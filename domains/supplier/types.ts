/**
 * Supplier Domain Models & Scoring
 * Section 13 & Section 22 of logistics-foundation.md
 */

import { GeoPoint } from '../store/types';

export interface SupplierOperationalFacts {
  confirmationRate: number; // 0.0 - 1.0
  fillRate: number;         // 0.0 - 1.0
  onTimeRate: number;       // 0.0 - 1.0
  cancellationRate: number; // 0.0 - 1.0
  shortageRate: number;     // 0.0 - 1.0
  returnRate: number;       // 0.0 - 1.0
}

export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  supplierType: 'DIRECT_BRAND' | 'DISTRIBUTOR' | 'WHOLESALER';
  address: string;
  latitude: number;
  longitude: number;
  geoPoint: GeoPoint;
  serviceRadiusKm: number;
  status: 'ACTIVE' | 'SUSPENDED';
  reliabilityScore: number; // 0 - 100
  operationalFacts: SupplierOperationalFacts;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierScoringWeights {
  priceWeight: number;       // default: 0.35
  reliabilityWeight: number; // default: 0.25
  etaWeight: number;         // default: 0.20
  distanceWeight: number;    // default: 0.10
  availabilityWeight: number;// default: 0.10
}
