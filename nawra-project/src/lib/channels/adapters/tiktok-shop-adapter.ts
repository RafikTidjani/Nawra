// src/lib/channels/adapters/tiktok-shop-adapter.ts
// TikTok Shop sales channel adapter

import { BaseChannelAdapter } from '../base-adapter';
import type {
  SalesChannel,
  TikTokShopConfig,
  TikTokShopCredentials,
  ProductSyncRequest,
  ProductSyncResponse,
  ChannelOrder,
  ChannelOrderItem,
  InventorySyncRequest,
  InventorySyncResponse,
  FulfillmentUpdateRequest,
  FulfillmentUpdateResponse,
  TikTokApiResponse,
  TikTokAuthResponse,
  TikTokShopInfo,
  TikTokOrderResponse,
  ChannelOrderStatus,
} from '../types';
import crypto from 'crypto';

// TikTok Shop API endpoints by region
const API_ENDPOINTS: Record<string, string> = {
  // Production
  FR: 'https://open-api.tiktokglobalshop.com',
  UK: 'https://open-api.tiktokglobalshop.com',
  DE: 'https://open-api.tiktokglobalshop.com',
  US: 'https://open-api.tiktokglobalshop.com',
  // Sandbox
  SANDBOX: 'https://open-api-sandbox.tiktokglobalshop.com',
};

const AUTH_ENDPOINT = 'https://auth.tiktok-shops.com';

// TikTok order status mapping
const ORDER_STATUS_MAP: Record<number, ChannelOrderStatus> = {
  100: 'unpaid',
  111: 'awaiting_shipment', // Awaiting Shipment
  112: 'awaiting_shipment', // Awaiting Collection
  114: 'awaiting_shipment', // Partially Shipping
  121: 'in_transit',
  122: 'delivered',
  130: 'completed',
  140: 'cancelled',
  150: 'refunded', // On hold (refund in progress)
};

// TikTok carrier codes for France
const CARRIER_CODES: Record<string, string> = {
  'colissimo': 'COLISSIMO',
  'chronopost': 'CHRONOPOST',
  'mondial-relay': 'MONDIAL_RELAY',
  'ups': 'UPS',
  'dhl': 'DHL',
  'fedex': 'FEDEX',
  'other': 'OTHER',
};

export class TikTokShopAdapter extends BaseChannelAdapter {
  private config: TikTokShopConfig;
  private credentials: TikTokShopCredentials;
  private apiEndpoint: string;

  constructor(channel: SalesChannel) {
    super(channel);
    this.config = channel.config as TikTokShopConfig;
    this.credentials = this.config.credentials;
    this.apiEndpoint = this.config.sandbox
      ? API_ENDPOINTS.SANDBOX
      : API_ENDPOINTS[this.config.region] || API_ENDPOINTS.FR;
  }

  // ============================================
  // AUTH & CONNECTION
  // ============================================

  async testConnection(): Promise<{ success: boolean; message: string; shopInfo?: unknown }> {
    try {
      // Ensure we have valid tokens
      if (!this.credentials.accessToken) {
        return { success: false, message: 'Access token manquant. Veuillez autoriser l\'application.' };
      }

      // Check if token is expired
      if (this.credentials.tokenExpiresAt && Date.now() > this.credentials.tokenExpiresAt) {
        const refreshResult = await this.refreshAccessToken();
        if (!refreshResult.success) {
          return { success: false, message: 'Token expiré et rafraîchissement échoué.' };
        }
      }

      // Get shop info to verify connection
      const response = await this.apiRequest<{ shops: TikTokShopInfo[] }>(
        '/authorization/202309/shops',
        'GET'
      );

      if (response.code === 0 && response.data?.shops?.length) {
        const shop = response.data.shops[0];
        return {
          success: true,
          message: `Connecté à ${shop.shop_name}`,
          shopInfo: shop,
        };
      }

      return { success: false, message: response.message || 'Erreur de connexion' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur de connexion',
      };
    }
  }

  getAuthorizationUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      app_key: this.credentials.appKey,
      redirect_uri: redirectUri,
      state: state,
    });

    return `${AUTH_ENDPOINT}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${AUTH_ENDPOINT}/api/v2/token/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_key: this.credentials.appKey,
          app_secret: this.credentials.appSecret,
          auth_code: code,
          grant_type: 'authorized_code',
        }),
      });

      const data = await response.json() as TikTokApiResponse<TikTokAuthResponse>;

      if (data.code === 0 && data.data) {
        this.credentials.accessToken = data.data.access_token;
        this.credentials.refreshToken = data.data.refresh_token;
        this.credentials.tokenExpiresAt = Date.now() + (data.data.access_token_expire_in * 1000);

        // TODO: Save credentials to database
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur d\'authentification' };
    }
  }

  async refreshAccessToken(): Promise<{ success: boolean; error?: string }> {
    if (!this.credentials.refreshToken) {
      return { success: false, error: 'Refresh token manquant' };
    }

    try {
      const response = await fetch(`${AUTH_ENDPOINT}/api/v2/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_key: this.credentials.appKey,
          app_secret: this.credentials.appSecret,
          refresh_token: this.credentials.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json() as TikTokApiResponse<TikTokAuthResponse>;

      if (data.code === 0 && data.data) {
        this.credentials.accessToken = data.data.access_token;
        this.credentials.refreshToken = data.data.refresh_token;
        this.credentials.tokenExpiresAt = Date.now() + (data.data.access_token_expire_in * 1000);

        // TODO: Save credentials to database
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur de rafraîchissement' };
    }
  }

  // ============================================
  // PRODUCT SYNC (Nawra → TikTok)
  // ============================================

  async createProduct(product: ProductSyncRequest): Promise<ProductSyncResponse> {
    try {
      // Prepare TikTok product payload
      const tiktokProduct = this.mapProductToTikTok(product);

      const response = await this.apiRequest<{ product_id: string }>(
        '/product/202309/products',
        'POST',
        tiktokProduct
      );

      if (response.code === 0 && response.data?.product_id) {
        return {
          success: true,
          channelProductId: response.data.product_id,
          channelStatus: 'pending', // TikTok reviews new products
        };
      }

      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur de création' };
    }
  }

  async updateProduct(channelProductId: string, product: ProductSyncRequest): Promise<ProductSyncResponse> {
    try {
      const tiktokProduct = this.mapProductToTikTok(product);

      const response = await this.apiRequest(
        `/product/202309/products/${channelProductId}`,
        'PUT',
        tiktokProduct
      );

      if (response.code === 0) {
        return {
          success: true,
          channelProductId,
          channelStatus: 'live',
        };
      }

      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur de mise à jour' };
    }
  }

  async deleteProduct(channelProductId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.apiRequest(
        `/product/202309/products/${channelProductId}`,
        'DELETE'
      );

      if (response.code === 0) {
        return { success: true };
      }

      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur de suppression' };
    }
  }

  async getProductStatus(channelProductId: string): Promise<{ status: string; error?: string }> {
    try {
      const response = await this.apiRequest<{ status: number }>(
        `/product/202309/products/${channelProductId}`,
        'GET'
      );

      if (response.code === 0 && response.data) {
        const statusMap: Record<number, string> = {
          1: 'draft',
          2: 'pending',
          3: 'failed',
          4: 'live',
          5: 'suspended',
          6: 'suspended',
          7: 'suspended',
        };
        return { status: statusMap[response.data.status] || 'unknown' };
      }

      return { status: 'unknown', error: response.message };
    } catch (error) {
      return { status: 'unknown', error: error instanceof Error ? error.message : 'Erreur' };
    }
  }

  // ============================================
  // ORDER SYNC (TikTok → Nawra)
  // ============================================

  async fetchOrders(options?: {
    status?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  }): Promise<ChannelOrder[]> {
    try {
      const params: Record<string, unknown> = {
        page_size: options?.limit || 20,
        sort_by: 'CREATE_TIME',
        sort_type: 'DESC',
      };

      if (options?.fromDate) {
        params.create_time_ge = Math.floor(options.fromDate.getTime() / 1000);
      }
      if (options?.toDate) {
        params.create_time_lt = Math.floor(options.toDate.getTime() / 1000);
      }

      const response = await this.apiRequest<{ orders: TikTokOrderResponse[] }>(
        '/order/202309/orders/search',
        'POST',
        params
      );

      if (response.code === 0 && response.data?.orders) {
        return response.data.orders.map(order => this.mapTikTokOrderToChannel(order));
      }

      return [];
    } catch (error) {
      console.error('[TikTokShopAdapter] fetchOrders error:', error);
      return [];
    }
  }

  async getOrder(channelOrderId: string): Promise<ChannelOrder | null> {
    try {
      const response = await this.apiRequest<{ orders: TikTokOrderResponse[] }>(
        '/order/202309/orders',
        'POST',
        { ids: [channelOrderId] }
      );

      if (response.code === 0 && response.data?.orders?.length) {
        return this.mapTikTokOrderToChannel(response.data.orders[0]);
      }

      return null;
    } catch (error) {
      console.error('[TikTokShopAdapter] getOrder error:', error);
      return null;
    }
  }

  parseOrderWebhook(payload: unknown): ChannelOrder | null {
    try {
      const data = payload as { type: number; data: TikTokOrderResponse };
      if (data.type === 1 && data.data) { // type 1 = order
        return this.mapTikTokOrderToChannel(data.data);
      }
      return null;
    } catch {
      return null;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) return false;

    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  // ============================================
  // INVENTORY SYNC
  // ============================================

  async updateInventory(request: InventorySyncRequest): Promise<InventorySyncResponse> {
    try {
      const response = await this.apiRequest(
        `/product/202309/products/${request.channelProductId}/inventory`,
        'PUT',
        {
          skus: [{
            id: request.channelProductId, // Assuming single SKU products
            inventory: [{ quantity: request.quantity }],
          }],
        }
      );

      if (response.code === 0) {
        return {
          success: true,
          channelProductId: request.channelProductId,
          newQuantity: request.quantity,
        };
      }

      return {
        success: false,
        channelProductId: request.channelProductId,
        error: response.message,
      };
    } catch (error) {
      return {
        success: false,
        channelProductId: request.channelProductId,
        error: error instanceof Error ? error.message : 'Erreur',
      };
    }
  }

  async batchUpdateInventory(requests: InventorySyncRequest[]): Promise<InventorySyncResponse[]> {
    // TikTok doesn't have a batch inventory endpoint, so we process sequentially
    const results: InventorySyncResponse[] = [];
    for (const request of requests) {
      const result = await this.updateInventory(request);
      results.push(result);
    }
    return results;
  }

  // ============================================
  // FULFILLMENT
  // ============================================

  async updateFulfillment(request: FulfillmentUpdateRequest): Promise<FulfillmentUpdateResponse> {
    try {
      const carrierCode = CARRIER_CODES[request.carrier] || 'OTHER';

      const response = await this.apiRequest(
        `/fulfillment/202309/orders/${request.channelOrderId}/packages`,
        'POST',
        {
          packages: [{
            tracking_number: request.trackingNumber,
            shipping_provider_id: carrierCode,
          }],
        }
      );

      if (response.code === 0) {
        return { success: true };
      }

      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur' };
    }
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  private async apiRequest<T = unknown>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: unknown
  ): Promise<TikTokApiResponse<T>> {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = new URL(path, this.apiEndpoint);

    // Add required query parameters
    url.searchParams.set('app_key', this.credentials.appKey);
    url.searchParams.set('timestamp', timestamp.toString());
    if (this.credentials.shopCipher) {
      url.searchParams.set('shop_cipher', this.credentials.shopCipher);
    }

    // Generate signature
    const signature = this.generateSignature(path, timestamp, body);
    url.searchParams.set('sign', signature);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.credentials.accessToken) {
      headers['x-tts-access-token'] = this.credentials.accessToken;
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return await response.json() as TikTokApiResponse<T>;
  }

  private generateSignature(path: string, timestamp: number, body?: unknown): string {
    // TikTok signature algorithm
    // sign = HMAC-SHA256(app_secret, path + timestamp + body)
    const bodyStr = body ? JSON.stringify(body) : '';
    const signString = `${path}${timestamp}${bodyStr}`;

    return crypto
      .createHmac('sha256', this.credentials.appSecret)
      .update(signString)
      .digest('hex');
  }

  private mapProductToTikTok(product: ProductSyncRequest): Record<string, unknown> {
    return {
      title: this.sanitizeText(product.name, 255),
      description: this.sanitizeText(product.description, 10000),
      category_id: this.getCategoryId(product.category),
      brand_id: '', // Optional
      main_images: product.images.slice(0, 9).map(url => ({ uri: url })),
      skus: [{
        sales_attributes: [],
        stock_infos: [{
          available_stock: product.stockQuantity,
        }],
        price: {
          amount: this.formatPrice(product.price),
          currency: 'EUR',
        },
        seller_sku: product.sku || product.productId,
      }],
      package_dimensions: product.dimensions ? {
        length: product.dimensions.length.toString(),
        width: product.dimensions.width.toString(),
        height: product.dimensions.height.toString(),
        unit: 'CENTIMETER',
      } : undefined,
      package_weight: product.weight ? {
        value: product.weight.toString(),
        unit: 'KILOGRAM',
      } : undefined,
    };
  }

  private mapTikTokOrderToChannel(order: TikTokOrderResponse): ChannelOrder {
    const items: ChannelOrderItem[] = order.item_list.map(item => ({
      channelItemId: item.id,
      channelProductId: item.product_id,
      sku: item.sku_id,
      name: item.product_name,
      quantity: item.quantity,
      unitPrice: parseFloat(item.sale_price),
      totalPrice: parseFloat(item.sale_price) * item.quantity,
      imageUrl: item.image_url,
    }));

    return {
      channelId: this.channel.id,
      channelOrderId: order.order_id,
      channelOrderNumber: order.order_id,
      status: ORDER_STATUS_MAP[order.order_status] || 'awaiting_shipment',
      totalAmount: parseFloat(order.payment_info.total_amount),
      currency: order.payment_info.currency,
      customer: {
        name: order.recipient_address.name,
        phone: order.recipient_address.phone_number,
      },
      shippingAddress: {
        name: order.recipient_address.name,
        phone: order.recipient_address.phone_number,
        addressLine1: order.recipient_address.full_address,
        city: order.recipient_address.city,
        postalCode: order.recipient_address.postal_code,
        country: order.recipient_address.country,
        countryCode: 'FR', // Assuming France
      },
      items,
      orderCreatedAt: new Date(order.create_time * 1000).toISOString(),
      orderPaidAt: order.paid_time ? new Date(order.paid_time * 1000).toISOString() : undefined,
    };
  }

  private getCategoryId(category: string): string {
    // TikTok Shop category mapping
    // This would need to be expanded with actual TikTok category IDs
    const categoryMap: Record<string, string> = {
      'coiffeuse': '601226', // Beauty & Personal Care > Makeup > Vanities & Makeup Tables
      'miroir': '601226',
      'accessoire': '601226',
    };
    return categoryMap[category.toLowerCase()] || '601226';
  }
}
