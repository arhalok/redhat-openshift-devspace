/**
 * Smart Replenishment Contract & Reason Codes
 * Section 8 of Phase 1 Technical Specification
 */

export type ReplenishmentReasonCode =
  | 'LOW_STOCK'
  | 'HIGH_VELOCITY'
  | 'SEASONAL_SIGNAL'
  | 'LEAD_TIME_RISK'
  | 'LOCAL_DEMAND_SIGNAL'
  | 'RECENT_ORDER_PATTERN'
  | 'PROMOTION_SIGNAL';

export interface ReplenishmentRecommendation {
  id: string;
  storeId: string;
  productId: string;
  recommendedQuantity: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence?: number;
  expectedStockoutAt?: string;
  reasonCodes: ReplenishmentReasonCode[];
  explanation: string;
  generatedAt: string;
}

export interface ReplenishmentService {
  getRecommendations(input: {
    storeId: string;
    limit?: number;
  }): Promise<ReplenishmentRecommendation[]>;
}
