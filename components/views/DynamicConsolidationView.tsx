'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { NetworkMap } from '../map/NetworkMap';
import {
  PackageCheck,
  TrendingDown,
  Fuel,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Layers,
} from 'lucide-react';

export function DynamicConsolidationView() {
  const {
    consolidationState,
    setConsolidationState,
    applyConsolidation,
    setActiveTab,
  } = useLogistics();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dynamic Network Consolidation
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            DISPATCH BATCHING ENGINE
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Cluster adjacent deliveries into consolidated vehicle runs to eliminate redundant dispatch legs.
        </p>
      </div>

      {/* Main Consolidation Banner Card (Section 20) */}
      <div className="bg-[#111827] border border-emerald-900/50 rounded-xl p-6 shadow-xl relative overflow-hidden bg-emerald-950/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Consolidation Opportunity Detected
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                12 Nearby Orders in East Bangalore Corridor
              </h2>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                Orders across Indiranagar, Domlur, and Koramangala share overlapping 10:00–14:00 time windows and fit combined payload weight constraints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {consolidationState === 'idle' && (
              <button
                onClick={() => setConsolidationState('preview')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <span>Preview Consolidation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {consolidationState === 'preview' && (
              <button
                onClick={applyConsolidation}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Consolidation</span>
              </button>
            )}
            {consolidationState === 'applied' && (
              <div className="px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Consolidated Routes Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Current vs Potential Stats (Section 20: BEFORE -> AFTER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-800">
          {/* Current */}
          <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Current Dispatch Plan (Before)
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold font-mono text-white">12</span>
              <span className="text-xs text-gray-400">Individual delivery trips</span>
            </div>
            <div className="text-xs text-gray-300 mt-1 font-mono">
              Total Distance: <strong className="text-rose-400 font-bold">48.0 km</strong> across 6 vehicles
            </div>
          </div>

          {/* Potential */}
          <div className="p-4 rounded-xl bg-gray-900 border border-emerald-900/60 bg-emerald-950/20">
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Potential Consolidated Plan (After)
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">4</span>
              <span className="text-xs text-gray-300">Optimized multi-drop routes</span>
            </div>
            <div className="text-xs text-emerald-300 mt-1 font-mono">
              Total Distance: <strong className="text-white font-bold">31.2 km</strong> (-16.8 km &bull; 28% fuel saved)
            </div>
          </div>
        </div>
      </div>

      {/* Visual Map Representation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Spatial Route Consolidation Overlay
          </h3>
          <span className="text-xs text-gray-400">
            {consolidationState === 'applied' ? 'Showing consolidated loops' : 'Showing unbundled dispatches'}
          </span>
        </div>
        <NetworkMap />
      </div>

      {/* Participating Orders List */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          Participating Delivery Orders in Cluster (12 Orders)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
            <div className="font-bold text-white">ORD-10284 &bull; Sharma General Store</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Indiranagar &bull; 12 products (310 kg)</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">Assigned to Route R-124</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
            <div className="font-bold text-white">ORD-10285 &bull; Venkateshwara Super Traders</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Koramangala &bull; 8 products (240 kg)</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">Assigned to Route R-124</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
            <div className="font-bold text-white">ORD-10286 &bull; Laxmi Retail Provisions</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Jayanagar &bull; 5 products (180 kg)</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">Assigned to Route R-124</div>
          </div>
        </div>
      </div>
    </div>
  );
}
