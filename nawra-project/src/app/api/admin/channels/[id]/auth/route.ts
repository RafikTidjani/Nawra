// src/app/api/admin/channels/[id]/auth/route.ts
// OAuth authorization for sales channels

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';
import { getChannelAdapter } from '@/lib/channels/adapters';
import type { SalesChannel } from '@/lib/channels/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get authorization URL
export async function GET(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const { id } = await params;

  try {
    // Get channel
    const { data, error } = await supabaseAdmin
      .from('sales_channels')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Canal non trouvé' }, { status: 404 });
    }

    const channel: SalesChannel = {
      id: data.id,
      code: data.code,
      name: data.name,
      status: data.status,
      config: data.config || {},
      createdAt: data.created_at,
    };

    const adapter = getChannelAdapter(channel);
    if (!adapter) {
      return NextResponse.json({ error: 'Adaptateur non disponible' }, { status: 400 });
    }

    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({
      channelId: id,
      timestamp: Date.now(),
    })).toString('base64');

    // Get redirect URI
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/channels/${id}/callback`;

    const authUrl = adapter.getAuthorizationUrl(redirectUri, state);

    return NextResponse.json({ authUrl, state });
  } catch (err) {
    console.error('[admin/channels/[id]/auth GET]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
