/**
 * Scenario Fixtures Contract
 * Section 43 of Phase 1 Engineering Build Specification
 */

export interface ScenarioFixture {
  id: string;
  name: string;
  description: string;
  demandMultiplier: number;
  vehicleAvailabilityMultiplier: number;
  supplierLeadTimeMultiplier: number;
  trafficDelayMultiplier: number;
  disabledWarehouseIds: string[];
  injectedExceptions: Array<{
    type: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    entityId: string;
    recommendedAction: string;
  }>;
}

export const SCENARIO_FIXTURES: Record<string, ScenarioFixture> = {
  normal_day: {
    id: 'normal_day',
    name: 'Normal Operations',
    description: 'Baseline distribution and replenishment schedule across 50 Bangalore kiranas.',
    demandMultiplier: 1.0,
    vehicleAvailabilityMultiplier: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    disabledWarehouseIds: [],
    injectedExceptions: [],
  },
  stockout_risk: {
    id: 'stockout_risk',
    name: 'Stockout Risk Alert',
    description: 'Critical staple stockout risk detected in Jayanagar cluster.',
    demandMultiplier: 1.1,
    vehicleAvailabilityMultiplier: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    disabledWarehouseIds: [],
    injectedExceptions: [
      {
        type: 'STOCKOUT_RISK',
        severity: 'CRITICAL',
        title: 'Atta 10kg Safety Stock Breach at Laxmi Retail',
        entityId: 'store-3',
        recommendedAction: 'Trigger priority replenishment with Apex FMCG Hub.',
      },
    ],
  },
  supplier_delay: {
    id: 'supplier_delay',
    name: 'Supplier Delay Bottleneck',
    description: 'Cold chain maintenance at Kaveri Perishables extends lead times by +18 hours.',
    demandMultiplier: 1.0,
    vehicleAvailabilityMultiplier: 1.0,
    supplierLeadTimeMultiplier: 2.2,
    trafficDelayMultiplier: 1.1,
    disabledWarehouseIds: [],
    injectedExceptions: [
      {
        type: 'SUPPLIER_DELAY',
        severity: 'WARNING',
        title: 'Perishable Dairy Lead Time Spike',
        entityId: 'sup-2',
        recommendedAction: 'Re-route milk dispatch to Mysore Syndicate alternative hub.',
      },
    ],
  },
  vehicle_capacity: {
    id: 'vehicle_capacity',
    name: 'Vehicle Capacity Overload',
    description: 'High volume biscuit orders exceed EV 3-wheeler payload envelope.',
    demandMultiplier: 1.2,
    vehicleAvailabilityMultiplier: 0.9,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    disabledWarehouseIds: [],
    injectedExceptions: [
      {
        type: 'VEHICLE_CAPACITY_CONFLICT',
        severity: 'WARNING',
        title: 'EV 3-Wheeler V-027 Payload Exceeded',
        entityId: 'veh-1',
        recommendedAction: 'Reassign overflow crates to Tata Ace V-131.',
      },
    ],
  },
  consolidation_opportunity: {
    id: 'consolidation_opportunity',
    name: 'Dynamic Consolidation Opportunity',
    description: '12 nearby deliveries in East Bangalore eligible for merging into 4 vehicle runs.',
    demandMultiplier: 1.0,
    vehicleAvailabilityMultiplier: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    disabledWarehouseIds: [],
    injectedExceptions: [],
  },
  return_capacity: {
    id: 'return_capacity',
    name: 'Backhaul Recovery Match',
    description: 'Empty return legs from Jayanagar matched with Delta Hub packaging pickups.',
    demandMultiplier: 1.0,
    vehicleAvailabilityMultiplier: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    disabledWarehouseIds: [],
    injectedExceptions: [],
  },
  route_delay: {
    id: 'route_delay',
    name: 'Route Delay & Traffic Incident',
    description: 'Arterial bottleneck on Old Airport Road delaying Route R-124.',
    demandMultiplier: 1.0,
    vehicleAvailabilityMultiplier: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.6,
    disabledWarehouseIds: [],
    injectedExceptions: [
      {
        type: 'ROUTE_DELAY',
        severity: 'CRITICAL',
        title: 'Projected 22-min SLA breach on Route R-124',
        entityId: 'route-1',
        recommendedAction: 'Move stops 4 and 5 from Route R-124 to Route R-131.',
      },
    ],
  },
  demand_spike: {
    id: 'demand_spike',
    name: 'Festival Surge Demand Spike',
    description: '+60% demand surge across FMCG staples and beverages testing fleet limits.',
    demandMultiplier: 1.6,
    vehicleAvailabilityMultiplier: 0.85,
    supplierLeadTimeMultiplier: 1.2,
    trafficDelayMultiplier: 1.3,
    disabledWarehouseIds: [],
    injectedExceptions: [
      {
        type: 'ORDER_ANOMALY',
        severity: 'WARNING',
        title: 'Demand Surge Outstrips EV Fleet Capacity',
        entityId: 'org-blr-core',
        recommendedAction: 'Activate secondary carrier overflow capacity.',
      },
    ],
  },
  warehouse_failure: {
    id: 'warehouse_failure',
    name: 'South Hub Outage & Depot Rebalance',
    description: 'South Fulfillment Hub (Electronic City) temporarily offline for maintenance.',
    demandMultiplier: 1.0,
    vehicleAvailabilityMultiplier: 0.8,
    supplierLeadTimeMultiplier: 1.4,
    trafficDelayMultiplier: 1.2,
    disabledWarehouseIds: ['wh-ecity-fulfillment'],
    injectedExceptions: [
      {
        type: 'WAREHOUSE_DELAY',
        severity: 'CRITICAL',
        title: 'South Hub Staging Offline',
        entityId: 'wh-ecity-fulfillment',
        recommendedAction: 'Reroute south corridor dispatches to North Central Depot.',
      },
    ],
  },
};
