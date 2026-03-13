// src/app/api/admin/bouquets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

interface BouquetInput {
  id?: string;
  name: string;
  description: string;
  video: string;
  color: string;
  price: number;
  flowers: string[];
  active?: boolean;
  sort_order?: number;
}

// GET - List all bouquets (public)
export async function GET() {
  const client = supabase;
  if (!client) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { data, error } = await client
    .from('bouquets')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create a new bouquet (admin only)
export async function POST(req: NextRequest) {
  // Verify admin
  const adminSecret = req.headers.get('x-admin-secret');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin database not configured' }, { status: 500 });
  }

  const body: BouquetInput = await req.json();

  const { data, error } = await supabaseAdmin
    .from('bouquets')
    .insert({
      name: body.name,
      description: body.description,
      video: body.video,
      color: body.color,
      price: body.price,
      flowers: body.flowers,
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT - Update a bouquet (admin only)
export async function PUT(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin database not configured' }, { status: 500 });
  }

  const body: BouquetInput = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('bouquets')
    .update({
      name: body.name,
      description: body.description,
      video: body.video,
      color: body.color,
      price: body.price,
      flowers: body.flowers,
      active: body.active,
      sort_order: body.sort_order,
    })
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete a bouquet (admin only)
export async function DELETE(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin database not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('bouquets')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
