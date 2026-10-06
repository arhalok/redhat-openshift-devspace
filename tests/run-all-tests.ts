/**
 * Unified Test Runner for Phase 1 Technical Contracts & Services
 * Sections 53-54 of Phase 1 Engineering Build Specification
 */

import { runInvariantsTests } from './unit/invariants.test';
import { runAlgorithmsTests } from './unit/algorithms.test';
import { runApiContractsTests } from './api/api-contracts.test';
import { run21StepQAScenario } from './qa-scenario-21-steps';

async function main() {
  console.log('================================================================');
  console.log('KiranaFlow Phase 1 Engineering Build Verification Suite (Part 5)');
  console.log('================================================================');

  let totalPassed = 0;
  let totalFailed = 0;

  // 1. Invariants
  const inv = runInvariantsTests();
  totalPassed += inv.passed;
  totalFailed += inv.failed;

  // 2. Algorithms
  const alg = await runAlgorithmsTests();
  totalPassed += alg.passed;
  totalFailed += alg.failed;

  // 3. API Contracts
  const api = await runApiContractsTests();
  totalPassed += api.passed;
  totalFailed += api.failed;

  // 4. Section 66: 21-Step Final QA Scenario
  const qa = await run21StepQAScenario();
  totalPassed += qa.passed;
  totalFailed += qa.failed;

  console.log('\n================================================================');
  console.log(`TOTAL RESULTS: ${totalPassed} passed, ${totalFailed} failed.`);
  console.log('================================================================');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
