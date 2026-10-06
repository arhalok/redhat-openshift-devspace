/**
 * Inventory Domain Types & Invariants
 * Section 10 of logistics-foundation.md:
 * Available stock formula: available = on_hand - reserved
 */

export type InventoryMovementType =
  | 'RECEIPT'
  | 'SALE'
  | 'RESERVATION'
  | 'RELEASE'
  | 'TRANSFER'
  | 'DAMAGE'
  | 'RETURN'
  | 'ADJUSTMENT';

export interface InventoryBalance {
  id: string;
  locationId: string; // Warehouse or Store ID
  productId: string;
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number; // Computed: onHandQuantity - reservedQuantity
  incomingQuantity: number;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  locationId: string;
  type: InventoryMovementType;
  quantity: number;
  referenceType: 'ORDER' | 'PURCHASE_ORDER' | 'STOCK_TRANSFER' | 'MANUAL_AUDIT';
  referenceId: string;
  occurredAt: string;
  createdBy: string;
}

/**
 * Calculates available stock ensuring the core invariant
 */
export function calculateAvailableStock(onHand: number, reserved: number): number {
  return Math.max(0, onHand - reserved);
}
