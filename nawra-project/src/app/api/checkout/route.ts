// src/app/api/checkout/route.ts
// Crée une Stripe Checkout Session et enregistre la commande en BDD

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string | null;
  quantity: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  zip: string;
  note?: string;
}

interface CheckoutRequest {
  customer: CustomerData;
  items: OrderItem[];
  total: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequest = await req.json();
    const { customer, items, total } = body;

    // Validation
    if (!customer?.email || !items?.length || !total) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Build line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.productName,
          images: item.productImage ? [item.productImage] : [],
        },
        unit_amount: Math.round(item.productPrice * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // 1. Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customer.email,
      line_items: lineItems,
      metadata: {
        brand: 'VELORA',
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        customerAddress2: customer.address2 || '',
        customerCity: customer.city,
        customerZip: customer.zip,
        customerNote: customer.note || '',
      },
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?cancelled=1`,
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

    // 2. Sauvegarder la commande en BDD avec status 'pending'
    if (supabaseAdmin) {
      // Insert order
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          shipping_first_name: customer.firstName,
          shipping_last_name: customer.lastName,
          shipping_email: customer.email,
          shipping_phone: customer.phone,
          shipping_address: customer.address,
          shipping_address2: customer.address2 || null,
          shipping_city: customer.city,
          shipping_zip: customer.zip,
          subtotal: total,
          shipping_cost: 0,
          total: total,
          status: 'pending',
          customer_note: customer.note || null,
          stripe_session_id: session.id,
        })
        .select()
        .single();

      if (orderError) {
        console.error('[checkout] Order insert error:', orderError);
        // Don't fail the checkout, just log
      } else if (order) {
        // Insert order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          product_price: item.productPrice,
          product_image: item.productImage,
          quantity: item.quantity,
          total: item.productPrice * item.quantity,
        }));

        const { error: itemsError } = await supabaseAdmin
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('[checkout] Order items insert error:', itemsError);
        }
      }
    }

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
