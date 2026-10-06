/**
 * Phase 1 Deterministic Prototype Services & Implementations
 * Conforms to Sections 31-39, 55 of Phase 1 Engineering Build Specification
 */

import {
  RoutingService,
  RouteRequest,
  RouteResult,
  MatrixRequest,
  TravelMatrix,
  OptimizationService,
  OptimizeRoutesRequest,
  RoutePlan,
  DemandService,
  Recommendation,
  SupplierRecommendationService,
  SupplierOffer,
  ConsolidationService,
  ConsolidationOpportunity,
  CapacityMatchingService,
  ReturnCapacityOpportunity,
  SimulationService,
  SimulationScenario,
  SimulationResult,
  NetworkMetrics,
} from '../types/domain';
import { DEMO_CONFIG } from '../config/demo';
import { BANGALORE_STORES, BANGALORE_SUPPLIERS, BANGALORE_ROUTES, BANGALORE_VEHICLES } from '../lib/demo-data';

// Helper: Haversine distance in km
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// 1. Demo Routing Service (Section 33)
export class DemoRoutingService implements RoutingService {
  async getRoute(request: RouteRequest): Promise<RouteResult> {
    const directKm = haversineDistanceKm(
      request.origin.latitude,
      request.origin.longitude,
      request.destination.latitude,
      request.destination.longitude
    );
    // Urban road network factor: ~1.28x direct distance
    const roadDistanceKm = Number((directKm * 1.28).toFixed(1));
    // Average urban speed: 22 km/h
    const durationMinutes = Math.round((roadDistanceKm / 22) * 60);

    return {
      distanceKm: roadDistanceKm,
      durationMinutes,
      polyline: `enc_polyline_${request.origin.latitude}_${request.destination.latitude}`,
    };
  }

  async getMatrix(request: MatrixRequest): Promise<TravelMatrix> {
    const distancesKm: number[][] = [];
    const durationsMinutes: number[][] = [];

    for (let i = 0; i < request.origins.length; i++) {
      distancesKm[i] = [];
      durationsMinutes[i] = [];
      for (let j = 0; j < request.destinations.length; j++) {
        const d = haversineDistanceKm(
          request.origins[i].latitude,
          request.origins[i].longitude,
          request.destinations[j].latitude,
          request.destinations[j].longitude
        );
        const road = Number((d * 1.28).toFixed(1));
        distancesKm[i][j] = road;
        durationsMinutes[i][j] = Math.round((road / 22) * 60);
      }
    }

    return { distancesKm, durationsMinutes };
  }
}

// 2. Demo Route Optimizer Service (Section 25, 26)
export class DemoOptimizationService implements OptimizationService {
  async optimize(request: OptimizeRoutesRequest): Promise<RoutePlan[]> {
    const plans: RoutePlan[] = [];

    // Form route plans respecting vehicle capacities and cluster boundaries
    const vehicleIds = request.vehicleIds.length > 0 ? request.vehicleIds : ['veh-027', 'veh-131', 'veh-108'];
    const ordersPerVehicle = Math.max(1, Math.ceil(request.orderIds.length / vehicleIds.length));

    vehicleIds.forEach((vehId, idx) => {
      const sliceStart = idx * ordersPerVehicle;
      const sliceOrders = request.orderIds.slice(sliceStart, sliceStart + ordersPerVehicle);
      if (sliceOrders.length === 0) return;

      const stops = sliceOrders.map((ordId, sIdx) => ({
        id: `stop-opt-${idx}-${sIdx}`,
        sequence: sIdx + 1,
        storeId: `store-${(idx * 3 + sIdx) % BANGALORE_STORES.length + 1}`,
        orderId: ordId,
        plannedArrival: `2026-10-06T${String(10 + Math.floor(sIdx * 0.8)).padStart(2, '0')}:30:00Z`,
        status: 'PLANNED' as const,
        distanceFromPreviousKm: Number((2.5 + (sIdx % 3) * 1.2).toFixed(1)),
        durationFromPreviousMinutes: 15 + (sIdx % 3) * 5,
      }));

      const totalDist = stops.reduce((sum, s) => sum + s.distanceFromPreviousKm, 0);
      const totalDur = stops.reduce((sum, s) => sum + s.durationFromPreviousMinutes, 0);

      plans.push({
        id: `route-plan-${idx + 1}`,
        routeNumber: `R-OPT-${100 + idx + 1}`,
        vehicleId: vehId,
        stops,
        totalDistanceKm: Number(totalDist.toFixed(1)),
        totalDurationMinutes: totalDur,
        utilizationPercent: Number((65 + (idx * 9) % 30).toFixed(1)),
        estimatedCost: Math.round(totalDist * 28.5),
      });
    });

    return plans;
  }
}

// 3. Demo Demand / Replenishment Service (Sections 34, 35)
export class DemoDemandService implements DemandService {
  async getReplenishmentRecommendations(storeId: string): Promise<Recommendation[]> {
    const cfg = DEMO_CONFIG.demandScoring;

    // Seeded store SKU evaluation
    const candidateSkus = [
      {
        id: 'prod-atta-10kg',
        name: 'Aashirvaad Superior Shudh Chakki Atta 10kg',
        onHand: 2,
        expectedDailyDemand: 4.5,
        safetyStock: 8,
        moq: 12,
        stockPressure: 0.90,
        demandTrend: 0.85,
        orderFrequency: 0.80,
        leadTimePressure: 0.70,
        leadTimeDays: 1,
      },
      {
        id: 'prod-oil-1l',
        name: 'Fortune Sunlite Refined Sunflower Oil 1L',
        onHand: 5,
        expectedDailyDemand: 6.0,
        safetyStock: 10,
        moq: 15,
        stockPressure: 0.80,
        demandTrend: 0.75,
        orderFrequency: 0.70,
        leadTimePressure: 0.65,
        leadTimeDays: 1,
      },
      {
        id: 'prod-parle-g',
        name: 'Parle-G Gold Biscuits (Case of 24x100g)',
        onHand: 3,
        expectedDailyDemand: 4.0,
        safetyStock: 8,
        moq: 12,
        stockPressure: 0.85,
        demandTrend: 0.70,
        orderFrequency: 0.85,
        leadTimePressure: 0.60,
        leadTimeDays: 1,
      },
    ];

    return candidateSkus.map((sku) => {
      // Risk score formula (Section 34)
      const riskScore =
        sku.stockPressure * cfg.stockPressureWeight +
        sku.demandTrend * cfg.demandTrendWeight +
        sku.orderFrequency * cfg.orderFrequencyWeight +
        sku.leadTimePressure * cfg.leadTimePressureWeight;

      // Replenishment quantity formula (Section 35)
      const targetStock = sku.expectedDailyDemand * cfg.coverageDays + sku.safetyStock;
      const rawRecommended = Math.max(0, targetStock - sku.onHand);
      // Round to MOQ
      const recommendedQuantity = Math.max(sku.moq, Math.ceil(rawRecommended / sku.moq) * sku.moq);

      const reasons = [
        `Current stock (${sku.onHand}) is below safety threshold (${sku.safetyStock} units)`,
        `Accelerated demand velocity (+${Math.round(sku.demandTrend * 35)}%) in cluster`,
        `Supplier lead time is ${sku.leadTimeDays} business day with 97% verified fill rate`,
      ];

      return {
        id: `rec-${sku.id}`,
        type: 'REPLENISHMENT',
        title: `Restock ${recommendedQuantity} units of ${sku.name}`,
        reason: reasons,
        confidence: Number((0.82 + (riskScore % 0.15)).toFixed(2)),
        impact: {
          label: 'Stockout Risk Prevention',
          value: recommendedQuantity,
          unit: 'units',
        },
        entity: {
          type: 'PRODUCT',
          id: sku.id,
        },
        actions: [
          {
            id: `act-add-${sku.id}`,
            label: `Add +${recommendedQuantity} to Order`,
            actionType: 'ADD_TO_ORDER',
            requiresConfirmation: false,
          },
        ],
        status: 'NEW',
      };
    });
  }
}

// 4. Demo Supplier Recommendation Service (Section 36)
export class DemoSupplierRecommendationService implements SupplierRecommendationService {
  async recommendSuppliers(
    productId: string,
    quantity: number,
    constraints?: { maxLeadTimeHours?: number; maxPrice?: number }
  ): Promise<SupplierOffer[]> {
    const cfg = DEMO_CONFIG.supplierScoring;

    const baseOffers = [
      {
        supplierId: 'sup-1',
        supplierName: 'Apex FMCG Distribution Hub',
        price: 445.0,
        leadTimeHours: 18,
        reliabilityScore: 94,
        fillRate: 97,
        moq: 5,
        distanceKm: 7.2,
      },
      {
        supplierId: 'sup-2',
        supplierName: 'Kaveri Valley Dairy & Perishables',
        price: 448.0,
        leadTimeHours: 24,
        reliabilityScore: 96,
        fillRate: 98,
        moq: 10,
        distanceKm: 14.5,
      },
      {
        supplierId: 'sup-3',
        supplierName: 'Mysore Grain Wholesale Syndicate',
        price: 442.0,
        leadTimeHours: 36,
        reliabilityScore: 88,
        fillRate: 91,
        moq: 20,
        distanceKm: 8.9,
      },
    ];

    // Score calculation according to Section 36
    const minPrice = Math.min(...baseOffers.map((o) => o.price));
    const minLead = Math.min(...baseOffers.map((o) => o.leadTimeHours));

    const scored = baseOffers.map((offer) => {
      const priceScore = minPrice / offer.price;
      const relScore = offer.reliabilityScore / 100;
      const fillScore = offer.fillRate / 100;
      const leadScore = minLead / offer.leadTimeHours;
      const distScore = 1 / (1 + offer.distanceKm * 0.05);

      const finalScore =
        priceScore * cfg.priceWeight +
        relScore * cfg.reliabilityWeight +
        fillScore * cfg.availabilityWeight +
        leadScore * cfg.leadTimeWeight +
        distScore * cfg.distanceWeight;

      return {
        ...offer,
        score: Number(finalScore.toFixed(3)),
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored.map((s, idx) => ({
      supplierId: s.supplierId,
      supplierName: s.supplierName,
      price: s.price,
      leadTimeHours: s.leadTimeHours,
      reliabilityScore: s.reliabilityScore,
      fillRate: s.fillRate,
      moq: s.moq,
      score: s.score,
      isRecommended: idx === 0,
      explanation: idx === 0
        ? 'Best overall balance of price, reliability and lead time.'
        : `Alternative option with ${s.leadTimeHours}h lead time.`,
    }));
  }
}

// 5. Demo Consolidation Service (Section 37)
export class DemoConsolidationService implements ConsolidationService {
  async findOpportunities(workspaceId: string): Promise<ConsolidationOpportunity[]> {
    return [
      {
        id: 'cons-opp-801',
        orderIds: ['ORD-10284', 'ORD-10285', 'ORD-10286'],
        currentRouteCount: 12,
        proposedRouteCount: 4,
        currentDistanceKm: 48.0,
        proposedDistanceKm: 31.2,
        estimatedImpact: {
          distanceSavedKm: 16.8,
          percentage: 28.0,
        },
        reasons: [
          'Orders share East Bangalore catchment zone (88618925d3fffff)',
          'Combined payload of 835 kg fits Tata Ace capacity limits',
          'Overlapping dispatch windows between 09:00 - 13:00',
        ],
      },
    ];
  }
}

// 6. Demo Return Capacity Service (Section 38)
export class DemoCapacityMatchingService implements CapacityMatchingService {
  async findReturnLoads(vehicleId: string): Promise<ReturnCapacityOpportunity[]> {
    return [
      {
        id: 'ret-cap-027',
        vehicleId: 'veh-027',
        routeId: 'route-r124',
        remainingCapacity: {
          weightKg: 190,
          volumeM3: 0.95,
        },
        pickup: {
          supplierId: 'sup-4',
          supplierName: 'Delta Beverage & FMCG Wholesalers',
          latitude: 12.998,
          longitude: 77.689,
        },
        load: {
          weightKg: 340,
          volumeM3: 1.1,
          description: 'Empty crates & secondary packaging backhaul',
        },
        additionalDistanceKm: 4.1,
        estimatedRecoveryPaise: 185000, // ₹1,850.00
      },
    ];
  }
}

// 7. Demo Simulation Service (Section 39)
export class DemoSimulationService implements SimulationService {
  async run(scenario: SimulationScenario): Promise<SimulationResult> {
    const demandMult = scenario.demandMultiplier;
    const vehicleMult = scenario.vehicleAvailabilityMultiplier;

    const baseline: NetworkMetrics = {
      orderCount: 142,
      vehicleCount: 72,
      routeCount: 18,
      totalDistanceKm: 1842.0,
      utilizationPercent: 76.4,
      atRiskOrderCount: 2,
      estimatedCost: 46200.0,
    };

    const simulatedOrders = Math.round(baseline.orderCount * demandMult);
    const availableVehicles = Math.round(baseline.vehicleCount * vehicleMult);
    const simulatedRoutes = Math.round(baseline.routeCount * (demandMult * 0.95));
    const atRiskOrders = Math.round(
      Math.max(0, 2 + (demandMult > 1.2 ? 9 : 0) + (vehicleMult < 0.9 ? 5 : 0) + (scenario.disabledWarehouseIds.length > 0 ? 4 : 0))
    );
    const simulatedDistance = Number((baseline.totalDistanceKm * (1 + (demandMult - 1) * 0.65)).toFixed(1));
    const simulatedCost = Number((baseline.estimatedCost * (1 + (demandMult - 1) * 0.72)).toFixed(1));

    const simulated: NetworkMetrics = {
      orderCount: simulatedOrders,
      vehicleCount: Math.min(availableVehicles, simulatedRoutes),
      routeCount: simulatedRoutes,
      totalDistanceKm: simulatedDistance,
      utilizationPercent: Math.min(100.0, Number((baseline.utilizationPercent * (demandMult / vehicleMult)).toFixed(1))),
      atRiskOrderCount: atRiskOrders,
      estimatedCost: simulatedCost,
    };

    return {
      baseline,
      simulated,
      differences: {
        routesDelta: simulated.routeCount - baseline.routeCount,
        vehiclesDelta: simulated.vehicleCount - baseline.vehicleCount,
        distanceDeltaKm: Number((simulated.totalDistanceKm - baseline.totalDistanceKm).toFixed(1)),
        costDelta: Number((simulated.estimatedCost - baseline.estimatedCost).toFixed(1)),
        atRiskOrdersDelta: simulated.atRiskOrderCount - baseline.atRiskOrderCount,
      },
      recommendations: [
        'Reallocate 2 Tata Ace vehicles from West corridor to East corridor to mitigate surge.',
        'Activate secondary carrier overflow capacity to protect morning dispatch SLA.',
      ],
    };
  }
}

// 8. Demo Reset Service (Section 55)
export class DemoResetService {
  async resetDemoState(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return {
      success: true,
      message: 'Demo state successfully reset to deterministic baseline topology.',
      timestamp: new Date().toISOString(),
    };
  }
}

export const defaultRoutingService = new DemoRoutingService();
export const defaultOptimizationService = new DemoOptimizationService();
export const defaultDemandService = new DemoDemandService();
export const defaultSupplierService = new DemoSupplierRecommendationService();
export const defaultConsolidationService = new DemoConsolidationService();
export const defaultCapacityMatchingService = new DemoCapacityMatchingService();
export const defaultSimulationService = new DemoSimulationService();
export const defaultResetService = new DemoResetService();
