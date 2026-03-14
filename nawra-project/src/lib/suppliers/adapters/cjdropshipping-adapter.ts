// src/lib/suppliers/adapters/cjdropshipping-adapter.ts
// Adapter for CJ Dropshipping API

import { BaseSupplierAdapter } from '../base-adapter';
import type {
  SupplierProduct,
  SupplierOrderRequest,
  SupplierOrderResponse,
  TrackingUpdate,
  InventoryUpdate,
  SupplierCredentials,
  FulfillmentStatus,
} from '../types';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

interface CJAuthResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    accessToken: string;
    accessTokenExpiryDate: string;
    refreshToken: string;
    refreshTokenExpiryDate: string;
  };
}

interface CJProduct {
  pid: string;
  productNameEn: string;
  productSku: string;
  sellPrice: number;
  productImage: string;
  categoryName: string;
  description: string;
  variants?: Array<{
    vid: string;
    variantNameEn: string;
    variantSku: string;
    variantSellPrice: number;
    variantImage: string;
    variantStock: number;
  }>;
}

interface CJOrderResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    orderId: string;
    orderNum: string;
  };
}

interface CJTrackingResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    trackNumber: string;
    logisticsStatus: string;
    trackInfo: Array<{
      date: string;
      location: string;
      trackContent: string;
    }>;
  };
}

export class CJDropshippingAdapter extends BaseSupplierAdapter {
  private accessToken?: string;
  private tokenExpiresAt?: Date;

  /**
   * Initialize by authenticating with CJ API
   */
  async initialize(): Promise<void> {
    const email = process.env.CJ_EMAIL;
    const password = process.env.CJ_PASSWORD;

    if (!email || !password) {
      throw new Error('CJ_EMAIL and CJ_PASSWORD environment variables are required');
    }

    await this.authenticate(email, password);
  }

  /**
   * Authenticate with CJ API using email/password
   */
  private async authenticate(email: string, password: string): Promise<void> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: CJAuthResponse = await response.json();

      if (!data.result) {
        throw new Error(data.message || 'Authentication failed');
      }

      this.accessToken = data.data.accessToken;
      this.tokenExpiresAt = new Date(data.data.accessTokenExpiryDate);
      this.credentials = {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        expiresAt: data.data.accessTokenExpiryDate,
      };

      await this.logSync({
        action: 'authenticate',
        entityType: 'order',
        status: 'success',
        durationMs: Date.now() - startTime,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';

      await this.logSync({
        action: 'authenticate',
        entityType: 'order',
        status: 'error',
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      throw err;
    }
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiresAt || this.tokenExpiresAt <= new Date()) {
      await this.initialize();
    }
  }

  /**
   * Make an authenticated API request
   */
  private async apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, unknown>
  ): Promise<T> {
    await this.ensureAuthenticated();

    const url = `${CJ_API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'CJ-Access-Token': this.accessToken!,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return response.json();
  }

  /**
   * Search for products in CJ catalog
   */
  async searchProducts(
    query: string,
    options?: { category?: string; page?: number; limit?: number }
  ): Promise<SupplierProduct[]> {
    const startTime = Date.now();
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    try {
      const response = await this.apiRequest<{
        code: number;
        result: boolean;
        data: { list: CJProduct[]; total: number };
      }>('/product/list', 'POST', {
        productNameEn: query,
        pageNum: page,
        pageSize: limit,
        categoryId: options?.category,
      });

      if (!response.result) {
        throw new Error('Failed to search products');
      }

      const products: SupplierProduct[] = (response.data?.list || []).map((p) => ({
        supplierId: this.supplier.id,
        supplierProductId: p.pid,
        sku: p.productSku,
        name: p.productNameEn,
        description: p.description,
        images: [p.productImage],
        price: p.sellPrice,
        currency: 'USD',
        variants: p.variants?.map((v) => ({
          variantId: v.vid,
          name: v.variantNameEn,
          price: v.variantSellPrice,
          inventory: v.variantStock,
          sku: v.variantSku,
        })),
        rawData: p as unknown as Record<string, unknown>,
      }));

      await this.logSync({
        action: 'search_products',
        entityType: 'product',
        status: 'success',
        requestPayload: { query, ...options },
        responsePayload: { count: products.length },
        durationMs: Date.now() - startTime,
      });

      return products;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';

      await this.logSync({
        action: 'search_products',
        entityType: 'product',
        status: 'error',
        requestPayload: { query, ...options },
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      return [];
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(supplierProductId: string): Promise<SupplierProduct | null> {
    const startTime = Date.now();

    try {
      const response = await this.apiRequest<{
        code: number;
        result: boolean;
        data: CJProduct;
      }>(`/product/query?pid=${supplierProductId}`);

      if (!response.result || !response.data) {
        return null;
      }

      const p = response.data;
      const product: SupplierProduct = {
        supplierId: this.supplier.id,
        supplierProductId: p.pid,
        sku: p.productSku,
        name: p.productNameEn,
        description: p.description,
        images: [p.productImage],
        price: p.sellPrice,
        currency: 'USD',
        variants: p.variants?.map((v) => ({
          variantId: v.vid,
          name: v.variantNameEn,
          price: v.variantSellPrice,
          inventory: v.variantStock,
          sku: v.variantSku,
        })),
        rawData: p as unknown as Record<string, unknown>,
      };

      await this.logSync({
        action: 'get_product',
        entityType: 'product',
        entityId: supplierProductId,
        status: 'success',
        durationMs: Date.now() - startTime,
      });

      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Get product failed';

      await this.logSync({
        action: 'get_product',
        entityType: 'product',
        entityId: supplierProductId,
        status: 'error',
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      return null;
    }
  }

  /**
   * Submit an order to CJ
   */
  async submitOrder(request: SupplierOrderRequest): Promise<SupplierOrderResponse> {
    const startTime = Date.now();

    try {
      const response = await this.apiRequest<CJOrderResponse>('/shopping/order/createOrder', 'POST', {
        orderNumber: request.orderId,
        products: [
          {
            vid: request.variantId || request.supplierProductId,
            quantity: request.quantity,
          },
        ],
        shippingInfo: {
          firstName: request.shippingAddress.firstName,
          lastName: request.shippingAddress.lastName,
          address: request.shippingAddress.address,
          address2: request.shippingAddress.address2 || '',
          city: request.shippingAddress.city,
          zip: request.shippingAddress.zip,
          countryCode: this.getCountryCode(request.shippingAddress.country),
          phone: request.shippingAddress.phone,
        },
        remark: request.note || '',
      });

      if (!response.result) {
        throw new Error(response.message || 'Order submission failed');
      }

      await this.logSync({
        action: 'submit_order',
        entityType: 'order',
        entityId: request.orderId,
        status: 'success',
        requestPayload: request as unknown as Record<string, unknown>,
        responsePayload: response as unknown as Record<string, unknown>,
        durationMs: Date.now() - startTime,
      });

      return {
        success: true,
        supplierOrderId: response.data.orderId,
        supplierReference: response.data.orderNum,
        rawData: response as unknown as Record<string, unknown>,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Order submission failed';

      await this.logSync({
        action: 'submit_order',
        entityType: 'order',
        entityId: request.orderId,
        status: 'error',
        requestPayload: request as unknown as Record<string, unknown>,
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Cancel an order with CJ
   */
  async cancelOrder(supplierOrderId: string): Promise<boolean> {
    const startTime = Date.now();

    try {
      const response = await this.apiRequest<{ code: number; result: boolean }>(
        '/shopping/order/deleteOrder',
        'POST',
        { orderId: supplierOrderId }
      );

      await this.logSync({
        action: 'cancel_order',
        entityType: 'order',
        entityId: supplierOrderId,
        status: response.result ? 'success' : 'error',
        durationMs: Date.now() - startTime,
      });

      return response.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Cancel failed';

      await this.logSync({
        action: 'cancel_order',
        entityType: 'order',
        entityId: supplierOrderId,
        status: 'error',
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      return false;
    }
  }

  /**
   * Get tracking info for an order
   */
  async getTracking(supplierOrderId: string): Promise<TrackingUpdate | null> {
    const startTime = Date.now();

    try {
      const response = await this.apiRequest<CJTrackingResponse>(
        `/logistic/getTrackInfo?orderId=${supplierOrderId}`
      );

      if (!response.result || !response.data) {
        return null;
      }

      const data = response.data;
      const status = this.mapTrackingStatus(data.logisticsStatus);

      await this.logSync({
        action: 'get_tracking',
        entityType: 'tracking',
        entityId: supplierOrderId,
        status: 'success',
        durationMs: Date.now() - startTime,
      });

      return {
        trackingNumber: data.trackNumber,
        carrier: 'CJ Logistics',
        status,
        events: data.trackInfo?.map((t) => ({
          timestamp: t.date,
          location: t.location,
          status: t.trackContent,
          description: t.trackContent,
        })),
        rawData: response as unknown as Record<string, unknown>,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tracking failed';

      await this.logSync({
        action: 'get_tracking',
        entityType: 'tracking',
        entityId: supplierOrderId,
        status: 'error',
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      return null;
    }
  }

  /**
   * Get inventory for products
   */
  async getInventory(supplierProductIds: string[]): Promise<InventoryUpdate[]> {
    const startTime = Date.now();
    const updates: InventoryUpdate[] = [];

    try {
      for (const pid of supplierProductIds) {
        const product = await this.getProduct(pid);
        if (product) {
          const totalInventory = product.variants?.reduce((sum, v) => sum + (v.inventory || 0), 0) || 0;
          updates.push({
            supplierProductId: pid,
            quantity: totalInventory,
            inStock: totalInventory > 0,
            lastUpdated: new Date().toISOString(),
          });
        }
      }

      await this.logSync({
        action: 'get_inventory',
        entityType: 'inventory',
        status: 'success',
        requestPayload: { productIds: supplierProductIds },
        responsePayload: { count: updates.length },
        durationMs: Date.now() - startTime,
      });

      return updates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Inventory sync failed';

      await this.logSync({
        action: 'get_inventory',
        entityType: 'inventory',
        status: 'error',
        errorMessage,
        durationMs: Date.now() - startTime,
      });

      return [];
    }
  }

  /**
   * Test the CJ API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.initialize();
      return {
        success: true,
        message: 'Connexion à CJ Dropshipping réussie',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Échec de la connexion',
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private getCountryCode(country: string): string {
    const codes: Record<string, string> = {
      France: 'FR',
      france: 'FR',
      Belgium: 'BE',
      belgique: 'BE',
      Switzerland: 'CH',
      suisse: 'CH',
    };
    return codes[country] || 'FR';
  }

  private mapTrackingStatus(cjStatus: string): FulfillmentStatus {
    const statusMap: Record<string, FulfillmentStatus> = {
      PENDING: 'pending',
      PROCESSING: 'submitted',
      SHIPPED: 'shipped',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
    };
    return statusMap[cjStatus.toUpperCase()] || 'pending';
  }
}
