// src/lib/channels/order-sync-service.ts
// Service to sync orders from sales channels to Nawra

import { supabaseAdmin } from '@/lib/supabase';
import { channelService } from './index';
import { submitOrderToSuppliers } from '@/lib/suppliers/fulfillment-service';
import type { ChannelOrder, ChannelOrderItem } from './types';

interface ImportResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

/**
 * Import an order from a sales channel into Nawra
 * This creates the order in our database and triggers fulfillment
 */
export async function importChannelOrder(channelOrder: ChannelOrder): Promise<ImportResult> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    // Check if order already imported
    const { data: existing } = await supabaseAdmin
      .from('orders')
      .select('id, order_number')
      .eq('channel_order_id', channelOrder.channelOrderId)
      .single();

    if (existing) {
      return {
        success: true,
        orderId: existing.id,
        orderNumber: existing.order_number,
        error: 'Order already imported',
      };
    }

    // Generate order number
    const orderNumber = `TTS-${Date.now().toString(36).toUpperCase()}`;

    // Map channel items to our product IDs
    const mappedItems = await mapChannelItemsToProducts(channelOrder.items, channelOrder.channelId);

    // Calculate totals
    const subtotal = mappedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingCost = 0; // TikTok handles shipping display

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: channelOrder.status === 'awaiting_shipment' ? 'paid' : 'pending',
        subtotal,
        shipping_cost: shippingCost,
        total: channelOrder.totalAmount,
        currency: channelOrder.currency,

        // Customer info
        shipping_first_name: channelOrder.customer.name.split(' ')[0] || channelOrder.customer.name,
        shipping_last_name: channelOrder.customer.name.split(' ').slice(1).join(' ') || '',
        shipping_email: channelOrder.customer.email || `tiktok-${channelOrder.channelOrderId}@placeholder.local`,
        shipping_phone: channelOrder.shippingAddress.phone,
        shipping_address: channelOrder.shippingAddress.addressLine1,
        shipping_address2: channelOrder.shippingAddress.addressLine2,
        shipping_city: channelOrder.shippingAddress.city,
        shipping_zip: channelOrder.shippingAddress.postalCode,
        shipping_country: channelOrder.shippingAddress.countryCode,

        // Channel reference
        channel_id: channelOrder.channelId,
        channel_order_id: channelOrder.channelOrderId,
        channel_order_number: channelOrder.channelOrderNumber,

        // Timestamps
        paid_at: channelOrder.orderPaidAt || new Date().toISOString(),
        created_at: channelOrder.orderCreatedAt,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('[OrderSyncService] Failed to create order:', orderError);
      return { success: false, error: orderError?.message || 'Failed to create order' };
    }

    // Create order items
    const orderItems = mappedItems.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_price: item.unitPrice,
      product_image: item.imageUrl,
      quantity: item.quantity,
      total: item.totalPrice,
      channel_item_id: item.channelItemId,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[OrderSyncService] Failed to create order items:', itemsError);
      // Order created but items failed - continue anyway
    }

    // Update channel order with our order ID
    await supabaseAdmin
      .from('channel_orders')
      .upsert({
        channel_id: channelOrder.channelId,
        channel_order_id: channelOrder.channelOrderId,
        order_id: order.id,
        status: channelOrder.status,
        synced_at: new Date().toISOString(),
      }, {
        onConflict: 'channel_id,channel_order_id',
      });

    // Trigger fulfillment if order is paid
    if (channelOrder.status === 'awaiting_shipment') {
      await submitOrderToSuppliers(order.id);
    }

    // Log success
    await logOrderImport(channelOrder.channelId, channelOrder.channelOrderId, order.id, true);

    console.log(`[OrderSyncService] Imported TikTok order ${channelOrder.channelOrderId} as ${orderNumber}`);

    return {
      success: true,
      orderId: order.id,
      orderNumber,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[OrderSyncService] Import error:', err);
    await logOrderImport(channelOrder.channelId, channelOrder.channelOrderId, undefined, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Fetch and import new orders from a channel
 */
export async function fetchAndImportOrders(channelId: string): Promise<{
  fetched: number;
  imported: number;
  errors: string[];
}> {
  const adapter = channelService.getAdapter(channelId);
  if (!adapter) {
    return { fetched: 0, imported: 0, errors: ['Channel adapter not found'] };
  }

  const errors: string[] = [];
  let imported = 0;

  try {
    // Fetch orders awaiting shipment (paid but not shipped)
    const orders = await adapter.fetchOrders({
      status: 'awaiting_shipment',
      limit: 50,
    });

    for (const order of orders) {
      const result = await importChannelOrder(order);
      if (result.success && !result.error?.includes('already imported')) {
        imported++;
      } else if (!result.success) {
        errors.push(`Order ${order.channelOrderId}: ${result.error}`);
      }
    }

    return {
      fetched: orders.length,
      imported,
      errors,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { fetched: 0, imported: 0, errors: [errorMsg] };
  }
}

/**
 * Fetch and import orders from all active channels
 */
export async function fetchAndImportAllOrders(): Promise<{
  channels: { channelId: string; channelName: string; fetched: number; imported: number; errors: string[] }[];
  totalImported: number;
}> {
  const channels = channelService.getActiveChannels();
  const results: { channelId: string; channelName: string; fetched: number; imported: number; errors: string[] }[] = [];
  let totalImported = 0;

  for (const channel of channels) {
    const result = await fetchAndImportOrders(channel.id);
    results.push({
      channelId: channel.id,
      channelName: channel.name,
      ...result,
    });
    totalImported += result.imported;
  }

  return { channels: results, totalImported };
}

/**
 * Update fulfillment on channel when order is shipped
 */
export async function updateChannelFulfillment(
  orderId: string,
  trackingNumber: string,
  carrier: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  // Get order with channel info
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('channel_id, channel_order_id')
    .eq('id', orderId)
    .single();

  if (error || !order?.channel_id || !order?.channel_order_id) {
    return { success: true }; // Not a channel order, nothing to update
  }

  const adapter = channelService.getAdapter(order.channel_id);
  if (!adapter) {
    return { success: false, error: 'Channel adapter not found' };
  }

  const result = await adapter.updateFulfillment({
    channelOrderId: order.channel_order_id,
    trackingNumber,
    carrier,
  });

  if (result.success) {
    // Update channel_orders status
    await supabaseAdmin
      .from('channel_orders')
      .update({
        status: 'in_transit',
        tracking_number: trackingNumber,
        carrier,
        shipped_at: new Date().toISOString(),
      })
      .eq('channel_order_id', order.channel_order_id);
  }

  return result;
}

type MappedOrderItem = Omit<ChannelOrderItem, 'productId'> & {
  productId: string | null;
};

/**
 * Map channel items to our product IDs
 */
async function mapChannelItemsToProducts(
  items: ChannelOrderItem[],
  channelId: string
): Promise<MappedOrderItem[]> {
  if (!supabaseAdmin) {
    return items.map(item => ({
      channelItemId: item.channelItemId,
      channelProductId: item.channelProductId,
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      imageUrl: item.imageUrl,
      productId: null,
    }));
  }

  const results: MappedOrderItem[] = [];

  for (const item of items) {
    // Try to find product by channel_product_id
    const { data: link } = await supabaseAdmin
      .from('channel_products')
      .select('product_id')
      .eq('channel_id', channelId)
      .eq('channel_product_id', item.channelProductId)
      .single();

    results.push({
      channelItemId: item.channelItemId,
      channelProductId: item.channelProductId,
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      imageUrl: item.imageUrl,
      productId: link?.product_id || null,
    });
  }

  return results;
}

/**
 * Log order import
 */
async function logOrderImport(
  channelId: string,
  channelOrderId: string,
  orderId: string | undefined,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    await supabaseAdmin.from('channel_sync_log').insert({
      channel_id: channelId,
      action: 'order_import',
      entity_type: 'order',
      entity_id: channelOrderId,
      status: success ? 'success' : 'failed',
      response_payload: orderId ? { order_id: orderId } : undefined,
      error_message: errorMessage,
    });
  } catch {
    // Ignore logging errors
  }
}
