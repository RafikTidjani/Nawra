// src/app/api/admin/sizes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

function verifyAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// GET - List all sizes (public)
export async function GET() {
  const client = supabase;
  if (!client) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await client
    .from('sizes')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create a new size (admin only)
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from('sizes')
    .insert({
      id: body.id,
      product_type: body.product_type || 'panier',
      label: body.label,
      sub: body.sub,
      price: body.price,
      slots: body.slots,
      popular: body.popular || false,
      sort_order: body.sort_order || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT - Update a size (admin only)
export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const body = await req.json();

  if (!body.id || !body.product_type) {
    return NextResponse.json({ error: 'ID et product_type requis' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('sizes')
    .update({
      label: body.label,
      sub: body.sub,
      price: body.price,
      slots: body.slots,
      popular: body.popular || false,
      sort_order: body.sort_order,
    })
    .eq('id', body.id)
    .eq('product_type', body.product_type)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete a size (admin only)
export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const productType = searchParams.get('product_type');

  if (!id || !productType) {
    return NextResponse.json({ error: 'ID et product_type requis' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('sizes')
    .delete()
    .eq('id', id)
    .eq('product_type', productType);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
