// src/app/api/webhooks/stripe/route.ts
// Reçoit les events Stripe et met à jour les commandes

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/resend';
import { submitOrderToSuppliers } from '@/lib/suppliers/fulfillment-service';
import type { Order } from '@/types';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[webhook] Invalid signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ── Paiement réussi ────────────────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string;
      payment_intent: string;
      metadata?: Record<string, string>;
      amount_total?: number;
      customer_email?: string;
    };

    if (!supabaseAdmin) {
      console.warn('[webhook] supabaseAdmin not available');
      return NextResponse.json({ ok: true });
    }

    // Fetch order with items
    const { data: orderData, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError || !orderData) {
      console.error('[webhook] Order not found for session:', session.id);
      return NextResponse.json({ ok: true });
    }

    // Update order status to paid
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        stripe_payment_intent: session.payment_intent,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderData.id);

    if (updateError) {
      console.error('[webhook] Failed to update order:', updateError);
    }

    // Build Order object for email
    const order: Order = {
      id: orderData.id,
      products: orderData.order_items?.map((item: { product_id: string }) => item.product_id) || [],
      total: orderData.total,
      status: 'paid',
      customer: {
        name: `${orderData.shipping_first_name} ${orderData.shipping_last_name}`,
        email: orderData.shipping_email,
        phone: orderData.shipping_phone,
        address: orderData.shipping_address,
        city: orderData.shipping_city,
        zip: orderData.shipping_zip,
        message: orderData.customer_note,
      },
      stripePaymentIntent: session.payment_intent,
      createdAt: orderData.created_at,
    };

    // Send confirmation emails
    try {
      await Promise.allSettled([
        sendOrderConfirmation(order),
        sendAdminNotification(order),
      ]);
      console.log('[webhook] Emails sent for order:', orderData.order_number);
    } catch (emailErr) {
      console.error('[webhook] Email sending failed:', emailErr);
    }

    // Submit to suppliers for fulfillment
    try {
      const fulfillmentResult = await submitOrderToSuppliers(orderData.id);
      console.log('[webhook] Fulfillment submitted:', fulfillmentResult);
    } catch (fulfillmentErr) {
      console.error('[webhook] Fulfillment submission failed:', fulfillmentErr);
      // Don't fail the webhook - fulfillment can be retried
    }
  }

  return NextResponse.json({ ok: true });
}
