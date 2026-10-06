/**
 * Feature Flags Configuration & Boundary
 * Section 62 of logistics-foundation.md
 */

export interface FeatureFlags {
  SMART_REPLENISHMENT: boolean;
  SUPPLIER_RECOMMENDATIONS: boolean;
  NETWORK_CONSOLIDATION: boolean;
  RETURN_LOAD_MATCHING: boolean;
  SIMULATOR: boolean;
  AI_COPILOT: boolean;
  VOICE_ORDERING: boolean;
  LIVE_GPS: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  SMART_REPLENISHMENT: true,
  SUPPLIER_RECOMMENDATIONS: true,
  NETWORK_CONSOLIDATION: true,
  RETURN_LOAD_MATCHING: true,
  SIMULATOR: true,
  AI_COPILOT: true,
  VOICE_ORDERING: false, // Planned for future voice assistance
  LIVE_GPS: false,       // In demo mode, simulated coordinates are used
};

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  if (typeof process !== 'undefined' && process.env) {
    const envKey = `FEATURE_${flag}`;
    if (process.env[envKey] !== undefined) {
      return process.env[envKey] === 'true' || process.env[envKey] === '1';
    }
  }
  return DEFAULT_FEATURE_FLAGS[flag];
}
