/**
 * Service Registry Implementation
 * Section 20 of logistics-foundation.md:
 * Dependency injection / Service registry decoupling demo and production adapters.
 */

import { ServiceRegistry } from '../contracts';
import { DemoRoutingService, DemoRouteOptimizer } from './demo-routing-service';
import { DemoDemandRecommendationService } from './demo-demand-service';
import { DemoSupplierRankingService } from './demo-supplier-ranking-service';
import { DemoCapacityMatchingService } from './demo-capacity-matching-service';

export function createServiceRegistry(): ServiceRegistry {
  return {
    routing: new DemoRoutingService(),
    optimizer: new DemoRouteOptimizer(),
    demand: new DemoDemandRecommendationService(),
    supplierRanking: new DemoSupplierRankingService(),
    capacityMatching: new DemoCapacityMatchingService(),
  };
}

export const defaultServiceRegistry = createServiceRegistry();
