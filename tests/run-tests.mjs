/**
 * Standalone Verification Runner for Foundation Architecture Assertions
 * Tests Section 15 (Money), Section 10 (Inventory), Section 11 (Order state machine)
 */

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Money tests (Section 15)
function fromRupees(rupees) {
  return { amount: Math.round(rupees * 100), currency: 'INR' };
}
function fromPaise(paise) {
  if (!Number.isInteger(paise)) throw new Error('Paise must be an integer');
  return { amount: paise, currency: 'INR' };
}
function addMoney(a, b) {
  return { amount: a.amount + b.amount, currency: a.currency };
}

// 2. Inventory tests (Section 10)
function calculateAvailableStock(onHand, reserved) {
  return Math.max(0, onHand - reserved);
}

// 3. Order transition tests (Section 11)
const ALLOWED_STATUS_TRANSITIONS = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['CONFIRMED', 'CANCELLED', 'EXCEPTION'],
  CONFIRMED: ['PARTIALLY_FULFILLED', 'READY_FOR_DISPATCH', 'CANCELLED', 'EXCEPTION'],
  PARTIALLY_FULFILLED: ['READY_FOR_DISPATCH', 'CANCELLED', 'EXCEPTION'],
  READY_FOR_DISPATCH: ['DISPATCHED', 'CANCELLED', 'EXCEPTION'],
  DISPATCHED: ['OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'EXCEPTION'],
  DELIVERED: [],
  CANCELLED: [],
  EXCEPTION: ['CONFIRMED', 'CANCELLED', 'READY_FOR_DISPATCH'],
};
function isValidOrderTransition(current, next) {
  return ALLOWED_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}

// Run test suite
console.log('--- Running Foundation Architecture Verification Tests ---');

console.log('\n[Section 15: Money Handling in Minor Units]');
const m1 = fromRupees(125.5);
assert(m1.amount === 12550, '₹125.50 converts to exactly 12,550 paise');
assert(m1.currency === 'INR', 'Currency explicitly set to INR');

let threw = false;
try { fromPaise(12.3); } catch (e) { threw = true; }
assert(threw, 'Throws error when non-integer paise is provided');

const sum = addMoney(fromRupees(100.25), fromRupees(50.75));
assert(sum.amount === 15100, 'Adding money yields exact 15,100 paise');

console.log('\n[Section 10: Inventory Formula available = on_hand - reserved]');
assert(calculateAvailableStock(100, 25) === 75, '100 on_hand - 25 reserved = 75 available');
assert(calculateAvailableStock(50, 50) === 0, '50 on_hand - 50 reserved = 0 available');
assert(calculateAvailableStock(10, 20) === 0, 'Negative stock prevented (clamped to 0)');

console.log('\n[Section 11: Order State Transitions]');
assert(isValidOrderTransition('DRAFT', 'SUBMITTED'), 'DRAFT -> SUBMITTED is valid');
assert(isValidOrderTransition('SUBMITTED', 'CONFIRMED'), 'SUBMITTED -> CONFIRMED is valid');
assert(isValidOrderTransition('CONFIRMED', 'READY_FOR_DISPATCH'), 'CONFIRMED -> READY_FOR_DISPATCH is valid');
assert(!isValidOrderTransition('DELIVERED', 'DRAFT'), 'DELIVERED -> DRAFT is invalid');
assert(!isValidOrderTransition('CANCELLED', 'CONFIRMED'), 'CANCELLED -> CONFIRMED is invalid');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
