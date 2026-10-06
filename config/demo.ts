/**
 * Demo Configuration & Calibration Parameters
 * Sections 34-39 of Phase 1 Engineering Build Specification
 */

export const DEMO_CONFIG = {
  // Demand algorithm weights (Section 34)
  demandScoring: {
    stockPressureWeight: 0.35,
    demandTrendWeight: 0.25,
    orderFrequencyWeight: 0.20,
    leadTimePressureWeight: 0.20,
    thresholds: {
      high: 0.75,
      medium: 0.50,
    },
    coverageDays: 3,
  },

  // Supplier scoring weights (Section 36)
  supplierScoring: {
    priceWeight: 0.35,
    reliabilityWeight: 0.25,
    availabilityWeight: 0.20,
    leadTimeWeight: 0.15,
    distanceWeight: 0.05,
  },

  // Consolidation clustering rules (Section 37)
  consolidation: {
    maxOrdersPerConsolidation: 8,
    radiusKm: 15.0,
    clusterH3Resolution: 8,
  },

  // Return capacity rules (Section 38)
  returnCapacity: {
    maxDeviationKm: 10.0,
    minPayloadWeightKg: 100,
  },
};
