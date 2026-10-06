/**
 * Supplier Models, Recommendation Contracts & Scoring Config
 * Sections 3.4, 3.7, 9, 29 of Phase 1 Technical Specification
 */

import { Address } from '../common/types';

export interface Supplier {
  id: string;
  workspaceId: string;
  name: string;
  supplierType: 'MANUFACTURER' | 'DISTRIBUTOR' | 'WHOLESALER' | 'FPO' | 'OTHER';
  address: Address;
  latitude: number;
  longitude: number;
  h3Cell?: string;
  reliabilityScore: number;
  averageLeadTimeHours?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ONBOARDING';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  productId: string;
  supplierSku?: string;
  unitPricePaise: number; // Integer minor units (INR Paise)
  currency: 'INR';
  minimumOrderQuantity?: number;
  availableQuantity?: number;
  leadTimeHours?: number;
  lastUpdatedAt: string;
}

export interface SupplierRecommendation {
  supplierId: string;
  productId: string;
  requestedQuantity: number;
  totalCostPaise: number;
  unitPricePaise: number;
  estimatedDeliveryAt?: string;
  leadTimeHours?: number;
  minimumOrderQuantity?: number;
  availabilityStatus: 'AVAILABLE' | 'PARTIAL' | 'UNAVAILABLE' | 'UNKNOWN';
  reliabilityScore?: number;
  distanceKm?: number;
  score: number;
  recommendationReasons: string[];
}

export interface SupplierScoringConfig {
  priceWeight: number;        // default: 0.30
  availabilityWeight: number; // default: 0.20
  reliabilityWeight: number;  // default: 0.20
  deliveryWeight: number;     // default: 0.15
  distanceWeight: number;     // default: 0.10
  moqWeight: number;          // default: 0.05
}

export interface SupplierRecommendationService {
  recommend(input: {
    storeId: string;
    lines: Array<{
      productId: string;
      quantity: number;
    }>;
    requestedDeliveryAt?: string;
  }): Promise<SupplierRecommendation[]>;
}
