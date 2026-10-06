/**
 * What-if Logistics Simulator Service Implementation
 * Sections 16, 35 of Phase 1 Technical Specification
 */

import {
  SimulationMetrics,
  SimulationResult,
  SimulationScenario,
  SimulationService,
} from '../../domain/simulation/types';

export class DemoSimulationService implements SimulationService {
  async run(scenario: SimulationScenario): Promise<SimulationResult> {
    const demandMult = scenario.parameters.demandMultiplier || 1.0;
    const vehicleMult = scenario.parameters.vehicleAvailabilityMultiplier || 1.0;

    // Baseline metrics
    const baseline: SimulationMetrics = {
      orders: 142,
      routes: 18,
      vehiclesUsed: 18,
      totalDistanceKm: 342.0,
      estimatedCostPaise: 1850000, // ₹18,500.00
      lateStops: 2,
      unassignedOrders: 0,
    };

    // Simulated metrics under scenario stress
    const simOrders = Math.round(baseline.orders * demandMult);
    const availableVehicles = Math.round(baseline.vehiclesUsed * vehicleMult);
    const neededRoutes = Math.round(baseline.routes * (demandMult * 0.9));
    const lateStops = Math.round(2 + (demandMult > 1.2 ? 12 : 0) + (vehicleMult < 0.8 ? 8 : 0));
    const unassignedOrders = Math.max(0, simOrders - (availableVehicles * 9));
    const simDistance = Math.round(baseline.totalDistanceKm * (1 + (demandMult - 1) * 0.65));
    const simCost = Math.round(baseline.estimatedCostPaise * (1 + (demandMult - 1) * 0.7));

    const simulated: SimulationMetrics = {
      orders: simOrders,
      routes: neededRoutes,
      vehiclesUsed: Math.min(availableVehicles, neededRoutes),
      totalDistanceKm: simDistance,
      estimatedCostPaise: simCost,
      lateStops,
      unassignedOrders,
    };

    return {
      scenarioId: scenario.id,
      baseline,
      simulated,
      delta: {
        routesDelta: simulated.routes - baseline.routes,
        vehiclesDelta: simulated.vehiclesUsed - baseline.vehiclesUsed,
        distanceDeltaKm: simulated.totalDistanceKm - baseline.totalDistanceKm,
        costDeltaPaise: simulated.estimatedCostPaise - baseline.estimatedCostPaise,
        lateStopsDelta: simulated.lateStops - baseline.lateStops,
      },
      recommendations: [
        {
          title: 'Trigger Multi-Order Consolidation in East Bangalore',
          explanation: `Demand surge (+${Math.round((demandMult - 1) * 100)}%) creates 14 late stops. Consolidating 8 overlapping orders reduces vehicle requirement by 3 units.`,
          priority: 'HIGH',
        },
        {
          title: 'Activate Secondary Wholesaler Overflow Capacity',
          explanation: 'Re-routing 25 cases from Peenya to Karnataka Wholesale prevents stockout cascade across Jayanagar kiranas.',
          priority: 'MEDIUM',
        },
      ],
    };
  }
}
