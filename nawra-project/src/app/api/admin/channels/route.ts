// src/app/api/admin/channels/route.ts
// API routes for managing sales channels

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';

// GET - List all sales channels
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('sales_channels')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[admin/channels GET]', error);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    // Mask sensitive credentials in config
    const channels = (data || []).map(channel => ({
      ...channel,
      config: maskCredentials(channel.config),
    }));

    return NextResponse.json({ channels });
  } catch (err) {
    console.error('[admin/channels GET]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Create a new sales channel
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  try {
    const { code, name, config } = await req.json();

    if (!code || !name) {
      return NextResponse.json({ error: 'Code et nom requis' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('sales_channels')
      .insert({
        code,
        name,
        config: config || {},
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[admin/channels POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ channel: data });
  } catch (err) {
    console.error('[admin/channels POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Helper to mask sensitive credentials
function maskCredentials(config: Record<string, unknown> | null): Record<string, unknown> {
  if (!config) return {};

  const masked = { ...config };

  if (masked.credentials && typeof masked.credentials === 'object') {
    const creds = masked.credentials as Record<string, unknown>;
    masked.credentials = {
      ...creds,
      appKey: creds.appKey ? '••••••••' + String(creds.appKey).slice(-4) : '',
      appSecret: creds.appSecret ? '••••••••' : '',
      accessToken: creds.accessToken ? '••••••••' : '',
      refreshToken: creds.refreshToken ? '••••••••' : '',
    };
  }

  return masked;
}
