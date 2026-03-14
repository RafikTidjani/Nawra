// src/app/api/webhooks/channels/[channel]/route.ts
// Webhook endpoint for receiving events from sales channels

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { channelService } from '@/lib/channels';
import { importChannelOrder } from '@/lib/channels/order-sync-service';

interface RouteParams {
  params: Promise<{ channel: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { channel: channelCode } = await params;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    // Load channels if not loaded
    await channelService.loadChannels();

    // Find channel by code
    const channel = channelService.getChannelByCode(channelCode);
    if (!channel) {
      console.error(`[Webhook] Channel not found: ${channelCode}`);
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const adapter = channelService.getAdapterByCode(channelCode);
    if (!adapter) {
      return NextResponse.json({ error: 'Adapter not found' }, { status: 500 });
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-tts-signature') || req.headers.get('x-signature') || '';

    // Verify signature
    if (!adapter.verifyWebhookSignature(rawBody, signature)) {
      console.error(`[Webhook] Invalid signature for ${channelCode}`);
      // In development, we might skip signature verification
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Parse payload
    const payload = JSON.parse(rawBody);

    // Handle different event types
    const eventType = payload.type || payload.event_type;

    switch (eventType) {
      case 1: // TikTok order event
      case 'order.created':
      case 'order.paid': {
        const order = adapter.parseOrderWebhook(payload);
        if (order) {
          const result = await importChannelOrder(order);
          console.log(`[Webhook] Order import result:`, result);
        }
        break;
      }

      case 'order.cancelled':
      case 'order.refunded': {
        // Handle cancellation/refund
        const channelOrderId = payload.data?.order_id || payload.order_id;
        if (channelOrderId) {
          await supabaseAdmin
            .from('orders')
            .update({ status: eventType === 'order.cancelled' ? 'cancelled' : 'refunded' })
            .eq('channel_order_id', channelOrderId);
        }
        break;
      }

      case 'product.suspended': {
        // Handle product suspension
        const productId = payload.data?.product_id;
        if (productId) {
          await supabaseAdmin
            .from('channel_products')
            .update({ channel_status: 'suspended', sync_status: 'failed' })
            .eq('channel_product_id', productId)
            .eq('channel_id', channel.id);
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${eventType}`);
    }

    // Log the webhook
    await supabaseAdmin.from('channel_sync_log').insert({
      channel_id: channel.id,
      action: 'webhook_received',
      entity_type: eventType?.toString() || 'unknown',
      entity_id: payload.data?.order_id || payload.data?.product_id || 'unknown',
      status: 'success',
      request_payload: payload,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
