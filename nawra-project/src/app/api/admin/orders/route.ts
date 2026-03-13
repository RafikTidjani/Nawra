// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/orders]', error);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error('[admin/orders]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/orders PATCH]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
