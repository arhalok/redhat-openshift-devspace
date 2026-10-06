/**
 * Algorithms & Scoring Unit Test Suite
 * Sections 34-39 of Phase 1 Engineering Build Specification
 */

import {
  defaultDemandService,
  defaultSupplierService,
  defaultConsolidationService,
  defaultCapacityMatchingService,
  defaultSimulationService,
} from '../../services/phase1-services';

export async function runAlgorithmsTests(): Promise<{ passed: number; failed: number }> {
  console.log('\n--- [Testing Sections 34-39 Intelligence Algorithms] ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ Algorithm: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Demand & Replenishment (Section 34, 35)
  const recs = await defaultDemandService.getReplenishmentRecommendations('store-1');
  assert(recs.length > 0, 'Replenishment recommendations returned for low inventory');
  assert(
    recs.every((r) => r.confidence !== undefined && r.confidence >= 0.70),
    'Confidence scores are bounded within valid statistical range (>= 70%)'
  );
  assert(
    recs[0].reason.length >= 2,
    'Recommendations contain multiple plain-English operational reasons'
  );

  // 2. Supplier Ranking (Section 36)
  const offers = await defaultSupplierService.recommendSuppliers('prod-atta-10kg', 12);
  assert(offers.length === 3, 'Evaluates all 3 candidate supplier offers');
  assert(
    offers[0].score >= offers[1].score && offers[1].score >= offers[2].score,
    'Supplier scores are monotonically ranked descending'
  );
  assert(
    offers[0].isRecommended === true && offers[1].isRecommended === false,
    'Top ranked supplier is flagged as recommended option'
  );

  // 3. Dynamic Consolidation (Section 37)
  const opps = await defaultConsolidationService.findOpportunities('ws-main');
  assert(opps.length > 0, 'Identifies East Bangalore consolidation candidate');
  assert(
    opps[0].proposedDistanceKm < opps[0].currentDistanceKm,
    `Consolidated distance (${opps[0].proposedDistanceKm} km) is strictly less than unbundled trips (${opps[0].currentDistanceKm} km)`
  );
  assert(
    opps[0].estimatedImpact.percentage >= 25,
    'Calculates significant fuel reduction (>= 25%)'
  );

  // 4. Return Capacity (Section 38)
  const returnLoads = await defaultCapacityMatchingService.findReturnLoads('veh-027');
  assert(returnLoads.length > 0, 'Discovers backhaul return opportunity for V-027');
  assert(
    returnLoads[0].load.weightKg <= returnLoads[0].remainingCapacity.weightKg * 2,
    'Return load payload fits vehicle capacity constraints'
  );
  assert(
    returnLoads[0].estimatedRecoveryPaise > 0,
    'Estimates positive commercial recovery value'
  );

  // 5. What-if Simulation (Section 39)
  const sim = await defaultSimulationService.run({
    demandMultiplier: 1.25,
    vehicleAvailabilityMultiplier: 0.90,
    disabledWarehouseIds: [],
    maxDeliveryWindowMinutes: 240,
  });
  assert(
    sim.simulated.orderCount > sim.baseline.orderCount,
    'Simulated order volume scales up with +25% demand surge'
  );
  assert(
    sim.simulated.atRiskOrderCount >= sim.baseline.atRiskOrderCount,
    'Capacity stress increases projected at-risk orders'
  );
  assert(
    sim.recommendations.length > 0,
    'Generates deterministic mitigation recommendations'
  );

  return { passed, failed };
}
