'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { CapacityBar } from '../common/CapacityBar';
import {
  Undo2,
  Truck,
  ArrowRight,
  CheckCircle2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export function ReturnCapacityView() {
  const {
    returnLoadState,
    setReturnLoadState,
    applyReturnLoad,
    vehicles,
    setActiveTab,
  } = useLogistics();

  const vehicleV27 = vehicles.find((v) => v.code === 'V-027') || vehicles[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Return Capacity Matching (Backhaul)
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            EMPTY LEG MONETIZATION
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Detect unused vehicle capacity on return routes to pick up supplier returns and packaging materials.
        </p>
      </div>

      {/* Main Vehicle Return Load Card (Section 23) */}
      <div className="bg-[#111827] border border-cyan-900/50 rounded-xl p-6 shadow-xl bg-cyan-950/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Undo2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Decision Support Suggestion
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Vehicle {vehicleV27.code} — Backhaul Optimization
              </h2>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                Vehicle will complete outbound deliveries in Jayanagar with 38% empty payload. A compatible packaging return shipment is waiting along the return corridor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {returnLoadState === 'idle' && (
              <button
                onClick={() => setReturnLoadState('preview')}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition shadow-lg shadow-cyan-600/30 flex items-center gap-2"
              >
                <span>Preview Return Load</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {returnLoadState === 'preview' && (
              <button
                onClick={applyReturnLoad}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add Return Load</span>
              </button>
            )}
            {returnLoadState === 'applied' && (
              <div className="px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Return Shipment Assigned (91% Utilization)</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Metrics vs Return Opportunity (Section 23) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 pt-5 border-t border-gray-800">
          {/* Current State */}
          <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Current Outbound Run
            </div>
            <div className="mt-3">
              <CapacityBar
                percentage={returnLoadState === 'applied' ? 91 : vehicleV27.currentCapacityPct}
                currentKg={returnLoadState === 'applied' ? 455 : vehicleV27.currentLoadKg}
                totalKg={vehicleV27.capacityKg}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded bg-gray-950/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase">Utilized</span>
                <div className="text-white font-bold text-sm mt-0.5">
                  {returnLoadState === 'applied' ? '91%' : '62%'}
                </div>
              </div>
              <div className="p-2.5 rounded bg-gray-950/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase">Unused Backhaul</span>
                <div className="text-cyan-400 font-bold text-sm mt-0.5">
                  {returnLoadState === 'applied' ? '9%' : '38%'} (190 kg)
                </div>
              </div>
            </div>
          </div>

          {/* Compatible Load Found */}
          <div className="p-4 rounded-xl bg-gray-900 border border-cyan-900/60 bg-cyan-950/20">
            <div className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Compatible Load Discovered
            </div>
            <div className="text-sm font-bold text-white mt-2">
              Delta Beverage & FMCG Wholesalers (Supplier Delta)
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Empty crate & secondary packaging backhaul to Central Depot.
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
              <div className="p-2 rounded bg-gray-950/60 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-500 uppercase">Pickup Dist</span>
                <div className="text-white font-bold mt-0.5">2.8 km</div>
              </div>
              <div className="p-2 rounded bg-gray-950/60 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-500 uppercase">Weight</span>
                <div className="text-white font-bold mt-0.5">340 kg</div>
              </div>
              <div className="p-2 rounded bg-gray-950/60 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-500 uppercase">Recovery</span>
                <div className="text-emerald-400 font-bold mt-0.5">₹1,850</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Impact Delta (Section 23: After preview) */}
        {(returnLoadState === 'preview' || returnLoadState === 'applied') && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Impact Analysis Summary:</div>
                <div className="text-gray-300 mt-0.5">
                  Additional distance:{' '}
                  <strong className="text-white font-mono">+4.1 km</strong> &bull; Estimated capacity utilization:{' '}
                  <strong className="text-emerald-400 font-mono">62% &rarr; 91%</strong> &bull; Carbon efficiency: +24%
                </div>
              </div>
            </div>

            {returnLoadState === 'preview' && (
              <button
                onClick={applyReturnLoad}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow"
              >
                Confirm & Add Return Load
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
