// src/app/api/admin/channels/[id]/callback/route.ts
// OAuth callback for sales channels

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getChannelAdapter } from '@/lib/channels/adapters';
import type { SalesChannel, TikTokShopConfig } from '@/lib/channels/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Handle OAuth callback
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!supabaseAdmin) {
    return NextResponse.redirect(new URL('/admin?error=db_not_configured', req.url));
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle errors from OAuth provider
    if (error) {
      console.error('[OAuth Callback] Error from provider:', error);
      return NextResponse.redirect(new URL(`/admin?tab=channels&error=${error}`, req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/admin?tab=channels&error=no_code', req.url));
    }

    // Verify state
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        if (stateData.channelId !== id) {
          return NextResponse.redirect(new URL('/admin?tab=channels&error=invalid_state', req.url));
        }
      } catch {
        // State parsing failed
      }
    }

    // Get channel
    const { data, error: dbError } = await supabaseAdmin
      .from('sales_channels')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !data) {
      return NextResponse.redirect(new URL('/admin?tab=channels&error=channel_not_found', req.url));
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
      return NextResponse.redirect(new URL('/admin?tab=channels&error=no_adapter', req.url));
    }

    // Exchange code for token
    const result = await adapter.exchangeCodeForToken(code);

    if (!result.success) {
      console.error('[OAuth Callback] Token exchange failed:', result.error);
      return NextResponse.redirect(new URL(`/admin?tab=channels&error=${result.error}`, req.url));
    }

    // Get shop info and update config
    const connectionTest = await adapter.testConnection();

    if (connectionTest.success && connectionTest.shopInfo) {
      const shopInfo = connectionTest.shopInfo as { shop_id?: string; shop_cipher?: string };

      // Update channel config with tokens and shop info
      const currentConfig = data.config as TikTokShopConfig || {};
      const updatedConfig = {
        ...currentConfig,
        credentials: {
          ...currentConfig.credentials,
          shopId: shopInfo.shop_id,
          shopCipher: shopInfo.shop_cipher,
          // Note: accessToken and refreshToken are stored by the adapter
        },
      };

      await supabaseAdmin
        .from('sales_channels')
        .update({
          config: updatedConfig,
          status: 'active',
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', id);
    }

    // Redirect back to admin with success
    return NextResponse.redirect(new URL('/admin?tab=channels&success=connected', req.url));
  } catch (err) {
    console.error('[OAuth Callback] Error:', err);
    return NextResponse.redirect(new URL('/admin?tab=channels&error=callback_failed', req.url));
  }
}
