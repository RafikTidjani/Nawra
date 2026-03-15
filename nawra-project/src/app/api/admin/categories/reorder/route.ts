// src/app/api/admin/categories/reorder/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// PATCH - Réordonner les catégories
export async function PATCH(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array required' }, { status: 400 });
    }

    // Mettre à jour l'ordre de chaque catégorie
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabase
        .from('categories')
        .update({ sort_order: i + 1 })
        .eq('id', orderedIds[i]);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[categories reorder]', error);
    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
  }
}
