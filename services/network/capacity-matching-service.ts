/**
 * Return-Capacity / Empty-Backhaul Matching Service
 * Sections 14, 35 of Phase 1 Technical Specification
 */

import {
  CapacityOpportunity,
  CapacityMatchingService,
} from '../../domain/network/types';

export class DemoCapacityMatchingService implements CapacityMatchingService {
  async findOpportunities(input: {
    routeId?: string;
    vehicleId?: string;
    radiusKm: number;
  }): Promise<CapacityOpportunity[]> {
    // Golden Scenario match (Section 42)
    return [
      {
        id: 'cap-opp-901',
        vehicleId: input.vehicleId || 'veh-tata-ace-02',
        routeId: input.routeId || 'rt-blr-east-01',
        availableWeightKg: 420,
        availableVolumeM3: 2.1,
        routeOrigin: { latitude: 12.9719, longitude: 77.6412 },
        routeDestination: { latitude: 13.0285, longitude: 77.5408 }, // Returning to Peenya Depot
        compatiblePickupId: 'pickup-supplier-delta',
        pickupLocation: { latitude: 12.9554, longitude: 77.6385 }, // HAL 3rd Stage
        pickupDistanceKm: 2.8,
        incrementalDistanceKm: 3.8,
        estimatedRevenuePaise: 185000, // ₹1,850.00 recovery
        estimatedCostPaise: 45000,     // ₹450.00 fuel cost
        estimatedNetValuePaise: 140000, // ₹1,400.00 net value
        compatibilityScore: 92,
        reasons: [
          'Backhaul load (260 kg, 1.5 m³) fits inside remaining 420 kg spare capacity',
          'Incremental detour is only +3.8 km (+16 mins)',
          'No delivery SLA commitments violated on return corridor',
        ],
      },
    ];
  }
}
