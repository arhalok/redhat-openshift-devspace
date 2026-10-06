/**
 * Money Handling Utility (INR / Minor Units in Paise)
 * Adheres to Section 15 of logistics-foundation.md:
 * Never use floating point numbers for monetary values in business logic.
 */

export interface Money {
  amount: number; // Stored in minor units (paise)
  currency: 'INR';
}

/**
 * Creates a Money object from major units (Rupees)
 */
export function fromRupees(rupees: number): Money {
  return {
    amount: Math.round(rupees * 100),
    currency: 'INR',
  };
}

/**
 * Creates a Money object directly from minor units (Paise)
 */
export function fromPaise(paise: number): Money {
  if (!Number.isInteger(paise)) {
    throw new Error(`Paise must be an integer, received: ${paise}`);
  }
  return {
    amount: paise,
    currency: 'INR',
  };
}

/**
 * Converts minor units to a formatted Indian Rupee string (e.g. ₹125.50)
 */
export function formatINR(money: Money | number): string {
  const paise = typeof money === 'number' ? money : money.amount;
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Adds two Money objects
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} !== ${b.currency}`);
  }
  return {
    amount: a.amount + b.amount,
    currency: a.currency,
  };
}

/**
 * Multiplies Money by an integer quantity
 */
export function multiplyMoney(a: Money, quantity: number): Money {
  return {
    amount: Math.round(a.amount * quantity),
    currency: a.currency,
  };
}
