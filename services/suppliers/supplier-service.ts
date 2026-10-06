/**
 * Supplier Intelligence Service Implementation
 * Sections 9, 29, 35 of Phase 1 Technical Specification
 */

import {
  SupplierRecommendation,
  SupplierRecommendationService,
  SupplierScoringConfig,
} from '../../domain/suppliers/types';

export class DemoSupplierService implements SupplierRecommendationService {
  private config: SupplierScoringConfig = {
    priceWeight: 0.30,
    availabilityWeight: 0.20,
    reliabilityWeight: 0.20,
    deliveryWeight: 0.15,
    distanceWeight: 0.10,
    moqWeight: 0.05,
  };

  async recommend(input: {
    storeId: string;
    lines: Array<{
      productId: string;
      quantity: number;
    }>;
    requestedDeliveryAt?: string;
  }): Promise<SupplierRecommendation[]> {
    const requestedQty = input.lines[0]?.quantity || 24;

    // Golden Scenario candidates (Section 42)
    const candidates = [
      {
        supplierId: 'sup-b-apex',
        supplierName: 'Supplier B (Apex FMCG Hub)',
        unitPricePaise: 44000, // ₹440.00
        availableQuantity: 200,
        reliabilityScore: 96,
        leadTimeHours: 18,
        distanceKm: 4.8,
        moq: 12,
      },
      {
        supplierId: 'sup-a-karnataka',
        supplierName: 'Supplier A (Karnataka Wholesale)',
        unitPricePaise: 43200, // ₹432.00 (cheaper, but higher lead time)
        availableQuantity: 80,
        reliabilityScore: 84,
        leadTimeHours: 42,
        distanceKm: 18.5,
        moq: 24,
      },
      {
        supplierId: 'sup-c-kaveri',
        supplierName: 'Supplier C (Kaveri Valley)',
        unitPricePaise: 45000, // ₹450.00
        availableQuantity: 150,
        reliabilityScore: 91,
        leadTimeHours: 24,
        distanceKm: 21.0,
        moq: 6,
      },
    ];

    const recommendations: SupplierRecommendation[] = candidates.map((cand) => {
      // 1. Normalized factor scores (0.0 to 100.0)
      const priceScore = Math.max(0, 100 - (cand.unitPricePaise / 50000) * 10);
      const availabilityScore = cand.availableQuantity >= requestedQty ? 100 : 50;
      const reliabilityScore = cand.reliabilityScore;
      const deliveryScore = Math.max(0, 100 - cand.leadTimeHours * 1.5);
      const distanceScore = Math.max(0, 100 - cand.distanceKm * 2.5);
      const moqScore = cand.moq <= requestedQty ? 100 : 40;

      // 2. Weighted application decision score (Section 29)
      const score = Math.round(
        this.config.priceWeight * priceScore +
        this.config.availabilityWeight * availabilityScore +
        this.config.reliabilityWeight * reliabilityScore +
        this.config.deliveryWeight * deliveryScore +
        this.config.distanceWeight * distanceScore +
        this.config.moqWeight * moqScore
      );

      const reasons = [
        `High historical reliability (${cand.reliabilityScore}%)`,
        `Short lead time (${cand.leadTimeHours}h delivery window)`,
        `Low detour distance (${cand.distanceKm} km from Indiranagar store)`,
      ];

      return {
        supplierId: cand.supplierId,
        productId: input.lines[0]?.productId || 'prod-beverage-01',
        requestedQuantity: requestedQty,
        totalCostPaise: cand.unitPricePaise * requestedQty,
        unitPricePaise: cand.unitPricePaise,
        estimatedDeliveryAt: new Date(Date.now() + cand.leadTimeHours * 3600000).toISOString(),
        leadTimeHours: cand.leadTimeHours,
        minimumOrderQuantity: cand.moq,
        availabilityStatus: 'AVAILABLE',
        reliabilityScore: cand.reliabilityScore,
        distanceKm: cand.distanceKm,
        score,
        recommendationReasons: reasons,
      };
    });

    return recommendations.sort((a, b) => b.score - a.score);
  }
}
