/**
 * Demo Scenario Definitions & Configuration
 * Section 41 of logistics-foundation.md
 */

export interface ScenarioConfig {
  name: string;
  description: string;
  demandMultiplier: number;
  vehicleAvailabilityRatio: number;
  supplierLeadTimeMultiplier: number;
  trafficDelayMultiplier: number;
  injectExceptions: boolean;
}

export const DEMO_SCENARIOS: Record<string, ScenarioConfig> = {
  'normal-day': {
    name: 'Normal Operations',
    description: 'Baseline distribution and replenishment schedule across Bangalore clusters.',
    demandMultiplier: 1.0,
    vehicleAvailabilityRatio: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    injectExceptions: false,
  },
  'peak-demand': {
    name: 'Festival Peak Demand',
    description: 'Demand surge (+60%) across FMCG staples and beverages testing vehicle capacity.',
    demandMultiplier: 1.6,
    vehicleAvailabilityRatio: 0.95,
    supplierLeadTimeMultiplier: 1.2,
    trafficDelayMultiplier: 1.3,
    injectExceptions: true,
  },
  'supplier-delay': {
    name: 'Tier-1 Supplier Bottleneck',
    description: 'Lead times double for primary dairy and bakery distributor.',
    demandMultiplier: 1.1,
    vehicleAvailabilityRatio: 1.0,
    supplierLeadTimeMultiplier: 2.2,
    trafficDelayMultiplier: 1.1,
    injectExceptions: true,
  },
  'vehicle-shortage': {
    name: 'Fleet Maintenance Downtime',
    description: '35% of electric 3-wheelers unavailable during morning dispatch window.',
    demandMultiplier: 1.0,
    vehicleAvailabilityRatio: 0.65,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.2,
    injectExceptions: true,
  },
  'return-load-opportunity': {
    name: 'Backhaul Recovery Match',
    description: 'Multiple empty return trips from East Bangalore depots matching return packaging loads.',
    demandMultiplier: 1.0,
    vehicleAvailabilityRatio: 1.0,
    supplierLeadTimeMultiplier: 1.0,
    trafficDelayMultiplier: 1.0,
    injectExceptions: false,
  },
};
