/**
 * Order & OrderItem Domain Models
 * Sections 11 & 12 of logistics-foundation.md
 */

export type OrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'CONFIRMED'
  | 'PARTIALLY_FULFILLED'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXCEPTION';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  supplierSkuId: string;
  requestedQuantity: number;
  confirmedQuantity: number;
  unitPricePaise: number;
  discountPaise: number;
  taxPaise: number;
  lineTotalPaise: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  organizationId: string;
  orderNumber: string;
  storeId: string;
  supplierId: string;
  status: OrderStatus;
  currency: 'INR';
  subtotalPaise: number;
  shippingFeePaise: number;
  discountPaise: number;
  taxPaise: number;
  totalPaise: number;
  requestedDeliveryStart: string; // UTC ISO 8601
  requestedDeliveryEnd: string;   // UTC ISO 8601
  source: 'WEB_PORTAL' | 'REPLENISHMENT_ENGINE' | 'AI_COPILOT' | 'CSV_IMPORT';
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

/**
 * Validates allowed state transitions for Orders
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
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

export function isValidOrderTransition(current: OrderStatus, next: OrderStatus): boolean {
  return ALLOWED_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}
