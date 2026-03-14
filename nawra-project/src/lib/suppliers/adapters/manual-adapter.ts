// src/lib/suppliers/adapters/manual-adapter.ts
// Adapter for manual fulfillment (no API, just tracking)

import { BaseSupplierAdapter } from '../base-adapter';
import type {
  SupplierProduct,
  SupplierOrderRequest,
  SupplierOrderResponse,
  TrackingUpdate,
  InventoryUpdate,
} from '../types';

export class ManualAdapter extends BaseSupplierAdapter {
  /**
   * No initialization needed for manual fulfillment
   */
  async initialize(): Promise<void> {
    // Nothing to do
  }

  /**
   * Manual fulfillment doesn't have a product catalog
   */
  async searchProducts(): Promise<SupplierProduct[]> {
    return [];
  }

  /**
   * Manual fulfillment doesn't have a product catalog
   */
  async getProduct(): Promise<SupplierProduct | null> {
    return null;
  }

  /**
   * For manual fulfillment, we just log the order as "submitted"
   * The admin will handle it manually
   */
  async submitOrder(request: SupplierOrderRequest): Promise<SupplierOrderResponse> {
    const startTime = Date.now();

    try {
      // Log the submission
      await this.logSync({
        action: 'submit_order',
        entityType: 'order',
        entityId: request.orderId,
        status: 'success',
        requestPayload: request as unknown as Record<string, unknown>,
        responsePayload: { message: 'Manual fulfillment - awaiting admin action' },
        durationMs: Date.now() - startTime,
      });

      return {
        success: true,
        supplierOrderId: `MANUAL-${request.orderId}`,
        message: 'Commande enregistrée pour traitement manuel',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      await this.logSync({
        action: 'submit_order',
        entityType: 'order',
        entityId: request.orderId,
        status: 'error',
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
   * Manual cancellation
   */
  async cancelOrder(supplierOrderId: string): Promise<boolean> {
    await this.logSync({
      action: 'cancel_order',
      entityType: 'order',
      entityId: supplierOrderId,
      status: 'success',
      responsePayload: { message: 'Manual cancellation recorded' },
    });

    return true;
  }

  /**
   * Manual fulfillment doesn't have automatic tracking
   */
  async getTracking(): Promise<TrackingUpdate | null> {
    return null;
  }

  /**
   * Manual fulfillment doesn't have inventory sync
   */
  async getInventory(): Promise<InventoryUpdate[]> {
    return [];
  }

  /**
   * Always succeeds - manual fulfillment is always "available"
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'Fulfillment manuel actif',
    };
  }
}
