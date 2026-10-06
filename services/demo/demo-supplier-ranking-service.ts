/**
 * Deterministic Demo Supplier Ranking Service
 * Implements SupplierRankingService adhering to Section 22 of logistics-foundation.md
 */

import {
  RankedSupplierOffer,
  SupplierRankingService,
  SupplierRankInput,
} from '../contracts';
import { generateSeedData } from '../../simulation/seed';

// Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export class DemoSupplierRankingService implements SupplierRankingService {
  async rankSuppliers(input: SupplierRankInput): Promise<RankedSupplierOffer[]> {
    const seed = generateSeedData('normal-day');
    const matchedSkus = seed.supplierSkus.filter((sku) => sku.productId === input.productId);

    const weights = input.weights || {
      priceWeight: 0.35,
      reliabilityWeight: 0.25,
      etaWeight: 0.20,
      distanceWeight: 0.10,
      availabilityWeight: 0.10,
    };

    const results: RankedSupplierOffer[] = matchedSkus.map((sku) => {
      const supplier = seed.suppliers.find((s) => s.id === sku.supplierId)!;
      const distance = calculateDistanceKm(
        supplier.latitude,
        supplier.longitude,
        input.storeLocation.latitude,
        input.storeLocation.longitude
      );

      // Deterministic normalized scores (0 to 100)
      const priceScore = Math.max(0, 100 - (sku.pricePaise / 50000) * 10);
      const reliabilityScore = supplier.reliabilityScore;
      const etaScore = Math.max(0, 100 - sku.leadTimeHours * 2);
      const distanceScore = Math.max(0, 100 - distance * 3);
      const availabilityScore = sku.availableQuantity >= input.requiredQuantity ? 100 : 50;

      const totalScore = Math.round(
        weights.priceWeight * priceScore +
          weights.reliabilityWeight * reliabilityScore +
          weights.etaWeight * etaScore +
          weights.distanceWeight * distanceScore +
          weights.availabilityWeight * availabilityScore
      );

      return {
        supplier,
        score: totalScore,
        pricePaise: sku.pricePaise,
        estimatedFulfillmentCostPaise: sku.pricePaise * input.requiredQuantity,
        leadTimeHours: sku.leadTimeHours,
        explanation: `Reliability score ${supplier.reliabilityScore}%, distance ${distance} km, lead time ${sku.leadTimeHours} hrs.`,
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }
}
