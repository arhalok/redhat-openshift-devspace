/**
 * Exception Intelligence & Lifecycle Contracts
 * Section 15 of Phase 1 Technical Specification
 */

export type ExceptionType =
  | 'LATE_DELIVERY'
  | 'LOW_STOCK'
  | 'SUPPLIER_DELAY'
  | 'VEHICLE_CAPACITY'
  | 'ORDER_FAILURE'
  | 'PAYMENT_MISMATCH'
  | 'FULFILLMENT_SHORTAGE'
  | 'ROUTE_DISRUPTION';

export interface RecommendedAction {
  id: string;
  type: string;
  label: string;
  impact?: {
    distanceKm?: number;
    costPaise?: number;
    etaMinutes?: number;
  };
  requiresConfirmation: boolean;
}

export interface Exception {
  id: string;
  workspaceId: string;
  type: ExceptionType;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  entityType: string;
  entityId: string;
  title: string;
  explanation: string;
  recommendedActions: RecommendedAction[];
  createdAt: string;
  resolvedAt?: string;
}
