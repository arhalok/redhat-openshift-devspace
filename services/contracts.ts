/**
 * Service Registry and Domain Service Contracts
 * Sections 17-24 & Section 20 of logistics-foundation.md
 */

import { Order, OrderStatus } from '../domains/order/types';
import { InventoryBalance } from '../domains/inventory/types';
import { Supplier, SupplierScoringWeights } from '../domains/supplier/types';
import { Route, Vehicle } from '../domains/delivery/types';

// Routing & Matrix interfaces (Section 17)
export interface RouteRequest {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  waypoints?: Array<{ latitude: number; longitude: number }>;
}

export interface RouteResult {
  distanceMeters: number;
  durationSeconds: number;
  polyline: string;
}

export interface RoutingService {
  getRoute(input: RouteRequest): Promise<RouteResult>;
  getMatrix(origins: Array<{ latitude: number; longitude: number }>, destinations: Array<{ latitude: number; longitude: number }>): Promise<number[][]>;
}

// Optimization interface (Section 17 & 18)
export interface OptimizationInput {
  depots: Array<{ id: string; latitude: number; longitude: number }>;
  vehicles: Vehicle[];
  stops: Array<{
    id: string;
    location: { latitude: number; longitude: number };
    demandWeightKg: number;
    demandVolumeM3: number;
    timeWindowStart: string;
    timeWindowEnd: string;
    priority: number;
  }>;
  objectiveConfig?: {
    minimizeDistanceWeight?: number;
    minimizeDurationWeight?: number;
    minimizeVehicleCount?: boolean;
  };
}

export interface OptimizationResult {
  runId: string;
  routes: Route[];
  unassignedStops: string[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
}

export interface RouteOptimizer {
  optimize(input: OptimizationInput): Promise<OptimizationResult>;
}

// Smart Replenishment & Demand Recommendation (Section 21)
export interface DemandInput {
  storeId: string;
  productId: string;
  onHand: number;
  historicalDailyDemand: number[];
  leadTimeHours: number;
  moq: number;
  planningHorizonDays: number;
}

export interface DemandRecommendation {
  productId: string;
  recommendedQuantity: number;
  confidenceScore: number; // 0.0 - 1.0
  reasonCodes: Array<
    | 'LOW_CURRENT_STOCK'
    | 'HIGH_RECENT_DEMAND'
    | 'LONG_SUPPLIER_LEAD_TIME'
    | 'LOCAL_DEMAND_INCREASE'
    | 'REORDER_PATTERN'
    | 'PROMOTIONAL_SIGNAL'
  >;
  suggestedSupplierId: string;
  expectedStockoutDate: string;
}

export interface DemandRecommendationService {
  recommend(input: DemandInput): Promise<DemandRecommendation[]>;
}

// Supplier Intelligence & Ranking (Section 22)
export interface SupplierRankInput {
  productId: string;
  requiredQuantity: number;
  storeLocation: { latitude: number; longitude: number };
  weights?: SupplierScoringWeights;
}

export interface RankedSupplierOffer {
  supplier: Supplier;
  score: number;
  pricePaise: number;
  estimatedFulfillmentCostPaise: number;
  leadTimeHours: number;
  explanation: string;
}

export interface SupplierRankingService {
  rankSuppliers(input: SupplierRankInput): Promise<RankedSupplierOffer[]>;
}

// Return Capacity Matching (Section 24)
export interface ReturnCapacityInput {
  vehicleId: string;
  currentRouteId: string;
  remainingCapacityWeightKg: number;
  remainingCapacityVolumeM3: number;
  currentLocation: { latitude: number; longitude: number };
  depotLocation: { latitude: number; longitude: number };
}

export interface ReturnCapacityCandidate {
  pickupLocation: { latitude: number; longitude: number };
  dropoffLocation: { latitude: number; longitude: number };
  weightKg: number;
  volumeM3: number;
  incrementalDistanceMeters: number;
  incrementalDurationSeconds: number;
  estimatedRecoveryPaise: number;
  recommendationScore: number;
}

export interface CapacityMatchingService {
  findReturnLoads(input: ReturnCapacityInput): Promise<ReturnCapacityCandidate[]>;
}

// Service Registry (Section 20)
export interface ServiceRegistry {
  routing: RoutingService;
  optimizer: RouteOptimizer;
  demand: DemandRecommendationService;
  supplierRanking: SupplierRankingService;
  capacityMatching: CapacityMatchingService;
}
