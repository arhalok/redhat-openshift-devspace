/**
 * Simulation Contracts & Scenario Models
 * Section 16 of Phase 1 Technical Specification
 */

export interface SimulationParameters {
  demandMultiplier?: number;
  vehicleAvailabilityMultiplier?: number;
  supplierAvailabilityMultiplier?: number;
  warehouseAvailability?: Record<string, boolean>;
  deliverySlaMinutes?: number;
  fuelCostMultiplier?: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
}

export interface SimulationMetrics {
  orders: number;
  routes: number;
  vehiclesUsed: number;
  totalDistanceKm: number;
  estimatedCostPaise: number;
  lateStops: number;
  unassignedOrders: number;
}

export interface SimulationDelta {
  routesDelta: number;
  vehiclesDelta: number;
  distanceDeltaKm: number;
  costDeltaPaise: number;
  lateStopsDelta: number;
}

export interface SimulationRecommendation {
  title: string;
  explanation: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SimulationResult {
  scenarioId: string;
  baseline: SimulationMetrics;
  simulated: SimulationMetrics;
  delta: SimulationDelta;
  recommendations: SimulationRecommendation[];
}

export interface SimulationService {
  run(input: SimulationScenario): Promise<SimulationResult>;
}
