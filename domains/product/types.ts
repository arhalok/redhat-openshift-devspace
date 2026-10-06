/**
 * Product & Supplier SKU Domain Types
 * Section 9 of logistics-foundation.md:
 * Separate Canonical Product from Supplier SKU / Offer.
 */

export interface Product {
  id: string;
  brand: string;
  name: string;
  normalizedName: string;
  category: string;
  subcategory: string;
  unit: string;
  packSize: string;
  weightGrams: number;
  volumeMl: number;
  barcode: string;
  status: 'ACTIVE' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierSKU {
  id: string;
  supplierId: string;
  productId: string;
  supplierSkuCode: string;
  supplierName: string;
  packDescription: string;
  pricePaise: number; // Integer minor units (Section 15)
  moq: number; // Minimum Order Quantity
  availableQuantity: number;
  leadTimeHours: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
