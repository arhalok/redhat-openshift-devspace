/**
 * Logistics Fleet, Stops, Routes and Optimization Contracts
 * Sections 3.5, 3.6, 10, 11, 12 of Phase 1 Technical Specification
 */

import { GeoPoint, Address, TimeWindow } from '../common/types';

export interface Warehouse {
  id: string;
  workspaceId: string;
  name: string;
  address: Address;
  latitude: number;
  longitude: number;
  capacityUnits?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  workspaceId: string;
  registrationNumber: string;
  vehicleType: 'BIKE' | 'LCV' | 'TRUCK' | 'TEMPO' | 'OTHER';
  capacityWeightKg?: number;
  capacityVolumeM3?: number;
  availableWeightKg?: number;
  availableVolumeM3?: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'MAINTENANCE' | 'OFFLINE';
  currentLocation?: GeoPoint;
  updatedAt: string;
}

export interface DeliveryStop {
  id: string;
  routeId?: string;
  sequence?: number;
  stopType: 'DEPOT' | 'PICKUP' | 'DELIVERY';
  locationType: 'STORE' | 'SUPPLIER' | 'WAREHOUSE' | 'OTHER';
  locationId: string;
  orderIds: string[];
  plannedArrivalAt?: string;
  plannedDepartureAt?: string;
  actualArrivalAt?: string;
  actualDepartureAt?: string;
  serviceDurationMinutes?: number;
  status: 'PLANNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
}

export interface RoutePlan {
  id: string;
  workspaceId: string;
  vehicleId: string;
  depotId?: string;
  status: 'DRAFT' | 'OPTIMIZED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  stops: DeliveryStop[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  estimatedCostPaise: number;
  utilization: {
    weightPercent?: number;
    volumePercent?: number;
  };
  optimizationVersion: string;
  createdAt: string;
}

export interface RouteOptimizationInput {
  depot?: GeoPoint;
  vehicles: Array<{
    id: string;
    start: GeoPoint;
    end?: GeoPoint;
    capacityWeightKg?: number;
    capacityVolumeM3?: number;
    maxRouteDurationMinutes?: number;
  }>;
  stops: Array<{
    id: string;
    location: GeoPoint;
    demandWeightKg?: number;
    demandVolumeM3?: number;
    serviceDurationMinutes?: number;
    timeWindow?: TimeWindow;
    orderIds: string[];
    type: 'PICKUP' | 'DELIVERY';
  }>;
  constraints: {
    allowUnassigned?: boolean;
    maximizeVehicleUtilization?: boolean;
    minimizeDistance?: boolean;
    minimizeDuration?: boolean;
    minimizeCost?: boolean;
    preserveExistingAssignments?: boolean;
  };
}

export interface OptimizationResult {
  routes: RoutePlan[];
  unassignedStopIds: string[];
  objective: {
    totalDistanceKm: number;
    totalDurationMinutes: number;
    estimatedCostPaise: number;
  };
  warnings: string[];
  solver: {
    name: string;
    version: string;
  };
}
