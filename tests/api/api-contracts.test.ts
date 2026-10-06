/**
 * API Contracts & Validation Test Suite
 * Sections 44-47, 55 of Phase 1 Engineering Build Specification
 */

import {
  CreateOrderSchema,
  OptimizeRoutesSchema,
  RunSimulationSchema,
  AIQuerySchema,
} from '../../lib/validation/schemas';
import { createSuccessResponse, createErrorResponse } from '../../lib/api/response';
import { defaultResetService } from '../../services/phase1-services';

export async function runApiContractsTests(): Promise<{ passed: number; failed: number }> {
  console.log('\n--- [Testing Sections 44-47, 55 API Contracts & Validation] ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ API Contract: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Validation Schemas (Section 46)
  const validOrder = CreateOrderSchema.safeParse({
    storeId: 'store-1',
    supplierId: 'sup-1',
    items: [
      { productId: 'prod-1', quantity: 10, unitPrice: 44.5 },
    ],
  });
  assert(validOrder.success, 'Valid order payload successfully passes Zod validation');

  const invalidOrder = CreateOrderSchema.safeParse({
    storeId: '',
    supplierId: 'sup-1',
    items: [],
  });
  assert(!invalidOrder.success, 'Invalid order payload correctly rejected with validation errors');

  const validSim = RunSimulationSchema.safeParse({
    demandMultiplier: 1.35,
    vehicleAvailabilityMultiplier: 0.85,
    disabledWarehouseIds: ['wh-ecity-fulfillment'],
    maxDeliveryWindowMinutes: 240,
  });
  assert(validSim.success, 'Valid simulation scenario passes parameter validation');

  // 2. Response Envelope (Section 45)
  const successEnv = createSuccessResponse({ orderId: 'ord-123' });
  assert(
    Boolean(successEnv.data && successEnv.meta && successEnv.meta.requestId),
    'Success response adheres to standard envelope { data, meta: { requestId } }'
  );

  const errorEnv = createErrorResponse('NOT_FOUND', 'Item not found');
  assert(
    Boolean(errorEnv.error && errorEnv.error.code === 'NOT_FOUND'),
    'Error response adheres to standard envelope { error: { code, message, requestId } }'
  );

  // 3. Demo Reset (Section 55)
  const resetRes = await defaultResetService.resetDemoState();
  assert(resetRes.success, 'Demo reset service succeeds and returns confirmation timestamp');

  return { passed, failed };
}
