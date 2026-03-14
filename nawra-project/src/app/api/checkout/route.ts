// src/app/api/checkout/route.ts
// Crée une Stripe Checkout Session et enregistre la commande en BDD

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import type { Order } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: { order: Order } = await req.json();
    const { order } = body;

    if (!order || !order.customer?.email) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 1. Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: order.customer.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Commande VELORA`,
              description: `${order.products.length} article(s)`,
              images: [`${appUrl}/images/og.jpg`],
            },
            unit_amount: order.total * 100, // Stripe en centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        brand: 'VELORA',
        products: order.products.join(','),
        customerName:    order.customer.name,
        customerPhone:   order.customer.phone,
        customerAddress: `${order.customer.address}, ${order.customer.zip} ${order.customer.city}`,
        message:         order.customer.message || '',
      },
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/cart?cancelled=1`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'eur',
            },
            display_name: 'Livraison offerte',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    // 2. Sauvegarder en BDD avec status 'pending'
    if (supabaseAdmin) {
      await supabaseAdmin.from('orders').insert({
        products:        order.products,
        total:           order.total,
        customer_name:   order.customer.name,
        customer_email:  order.customer.email,
        customer_phone:  order.customer.phone,
        customer_address:order.customer.address,
        customer_city:   order.customer.city,
        customer_zip:    order.customer.zip,
        customer_message:order.customer.message || null,
        status:          'pending',
        stripe_session_id: session.id,
      });
    }

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
