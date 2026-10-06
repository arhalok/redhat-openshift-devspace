/**
 * Feature Flags Configuration
 * Section 56 of Phase 1 Engineering Build Specification
 */

export interface FeatureFlags {
  smartReplenishment: boolean;
  supplierIntelligence: boolean;
  consolidation: boolean;
  returnCapacity: boolean;
  simulator: boolean;
  aiCopilot: boolean;
  realRouting: boolean;
  realForecasting: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  smartReplenishment: true,
  supplierIntelligence: true,
  consolidation: true,
  returnCapacity: true,
  simulator: true,
  aiCopilot: true,
  realRouting: false,
  realForecasting: false,
};

export function getFeatureFlags(): FeatureFlags {
  return { ...DEFAULT_FEATURE_FLAGS };
}
