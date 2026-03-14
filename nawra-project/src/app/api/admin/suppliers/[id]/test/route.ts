// src/app/api/admin/suppliers/[id]/test/route.ts
// Test supplier API connection

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';
import { SupplierService } from '@/lib/suppliers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  const { id } = await params;

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    // Get supplier
    const supplier = await SupplierService.getSupplierById(id);
    if (!supplier) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    // Get adapter
    const adapter = await SupplierService.getAdapter(supplier);
    if (!adapter) {
      return NextResponse.json({
        success: false,
        message: 'Adapter non disponible pour ce fournisseur',
      });
    }

    // Test connection
    const result = await adapter.testConnection();

    return NextResponse.json(result);
  } catch (err) {
    console.error('[admin/suppliers/test]', err);
    return NextResponse.json({
      success: false,
      message: err instanceof Error ? err.message : 'Erreur de connexion',
    });
  }
}
