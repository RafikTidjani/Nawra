// src/lib/channels/index.ts
// Main entry point for sales channels

import { supabaseAdmin } from '@/lib/supabase';
import type { SalesChannel, ChannelProduct, TikTokShopConfig } from './types';
import { getChannelAdapter, getSupportedChannels, isChannelSupported } from './adapters';
import { BaseChannelAdapter } from './base-adapter';

export * from './types';
export { BaseChannelAdapter } from './base-adapter';
export { getChannelAdapter, getSupportedChannels, isChannelSupported } from './adapters';

/**
 * ChannelService - Singleton for managing sales channels
 */
export class ChannelService {
  private static instance: ChannelService;
  private channels: Map<string, SalesChannel> = new Map();
  private adapters: Map<string, BaseChannelAdapter> = new Map();

  private constructor() {}

  static getInstance(): ChannelService {
    if (!ChannelService.instance) {
      ChannelService.instance = new ChannelService();
    }
    return ChannelService.instance;
  }

  /**
   * Load all active channels from database
   */
  async loadChannels(): Promise<void> {
    if (!supabaseAdmin) {
      console.warn('[ChannelService] supabaseAdmin not available');
      return;
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('sales_channels')
        .select('*')
        .in('status', ['active', 'pending']);

      if (error) {
        console.error('[ChannelService] Error loading channels:', error);
        return;
      }

      this.channels.clear();
      this.adapters.clear();

      for (const row of data || []) {
        const channel: SalesChannel = {
          id: row.id,
          code: row.code,
          name: row.name,
          status: row.status,
          config: row.config || {},
          lastSyncedAt: row.last_synced_at,
          createdAt: row.created_at,
        };

        this.channels.set(channel.id, channel);

        const adapter = getChannelAdapter(channel);
        if (adapter) {
          this.adapters.set(channel.id, adapter);
        }
      }

      console.log(`[ChannelService] Loaded ${this.channels.size} channel(s)`);
    } catch (err) {
      console.error('[ChannelService] Error:', err);
    }
  }

  /**
   * Get a channel by ID
   */
  getChannel(channelId: string): SalesChannel | undefined {
    return this.channels.get(channelId);
  }

  /**
   * Get a channel by code
   */
  getChannelByCode(code: string): SalesChannel | undefined {
    for (const channel of this.channels.values()) {
      if (channel.code === code) {
        return channel;
      }
    }
    return undefined;
  }

  /**
   * Get adapter for a channel
   */
  getAdapter(channelId: string): BaseChannelAdapter | undefined {
    return this.adapters.get(channelId);
  }

  /**
   * Get adapter by channel code
   */
  getAdapterByCode(code: string): BaseChannelAdapter | undefined {
    const channel = this.getChannelByCode(code);
    return channel ? this.adapters.get(channel.id) : undefined;
  }

  /**
   * Get all active channels
   */
  getActiveChannels(): SalesChannel[] {
    return Array.from(this.channels.values()).filter(c => c.status === 'active');
  }

  /**
   * Create a new sales channel
   */
  async createChannel(
    code: string,
    name: string,
    config: TikTokShopConfig | Record<string, unknown>
  ): Promise<SalesChannel | null> {
    if (!supabaseAdmin) return null;

    try {
      const { data, error } = await supabaseAdmin
        .from('sales_channels')
        .insert({
          code,
          name,
          config,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('[ChannelService] Error creating channel:', error);
        return null;
      }

      const channel: SalesChannel = {
        id: data.id,
        code: data.code,
        name: data.name,
        status: data.status,
        config: data.config,
        createdAt: data.created_at,
      };

      this.channels.set(channel.id, channel);

      const adapter = getChannelAdapter(channel);
      if (adapter) {
        this.adapters.set(channel.id, adapter);
      }

      return channel;
    } catch (err) {
      console.error('[ChannelService] Error:', err);
      return null;
    }
  }

  /**
   * Update channel configuration
   */
  async updateChannel(
    channelId: string,
    updates: Partial<SalesChannel>
  ): Promise<boolean> {
    if (!supabaseAdmin) return false;

    try {
      const { error } = await supabaseAdmin
        .from('sales_channels')
        .update({
          name: updates.name,
          config: updates.config,
          status: updates.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', channelId);

      if (error) {
        console.error('[ChannelService] Error updating channel:', error);
        return false;
      }

      // Reload to refresh adapter
      await this.loadChannels();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get product-channel link
   */
  async getChannelProduct(
    productId: string,
    channelId: string
  ): Promise<ChannelProduct | null> {
    if (!supabaseAdmin) return null;

    try {
      const { data, error } = await supabaseAdmin
        .from('channel_products')
        .select('*')
        .eq('product_id', productId)
        .eq('channel_id', channelId)
        .single();

      if (error || !data) return null;

      return {
        productId: data.product_id,
        productName: data.product_name,
        productSlug: data.product_slug,
        channelId: data.channel_id,
        channelProductId: data.channel_product_id,
        channelStatus: data.channel_status,
        syncStatus: data.sync_status,
        lastSyncedAt: data.last_synced_at,
        lastSyncError: data.last_sync_error,
        channelPrice: data.channel_price,
        channelCompareAtPrice: data.channel_compare_at_price,
      };
    } catch {
      return null;
    }
  }

  /**
   * Update product-channel link
   */
  async updateChannelProduct(
    productId: string,
    channelId: string,
    updates: Partial<ChannelProduct>
  ): Promise<boolean> {
    if (!supabaseAdmin) return false;

    try {
      const { error } = await supabaseAdmin
        .from('channel_products')
        .upsert({
          product_id: productId,
          channel_id: channelId,
          channel_product_id: updates.channelProductId,
          channel_status: updates.channelStatus,
          sync_status: updates.syncStatus,
          last_synced_at: updates.lastSyncedAt || new Date().toISOString(),
          last_sync_error: updates.lastSyncError,
          channel_price: updates.channelPrice,
          channel_compare_at_price: updates.channelCompareAtPrice,
        }, {
          onConflict: 'product_id,channel_id',
        });

      return !error;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const channelService = ChannelService.getInstance();
