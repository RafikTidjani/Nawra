// src/app/api/admin/categories/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Liste toutes les catégories avec le nombre de produits
export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    // Récupérer les catégories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (catError) throw catError;

    // Compter les produits par catégorie
    const { data: productCounts, error: countError } = await supabase
      .from('products')
      .select('category_id')
      .eq('is_active', true);

    if (countError) throw countError;

    // Calculer le nombre de produits par catégorie
    const counts: Record<string, number> = {};
    productCounts?.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    });

    // Ajouter le comptage aux catégories
    const categoriesWithCount = (categories || []).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      sortOrder: cat.sort_order,
      isActive: cat.is_active,
      productCount: counts[cat.id] || 0,
    }));

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('[categories GET]', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, icon, color } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Vérifier que le slug est unique
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 });
    }

    // Trouver le prochain sort_order
    const { data: maxOrder } = await supabase
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.sort_order || 0) + 1;

    // Créer la catégorie
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || null,
        sort_order: nextOrder,
        is_active: true,
      })
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
      productCount: 0,
    });
  } catch (error) {
    console.error('[categories POST]', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
