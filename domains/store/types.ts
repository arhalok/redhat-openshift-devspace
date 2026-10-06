/**
 * Store Domain Types
 * Section 8 & Section 16 of logistics-foundation.md
 */

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Store {
  id: string;
  organizationId: string;
  name: string;
  ownerName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  geoPoint: GeoPoint;
  h3Cell: string; // Derived spatial index
  status: 'ACTIVE' | 'INACTIVE' | 'ONBOARDING';
  storeType: 'GENERAL' | 'GROCERY' | 'PAN_SHOP' | 'SUPERMARKET';
  createdAt: string;
  updatedAt: string;
}
