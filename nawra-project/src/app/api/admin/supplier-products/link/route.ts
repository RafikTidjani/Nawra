// src/app/api/admin/supplier-products/link/route.ts
// Link an existing product to a supplier

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';

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
      productId,
      supplierId,
      supplierProductId,
      costPrice,
      isPrimary = true,
      autoFulfill = true,
    } = await req.json();

    if (!productId || !supplierId || !supplierProductId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // If setting as primary, unset other primary links for this product
    if (isPrimary) {
      await supabaseAdmin
        .from('supplier_products')
        .update({ is_primary: false })
        .eq('product_id', productId);
    }

    // Create or update the link
    const { data, error } = await supabaseAdmin
      .from('supplier_products')
      .upsert({
        product_id: productId,
        supplier_id: supplierId,
        supplier_product_id: supplierProductId,
        cost_price: costPrice,
        is_primary: isPrimary,
        auto_fulfill: autoFulfill,
        sync_status: 'synced',
        last_synced_at: new Date().toISOString(),
      }, {
        onConflict: 'product_id,supplier_id',
      })
      .select()
      .single();

    if (error) {
      console.error('[supplier-products/link]', error);
      return NextResponse.json({ error: 'Erreur liaison' }, { status: 500 });
    }

    // Update product with supplier info
    await supabaseAdmin
      .from('products')
      .update({
        supplier_id: supplierId,
        supplier_product_id: supplierProductId,
        cost_price: costPrice,
      })
      .eq('id', productId);

    return NextResponse.json({ link: data });
  } catch (err) {
    console.error('[supplier-products/link]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
