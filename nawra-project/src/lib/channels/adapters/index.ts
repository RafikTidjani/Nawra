// src/lib/channels/adapters/index.ts
// Registry of available sales channel adapters

import type { SalesChannel } from '../types';
import { BaseChannelAdapter } from '../base-adapter';
import { TikTokShopAdapter } from './tiktok-shop-adapter';

// Map of channel codes to adapter classes
const ADAPTER_REGISTRY: Record<string, new (channel: SalesChannel) => BaseChannelAdapter> = {
  'tiktok-shop': TikTokShopAdapter,
  // Future: 'instagram-shop': InstagramShopAdapter,
  // Future: 'facebook-shop': FacebookShopAdapter,
};

/**
 * Get the appropriate adapter for a sales channel
 */
export function getChannelAdapter(channel: SalesChannel): BaseChannelAdapter | null {
  const AdapterClass = ADAPTER_REGISTRY[channel.code];
  if (!AdapterClass) {
    console.warn(`[channels] No adapter found for channel code: ${channel.code}`);
    return null;
  }
  return new AdapterClass(channel);
}

/**
 * Get list of supported channel codes
 */
export function getSupportedChannels(): string[] {
  return Object.keys(ADAPTER_REGISTRY);
}

/**
 * Check if a channel is supported
 */
export function isChannelSupported(code: string): boolean {
  return code in ADAPTER_REGISTRY;
}

export { TikTokShopAdapter };
