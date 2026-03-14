// src/lib/channels/product-sync-service.ts
// Service to sync products from Nawra to sales channels

import { supabaseAdmin } from '@/lib/supabase';
import { channelService } from './index';
import type { ProductSyncRequest, ProductSyncResponse, ChannelProduct } from './types';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  stock_status: string;
  is_active: boolean;
}

/**
 * Sync a single product to all active channels
 */
export async function syncProductToChannels(productId: string): Promise<{
  success: boolean;
  results: { channelId: string; channelName: string; success: boolean; error?: string }[];
}> {
  if (!supabaseAdmin) {
    return { success: false, results: [] };
  }

  // Fetch product
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return { success: false, results: [] };
  }

  const results: { channelId: string; channelName: string; success: boolean; error?: string }[] = [];

  // Get all active channels
  const channels = channelService.getActiveChannels();

  for (const channel of channels) {
    const adapter = channelService.getAdapter(channel.id);
    if (!adapter) continue;

    try {
      // Check if product already exists on channel
      const existingLink = await channelService.getChannelProduct(productId, channel.id);

      const syncRequest: ProductSyncRequest = {
        productId: product.id,
        name: product.name,
        description: product.description || product.short_description || '',
        price: product.price,
        compareAtPrice: product.compare_at_price,
        images: product.images || [],
        category: product.category || 'coiffeuse',
        stockQuantity: product.stock_status === 'out_of_stock' ? 0 : 10, // Default stock
        sku: product.slug,
      };

      let response: ProductSyncResponse;

      if (existingLink?.channelProductId) {
        // Update existing product
        response = await adapter.updateProduct(existingLink.channelProductId, syncRequest);
      } else {
        // Create new product
        response = await adapter.createProduct(syncRequest);
      }

      // Update channel_products link
      await channelService.updateChannelProduct(productId, channel.id, {
        channelProductId: response.channelProductId,
        channelStatus: response.channelStatus as ChannelProduct['channelStatus'],
        syncStatus: response.success ? 'synced' : 'failed',
        lastSyncedAt: new Date().toISOString(),
        lastSyncError: response.error,
      });

      results.push({
        channelId: channel.id,
        channelName: channel.name,
        success: response.success,
        error: response.error,
      });

      // Log sync
      await logSync(channel.id, response.success ? 'product_update' : 'product_create', 'product', productId, response.success, syncRequest, response, response.error);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      results.push({
        channelId: channel.id,
        channelName: channel.name,
        success: false,
        error: errorMsg,
      });
    }
  }

  return {
    success: results.every(r => r.success),
    results,
  };
}

/**
 * Sync a product to a specific channel
 */
export async function syncProductToChannel(productId: string, channelId: string): Promise<ProductSyncResponse> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  const adapter = channelService.getAdapter(channelId);
  if (!adapter) {
    return { success: false, error: 'Channel adapter not found' };
  }

  // Fetch product
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return { success: false, error: 'Product not found' };
  }

  const existingLink = await channelService.getChannelProduct(productId, channelId);

  const syncRequest: ProductSyncRequest = {
    productId: product.id,
    name: product.name,
    description: product.description || product.short_description || '',
    price: product.price,
    compareAtPrice: product.compare_at_price,
    images: product.images || [],
    category: product.category || 'coiffeuse',
    stockQuantity: product.stock_status === 'out_of_stock' ? 0 : 10,
    sku: product.slug,
  };

  let response: ProductSyncResponse;

  if (existingLink?.channelProductId) {
    response = await adapter.updateProduct(existingLink.channelProductId, syncRequest);
  } else {
    response = await adapter.createProduct(syncRequest);
  }

  // Update link
  await channelService.updateChannelProduct(productId, channelId, {
    channelProductId: response.channelProductId,
    channelStatus: response.channelStatus as ChannelProduct['channelStatus'],
    syncStatus: response.success ? 'synced' : 'failed',
    lastSyncedAt: new Date().toISOString(),
    lastSyncError: response.error,
  });

  return response;
}

/**
 * Remove a product from a channel
 */
export async function removeProductFromChannel(productId: string, channelId: string): Promise<{ success: boolean; error?: string }> {
  const adapter = channelService.getAdapter(channelId);
  if (!adapter) {
    return { success: false, error: 'Channel adapter not found' };
  }

  const link = await channelService.getChannelProduct(productId, channelId);
  if (!link?.channelProductId) {
    return { success: false, error: 'Product not linked to channel' };
  }

  const result = await adapter.deleteProduct(link.channelProductId);

  if (result.success) {
    await channelService.updateChannelProduct(productId, channelId, {
      channelStatus: 'deleted',
      syncStatus: 'synced',
    });
  }

  return result;
}

/**
 * Sync all products to all channels
 */
export async function syncAllProducts(): Promise<{
  total: number;
  synced: number;
  failed: number;
  errors: string[];
}> {
  if (!supabaseAdmin) {
    return { total: 0, synced: 0, failed: 0, errors: ['Database not configured'] };
  }

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('is_active', true);

  if (error || !products) {
    return { total: 0, synced: 0, failed: 0, errors: ['Failed to fetch products'] };
  }

  let synced = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const product of products) {
    const result = await syncProductToChannels(product.id);
    if (result.success) {
      synced++;
    } else {
      failed++;
      result.results
        .filter(r => !r.success)
        .forEach(r => errors.push(`${r.channelName}: ${r.error}`));
    }
  }

  return {
    total: products.length,
    synced,
    failed,
    errors,
  };
}

/**
 * Update inventory on all channels for a product
 */
export async function syncInventoryToChannels(productId: string, quantity: number): Promise<void> {
  const channels = channelService.getActiveChannels();

  for (const channel of channels) {
    const adapter = channelService.getAdapter(channel.id);
    if (!adapter) continue;

    const link = await channelService.getChannelProduct(productId, channel.id);
    if (!link?.channelProductId) continue;

    try {
      await adapter.updateInventory({
        productId,
        channelProductId: link.channelProductId,
        quantity,
      });
    } catch (err) {
      console.error(`[ProductSyncService] Failed to sync inventory to ${channel.name}:`, err);
    }
  }
}

/**
 * Log sync action
 */
async function logSync(
  channelId: string,
  action: string,
  entityType: string,
  entityId: string,
  success: boolean,
  request?: unknown,
  response?: unknown,
  errorMessage?: string
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    await supabaseAdmin.from('channel_sync_log').insert({
      channel_id: channelId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      status: success ? 'success' : 'failed',
      request_payload: request,
      response_payload: response,
      error_message: errorMessage,
    });
  } catch {
    // Ignore logging errors
  }
}
