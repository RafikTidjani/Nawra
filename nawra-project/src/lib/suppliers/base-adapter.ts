// src/lib/suppliers/base-adapter.ts
// Abstract base class for all supplier adapters

import type {
  Supplier,
  SupplierProduct,
  SupplierOrderRequest,
  SupplierOrderResponse,
  TrackingUpdate,
  InventoryUpdate,
  SupplierCredentials,
  SyncLogEntry,
} from './types';
import { supabaseAdmin } from '@/lib/supabase';

export abstract class BaseSupplierAdapter {
  protected supplier: Supplier;
  protected credentials?: SupplierCredentials;

  constructor(supplier: Supplier) {
    this.supplier = supplier;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ABSTRACT METHODS - Must be implemented by each adapter
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initialize the adapter (authenticate, set up API client, etc.)
   */
  abstract initialize(): Promise<void>;

  /**
   * Search for products in the supplier's catalog
   */
  abstract searchProducts(query: string, options?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<SupplierProduct[]>;

  /**
   * Get a single product by its supplier product ID
   */
  abstract getProduct(supplierProductId: string): Promise<SupplierProduct | null>;

  /**
   * Submit an order to the supplier
   */
  abstract submitOrder(request: SupplierOrderRequest): Promise<SupplierOrderResponse>;

  /**
   * Cancel an order with the supplier
   */
  abstract cancelOrder(supplierOrderId: string): Promise<boolean>;

  /**
   * Get tracking information for an order
   */
  abstract getTracking(supplierOrderId: string): Promise<TrackingUpdate | null>;

  /**
   * Get inventory levels for products
   */
  abstract getInventory(supplierProductIds: string[]): Promise<InventoryUpdate[]>;

  /**
   * Test the connection/credentials
   */
  abstract testConnection(): Promise<{ success: boolean; message: string }>;

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMON METHODS - Shared functionality for all adapters
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get the supplier configuration
   */
  getSupplier(): Supplier {
    return this.supplier;
  }

  /**
   * Check if the adapter is ready to use
   */
  isActive(): boolean {
    return this.supplier.status === 'active';
  }

  /**
   * Log a sync operation
   */
  protected async logSync(entry: Omit<SyncLogEntry, 'supplierId'>): Promise<void> {
    if (!supabaseAdmin) return;

    try {
      await supabaseAdmin.from('supplier_sync_log').insert({
        supplier_id: this.supplier.id,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        status: entry.status,
        request_payload: entry.requestPayload,
        response_payload: entry.responsePayload,
        error_message: entry.errorMessage,
        duration_ms: entry.durationMs,
      });
    } catch (err) {
      console.error('[BaseSupplierAdapter] Failed to log sync:', err);
    }
  }

  /**
   * Update the last synced timestamp
   */
  protected async updateLastSynced(): Promise<void> {
    if (!supabaseAdmin) return;

    try {
      await supabaseAdmin
        .from('suppliers')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', this.supplier.id);
    } catch (err) {
      console.error('[BaseSupplierAdapter] Failed to update last_synced:', err);
    }
  }

  /**
   * Decrypt API credentials from the database
   */
  protected decryptCredentials(encryptedKey: string): SupplierCredentials {
    // In production, use proper encryption with SUPPLIER_ENCRYPTION_KEY
    // For now, we'll just parse the JSON
    try {
      return JSON.parse(encryptedKey);
    } catch {
      return {};
    }
  }

  /**
   * Encrypt API credentials for storage
   */
  protected encryptCredentials(credentials: SupplierCredentials): string {
    // In production, use proper encryption with SUPPLIER_ENCRYPTION_KEY
    return JSON.stringify(credentials);
  }
}
