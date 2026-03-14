// src/app/api/admin/supplier-products/import/route.ts
// Import a product from supplier catalog

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';
import { SupplierService } from '@/lib/suppliers';

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const {
      supplierId,
      supplierProductId,
      name,
      description,
      price,
      costPrice,
      images,
      category,
      tags,
    } = await req.json();

    if (!supplierId || !supplierProductId || !name) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Get supplier info
    const supplier = await SupplierService.getSupplierById(supplierId);
    if (!supplier) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    const finalSlug = existingProduct
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    // Calculate selling price with margin (default 2x markup)
    const sellingPrice = price || (costPrice ? costPrice * 2 : 99);

    // Create product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        slug: finalSlug,
        description: description || '',
        short_description: description?.substring(0, 100) || '',
        price: sellingPrice,
        cost_price: costPrice || price,
        images: images || [],
        category: category || 'coiffeuse',
        tags: tags || [],
        stock_status: 'in_stock',
        features: [],
        is_active: true,
        supplier_id: supplierId,
        supplier_product_id: supplierProductId,
      })
      .select()
      .single();

    if (productError) {
      console.error('[supplier-products/import] Product error:', productError);
      return NextResponse.json({ error: 'Erreur création produit' }, { status: 500 });
    }

    // Create supplier_products link
    const { error: linkError } = await supabaseAdmin
      .from('supplier_products')
      .insert({
        product_id: product.id,
        supplier_id: supplierId,
        supplier_product_id: supplierProductId,
        cost_price: costPrice || price,
        is_primary: true,
        auto_fulfill: true,
        sync_status: 'synced',
        last_synced_at: new Date().toISOString(),
      });

    if (linkError) {
      console.error('[supplier-products/import] Link error:', linkError);
      // Product was created but link failed - continue anyway
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error('[supplier-products/import]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
