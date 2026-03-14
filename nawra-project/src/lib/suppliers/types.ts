// src/lib/suppliers/types.ts
// TypeScript types for supplier integration

export type SupplierCode = 'manual' | 'cjdropshipping' | 'spocket';
export type SupplierStatus = 'active' | 'inactive' | 'testing';
export type FulfillmentStatus = 'pending' | 'submitted' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'failed';
export type SyncStatus = 'synced' | 'pending' | 'error';

// Supplier configuration stored in DB
export interface Supplier {
  id: string;
  code: SupplierCode;
  name: string;
  api_endpoint?: string;
  api_key_encrypted?: string;
  webhook_secret?: string;
  status: SupplierStatus;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
}

// Product in supplier's catalog
export interface SupplierProduct {
  supplierId: string;
  supplierProductId: string;
  sku?: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  currency: string;
  variants?: SupplierProductVariant[];
  inventory?: number;
  shippingInfo?: {
    estimatedDays: number;
    cost: number;
  };
  rawData?: Record<string, unknown>;
}

export interface SupplierProductVariant {
  variantId: string;
  name: string;
  price: number;
  inventory?: number;
  sku?: string;
  attributes?: Record<string, string>;
}

// Order to submit to supplier
export interface SupplierOrderRequest {
  orderId: string;
  orderItemId: string;
  supplierProductId: string;
  variantId?: string;
  quantity: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
  };
  customerEmail?: string;
  note?: string;
}

// Response from supplier after order submission
export interface SupplierOrderResponse {
  success: boolean;
  supplierOrderId?: string;
  supplierReference?: string;
  estimatedShippingDate?: string;
  cost?: number;
  currency?: string;
  message?: string;
  rawData?: Record<string, unknown>;
}

// Tracking update from supplier
export interface TrackingUpdate {
  trackingNumber?: string;
  carrier?: string;
  carrierUrl?: string;
  status: FulfillmentStatus;
  events?: TrackingEvent[];
  estimatedDelivery?: string;
  rawData?: Record<string, unknown>;
}

export interface TrackingEvent {
  timestamp: string;
  location?: string;
  status: string;
  description: string;
}

// Inventory update from supplier
export interface InventoryUpdate {
  supplierProductId: string;
  variantId?: string;
  quantity: number;
  inStock: boolean;
  lastUpdated: string;
}

// Sync log entry
export interface SyncLogEntry {
  supplierId: string;
  action: string;
  entityType: 'product' | 'order' | 'inventory' | 'tracking';
  entityId?: string;
  status: 'success' | 'error' | 'warning';
  requestPayload?: Record<string, unknown>;
  responsePayload?: Record<string, unknown>;
  errorMessage?: string;
  durationMs?: number;
}

// Supplier credentials (for API auth)
export interface SupplierCredentials {
  email?: string;
  password?: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}
