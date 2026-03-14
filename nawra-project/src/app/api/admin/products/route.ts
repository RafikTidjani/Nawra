// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';

// GET - List all products (public pour l'affichage, admin pour l'édition)
export async function GET() {
  const client = supabase || supabaseAdmin;
  if (!client) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/products GET]', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('[admin/products GET]', err);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create a new product (admin only)
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        short_description: body.short_description,
        price: body.price,
        compare_at_price: body.compare_at_price || null,
        images: body.images || [],
        video: body.video || null,
        category: body.category || 'coiffeuse',
        tags: body.tags || [],
        stock_status: body.stock_status || 'in_stock',
        features: body.features || [],
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('[admin/products POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/products POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Update a product (admin only)
export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      name: body.name,
      description: body.description,
      short_description: body.short_description,
      price: body.price,
      compare_at_price: body.compare_at_price || null,
      images: body.images || [],
      video: body.video || null,
      category: body.category,
      tags: body.tags || [],
      stock_status: body.stock_status,
      features: body.features || [],
      is_active: body.is_active,
      updated_at: new Date().toISOString(),
    };

    // Add supplier fields if provided
    if (body.supplier_id !== undefined) {
      updates.supplier_id = body.supplier_id || null;
    }
    if (body.supplier_product_id !== undefined) {
      updates.supplier_product_id = body.supplier_product_id || null;
    }
    if (body.cost_price !== undefined) {
      updates.cost_price = body.cost_price || null;
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('[admin/products PUT]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If supplier is set, also create/update supplier_products link
    if (body.supplier_id && body.supplier_product_id) {
      // Try to create/update the link (table might not exist yet)
      try {
        await supabaseAdmin
          .from('supplier_products')
          .upsert({
            product_id: body.id,
            supplier_id: body.supplier_id,
            supplier_product_id: body.supplier_product_id,
            cost_price: body.cost_price || null,
            is_primary: true,
            auto_fulfill: body.auto_fulfill ?? true,
            sync_status: 'synced',
            last_synced_at: new Date().toISOString(),
          }, {
            onConflict: 'product_id,supplier_id',
          });
      } catch {
        // Table might not exist - that's OK
        console.log('[admin/products PUT] supplier_products table not available');
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/products PUT]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Delete a product (admin only)
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[admin/products DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/products DELETE]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
