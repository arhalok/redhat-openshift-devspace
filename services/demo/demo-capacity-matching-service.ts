/**
 * Deterministic Demo Return-Load / Empty-Capacity Matching Service
 * Implements CapacityMatchingService adhering to Section 24 of logistics-foundation.md
 */

import {
  CapacityMatchingService,
  ReturnCapacityCandidate,
  ReturnCapacityInput,
} from '../contracts';

export class DemoCapacityMatchingService implements CapacityMatchingService {
  async findReturnLoads(input: ReturnCapacityInput): Promise<ReturnCapacityCandidate[]> {
    // Deterministic simulation of nearby suppliers needing backhaul transfer to depot
    const candidates: ReturnCapacityCandidate[] = [
      {
        pickupLocation: { latitude: 12.9554, longitude: 77.6385 }, // Domlur Hub
        dropoffLocation: input.depotLocation,
        weightKg: 180,
        volumeM3: 1.2,
        incrementalDistanceMeters: 3800, // +3.8 km deviation
        incrementalDurationSeconds: 960,  // +16 mins
        estimatedRecoveryPaise: 185000,   // ₹1,850.00 commercial recovery
        recommendationScore: 88,
      },
      {
        pickupLocation: { latitude: 12.9340, longitude: 77.6101 }, // BTM Hub
        dropoffLocation: input.depotLocation,
        weightKg: 250,
        volumeM3: 1.8,
        incrementalDistanceMeters: 5200, // +5.2 km deviation
        incrementalDurationSeconds: 1200, // +20 mins
        estimatedRecoveryPaise: 240000,   // ₹2,400.00 recovery
        recommendationScore: 82,
      },
    ];

    // Filter candidates strictly fitting remaining vehicle capacity
    return candidates.filter(
      (c) =>
        c.weightKg <= input.remainingCapacityWeightKg &&
        c.volumeM3 <= input.remainingCapacityVolumeM3
    );
  }
}
