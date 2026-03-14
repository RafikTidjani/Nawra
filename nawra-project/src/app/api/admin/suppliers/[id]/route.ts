// src/app/api/admin/suppliers/[id]/route.ts
// Get, update, delete a specific supplier

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  const { id } = await params;

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ supplier: data });
  } catch (err) {
    console.error('[admin/suppliers/id]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  const { id } = await params;

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const updates = await req.json();

    // Only allow certain fields to be updated
    const allowedFields = ['name', 'api_endpoint', 'status', 'config'];
    const filteredUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'Aucune mise à jour' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[admin/suppliers/id PATCH]', error);
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    }

    return NextResponse.json({ supplier: data });
  } catch (err) {
    console.error('[admin/suppliers/id PATCH]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  const { id } = await params;

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[admin/suppliers/id DELETE]', error);
      return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/suppliers/id DELETE]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
