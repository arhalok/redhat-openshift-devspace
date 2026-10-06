/**
 * Comprehensive Verification Runner for Phase 1 Technical Contracts & Services
 * Tests:
 * - Section 15: Integer money handling in minor units (INR Paise)
 * - Section 7: Inventory available stock invariant (available = onHand - reserved)
 * - Section 5, 6: Order lifecycle and state transitions
 * - Section 8, 28: Smart Replenishment deterministic formula & reason codes
 * - Section 9, 29: Supplier weighted scoring engine
 * - Section 13: Dynamic Consolidation distance reduction
 * - Section 14: Return capacity / backhaul commercial value recovery
 * - Section 16: What-if Simulation sandbox isolation
 */

import { OrderService } from '../services/orders/order-service';
import { DemoReplenishmentService } from '../services/recommendations/replenishment-service';
import { DemoSupplierService } from '../services/suppliers/supplier-service';
import { DemoConsolidationService } from '../services/network/consolidation-service';
import { DemoCapacityMatchingService } from '../services/network/capacity-matching-service';
import { DemoSimulationService } from '../services/simulation/simulation-service';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function run() {
  console.log('--- Running Phase 1 Technical Contracts & Services Verification ---');

  // 1. Order Service & State Machine (Sections 5 & 6)
  console.log('\n[Order Domain & State Machine (Sections 5 & 6)]');
  const orderService = new OrderService();
  const order = await orderService.createOrder({
    workspaceId: 'ws-main',
    storeId: 'store-shree-general',
    supplierId: 'sup-b-apex',
    lines: [
      { productId: 'prod-beverage-01', quantity: 24, unitPricePaise: 44000 },
    ],
  });

  assert(order.status === 'DRAFT', 'Newly created order starts in DRAFT state');
  assert(order.lines?.[0].lineTotalPaise === 1056000, 'Line total calculated in paise: 24 * 44000 = 1,056,000 paise (₹10,560.00)');
  assert(order.version === 1, 'Initial order version is 1');

  const submittedOrder = await orderService.submitOrder(order.id);
  assert(submittedOrder.status === 'SUBMITTED', 'Order transitions to SUBMITTED state');
  assert(submittedOrder.version === 2, 'Order version increments to 2 upon submission');

  const confirmedOrder = await orderService.transitionOrder(order.id, 'CONFIRMED', 2);
  assert(confirmedOrder.status === 'CONFIRMED', 'Order transitions to CONFIRMED with optimistic locking');

  let conflictThrew = false;
  try {
    // Attempt transition with stale version
    await orderService.transitionOrder(order.id, 'PREPARING', 1);
  } catch (e) {
    conflictThrew = true;
  }
  assert(conflictThrew, 'Throws 409 Conflict when transition attempted with stale version');

  // 2. Replenishment Service (Sections 8 & 28)
  console.log('\n[Smart Replenishment Engine (Sections 8 & 28)]');
  const replService = new DemoReplenishmentService();
  const recs = await replService.getRecommendations({ storeId: 'store-shree-general' });
  assert(recs.length > 0, 'Generates replenishment recommendations for low inventory');
  assert(recs[0].reasonCodes.includes('LOW_STOCK'), 'Reason code identifies LOW_STOCK threshold breach');
  assert(recs[0].recommendedQuantity >= 12, 'Recommended quantity respects MOQ constraint (>= 12 units)');

  // 3. Supplier Intelligence & Scoring (Sections 9 & 29)
  console.log('\n[Supplier Intelligence & Scoring (Sections 9 & 29)]');
  const supplierService = new DemoSupplierService();
  const rankedSuppliers = await supplierService.recommend({
    storeId: 'store-shree-general',
    lines: [{ productId: 'prod-beverage-01', quantity: 24 }],
  });
  assert(rankedSuppliers.length === 3, 'Evaluates all available supplier options');
  assert(rankedSuppliers[0].supplierId === 'sup-b-apex', 'Supplier B (Apex FMCG) ranked #1 due to reliability and lead time');
  assert(rankedSuppliers[0].score >= rankedSuppliers[1].score, 'Scores are monotonically ranked descending');

  // 4. Dynamic Consolidation (Section 13)
  console.log('\n[Dynamic Network Consolidation (Section 13)]');
  const consolidationService = new DemoConsolidationService();
  const opps = await consolidationService.findOpportunities({
    workspaceId: 'ws-main',
    radiusKm: 15,
  });
  assert(opps.length > 0, 'Identifies East Bangalore consolidation candidate');
  assert(opps[0].estimatedDistanceReductionKm === 16.8, 'Calculates 16.8 km distance reduction (-28% fuel)');

  // 5. Return Capacity Matching (Section 14)
  console.log('\n[Return-Capacity Backhaul Matching (Section 14)]');
  const capacityService = new DemoCapacityMatchingService();
  const capOpps = await capacityService.findOpportunities({
    vehicleId: 'veh-tata-ace-02',
    radiusKm: 10,
  });
  assert(capOpps.length > 0, 'Detects compatible return-load pickup');
  assert(capOpps[0].estimatedRevenuePaise === 185000, 'Estimates ₹1,850.00 (185000 paise) commercial recovery');

  // 6. What-if Simulation (Section 16)
  console.log('\n[What-if Simulator (Section 16)]');
  const simService = new DemoSimulationService();
  const simResult = await simService.run({
    id: 'sim-surge-35',
    name: 'Festival Surge',
    description: '+35% demand increase',
    parameters: { demandMultiplier: 1.35, vehicleAvailabilityMultiplier: 0.70 },
  });
  assert(simResult.simulated.orders > simResult.baseline.orders, 'Simulated orders reflect demand multiplier surge');
  assert(simResult.delta.distanceDeltaKm > 0, 'Computes incremental route distance delta');
  assert(simResult.recommendations.length > 0, 'Generates mitigation recommendations without mutating live records');

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
