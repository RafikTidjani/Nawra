// src/app/api/admin/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Modifier une catégorie
export async function PUT(request: Request, { params }: RouteParams) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, icon, color, sortOrder, isActive } = body;

    // Vérifier que le slug est unique (sauf pour cette catégorie)
    if (slug) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 });
      }
    }

    // Mettre à jour la catégorie
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug;
    if (description !== undefined) updates.description = description;
    if (icon !== undefined) updates.icon = icon;
    if (color !== undefined) updates.color = color;
    if (sortOrder !== undefined) updates.sort_order = sortOrder;
    if (isActive !== undefined) updates.is_active = isActive;

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      sortOrder: data.sort_order,
      isActive: data.is_active,
    });
  } catch (error) {
    console.error('[categories PUT]', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Supprimer une catégorie (bloqué si des produits y sont liés)
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;

    // Vérifier s'il y a des produits liés
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .eq('is_active', true)
      .limit(1);

    if (productError) throw productError;

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer: des produits sont liés à cette catégorie' },
        { status: 400 }
      );
    }

    // Supprimer la catégorie
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[categories DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

// PATCH - Réordonner les catégories
export async function PATCH(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { orderedIds } = body; // Array d'IDs dans le nouvel ordre

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array required' }, { status: 400 });
    }

    // Mettre à jour l'ordre
    for (let i = 0; i < orderedIds.length; i++) {
      await supabase
        .from('categories')
        .update({ sort_order: i + 1 })
        .eq('id', orderedIds[i]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[categories PATCH]', error);
    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
  }
}
