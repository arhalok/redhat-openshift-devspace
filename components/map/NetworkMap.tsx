'use client';

import React, { useState } from 'react';
import {
  BANGALORE_WAREHOUSES,
  BANGALORE_SUPPLIERS,
  BANGALORE_STORES,
  BANGALORE_VEHICLES,
  BANGALORE_ROUTES,
  H3_AREA_INSIGHTS,
  StoreNode,
  VehicleNode,
  RouteVector,
  WarehouseNode,
  SupplierNode,
} from '../../lib/demo-data';
import { useLogistics } from '../../lib/logistics-state';
import {
  Layers,
  MapPin,
  Truck,
  Warehouse,
  Factory,
  AlertTriangle,
  Flame,
  Grid,
  Info,
} from 'lucide-react';

interface MapLayersState {
  stores: boolean;
  suppliers: boolean;
  warehouses: boolean;
  vehicles: boolean;
  routes: boolean;
  demand: boolean;
  exceptions: boolean;
  h3zones: boolean;
}

export function NetworkMap() {
  const {
    setSelectedStore,
    setSelectedVehicle,
    setSelectedH3Insight,
    selectedVehicle,
    selectedStore,
    consolidationState,
    optimizationState,
  } = useLogistics();

  const [layers, setLayers] = useState<MapLayersState>({
    stores: true,
    suppliers: true,
    warehouses: true,
    vehicles: true,
    routes: true,
    demand: true,
    exceptions: true,
    h3zones: true,
  });

  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    subtitle: string;
    badge?: string;
  } | null>(null);

  // Coordinate projection from Bangalore Lat/Lng to SVG [0, 920] x [0, 520]
  const minLat = 12.82;
  const maxLat = 13.05;
  const minLng = 77.50;
  const maxLng = 77.76;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 20;
    // Invert Y because latitude increases northward
    const y = ((maxLat - lat) / (maxLat - minLat)) * 480 + 20;
    return { x, y };
  };

  const toggleLayer = (layer: keyof MapLayersState) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Pre-calculated H3 Hexagon centroids
  const h3Cells = [
    {
      index: '88618925d3fffff',
      centerLat: 12.9719,
      centerLng: 77.6412,
      label: 'East Bangalore (Indiranagar)',
      risk: 'High',
      color: 'rgba(239, 68, 68, 0.15)',
    },
    {
      index: '8861892557fffff',
      centerLat: 12.9345,
      centerLng: 77.6256,
      label: 'South-East (Koramangala)',
      risk: 'Medium',
      color: 'rgba(245, 158, 11, 0.15)',
    },
    {
      index: '886189240bfffff',
      centerLat: 12.9237,
      centerLng: 77.5925,
      label: 'South (Jayanagar)',
      risk: 'Critical',
      color: 'rgba(239, 68, 68, 0.25)',
    },
    {
      index: '8861892e67fffff',
      centerLat: 12.958,
      centerLng: 77.721,
      label: 'East (Whitefield)',
      risk: 'Low',
      color: 'rgba(59, 130, 246, 0.15)',
    },
    {
      index: '8861892511fffff',
      centerLat: 13.003,
      centerLng: 77.571,
      label: 'North-West (Malleshwaram)',
      risk: 'Low',
      color: 'rgba(16, 185, 129, 0.15)',
    },
  ];

  return (
    <div className="relative w-full h-[520px] bg-[#070b14] border border-gray-800 rounded-xl overflow-hidden shadow-inner select-none">
      {/* Top Map Header & Layer Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-auto shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-white">Bangalore Logistics Hub</span>
          <span className="text-[11px] text-gray-400 font-mono">12.97°N, 77.59°E</span>
        </div>

        {/* Layer Toggles */}
        <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 pointer-events-auto shadow-md overflow-x-auto">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>
          <button
            onClick={() => toggleLayer('warehouses')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.warehouses ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Hubs
          </button>
          <button
            onClick={() => toggleLayer('suppliers')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.suppliers ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Suppliers
          </button>
          <button
            onClick={() => toggleLayer('stores')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.stores ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => toggleLayer('vehicles')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.vehicles ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Vehicles
          </button>
          <button
            onClick={() => toggleLayer('routes')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.routes ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => toggleLayer('demand')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.demand ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Demand
          </button>
          <button
            onClick={() => toggleLayer('h3zones')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              layers.h3zones ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            H3 Grid
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 920 520"
        className="w-full h-full cursor-crosshair"
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <defs>
          {/* Subtle Grid pattern */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          </pattern>
          {/* Gradients */}
          <radialGradient id="demandGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="#070b14" />
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* Bangalore arterial road vectors (stylized background framework) */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none">
          {/* Outer Ring Road loop */}
          <path d="M 120 70 Q 320 40 580 80 T 840 220 Q 820 420 560 480 T 260 440 Q 80 320 120 70" />
          {/* NICE road arc */}
          <path d="M 60 220 Q 140 460 520 490" strokeDasharray="4 4" />
          {/* Arterial corridors (Hebbal, Airport road, Hosur road) */}
          <line x1="220" y1="50" x2="460" y2="260" />
          <line x1="460" y1="260" x2="580" y2="470" />
          <line x1="460" y1="260" x2="820" y2="230" />
          <line x1="120" y1="80" x2="460" y2="260" />
        </g>

        {/* 1. Demand Heatmap circles */}
        {layers.demand && (
          <g>
            <circle cx="480" cy="240" r="110" fill="url(#demandGlow)" />
            <circle cx="430" cy="330" r="90" fill="url(#demandGlow)" />
            <circle cx="720" cy="250" r="80" fill="url(#demandGlow)" opacity="0.6" />
          </g>
        )}

        {/* 2. H3 Spatial Hexagonal Zones */}
        {layers.h3zones &&
          h3Cells.map((hex) => {
            const { x, y } = project(hex.centerLat, hex.centerLng);
            const radius = 48;
            // Generate hexagon points
            const points = [0, 60, 120, 180, 240, 300]
              .map((angle) => {
                const rad = (Math.PI / 180) * angle;
                return `${x + radius * Math.cos(rad)},${y + radius * Math.sin(rad)}`;
              })
              .join(' ');

            return (
              <g
                key={hex.index}
                className="cursor-pointer transition-opacity hover:opacity-100"
                onClick={() => {
                  const insight = H3_AREA_INSIGHTS[hex.index];
                  if (insight) setSelectedH3Insight(insight);
                }}
                onMouseEnter={() =>
                  setActiveTooltip({
                    x,
                    y: y - 50,
                    title: hex.label,
                    subtitle: `H3: ${hex.index.slice(0, 10)}... (Click for area insight)`,
                    badge: `${hex.risk} Demand Surge`,
                  })
                }
              >
                <polygon
                  points={points}
                  fill={hex.color}
                  stroke="rgba(147, 51, 234, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x={x}
                  y={y - 2}
                  fill="rgba(216, 180, 254, 0.8)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {hex.index.slice(0, 7)}
                </text>
              </g>
            );
          })}

        {/* 3. Delivery Routes */}
        {layers.routes &&
          BANGALORE_ROUTES.map((route) => {
            const pathPoints = route.coordinates.map((c) => project(c[0], c[1]));
            const d = pathPoints.reduce(
              (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
              ''
            );

            const isConsolidated = consolidationState === 'applied' && route.id === 'route-r124';

            return (
              <g key={route.id}>
                {/* Glow underlay */}
                <path
                  d={d}
                  fill="none"
                  stroke={isConsolidated ? '#10b981' : route.color}
                  strokeWidth="4"
                  strokeOpacity="0.25"
                />
                {/* Vector line */}
                <path
                  d={d}
                  fill="none"
                  stroke={isConsolidated ? '#10b981' : route.color}
                  strokeWidth="2"
                  strokeDasharray={route.status === 'DELAYED' && !isConsolidated ? '6 4' : undefined}
                />
              </g>
            );
          })}

        {/* 4. Warehouses / Central Depots */}
        {layers.warehouses &&
          BANGALORE_WAREHOUSES.map((wh) => {
            const { x, y } = project(wh.lat, wh.lng);
            return (
              <g
                key={wh.id}
                className="cursor-pointer group"
                onMouseEnter={() =>
                  setActiveTooltip({
                    x,
                    y: y - 28,
                    title: wh.name,
                    subtitle: `${wh.locality} • ${wh.activeVehicles} active vehicles`,
                    badge: `${wh.capacityUtilization}% Capacity`,
                  })
                }
              >
                <rect
                  x={x - 14}
                  y={y - 14}
                  width="28"
                  height="28"
                  rx="6"
                  fill="#1e1b4b"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="transition group-hover:scale-110"
                />
                <Warehouse x={x - 8} y={y - 8} width="16" height="16" className="text-indigo-400" />
                <text x={x} y={y + 24} fill="#c7d2fe" fontSize="10" fontWeight="600" textAnchor="middle">
                  {wh.code}
                </text>
              </g>
            );
          })}

        {/* 5. Suppliers */}
        {layers.suppliers &&
          BANGALORE_SUPPLIERS.map((sup) => {
            const { x, y } = project(sup.lat, sup.lng);
            return (
              <g
                key={sup.id}
                className="cursor-pointer group"
                onMouseEnter={() =>
                  setActiveTooltip({
                    x,
                    y: y - 24,
                    title: sup.name,
                    subtitle: `${sup.category} • ${sup.distanceKm} km away`,
                    badge: `${sup.reliabilityScore}% Reliability`,
                  })
                }
              >
                <polygon
                  points={`${x},${y - 12} ${x + 12},${y + 10} ${x - 12},${y + 10}`}
                  fill="#451a03"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className="transition group-hover:scale-110"
                />
                <circle cx={x} cy={y + 2} r="3" fill="#fbbf24" />
                <text x={x} y={y + 22} fill="#fde68a" fontSize="9.5" fontWeight="500" textAnchor="middle">
                  {sup.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

        {/* 6. Kirana Stores */}
        {layers.stores &&
          BANGALORE_STORES.map((store) => {
            const { x, y } = project(store.lat, store.lng);
            const isSelected = selectedStore?.id === store.id;

            const riskColors = {
              CRITICAL: '#ef4444',
              HIGH: '#f97316',
              MEDIUM: '#eab308',
              LOW: '#3b82f6',
            };

            return (
              <g
                key={store.id}
                className="cursor-pointer group"
                onClick={() => setSelectedStore(store)}
                onMouseEnter={() =>
                  setActiveTooltip({
                    x,
                    y: y - 26,
                    title: store.name,
                    subtitle: `${store.locality} • Click to open replenishment`,
                    badge: `${store.stockoutRiskLevel} Stockout Risk`,
                  })
                }
              >
                {/* Pulse ring for high/critical risk */}
                {(store.stockoutRiskLevel === 'CRITICAL' || store.stockoutRiskLevel === 'HIGH') && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke={riskColors[store.stockoutRiskLevel]}
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 9 : 7}
                  fill="#0f172a"
                  stroke={riskColors[store.stockoutRiskLevel]}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition group-hover:r-9"
                />
                <circle cx={x} cy={y} r="3" fill={riskColors[store.stockoutRiskLevel]} />
                <text x={x} y={y + 18} fill="#e2e8f0" fontSize="9.5" fontWeight="500" textAnchor="middle">
                  {store.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

        {/* 7. Fleet Vehicles */}
        {layers.vehicles &&
          BANGALORE_VEHICLES.map((veh) => {
            const { x, y } = project(veh.lat, veh.lng);
            const isSelected = selectedVehicle?.id === veh.id;

            return (
              <g
                key={veh.id}
                className="cursor-pointer group"
                onClick={() => setSelectedVehicle(veh)}
                onMouseEnter={() =>
                  setActiveTooltip({
                    x,
                    y: y - 28,
                    title: `${veh.code} (${veh.model})`,
                    subtitle: `Status: ${veh.status} • Stops: ${veh.stopsCount} • ETA: ${veh.eta}`,
                    badge: `${veh.currentCapacityPct}% Capacity`,
                  })
                }
              >
                <rect
                  x={x - 12}
                  y={y - 12}
                  width="24"
                  height="24"
                  rx="6"
                  fill="#064e3b"
                  stroke={isSelected ? '#34d399' : '#10b981'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition group-hover:scale-110"
                />
                <Truck x={x - 7} y={y - 7} width="14" height="14" className="text-emerald-300" />
                <text x={x} y={y + 20} fill="#6ee7b7" fontSize="9" fontWeight="700" textAnchor="middle">
                  {veh.code}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Floating Tooltip */}
      {activeTooltip && (
        <div
          className="absolute z-30 pointer-events-none bg-gray-950/95 border border-gray-700 text-white px-3 py-2 rounded-lg shadow-2xl backdrop-blur-md transform -translate-x-1/2 -translate-y-full text-xs"
          style={{ left: activeTooltip.x, top: activeTooltip.y }}
        >
          <div className="flex items-center gap-2 font-bold text-gray-100">
            <span>{activeTooltip.title}</span>
            {activeTooltip.badge && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeTooltip.badge}
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">{activeTooltip.subtitle}</div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 bg-gray-900/90 backdrop-blur-md border border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-4 text-[11px] text-gray-300 pointer-events-none shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Central Hub
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Supplier
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Kirana Store
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Fleet Vehicle
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Stockout Risk
        </div>
      </div>
    </div>
  );
}
