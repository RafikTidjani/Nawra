// src/app/api/admin/orders/[id]/tracking/route.ts
// Send tracking notification to customer

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';
import { sendShippingNotification } from '@/lib/resend';
import type { Order } from '@/types';

const CARRIERS: Record<string, { name: string; trackingUrl: string }> = {
  colissimo: { name: 'Colissimo', trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=' },
  chronopost: { name: 'Chronopost', trackingUrl: 'https://www.chronopost.fr/tracking-no-cms/suivi-page?liession=' },
  'mondial-relay': { name: 'Mondial Relay', trackingUrl: 'https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=' },
  ups: { name: 'UPS', trackingUrl: 'https://www.ups.com/track?tracknum=' },
  dhl: { name: 'DHL', trackingUrl: 'https://www.dhl.fr/fr/express/suivi.html?AWB=' },
  other: { name: 'Autre', trackingUrl: '' },
};

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  const { id } = await params;

  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { trackingNumber, carrier } = await req.json();

    if (!trackingNumber) {
      return NextResponse.json({ error: 'Numéro de suivi requis' }, { status: 400 });
    }

    // Fetch order
    const { data: orderData, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Update order with tracking info and status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber,
        tracking_carrier: carrier || 'colissimo',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('[tracking] Update error:', updateError);
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    }

    // Build Order object for email
    const order: Order = {
      id: orderData.id,
      products: [],
      total: orderData.total,
      status: 'shipped',
      customer: {
        name: `${orderData.shipping_first_name} ${orderData.shipping_last_name}`,
        email: orderData.shipping_email,
        phone: orderData.shipping_phone,
        address: orderData.shipping_address,
        city: orderData.shipping_city,
        zip: orderData.shipping_zip,
      },
    };

    // Build tracking URL
    const carrierConfig = CARRIERS[carrier] || CARRIERS.other;
    const carrierUrl = carrierConfig.trackingUrl
      ? `${carrierConfig.trackingUrl}${trackingNumber}`
      : '';

    // Send shipping notification email
    try {
      await sendShippingNotification(order, trackingNumber, carrierUrl);
      console.log('[tracking] Email sent for order:', orderData.order_number);
    } catch (emailErr) {
      console.error('[tracking] Email error:', emailErr);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[tracking]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
