// src/app/api/admin/channels/[id]/test/route.ts
// Test connection to a sales channel

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';
import { getChannelAdapter } from '@/lib/channels/adapters';
import type { SalesChannel } from '@/lib/channels/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
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

    // Get adapter
    const adapter = getChannelAdapter(channel);
    if (!adapter) {
      return NextResponse.json({
        success: false,
        message: `Pas d'adaptateur disponible pour ${channel.code}`,
      });
    }

    // Test connection
    const result = await adapter.testConnection();

    // Update last_synced_at if successful
    if (result.success) {
      await supabaseAdmin
        .from('sales_channels')
        .update({
          last_synced_at: new Date().toISOString(),
          status: 'active',
        })
        .eq('id', id);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[admin/channels/[id]/test]', err);
    return NextResponse.json({
      success: false,
      message: err instanceof Error ? err.message : 'Erreur de connexion',
    });
  }
}
