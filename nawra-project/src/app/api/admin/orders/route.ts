// src/app/api/admin/orders/route.ts
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
    // Fetch orders with items
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/orders]', error);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    // Fetch suppliers list for mapping
    let suppliersMap: Record<string, { name: string; code: string }> = {};
    try {
      const { data: suppliers } = await supabaseAdmin
        .from('suppliers')
        .select('id, name, code');
      if (suppliers) {
        suppliersMap = suppliers.reduce((acc, s) => {
          acc[s.id] = { name: s.name, code: s.code };
          return acc;
        }, {} as Record<string, { name: string; code: string }>);
      }
    } catch {
      // Suppliers table might not exist
    }

    // Fetch product supplier info for all products in orders
    const productIds = new Set<string>();
    orders?.forEach(order => {
      order.order_items?.forEach((item: { product_id?: string }) => {
        if (item.product_id) productIds.add(item.product_id);
      });
    });

    let productsSupplierMap: Record<string, { supplier_id: string; supplier_product_id: string; cost_price: number }> = {};
    if (productIds.size > 0) {
      try {
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('id, supplier_id, supplier_product_id, cost_price')
          .in('id', Array.from(productIds));
        if (products) {
          productsSupplierMap = products.reduce((acc, p) => {
            if (p.supplier_id) {
              acc[p.id] = {
                supplier_id: p.supplier_id,
                supplier_product_id: p.supplier_product_id || '',
                cost_price: p.cost_price || 0,
              };
            }
            return acc;
          }, {} as Record<string, { supplier_id: string; supplier_product_id: string; cost_price: number }>);
        }
      } catch {
        // Columns might not exist yet
      }
    }

    // Enrich order items with supplier info
    const enrichedOrders = orders?.map(order => ({
      ...order,
      order_items: order.order_items?.map((item: { product_id?: string }) => {
        const supplierInfo = item.product_id ? productsSupplierMap[item.product_id] : null;
        const supplier = supplierInfo ? suppliersMap[supplierInfo.supplier_id] : null;
        return {
          ...item,
          supplier_name: supplier?.name || null,
          supplier_code: supplier?.code || null,
          supplier_product_id: supplierInfo?.supplier_product_id || null,
          cost_price: supplierInfo?.cost_price || null,
        };
      }),
    }));

    return NextResponse.json({ orders: enrichedOrders || [] });
  } catch (err) {
    console.error('[admin/orders]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin(req);

  if (!admin) {
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

    // Mettre à jour le statut et les timestamps appropriés
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'paid') {
      updates.paid_at = new Date().toISOString();
    } else if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('[admin/orders PATCH]', error);
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/orders PATCH]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
