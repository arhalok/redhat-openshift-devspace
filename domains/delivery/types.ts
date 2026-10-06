/**
 * Delivery, Vehicle, Route, and RouteStop Domain Models
 * Section 14 of logistics-foundation.md
 */

import { GeoPoint } from '../store/types';

export type VehicleAvailabilityStatus = 'AVAILABLE' | 'ON_ROUTE' | 'MAINTENANCE' | 'OFF_DUTY';

export interface Vehicle {
  id: string;
  organizationId: string;
  vehicleCode: string;
  vehicleType: 'EV_3_WHEELER' | 'TATA_ACE' | 'BOLERO_PICKUP' | '14FT_TRUCK';
  capacityWeightKg: number;
  capacityVolumeM3: number;
  currentLatitude: number;
  currentLongitude: number;
  currentGeoPoint: GeoPoint;
  availabilityStatus: VehicleAvailabilityStatus;
  availableFrom: string; // UTC ISO 8601
  availableUntil: string;
  createdAt: string;
  updatedAt: string;
}

export type RouteStatus = 'PLANNED' | 'ASSIGNED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export interface RouteStop {
  id: string;
  routeId: string;
  sequence: number;
  stopType: 'DEPOT_PICKUP' | 'STORE_DELIVERY' | 'SUPPLIER_BACKHAUL';
  locationId: string;
  orderId?: string;
  plannedArrival: string;
  plannedDeparture: string;
  actualArrival?: string;
  actualDeparture?: string;
  status: 'PENDING' | 'ARRIVED' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
}

export interface Route {
  id: string;
  routeCode: string;
  originLocationId: string;
  status: RouteStatus;
  plannedDistanceMeters: number;
  plannedDurationSeconds: number;
  totalWeightKg: number;
  totalVolumeM3: number;
  vehicleId: string;
  optimizationRunId?: string;
  stops: RouteStop[];
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  vehicleId: string;
  routeId: string;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  plannedDeparture: string;
  actualDeparture?: string;
  plannedArrival: string;
  actualArrival?: string;
  podStatus: 'PENDING' | 'OTP_VERIFIED' | 'SIGNATURE_CAPTURED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}
