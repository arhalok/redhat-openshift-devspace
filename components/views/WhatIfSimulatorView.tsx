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
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

export function WhatIfSimulatorView() {
  const { addToast, setActiveTab, setConsolidationState } = useLogistics();

  // Left panel scenario parameters (Section 24.1)
  const [demandSurge, setDemandSurge] = useState(20); // +20%
  const [vehicleShortage, setVehicleShortage] = useState(-2); // -2 vehicles
  const [supplierAvailability, setSupplierAvailability] = useState<'normal' | 'delayed' | 'critical'>('normal');
  const [selectedWarehouse, setSelectedWarehouse] = useState<'all' | 'central' | 'south'>('all');
  const [isSimulating, setIsSimulating] = useState(false);
  const [confirmApplyModalOpen, setConfirmApplyModalOpen] = useState(false);

  // Dynamic calculations based on parameters (Section 24.2)
  const ordersAffected = Math.round(18 + (demandSurge / 5) * 2);
  const vehiclesRequired = Math.max(1, Math.round(2 + (demandSurge > 15 ? 1 : 0) + Math.abs(vehicleShortage)));
  const avgEtaIncreaseMin = Math.round(14 + (demandSurge / 4) + (supplierAvailability === 'delayed' ? 12 : 0));
  const capacityUtilizationPct = Math.min(98, Math.round(76 + (demandSurge / 2) + Math.abs(vehicleShortage) * 3));
  const atRiskDeliveries = Math.round(
    Math.max(1, (demandSurge > 15 ? 4 : 1) + (supplierAvailability !== 'normal' ? 3 : 0))
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      addToast('Simulation Complete', 'Monte Carlo network impact projection updated.', 'info');
    }, 400);
  };

  const handleReset = () => {
    setDemandSurge(20);
    setVehicleShortage(-2);
    setSupplierAvailability('normal');
    setSelectedWarehouse('all');
    addToast('Simulation Reset', 'Parameters restored to benchmark scenario.', 'info');
  };

  const handleCreateProposedPlan = () => {
    setConfirmApplyModalOpen(false);
    setConsolidationState('preview');
    addToast(
      'Proposed Operational Plan Created',
      'Mitigation plan staged for audit review. Ready to consolidate routes & activate return legs.',
      'success'
    );
    setActiveTab('consolidation');
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

      {/* Simulator Safety Banner (Section 25) */}
      <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-semibold text-white">SIMULATION ENVIRONMENT</span>
          <span className="text-gray-400">— No live operational data will be changed.</span>
        </div>
        <span className="text-[11px] font-mono text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded">
          Safe Sandbox
        </span>
      </div>

      {/* Main Split Layout: Controls vs Results (Section 24) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Panel (Section 24.1) */}
        <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-800 text-sm font-bold text-white uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>What If Scenario Controls</span>
            </div>

            <div className="space-y-5 mt-5">
              {/* Slider 1: Demand */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-gray-200">Demand Fluctuation</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {demandSurge >= 0 ? `+${demandSurge}%` : `${demandSurge}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="60"
                  step="5"
                  value={demandSurge}
                  onChange={(e) => setDemandSurge(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                  <span>-20% Slump</span>
                  <span>Normal (0%)</span>
                  <span>+60% Surge</span>
                </div>
              </div>

              {/* Slider 2: Fleet Vehicles */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-gray-200">Available Fleet Capacity</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {vehicleShortage >= 0 ? `+${vehicleShortage} vehicles` : `${vehicleShortage} vehicles`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="4"
                  step="1"
                  value={vehicleShortage}
                  onChange={(e) => setVehicleShortage(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                  <span>-6 Deficit</span>
                  <span>Baseline</span>
                  <span>+4 Surplus</span>
                </div>
              </div>

              {/* Dropdown: Supplier Availability */}
              <div>
                <label className="text-xs font-semibold text-gray-200 block mb-1.5">
                  Supplier Fulfillment Availability
                </label>
                <select
                  value={supplierAvailability}
                  onChange={(e) => setSupplierAvailability(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
                >
                  <option value="normal">Normal (96% Fill Rate, Standard SLA)</option>
                  <option value="delayed">Delayed (+24h Cold Chain Bottleneck)</option>
                  <option value="critical">Critical Supply Shortage (-35% Stock)</option>
                </select>
              </div>

              {/* Dropdown: Warehouse / Hub */}
              <div>
                <label className="text-xs font-semibold text-gray-200 block mb-1.5">
                  Fulfillment Depot Corridor
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Depots (Yeshwanthpur + E-City + Whitefield)</option>
                  <option value="central">North Bangalore Central Depot Only</option>
                  <option value="south">South Bangalore E-City Hub Only</option>
                </select>
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
              <span>{isSimulating ? 'Recalculating Impact...' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Right: Network Impact & Mitigation (Section 24.2) */}
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

            {/* Results Grid (Section 24.2) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 mt-5 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[10px] font-semibold text-gray-400 uppercase">Orders Affected</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {ordersAffected}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Demanding delivery slots</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[10px] font-semibold text-gray-400 uppercase">Vehicles Required</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  +{vehiclesRequired}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Additional trips needed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[10px] font-semibold text-gray-400 uppercase">Average ETA Drift</div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                  +{avgEtaIncreaseMin} min
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Traffic & staging lag</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[10px] font-semibold text-gray-400 uppercase">Capacity Utilization</div>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                  {capacityUtilizationPct}%
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Payload envelope stress</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 col-span-2 md:col-span-1">
                <div className="text-[10px] font-semibold text-gray-400 uppercase">At-Risk Deliveries</div>
                <div className="text-2xl font-bold font-mono text-red-400 mt-1">
                  {atRiskDeliveries}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Potential SLA breaches</div>
              </div>
            </div>

            {/* Recommended Response Box (Section 24.2) */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/30 border border-purple-800/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                RECOMMENDED OPERATIONAL RESPONSE
              </span>
              <div className="text-sm font-bold text-white mt-1">
                Activate return capacity + consolidate nearby orders
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                By grouping 12 adjacent Indiranagar orders and deploying backhaul return space on vehicle V-027, the network absorbs the +{demandSurge}% surge while preventing all {atRiskDeliveries} at-risk SLA breaches.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              onClick={() => setConfirmApplyModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Safety Confirmation Modal (Section 25) */}
      {confirmApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmApplyModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Create Proposed Operational Plan
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Section 25: This will create a proposed operational plan derived from this simulation. No live operational dispatches will be modified until you review the consolidated routes.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmApplyModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProposedPlan}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow"
              >
                Create Proposed Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
