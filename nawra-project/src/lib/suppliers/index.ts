// src/lib/suppliers/index.ts
// Main entry point for the supplier service

import { supabaseAdmin } from '@/lib/supabase';
import type { Supplier, SupplierCode } from './types';
import type { BaseSupplierAdapter } from './base-adapter';
import { createAdapter } from './adapters';

// Cache of adapter instances
const adapterCache = new Map<string, BaseSupplierAdapter>();

/**
 * SupplierService - Singleton service for managing suppliers
 */
export const SupplierService = {
  /**
   * Get all suppliers from database
   */
  async getSuppliers(): Promise<Supplier[]> {
    if (!supabaseAdmin) {
      console.warn('[SupplierService] supabaseAdmin not available');
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) {
      console.error('[SupplierService] Error fetching suppliers:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get a supplier by ID
   */
  async getSupplierById(id: string): Promise<Supplier | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[SupplierService] Error fetching supplier:', error);
      return null;
    }

    return data;
  },

  /**
   * Get a supplier by code
   */
  async getSupplierByCode(code: SupplierCode): Promise<Supplier | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      console.error('[SupplierService] Error fetching supplier by code:', error);
      return null;
    }

    return data;
  },

  /**
   * Get an adapter for a supplier (cached)
   */
  async getAdapter(supplierOrId: Supplier | string): Promise<BaseSupplierAdapter | null> {
    let supplier: Supplier | null;

    if (typeof supplierOrId === 'string') {
      // Check cache first
      const cached = adapterCache.get(supplierOrId);
      if (cached) return cached;

      // Fetch supplier
      supplier = await this.getSupplierById(supplierOrId);
    } else {
      supplier = supplierOrId;
    }

    if (!supplier) return null;

    // Check cache
    const cached = adapterCache.get(supplier.id);
    if (cached) return cached;

    // Create new adapter
    const adapter = createAdapter(supplier);
    adapterCache.set(supplier.id, adapter);

    return adapter;
  },

  /**
   * Get adapter by supplier code
   */
  async getAdapterByCode(code: SupplierCode): Promise<BaseSupplierAdapter | null> {
    const supplier = await this.getSupplierByCode(code);
    if (!supplier) return null;
    return this.getAdapter(supplier);
  },

  /**
   * Clear the adapter cache
   */
  clearCache(): void {
    adapterCache.clear();
  },

  /**
   * Get the primary supplier for a product
   */
  async getProductSupplier(productId: string): Promise<{
    supplier: Supplier;
    supplierProductId: string;
  } | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from('supplier_products')
      .select(`
        supplier_product_id,
        suppliers (*)
      `)
      .eq('product_id', productId)
      .eq('is_primary', true)
      .single();

    if (error || !data) return null;

    return {
      supplier: data.suppliers as unknown as Supplier,
      supplierProductId: data.supplier_product_id,
    };
  },
};

// Re-export types and adapters
export * from './types';
export { BaseSupplierAdapter } from './base-adapter';
export { createAdapter, getAdapterClass } from './adapters';
