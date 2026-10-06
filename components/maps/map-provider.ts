/**
 * Map Provider Abstraction
 * Section 16.3 of logistics-foundation.md:
 * Decouples map visualization libraries (MapLibre, Google Maps, Leaflet) from business views.
 */

import { GeoPoint } from '../../domains/store/types';

export interface MapMarker {
  id: string;
  position: GeoPoint;
  title: string;
  type: 'DEPOT' | 'SUPPLIER' | 'STORE' | 'VEHICLE';
  status?: string;
  payload?: Record<string, unknown>;
}

export interface MapRouteVector {
  id: string;
  coordinates: GeoPoint[];
  colorHex: string;
  isPlanned: boolean;
}

export interface MapViewportBounds {
  northEast: GeoPoint;
  southWest: GeoPoint;
}

export interface MapProvider {
  initialize(containerElementId: string, center: GeoPoint, zoom: number): Promise<void>;
  renderMarkers(markers: MapMarker[]): void;
  renderRoutes(routes: MapRouteVector[]): void;
  fitBounds(bounds: MapViewportBounds): void;
  destroy(): void;
}
