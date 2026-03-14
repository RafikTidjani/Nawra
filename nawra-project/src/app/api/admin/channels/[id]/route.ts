// src/app/api/admin/channels/[id]/route.ts
// API routes for a specific sales channel

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get channel details
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
    const { data, error } = await supabaseAdmin
      .from('sales_channels')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Canal non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ channel: data });
  } catch (err) {
    console.error('[admin/channels/[id] GET]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH - Update channel
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // Get current channel to merge config
    const { data: current } = await supabaseAdmin
      .from('sales_channels')
      .select('config')
      .eq('id', id)
      .single();

    // Build updates
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name;
    if (body.status !== undefined) updates.status = body.status;

    // Merge config (don't overwrite credentials if not provided)
    if (body.config !== undefined) {
      const currentConfig = (current?.config || {}) as Record<string, unknown>;
      const currentCredentials = (currentConfig.credentials || {}) as Record<string, unknown>;
      const newCredentials = body.config.credentials as Record<string, unknown> | undefined;

      updates.config = {
        ...currentConfig,
        ...body.config,
        // If credentials provided, merge them
        credentials: newCredentials
          ? { ...currentCredentials, ...newCredentials }
          : currentCredentials,
      };
    }

    const { data, error } = await supabaseAdmin
      .from('sales_channels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[admin/channels/[id] PATCH]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ channel: data });
  } catch (err) {
    console.error('[admin/channels/[id] PATCH]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Delete channel
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Base de données non configurée' }, { status: 500 });
  }

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('sales_channels')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[admin/channels/[id] DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/channels/[id] DELETE]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
