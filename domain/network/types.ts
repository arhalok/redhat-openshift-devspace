/**
 * Consolidation, Return Capacity Matching & Network Map Data
 * Sections 13, 14, 31 of Phase 1 Technical Specification
 */

import { GeoPoint } from '../common/types';
import { RoutePlan, Vehicle, Warehouse } from '../logistics/types';
import { Supplier } from '../suppliers/types';

export interface ConsolidationOpportunity {
  id: string;
  orderIds: string[];
  storeIds: string[];
  supplierIds: string[];
  currentEstimatedDistanceKm: number;
  consolidatedEstimatedDistanceKm: number;
  estimatedDistanceReductionKm: number;
  compatibleVehicleTypes: string[];
  confidence: number;
  reasons: string[];
}

export interface ConsolidationService {
  findOpportunities(input: {
    workspaceId: string;
    orderIds?: string[];
    radiusKm: number;
    maxOrdersPerGroup?: number;
  }): Promise<ConsolidationOpportunity[]>;
}

export interface CapacityOpportunity {
  id: string;
  vehicleId: string;
  routeId: string;
  availableWeightKg?: number;
  availableVolumeM3?: number;
  routeOrigin?: GeoPoint;
  routeDestination?: GeoPoint;
  compatiblePickupId: string;
  pickupLocation: GeoPoint;
  pickupDistanceKm: number;
  incrementalDistanceKm: number;
  estimatedRevenuePaise?: number;
  estimatedCostPaise?: number;
  estimatedNetValuePaise?: number;
  compatibilityScore: number;
  reasons: string[];
}

export interface CapacityMatchingService {
  findOpportunities(input: {
    routeId?: string;
    vehicleId?: string;
    radiusKm: number;
  }): Promise<CapacityOpportunity[]>;
}

export interface DemandCell {
  h3Index: string;
  orderCount: number;
  storeCount: number;
  demandIndex: number;
  stockoutRisk: number;
}

export interface NetworkMapData {
  stores: Array<{ id: string; name: string; location: GeoPoint; h3Cell?: string; status: string }>;
  warehouses: Warehouse[];
  suppliers: Supplier[];
  vehicles: Vehicle[];
  routes: RoutePlan[];
  demandCells: DemandCell[];
}
