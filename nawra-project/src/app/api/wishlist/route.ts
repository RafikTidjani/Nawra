// src/app/api/wishlist/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET - Liste les favoris du client connecté
export async function GET() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ items: [] });
    }

    // Récupérer les favoris avec les infos produit
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          slug,
          price,
          compare_at_price,
          images,
          short_description,
          stock_status
        )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const items = (data || []).map(item => ({
      id: item.id,
      productId: item.product_id,
      createdAt: item.created_at,
      product: item.products,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('[wishlist GET]', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST - Ajouter un produit aux favoris
export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'productId requis' }, { status: 400 });
    }

    // Vérifier si le produit existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Ajouter aux favoris (ou ignorer si déjà présent grâce à la contrainte UNIQUE)
    const { data, error } = await supabase
      .from('wishlists')
      .upsert({
        customer_id: user.id,
        product_id: productId,
      }, {
        onConflict: 'customer_id,product_id',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('[wishlist POST]', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}
