/**
 * Order Domain Models & State Transitions
 * Sections 5 & 6 of Phase 1 Technical Specification
 */

export type OrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'CONFIRMED'
  | 'PARTIALLY_FULFILLED'
  | 'PREPARING'
  | 'ALLOCATED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export interface OrderLine {
  id: string;
  orderId: string;
  productId: string;
  requestedQuantity: number;
  confirmedQuantity: number;
  fulfilledQuantity: number;
  unitPricePaise: number; // Integer minor units (INR Paise)
  taxRate?: number;
  lineTotalPaise: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  workspaceId: string;
  storeId: string;
  supplierId?: string;
  fulfillmentCenterId?: string;
  status: OrderStatus;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  subtotalPaise: number;
  discountsPaise: number;
  taxesPaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
  requestedDeliveryAt?: string;
  promisedDeliveryAt?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  lines?: OrderLine[];
}

export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['CONFIRMED', 'CANCELLED', 'FAILED'],
  CONFIRMED: ['PARTIALLY_FULFILLED', 'PREPARING', 'CANCELLED'],
  PARTIALLY_FULFILLED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['ALLOCATED', 'CANCELLED'],
  ALLOCATED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  CANCELLED: [],
  FAILED: ['DRAFT', 'CANCELLED'],
};

export function canTransitionOrder(current: OrderStatus, next: OrderStatus): boolean {
  return ALLOWED_ORDER_TRANSITIONS[current]?.includes(next) ?? false;
}
