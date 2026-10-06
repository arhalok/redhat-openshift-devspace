'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Truck,
  Warehouse,
  CheckCircle2,
} from 'lucide-react';

export function WhatIfSimulatorView() {
  const { addToast } = useLogistics();

  // Left panel scenario parameters
  const [demandSurge, setDemandSurge] = useState(25); // +25%
  const [vehicleCapacityChange, setVehicleCapacityChange] = useState(-10); // -10%
  const [warehouseBEnabled, setWarehouseBEnabled] = useState(false); // Warehouse B OFF
  const [slaTarget, setSlaTarget] = useState<'2h' | '4h' | 'sameday'>('4h');
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic calculations based on parameters
  const vehiclesNeeded = Math.round(
    Math.max(0, (demandSurge / 10) * 2 - (vehicleCapacityChange / 10) * 1.5 + (warehouseBEnabled ? -3 : 4))
  );

  const slaRisks = Math.round(
    Math.max(0, (demandSurge > 15 ? 8 : 2) + (!warehouseBEnabled ? 5 : 0) + (vehicleCapacityChange < 0 ? 4 : 0))
  );

  const costImpactPaise = Math.round(
    (demandSurge * 520 + Math.abs(vehicleCapacityChange) * 310 + (!warehouseBEnabled ? 4500 : 0)) * 100
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      addToast('Scenario Simulation Complete', 'Stress test results updated across routing heuristics.', 'info');
    }, 500);
  };

  const handleReset = () => {
    setDemandSurge(25);
    setVehicleCapacityChange(-10);
    setWarehouseBEnabled(false);
    setSlaTarget('4h');
    addToast('Simulation Reset', 'Parameters restored to baseline benchmark.', 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              What-If Supply Chain Simulator
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              SANDBOX STRESS TESTING
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Simulate volatile demand spikes, fleet capacity deficits, and warehouse outages in safe isolation.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 text-xs text-gray-300 font-medium transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Split Layout (Section 26: SCENARIO vs RESULT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-800 text-sm font-bold text-white uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Scenario Parameters</span>
            </div>

            <div className="space-y-5 mt-5">
              {/* Slider 1: Demand Surge */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-gray-200">Customer Demand Surge</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {demandSurge >= 0 ? `+${demandSurge}%` : `${demandSurge}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="80"
                  step="5"
                  value={demandSurge}
                  onChange={(e) => setDemandSurge(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                  <span>-20% Slump</span>
                  <span>Normal (0%)</span>
                  <span>+80% Surge</span>
                </div>
              </div>

              {/* Slider 2: Fleet Availability */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-gray-200">Vehicle Fleet Availability</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {vehicleCapacityChange >= 0 ? `+${vehicleCapacityChange}%` : `${vehicleCapacityChange}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="20"
                  step="5"
                  value={vehicleCapacityChange}
                  onChange={(e) => setVehicleCapacityChange(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                  <span>-30% Shortage</span>
                  <span>Baseline</span>
                  <span>+20% Surge</span>
                </div>
              </div>

              {/* Toggle: Warehouse B Status */}
              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">South Fulfillment Hub (Warehouse B)</div>
                    <div className="text-[11px] text-gray-400">Electronic City Distribution Depot</div>
                  </div>
                  <button
                    onClick={() => setWarehouseBEnabled(!warehouseBEnabled)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                      warehouseBEnabled
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                    }`}
                  >
                    {warehouseBEnabled ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </div>
              </div>

              {/* Selector: SLA Window */}
              <div className="pt-2 border-t border-gray-800">
                <span className="text-xs font-semibold text-gray-200 mb-2 block">
                  Delivery SLA Target Window
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['2h', '4h', 'sameday'] as const).map((sla) => (
                    <button
                      key={sla}
                      onClick={() => setSlaTarget(sla)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition ${
                        slaTarget === sla
                          ? 'bg-blue-600/30 text-blue-300 border-blue-500 font-bold'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {sla === '2h' ? '2h Express' : sla === '4h' ? '4h Standard' : 'Same-Day'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-xs font-bold text-white transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isSimulating ? 'Recalculating Network...' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Right: Results Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Simulated Network Impact</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                MONTE CARLO PROJECTION
              </span>
            </div>

            {/* Results Grid (Section 26) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[11px] font-semibold text-gray-400 uppercase">Vehicles Needed</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  +{vehiclesNeeded}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">Shortfall in morning dispatch</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[11px] font-semibold text-gray-400 uppercase">SLA Breach Risks</div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                  {slaRisks} orders
                </div>
                <div className="text-[11px] text-gray-500 mt-1">Projected late delivery count</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[11px] font-semibold text-gray-400 uppercase">Cost Impact</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  +₹{(costImpactPaise / 100).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">Fleet overtime & rerouting</div>
              </div>
            </div>

            {/* Operational Recommendation Box (Section 26) */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/30 border border-purple-800/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Operational Recommendation
              </span>
              <div className="text-sm font-bold text-white mt-1">
                Reallocate 2 Tata Ace vehicles from West corridor to East corridor.
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Under the simulated +{demandSurge}% surge and South Hub outage, transferring 2 vehicles from Malleshwaram prevents 11 of the 13 projected SLA failures and saves ₹8,400 in emergency contractor premiums.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              onClick={() => addToast('Mitigation Strategy Staged', 'Dispatched rebalancing order to fleet controller.', 'success')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Reallocation Strategy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
