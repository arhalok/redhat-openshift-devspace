/**
 * Canonical Domain Types & Service Interfaces
 * Phase 1 — Engineering Build Specification: Part 5 (Sections 23-31)
 */

// 1. Order Domain (Section 23)
export type OrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXCEPTION';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  unit: string;
  packSize?: string;
  weightKg?: number;
  volumeM3?: number;
}

export interface InventoryPosition {
  storeId: string;
  productId: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  safetyStock: number;
}

// 2. Recommendations (Section 24)
export interface RecommendationAction {
  id: string;
  label: string;
  actionType: string;
  requiresConfirmation: boolean;
}

export interface Recommendation {
  id: string;
  type:
    | 'REPLENISHMENT'
    | 'SUPPLIER'
    | 'CONSOLIDATION'
    | 'RETURN_CAPACITY'
    | 'ROUTE'
    | 'STOCKOUT';
  title: string;
  reason: string[];
  confidence?: number;
  impact?: {
    label: string;
    value: number;
    unit: string;
  };
  entity: {
    type: string;
    id: string;
  };
  actions: RecommendationAction[];
  status: 'NEW' | 'VIEWED' | 'ACCEPTED' | 'DISMISSED' | 'EXPIRED';
}

// 3. Routing & Route Plan Contract (Section 25)
export interface RouteStop {
  id: string;
  sequence: number;
  storeId: string;
  orderId?: string;
  plannedArrival: string;
  actualArrival?: string;
  status: 'PLANNED' | 'EN_ROUTE' | 'ARRIVED' | 'DELIVERED' | 'FAILED' | 'SKIPPED';
  distanceFromPreviousKm: number;
  durationFromPreviousMinutes: number;
}

export interface RoutePlan {
  id: string;
  routeNumber: string;
  vehicleId: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  utilizationPercent: number;
  estimatedCost?: number;
}

export interface OptimizeRoutesRequest {
  orderIds: string[];
  vehicleIds: string[];
  constraints: {
    maxRouteDurationMinutes?: number;
    respectTimeWindows: boolean;
    respectVehicleCapacity: boolean;
  };
}

// 4. Consolidation Contract (Section 27)
export interface ConsolidationOpportunity {
  id: string;
  orderIds: string[];
  currentRouteCount: number;
  proposedRouteCount: number;
  currentDistanceKm: number;
  proposedDistanceKm: number;
  estimatedImpact: {
    distanceSavedKm: number;
    percentage: number;
  };
  reasons: string[];
}

// 5. Return Capacity Contract (Section 28)
export interface ReturnCapacityOpportunity {
  id: string;
  vehicleId: string;
  routeId: string;
  remainingCapacity: {
    weightKg: number;
    volumeM3: number;
  };
  pickup: {
    supplierId: string;
    supplierName: string;
    latitude: number;
    longitude: number;
  };
  load: {
    weightKg: number;
    volumeM3: number;
    description: string;
  };
  additionalDistanceKm: number;
  estimatedRecoveryPaise: number;
}

// 6. Simulation Contract & Network Metrics (Sections 29, 30)
export interface NetworkMetrics {
  orderCount: number;
  vehicleCount: number;
  routeCount: number;
  totalDistanceKm: number;
  utilizationPercent: number;
  atRiskOrderCount: number;
  estimatedCost: number;
}

export interface NetworkDifferences {
  routesDelta: number;
  vehiclesDelta: number;
  distanceDeltaKm: number;
  costDelta: number;
  atRiskOrdersDelta: number;
}

export interface SimulationScenario {
  demandMultiplier: number;
  vehicleAvailabilityMultiplier: number;
  disabledWarehouseIds: string[];
  maxDeliveryWindowMinutes: number;
}

export interface SimulationResult {
  baseline: NetworkMetrics;
  simulated: NetworkMetrics;
  differences: NetworkDifferences;
  recommendations: string[];
}

// 7. Service Interfaces (Section 31)
export interface RouteRequest {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  waypoints?: Array<{ latitude: number; longitude: number }>;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
}

export interface MatrixRequest {
  origins: Array<{ latitude: number; longitude: number }>;
  destinations: Array<{ latitude: number; longitude: number }>;
}

export interface TravelMatrix {
  distancesKm: number[][];
  durationsMinutes: number[][];
}

export interface RoutingService {
  getRoute(request: RouteRequest): Promise<RouteResult>;
  getMatrix(request: MatrixRequest): Promise<TravelMatrix>;
}

export interface OptimizationService {
  optimize(request: OptimizeRoutesRequest): Promise<RoutePlan[]>;
}

export interface DemandService {
  getReplenishmentRecommendations(storeId: string): Promise<Recommendation[]>;
}

export interface SupplierOffer {
  supplierId: string;
  supplierName: string;
  price: number;
  leadTimeHours: number;
  reliabilityScore: number;
  fillRate: number;
  moq: number;
  score: number;
  isRecommended: boolean;
  explanation: string;
}

export interface SupplierRecommendationService {
  recommendSuppliers(
    productId: string,
    quantity: number,
    constraints?: { maxLeadTimeHours?: number; maxPrice?: number }
  ): Promise<SupplierOffer[]>;
}

export interface ConsolidationService {
  findOpportunities(workspaceId: string): Promise<ConsolidationOpportunity[]>;
}

export interface CapacityMatchingService {
  findReturnLoads(vehicleId: string): Promise<ReturnCapacityOpportunity[]>;
}

export interface SimulationService {
  run(scenario: SimulationScenario): Promise<SimulationResult>;
}
