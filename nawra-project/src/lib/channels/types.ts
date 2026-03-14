// src/lib/channels/types.ts
// Types for sales channels (TikTok Shop, etc.)

/**
 * Sales Channel - A platform where we SELL products
 * (opposite of Supplier where we BUY products)
 */

// ============================================
// CHANNEL CONFIGURATION
// ============================================

export type ChannelStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type SyncStatus = 'synced' | 'pending' | 'failed' | 'not_synced';

export interface SalesChannel {
  id: string;
  code: string; // 'tiktok-shop', 'instagram-shop', etc.
  name: string;
  status: ChannelStatus;
  config: ChannelConfig;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface ChannelConfig {
  apiEndpoint?: string;
  shopId?: string;
  region?: string; // 'FR', 'EU', 'US'
  currency?: string;
  autoSyncProducts?: boolean;
  autoSyncOrders?: boolean;
  autoSyncInventory?: boolean;
  webhookSecret?: string;
}

// ============================================
// TIKTOK SHOP SPECIFIC TYPES
// ============================================

export interface TikTokShopCredentials {
  appKey: string;
  appSecret: string;
  accessToken?: string;
  refreshToken?: string;
  shopId?: string;
  shopCipher?: string; // Required for some API calls
  tokenExpiresAt?: number;
}

export interface TikTokShopConfig extends ChannelConfig {
  credentials: TikTokShopCredentials;
  sandbox?: boolean; // Use sandbox API
  region: 'FR' | 'UK' | 'DE' | 'ES' | 'IT' | 'IE' | 'US';
}

// ============================================
// PRODUCT SYNC TYPES
// ============================================

export interface ChannelProduct {
  // Our internal product
  productId: string;
  productName: string;
  productSlug: string;

  // Channel-specific
  channelId: string;
  channelProductId?: string; // ID on the channel (e.g., TikTok product ID)
  channelStatus: 'draft' | 'pending' | 'live' | 'suspended' | 'deleted';

  // Sync state
  syncStatus: SyncStatus;
  lastSyncedAt?: string;
  lastSyncError?: string;

  // Price override (if different from main site)
  channelPrice?: number;
  channelCompareAtPrice?: number;
}

export interface ProductSyncRequest {
  productId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  stockQuantity: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ProductSyncResponse {
  success: boolean;
  channelProductId?: string;
  channelStatus?: string;
  error?: string;
  warnings?: string[];
}

// ============================================
// ORDER SYNC TYPES
// ============================================

export interface ChannelOrder {
  // Channel info
  channelId: string;
  channelOrderId: string;
  channelOrderNumber: string;

  // Our internal order (created after sync)
  orderId?: string;
  orderNumber?: string;

  // Order details
  status: ChannelOrderStatus;
  totalAmount: number;
  currency: string;

  // Customer
  customer: ChannelCustomer;
  shippingAddress: ChannelAddress;

  // Items
  items: ChannelOrderItem[];

  // Timestamps
  orderCreatedAt: string;
  orderPaidAt?: string;
  syncedAt?: string;
}

export type ChannelOrderStatus =
  | 'unpaid'
  | 'awaiting_shipment'
  | 'awaiting_collection'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface ChannelCustomer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface ChannelAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export interface ChannelOrderItem {
  channelItemId: string;
  channelProductId: string;
  productId?: string; // Our internal product ID
  sku?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

// ============================================
// INVENTORY SYNC TYPES
// ============================================

export interface InventorySyncRequest {
  productId: string;
  channelProductId: string;
  quantity: number;
}

export interface InventorySyncResponse {
  success: boolean;
  channelProductId: string;
  newQuantity?: number;
  error?: string;
}

// ============================================
// FULFILLMENT TYPES (for updating TikTok with tracking)
// ============================================

export interface FulfillmentUpdateRequest {
  channelOrderId: string;
  trackingNumber: string;
  carrier: string;
  carrierCode?: string; // TikTok-specific carrier code
  shippedAt?: string;
}

export interface FulfillmentUpdateResponse {
  success: boolean;
  error?: string;
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface ChannelWebhookEvent {
  type: 'order.created' | 'order.cancelled' | 'order.refunded' | 'product.suspended';
  channelId: string;
  timestamp: string;
  payload: unknown;
}

// ============================================
// TIKTOK SHOP API RESPONSE TYPES
// ============================================

export interface TikTokApiResponse<T = unknown> {
  code: number; // 0 = success
  message: string;
  data?: T;
  request_id?: string;
}

export interface TikTokAuthResponse {
  access_token: string;
  access_token_expire_in: number;
  refresh_token: string;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name?: string;
  seller_base_region?: string;
}

export interface TikTokShopInfo {
  shop_id: string;
  shop_name: string;
  region: string;
  shop_cipher: string;
}

export interface TikTokProductResponse {
  product_id: string;
  status: number; // 1=draft, 2=pending, 3=failed, 4=live, 5=seller_deactivated, 6=platform_deactivated, 7=freeze
}

export interface TikTokOrderResponse {
  order_id: string;
  order_status: number;
  payment_info: {
    total_amount: string;
    currency: string;
  };
  recipient_address: {
    full_address: string;
    phone_number: string;
    name: string;
    postal_code: string;
    city: string;
    country: string;
  };
  item_list: TikTokOrderItem[];
  create_time: number;
  paid_time?: number;
}

export interface TikTokOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  sku_id: string;
  quantity: number;
  sale_price: string;
  image_url: string;
}

// ============================================
// SYNC LOG
// ============================================

export interface ChannelSyncLog {
  id: string;
  channelId: string;
  action: 'product_create' | 'product_update' | 'product_delete' | 'order_import' | 'inventory_update' | 'fulfillment_update';
  entityType: 'product' | 'order' | 'inventory';
  entityId: string;
  status: 'success' | 'failed';
  requestPayload?: unknown;
  responsePayload?: unknown;
  errorMessage?: string;
  createdAt: string;
}
