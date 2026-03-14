// src/app/api/admin/suppliers/route.ts
// List and create suppliers

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);

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
      .order('name');

    if (error) {
      console.error('[admin/suppliers]', error);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    return NextResponse.json({ suppliers: data || [] });
  } catch (err) {
    console.error('[admin/suppliers]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { code, name, api_endpoint, status, config } = await req.json();

    if (!code || !name) {
      return NextResponse.json({ error: 'Code et nom requis' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .insert({
        code,
        name,
        api_endpoint,
        status: status || 'inactive',
        config: config || {},
      })
      .select()
      .single();

    if (error) {
      console.error('[admin/suppliers POST]', error);
      return NextResponse.json({ error: 'Erreur création' }, { status: 500 });
    }

    return NextResponse.json({ supplier: data });
  } catch (err) {
    console.error('[admin/suppliers POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
