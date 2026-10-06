/**
 * Inventory Balance & Ledger Event Models
 * Section 7 of Phase 1 Technical Specification
 */

export interface InventoryBalance {
  id: string;
  workspaceId: string;
  locationType: 'STORE' | 'WAREHOUSE' | 'SUPPLIER';
  locationId: string;
  productId: string;
  onHand: number;
  reserved: number;
  available: number; // Invariant: Math.max(0, onHand - reserved)
  reorderPoint?: number;
  safetyStock?: number;
  updatedAt: string;
}

export type InventoryEventType =
  | 'RECEIPT'
  | 'SALE'
  | 'RESERVATION'
  | 'RELEASE'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'RETURN'
  | 'ADJUSTMENT'
  | 'DAMAGE'
  | 'EXPIRY';

export interface InventoryEvent {
  id: string;
  workspaceId: string;
  locationType: 'STORE' | 'WAREHOUSE' | 'SUPPLIER';
  locationId: string;
  productId: string;
  type: InventoryEventType;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  occurredAt: string;
  idempotencyKey: string;
}

export function computeAvailableStock(onHand: number, reserved: number): number {
  return Math.max(0, onHand - reserved);
}
