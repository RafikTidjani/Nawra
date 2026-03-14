// src/lib/channels/base-adapter.ts
// Abstract base class for sales channel adapters

import type {
  SalesChannel,
  ProductSyncRequest,
  ProductSyncResponse,
  ChannelOrder,
  InventorySyncRequest,
  InventorySyncResponse,
  FulfillmentUpdateRequest,
  FulfillmentUpdateResponse,
} from './types';

/**
 * Base adapter for sales channels
 *
 * Sales channels are platforms where we SELL products (TikTok Shop, Instagram, etc.)
 * This is the opposite of Supplier adapters where we BUY products.
 *
 * Flow:
 * - Products: Nawra → Channel (push)
 * - Orders: Channel → Nawra (pull/webhook)
 * - Inventory: Bidirectional sync
 * - Fulfillment: Nawra → Channel (push tracking info)
 */
export abstract class BaseChannelAdapter {
  protected channel: SalesChannel;

  constructor(channel: SalesChannel) {
    this.channel = channel;
  }

  /**
   * Get the channel code (e.g., 'tiktok-shop')
   */
  get code(): string {
    return this.channel.code;
  }

  /**
   * Get the channel name
   */
  get name(): string {
    return this.channel.name;
  }

  // ============================================
  // AUTH & CONNECTION
  // ============================================

  /**
   * Test the connection to the channel API
   * Returns true if credentials are valid and API is reachable
   */
  abstract testConnection(): Promise<{ success: boolean; message: string; shopInfo?: unknown }>;

  /**
   * Initialize OAuth flow - returns authorization URL
   */
  abstract getAuthorizationUrl(redirectUri: string, state: string): string;

  /**
   * Exchange authorization code for access token
   */
  abstract exchangeCodeForToken(code: string): Promise<{ success: boolean; error?: string }>;

  /**
   * Refresh access token if expired
   */
  abstract refreshAccessToken(): Promise<{ success: boolean; error?: string }>;

  // ============================================
  // PRODUCT SYNC (Nawra → Channel)
  // ============================================

  /**
   * Create a new product on the channel
   */
  abstract createProduct(product: ProductSyncRequest): Promise<ProductSyncResponse>;

  /**
   * Update an existing product on the channel
   */
  abstract updateProduct(channelProductId: string, product: ProductSyncRequest): Promise<ProductSyncResponse>;

  /**
   * Delete/deactivate a product on the channel
   */
  abstract deleteProduct(channelProductId: string): Promise<{ success: boolean; error?: string }>;

  /**
   * Get product status from the channel
   */
  abstract getProductStatus(channelProductId: string): Promise<{ status: string; error?: string }>;

  // ============================================
  // ORDER SYNC (Channel → Nawra)
  // ============================================

  /**
   * Fetch new orders from the channel
   * Used for polling (backup if webhooks fail)
   */
  abstract fetchOrders(options?: {
    status?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  }): Promise<ChannelOrder[]>;

  /**
   * Get a single order by channel order ID
   */
  abstract getOrder(channelOrderId: string): Promise<ChannelOrder | null>;

  /**
   * Parse a webhook payload into a ChannelOrder
   */
  abstract parseOrderWebhook(payload: unknown): ChannelOrder | null;

  /**
   * Verify webhook signature
   */
  abstract verifyWebhookSignature(payload: string, signature: string): boolean;

  // ============================================
  // INVENTORY SYNC (Bidirectional)
  // ============================================

  /**
   * Update inventory on the channel
   */
  abstract updateInventory(request: InventorySyncRequest): Promise<InventorySyncResponse>;

  /**
   * Batch update inventory for multiple products
   */
  abstract batchUpdateInventory(requests: InventorySyncRequest[]): Promise<InventorySyncResponse[]>;

  // ============================================
  // FULFILLMENT (Nawra → Channel)
  // ============================================

  /**
   * Update order with tracking information
   * Called when order is shipped
   */
  abstract updateFulfillment(request: FulfillmentUpdateRequest): Promise<FulfillmentUpdateResponse>;

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Map our stock status to channel-specific availability
   */
  protected mapStockStatus(status: string, quantity: number): boolean {
    if (status === 'out_of_stock') return false;
    if (quantity <= 0) return false;
    return true;
  }

  /**
   * Sanitize text for channel (remove HTML, limit length, etc.)
   */
  protected sanitizeText(text: string, maxLength?: number): string {
    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>/g, '');
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    // Limit length if specified
    if (maxLength && cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength - 3) + '...';
    }
    return cleaned;
  }

  /**
   * Convert price to channel format (usually in cents or with specific decimal places)
   */
  protected formatPrice(price: number, currency: string = 'EUR'): string {
    return price.toFixed(2);
  }
}
