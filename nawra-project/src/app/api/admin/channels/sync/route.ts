// src/app/api/admin/channels/sync/route.ts
// API for syncing products and orders with channels

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { channelService } from '@/lib/channels';
import { syncProductToChannel, syncAllProducts, syncInventoryToChannels } from '@/lib/channels/product-sync-service';
import { fetchAndImportOrders, fetchAndImportAllOrders } from '@/lib/channels/order-sync-service';

// POST - Trigger sync operations
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { action, channelId, productId, quantity } = await req.json();

    // Load channels
    await channelService.loadChannels();

    switch (action) {
      case 'sync_product': {
        if (!productId || !channelId) {
          return NextResponse.json({ error: 'productId et channelId requis' }, { status: 400 });
        }
        const result = await syncProductToChannel(productId, channelId);
        return NextResponse.json(result);
      }

      case 'sync_all_products': {
        const result = await syncAllProducts();
        return NextResponse.json(result);
      }

      case 'sync_inventory': {
        if (!productId || quantity === undefined) {
          return NextResponse.json({ error: 'productId et quantity requis' }, { status: 400 });
        }
        await syncInventoryToChannels(productId, quantity);
        return NextResponse.json({ success: true });
      }

      case 'import_orders': {
        if (channelId) {
          const result = await fetchAndImportOrders(channelId);
          return NextResponse.json(result);
        } else {
          const result = await fetchAndImportAllOrders();
          return NextResponse.json(result);
        }
      }

      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (err) {
    console.error('[admin/channels/sync]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
