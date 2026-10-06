/**
 * Exception Domain Models & Lifecycle
 * Section 25 of logistics-foundation.md
 */

export type ExceptionType =
  | 'STOCKOUT_RISK'
  | 'SUPPLIER_DELAY'
  | 'VEHICLE_CAPACITY_CONFLICT'
  | 'ROUTE_DELAY'
  | 'FAILED_DELIVERY'
  | 'PAYMENT_MISMATCH'
  | 'ORDER_ANOMALY'
  | 'WAREHOUSE_DELAY';

export type ExceptionSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ExceptionStatus =
  | 'DETECTED'
  | 'ACKNOWLEDGED'
  | 'ACTION_PROPOSED'
  | 'ACTION_APPLIED'
  | 'RESOLVED';

export interface ExceptionRecord {
  id: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  entityType: 'ORDER' | 'STORE' | 'SUPPLIER' | 'ROUTE' | 'VEHICLE' | 'INVENTORY';
  entityId: string;
  status: ExceptionStatus;
  detectedAt: string;
  resolvedAt?: string;
  recommendedAction: string;
  actionDetails?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
