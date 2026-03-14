// src/lib/suppliers/adapters/index.ts
// Registry of all supplier adapters

import type { Supplier, SupplierCode } from '../types';
import type { BaseSupplierAdapter } from '../base-adapter';
import { ManualAdapter } from './manual-adapter';
import { CJDropshippingAdapter } from './cjdropshipping-adapter';

// Map of supplier codes to adapter classes
const ADAPTER_REGISTRY: Record<SupplierCode, new (supplier: Supplier) => BaseSupplierAdapter> = {
  manual: ManualAdapter,
  cjdropshipping: CJDropshippingAdapter,
  spocket: ManualAdapter, // Fallback to manual until implemented
};

/**
 * Get the adapter class for a supplier code
 */
export function getAdapterClass(code: SupplierCode): new (supplier: Supplier) => BaseSupplierAdapter {
  const AdapterClass = ADAPTER_REGISTRY[code];
  if (!AdapterClass) {
    throw new Error(`Unknown supplier code: ${code}`);
  }
  return AdapterClass;
}

/**
 * Create an adapter instance for a supplier
 */
export function createAdapter(supplier: Supplier): BaseSupplierAdapter {
  const AdapterClass = getAdapterClass(supplier.code as SupplierCode);
  return new AdapterClass(supplier);
}

// Re-export adapters
export { ManualAdapter } from './manual-adapter';
export { CJDropshippingAdapter } from './cjdropshipping-adapter';
