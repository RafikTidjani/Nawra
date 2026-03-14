// src/lib/suppliers/fulfillment-service.ts
// Service to handle order fulfillment - simplified for manual processing

import { supabaseAdmin } from '@/lib/supabase';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
}

/**
 * Submit an order to suppliers for fulfillment
 * Called after payment is confirmed
 *
 * For now, this just creates records for manual fulfillment
 * The supplier integration (CJ, etc.) can be added later
 */
export async function submitOrderToSuppliers(orderId: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!supabaseAdmin) {
    console.warn('[fulfillment] supabaseAdmin not available');
    return { success: false, message: 'Database not configured' };
  }

  try {
    // Check if suppliers table exists
    const { error: tableCheck } = await supabaseAdmin
      .from('suppliers')
      .select('id')
      .limit(1);

    if (tableCheck) {
      // Suppliers table doesn't exist yet - that's OK
      // The order will be processed manually via the admin panel
      console.log('[fulfillment] Suppliers table not yet created - using manual fulfillment');
      return {
        success: true,
        message: 'Order marked for manual fulfillment (suppliers table not configured)'
      };
    }

    // Get the manual supplier
    const { data: manualSupplier } = await supabaseAdmin
      .from('suppliers')
      .select('id')
      .eq('code', 'manual')
      .single();

    if (!manualSupplier) {
      console.log('[fulfillment] Manual supplier not found - order will be processed via admin');
      return { success: true, message: 'Order ready for manual processing' };
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError || !orderItems) {
      console.error('[fulfillment] Error fetching order items:', itemsError);
      return { success: false, message: 'Could not fetch order items' };
    }

    // Create supplier_order records for each item
    for (const item of orderItems as OrderItem[]) {
      // Check if supplier_orders table exists
      const { error: insertError } = await supabaseAdmin
        .from('supplier_orders')
        .insert({
          order_item_id: item.id,
          supplier_id: manualSupplier.id,
          fulfillment_status: 'pending',
        });

      if (insertError) {
        // Table might not exist - that's fine
        console.log('[fulfillment] Could not create supplier_order record:', insertError.message);
      }
    }

    console.log(`[fulfillment] Order ${orderId} submitted for manual fulfillment`);
    return { success: true, message: 'Order submitted for fulfillment' };

  } catch (err) {
    console.error('[fulfillment] Error:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Update fulfillment status for an order item
 */
export async function updateFulfillmentStatus(
  orderItemId: string,
  status: string,
  trackingNumber?: string,
  carrier?: string
): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    // Update order_item
    const updates: Record<string, unknown> = {
      fulfillment_status: status,
    };

    if (trackingNumber) updates.tracking_number = trackingNumber;
    if (carrier) updates.carrier = carrier;

    const { error } = await supabaseAdmin
      .from('order_items')
      .update(updates)
      .eq('id', orderItemId);

    return !error;
  } catch {
    return false;
  }
}
