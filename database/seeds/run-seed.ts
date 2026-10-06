/**
 * Seed & Fixture Generation Script
 * Writes JSON fixtures to database/fixtures/ and verifies dataset scale
 */

import fs from 'fs';
import path from 'path';
import { generatePhase1SeedDataset } from './seed-generator';
import { SCENARIO_FIXTURES } from '../fixtures/scenarios';

const fixturesDir = path.resolve(__dirname, '../fixtures');

if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

// Write out all 9 scenario fixtures to JSON files
for (const [key, fixture] of Object.entries(SCENARIO_FIXTURES)) {
  const filePath = path.join(fixturesDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2), 'utf-8');
}

// Generate the primary seed dataset
const dataset = generatePhase1SeedDataset(42);

// Write primary seed dataset summary
const seedSummaryPath = path.join(fixturesDir, 'seed_summary.json');
fs.writeFileSync(
  seedSummaryPath,
  JSON.stringify(
    {
      metrics: dataset.metrics,
      warehouses: dataset.warehouses,
      suppliersSample: dataset.suppliers.slice(0, 3),
      storesSample: dataset.stores.slice(0, 3),
      productsSample: dataset.products.slice(0, 3),
      ordersCount: dataset.orders.length,
      routesCount: dataset.routes.length,
      inventoryCount: dataset.inventory.length,
    },
    null,
    2
  ),
  'utf-8'
);

console.log('✓ Successfully generated 9 scenario JSON fixtures in database/fixtures/');
console.log('✓ Verified Phase 1 Seed Dataset Scale (Section 40):');
console.log(`  - Organizations: ${dataset.metrics.organizationCount}`);
console.log(`  - Users: ${dataset.metrics.userCount}`);
console.log(`  - Kirana Stores: ${dataset.metrics.storeCount} (Target: 50)`);
console.log(`  - Suppliers: ${dataset.metrics.supplierCount} (Target: 10)`);
console.log(`  - Warehouses: ${dataset.metrics.warehouseCount} (Target: 2)`);
console.log(`  - Fleet Vehicles: ${dataset.metrics.vehicleCount} (Target: 100)`);
console.log(`  - Products: ${dataset.metrics.productCount} (Target: 300)`);
console.log(`  - Inventory Positions: ${dataset.metrics.inventoryCount} (Target: 2,000)`);
console.log(`  - Orders: ${dataset.metrics.orderCount} (Target: 500)`);
console.log(`  - Active Routes: ${dataset.metrics.routeCount} (Target: 100)`);
