/**
 * Common Domain Entities & Geospatial Types
 * Sections 3 & 4 of Phase 1 Technical Specification
 */

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Address {
  line1: string;
  line2?: string;
  locality?: string;
  city: string;
  district?: string;
  state: string;
  postalCode?: string;
  country: 'IN';
}

export interface TimeWindow {
  start: string; // HH:mm
  end: string;   // HH:mm
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  currency: 'INR';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type Role =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'PROCUREMENT_MANAGER'
  | 'STORE_MANAGER'
  | 'DRIVER_VIEWER'
  | 'ANALYST';
