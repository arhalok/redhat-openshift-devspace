/**
 * Deterministic Demo Routing and Optimization Services
 * Implements RoutingService and RouteOptimizer adhering to Sections 17 & 18 of logistics-foundation.md
 */

import {
  OptimizationInput,
  OptimizationResult,
  RouteOptimizer,
  RouteRequest,
  RouteResult,
  RoutingService,
} from '../contracts';
import { Route } from '../../domains/delivery/types';

export class DemoRoutingService implements RoutingService {
  async getRoute(input: RouteRequest): Promise<RouteResult> {
    // Deterministic distance estimation (Haversine approx * 1.3 road factor)
    const dLat = Math.abs(input.destination.latitude - input.origin.latitude);
    const dLon = Math.abs(input.destination.longitude - input.origin.longitude);
    const estKm = Math.sqrt(dLat * dLat + dLon * dLon) * 111 * 1.3;
    const distanceMeters = Math.round(estKm * 1000);
    const durationSeconds = Math.round((distanceMeters / 1000 / 25) * 3600); // 25 km/h urban speed

    return {
      distanceMeters,
      durationSeconds,
      polyline: `enc_route_${distanceMeters}`,
    };
  }

  async getMatrix(
    origins: Array<{ latitude: number; longitude: number }>,
    destinations: Array<{ latitude: number; longitude: number }>
  ): Promise<number[][]> {
    return origins.map((orig) =>
      destinations.map((dest) => {
        const dLat = Math.abs(dest.latitude - orig.latitude);
        const dLon = Math.abs(dest.longitude - orig.longitude);
        return Math.round(Math.sqrt(dLat * dLat + dLon * dLon) * 111 * 1.3 * 1000);
      })
    );
  }
}

export class DemoRouteOptimizer implements RouteOptimizer {
  async optimize(input: OptimizationInput): Promise<OptimizationResult> {
    const runId = `opt-run-${Date.now()}`;
    const assignedRoutes: Route[] = [];
    let remainingStops = [...input.stops];

    for (let i = 0; i < input.vehicles.length && remainingStops.length > 0; i++) {
      const vehicle = input.vehicles[i];
      let currentWeight = 0;
      let currentVolume = 0;
      const vehicleStops = [];

      while (remainingStops.length > 0) {
        const nextStop = remainingStops[0];
        if (
          currentWeight + nextStop.demandWeightKg <= vehicle.capacityWeightKg &&
          currentVolume + nextStop.demandVolumeM3 <= vehicle.capacityVolumeM3
        ) {
          currentWeight += nextStop.demandWeightKg;
          currentVolume += nextStop.demandVolumeM3;
          vehicleStops.push({
            id: `stop-${nextStop.id}`,
            routeId: `route-${runId}-${i}`,
            sequence: vehicleStops.length + 1,
            stopType: 'STORE_DELIVERY' as const,
            locationId: nextStop.id,
            plannedArrival: nextStop.timeWindowStart,
            plannedDeparture: nextStop.timeWindowEnd,
            status: 'PENDING' as const,
          });
          remainingStops.shift();
        } else {
          break;
        }
      }

      if (vehicleStops.length > 0) {
        assignedRoutes.push({
          id: `route-${runId}-${i}`,
          routeCode: `RT-BLR-${i + 101}`,
          originLocationId: input.depots[0]?.id || 'depot-central',
          status: 'PLANNED',
          plannedDistanceMeters: vehicleStops.length * 4200,
          plannedDurationSeconds: vehicleStops.length * 900,
          totalWeightKg: currentWeight,
          totalVolumeM3: currentVolume,
          vehicleId: vehicle.id,
          optimizationRunId: runId,
          stops: vehicleStops,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return {
      runId,
      routes: assignedRoutes,
      unassignedStops: remainingStops.map((s) => s.id),
      totalDistanceMeters: assignedRoutes.reduce((acc, r) => acc + r.plannedDistanceMeters, 0),
      totalDurationSeconds: assignedRoutes.reduce((acc, r) => acc + r.plannedDurationSeconds, 0),
    };
  }
}
