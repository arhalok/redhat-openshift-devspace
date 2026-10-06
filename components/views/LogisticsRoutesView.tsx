'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { BANGALORE_ROUTES, BANGALORE_VEHICLES, RouteVector } from '../../lib/demo-data';
import { StatusBadge } from '../common/StatusBadge';
import { CapacityBar } from '../common/CapacityBar';
import { Drawer } from '../common/Drawer';
import {
  Truck,
  Fuel,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Navigation,
  MapPin,
  AlertCircle,
  Play,
} from 'lucide-react';

export function LogisticsRoutesView() {
  const {
    routes,
    vehicles,
    optimizationState,
    optimizationStep,
    runRouteOptimization,
    applyRouteOptimization,
    selectedVehicle,
    setSelectedVehicle,
    setActiveTab,
  } = useLogistics();

  const [selectedRoute, setSelectedRoute] = useState<RouteVector | null>(null);

  const optimizationChecklist = [
    'Grouping nearby deliveries by H3 spatial cluster',
    'Checking vehicle cubic capacity & axle weight constraints',
    'Checking morning/afternoon kirana delivery time windows',
    'Evaluating multi-echelon arterial route distances',
    'Comparing heuristic alternatives against baseline dispatch',
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Logistics & Route Operations
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
              VRPTW SOLVER
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Active dispatch schedules, vehicle capacity telemetry, and multi-depot optimization.
          </p>
        </div>

        {/* Primary CTA: Optimize Network (Section 21) */}
        <div className="flex items-center gap-3">
          <button
            onClick={runRouteOptimization}
            disabled={optimizationState === 'running'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            <Fuel className="w-4 h-4" />
            <span>{optimizationState === 'running' ? 'Optimizing...' : 'Optimize Network'}</span>
          </button>
        </div>
      </div>

      {/* Staged Optimization Progress Modal (Section 22) */}
      {optimizationState === 'running' && (
        <div className="bg-[#111827] border border-blue-900/60 rounded-xl p-5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <span>Optimizing Bangalore Distribution Network...</span>
            </div>
            <span className="text-xs font-mono text-blue-400">Step {optimizationStep} of 5</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {optimizationChecklist.map((step, idx) => {
              const isDone = idx + 1 < optimizationStep;
              const isCurrent = idx + 1 === optimizationStep;

              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0" />
                  )}
                  <span
                    className={
                      isDone
                        ? 'text-gray-300'
                        : isCurrent
                        ? 'text-white font-bold'
                        : 'text-gray-600'
                    }
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optimization Completed / Before vs After Summary (Section 22) */}
      {(optimizationState === 'completed' || optimizationState === 'applied') && (
        <div className="bg-[#111827] border border-emerald-900/50 rounded-xl p-5 shadow-xl bg-emerald-950/10">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Optimization Complete</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ESTIMATED
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">Algorithm: Google OR-Tools (Simulated)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Active Fleet</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-gray-400 line-through">72 vehicles</span>
                <span className="text-base font-bold text-white font-mono">61 vehicles</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">-11 vehicles (-15.2%)</div>
            </div>

            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Distance</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-gray-400 line-through">1,842 km</span>
                <span className="text-base font-bold text-white font-mono">1,421 km</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">-421 km (-22.8%)</div>
            </div>

            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Fuel & Fleet Cost</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-gray-400 line-through">₹46,200</span>
                <span className="text-base font-bold text-emerald-400 font-mono">₹35,800</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">₹10,400 daily saving</div>
            </div>

            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">SLA Breach Risk</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-gray-400 line-through">11 orders</span>
                <span className="text-base font-bold text-white font-mono">0 at risk</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">100% on-time protected</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-800/80">
            {optimizationState === 'applied' ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Active routes updated in telemetry
              </span>
            ) : (
              <button
                onClick={applyRouteOptimization}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30"
              >
                Apply Optimized Routes
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Route Cards Grid (Section 21) */}
      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          Active Dispatched Routes ({routes.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className="bg-[#111827] border border-gray-800 hover:border-gray-700 rounded-xl p-5 cursor-pointer transition shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                      {route.code}
                    </h3>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Vehicle: <span className="text-white font-mono font-bold">{route.vehicleCode}</span> &bull; {route.vehicleType}
                    </div>
                  </div>
                  <StatusBadge
                    label={route.status}
                    variant={route.status === 'DELAYED' ? 'red' : 'green'}
                    size="sm"
                  />
                </div>

                {/* Waypoint sequence */}
                <div className="mt-3.5 p-2.5 rounded-lg bg-gray-900 border border-gray-800/60 text-xs">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">
                    Route Sequence ({route.stops} stops)
                  </div>
                  <div className="text-gray-300 truncate font-mono text-[11px]">
                    {route.waypointNames.join(' → ')}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="p-2 rounded bg-gray-900/60 border border-gray-800 text-center">
                    <div className="text-[10px] text-gray-500 uppercase">Stops</div>
                    <div className="font-mono font-bold text-white mt-0.5">{route.stops}</div>
                  </div>
                  <div className="p-2 rounded bg-gray-900/60 border border-gray-800 text-center">
                    <div className="text-[10px] text-gray-500 uppercase">Distance</div>
                    <div className="font-mono font-bold text-white mt-0.5">{route.distanceKm} km</div>
                  </div>
                  <div className="p-2 rounded bg-gray-900/60 border border-gray-800 text-center">
                    <div className="text-[10px] text-gray-500 uppercase">ETA</div>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">{route.eta}</div>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-4">
                  <CapacityBar percentage={route.capacityPct} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono text-[11px]">Telemetry synced</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  Inspect Route &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Vehicles Status */}
      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          Fleet Vehicles ({vehicles.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((veh) => (
            <div
              key={veh.id}
              onClick={() => setSelectedVehicle(veh)}
              className="bg-[#111827] border border-gray-800 hover:border-gray-700 rounded-xl p-4 cursor-pointer transition shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm">{veh.code}</div>
                <StatusBadge
                  label={veh.status}
                  variant={veh.status === 'EN_ROUTE' ? 'blue' : veh.status === 'AT_DEPOT' ? 'neutral' : 'amber'}
                  size="sm"
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{veh.model}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Driver: {veh.driverName}</div>

              <div className="mt-3">
                <CapacityBar
                  percentage={veh.currentCapacityPct}
                  currentKg={veh.currentLoadKg}
                  totalKg={veh.capacityKg}
                />
              </div>

              <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-gray-800 text-gray-400">
                <span>Stops: {veh.stopsCount}</span>
                <span className="text-emerald-400 font-mono">ETA: {veh.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Detail Drawer */}
      {selectedRoute && (
        <Drawer
          isOpen={Boolean(selectedRoute)}
          onClose={() => setSelectedRoute(null)}
          title={selectedRoute.code}
          subtitle={`${selectedRoute.vehicleType} • Dispatched via ${selectedRoute.vehicleCode}`}
          footer={
            <button
              onClick={() => setSelectedRoute(null)}
              className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white transition"
            >
              Close
            </button>
          }
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex justify-between items-center">
              <div>
                <span className="text-gray-400">Status</span>
                <div className="mt-0.5">
                  <StatusBadge label={selectedRoute.status} variant={selectedRoute.status === 'DELAYED' ? 'red' : 'green'} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-gray-400">ETA</span>
                <div className="text-base font-bold font-mono text-emerald-400">{selectedRoute.eta}</div>
              </div>
            </div>

            <div>
              <div className="font-semibold text-gray-300 mb-2">Waypoint Stops Order:</div>
              <div className="space-y-2">
                {selectedRoute.waypointNames.map((name, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-gray-900/60 border border-gray-800 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-white font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 22: Route Explainability */}
            <div className="p-3.5 rounded-lg bg-gray-900 border border-purple-900/40 space-y-2">
              <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                Why this route was generated:
              </div>
              <ul className="space-y-1.5 text-gray-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1. Nearby deliveries were grouped by spatial corridor.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2. Vehicle cubic payload limits ({selectedRoute.capacityPct}% capacity) were respected.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3. Morning kirana delivery windows were preserved without SLA breach.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>4. High-priority stockout replenishment orders were sequenced first.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 text-gray-300">
              <span className="font-bold text-white">Operational Notes:</span> Stop 4 delivery window closes at 15:00. Traffic buffer currently calculated at +14m.
            </div>
          </div>
        </Drawer>
      )}

      {/* Vehicle Detail Drawer */}
      {selectedVehicle && (
        <Drawer
          isOpen={Boolean(selectedVehicle)}
          onClose={() => setSelectedVehicle(null)}
          title={`Vehicle ${selectedVehicle.code}`}
          subtitle={`${selectedVehicle.model} (${selectedVehicle.type})`}
          footer={
            <>
              {selectedVehicle.compatibleReturnLoad && (
                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    setActiveTab('return-capacity');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition"
                >
                  Inspect Return Load
                </button>
              )}
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Driver</span>
                <span className="text-white font-bold">{selectedVehicle.driverName}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Payload Capacity</span>
                <span className="font-mono text-white">{selectedVehicle.capacityKg} kg</span>
              </div>
              <CapacityBar
                percentage={selectedVehicle.currentCapacityPct}
                currentKg={selectedVehicle.currentLoadKg}
                totalKg={selectedVehicle.capacityKg}
              />
            </div>

            {selectedVehicle.compatibleReturnLoad && (
              <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs">
                <div className="font-bold text-cyan-300">Compatible Return Load Found</div>
                <div className="text-gray-300 mt-1">
                  {selectedVehicle.compatibleReturnLoad.supplierName} ({selectedVehicle.compatibleReturnLoad.weightKg} kg load, 2.8 km pickup deviation).
                </div>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
}
