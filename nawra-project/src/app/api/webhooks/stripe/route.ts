// src/app/api/webhooks/stripe/route.ts
// Reçoit les events Stripe et met à jour les commandes

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/resend';
import type { Order } from '@/types';

export async function POST(req: NextRequest) {
  const body      = await req.text();
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
    const session = event.data.object as any;
    const meta    = session.metadata;

    if (!supabaseAdmin) {
      console.warn('[webhook] supabaseAdmin not available');
      return NextResponse.json({ ok: true });
    }

    // Mettre à jour le statut
    const { data: updatedOrder } = await supabaseAdmin
      .from('orders')
      .update({
        status:                'paid',
        stripe_payment_intent: session.payment_intent,
      })
      .eq('stripe_session_id', session.id)
      .select()
      .single();

    // Envoyer les emails de confirmation
    if (updatedOrder) {
      const order: Order = {
        id:       updatedOrder.id,
        theme:    updatedOrder.theme,
        size:     updatedOrder.size,
        products: updatedOrder.products,
        total:    updatedOrder.total,
        status:   'paid',
        customer: {
          name:    updatedOrder.customer_name,
          email:   updatedOrder.customer_email,
          phone:   updatedOrder.customer_phone,
          address: updatedOrder.customer_address,
          city:    updatedOrder.customer_city,
          zip:     updatedOrder.customer_zip,
          message: updatedOrder.customer_message,
        },
        deliveryDate: updatedOrder.delivery_date,
      };

      await Promise.allSettled([
        sendOrderConfirmation(order),
        sendAdminNotification(order),
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}
