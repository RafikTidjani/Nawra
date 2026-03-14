// src/app/api/admin/supplier-products/search/route.ts
// Search supplier product catalog

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { SupplierService } from '@/lib/suppliers';

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const supplierId = searchParams.get('supplierId');
  const query = searchParams.get('query');
  const category = searchParams.get('category') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!supplierId) {
    return NextResponse.json({ error: 'supplierId requis' }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: 'query requis' }, { status: 400 });
  }

  try {
    // Get adapter for supplier
    const adapter = await SupplierService.getAdapter(supplierId);
    if (!adapter) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    // Initialize if needed
    await adapter.initialize();

    // Search products
    const products = await adapter.searchProducts(query, {
      category,
      page,
      limit,
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error('[supplier-products/search]', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Erreur recherche',
    }, { status: 500 });
  }
}
