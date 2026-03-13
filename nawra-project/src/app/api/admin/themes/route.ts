// src/app/api/admin/themes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

function verifyAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// GET - List all themes (public)
export async function GET() {
  const client = supabase;
  if (!client) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await client
    .from('themes')
    .select('*')
    .order('product_type', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create a new theme (admin only)
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from('themes')
    .insert({
      name: body.name,
      product_type: body.product_type || 'panier',
      p: body.p,
      s: body.s,
      a: body.a,
      l: body.l,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT - Update a theme (admin only)
export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('themes')
    .update({
      name: body.name,
      product_type: body.product_type,
      p: body.p,
      s: body.s,
      a: body.a,
      l: body.l,
    })
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete a theme (admin only)
export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('themes')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
