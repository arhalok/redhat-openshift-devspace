'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { NetworkMap } from '../map/NetworkMap';
import { H3_AREA_INSIGHTS, H3AreaInsight } from '../../lib/demo-data';
import { Drawer } from '../common/Drawer';
import {
  Globe2,
  TrendingUp,
  AlertTriangle,
  Layers,
  Store,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function NetworkInsightsView() {
  const { selectedH3Insight, setSelectedH3Insight, setActiveTab } = useLogistics();

  const [activeLayer, setActiveLayer] = useState<
    'demand' | 'supply' | 'delivery' | 'capacity' | 'risk'
  >('demand');

  const defaultInsight = selectedH3Insight || H3_AREA_INSIGHTS['88618925d3fffff'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Network Spatial Insights
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
              H3 DISCRETE SPATIAL GRID
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Geographic density metrics, cluster demand velocity, and localized stockout vulnerabilities.
          </p>
        </div>

        {/* Analytical Layers Switcher (Section 24) */}
        <div className="flex items-center gap-1.5 bg-gray-900 p-1 rounded-lg border border-gray-800 text-xs">
          <button
            onClick={() => setActiveLayer('demand')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeLayer === 'demand'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Demand Density
          </button>
          <button
            onClick={() => setActiveLayer('supply')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeLayer === 'supply'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Supply Density
          </button>
          <button
            onClick={() => setActiveLayer('delivery')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeLayer === 'delivery'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Delivery Density
          </button>
          <button
            onClick={() => setActiveLayer('capacity')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeLayer === 'capacity'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Vehicle Capacity
          </button>
          <button
            onClick={() => setActiveLayer('risk')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeLayer === 'risk'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Risk Zones
          </button>
        </div>
      </div>

      {/* Main Grid: Left Map, Right H3 Area Insight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <NetworkMap />
        </div>

        {/* Area Insight Card (Section 25) */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Spatial Cluster Diagnostic
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                H3: {defaultInsight.h3Index.slice(0, 10)}...
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mt-2">
              {defaultInsight.locality}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Hexagonal catchment zone encompassing urban kirana density.
            </p>

            {/* Core Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-sans font-semibold">
                  Active Kiranas
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {defaultInsight.storesCount} stores
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-sans font-semibold">
                  Daily Orders
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {defaultInsight.dailyOrdersCount} orders
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-sans font-semibold">
                  Demand Trend
                </span>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  ↑ {defaultInsight.demandTrendPct}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900 border border-red-950/60 bg-red-950/20">
                <span className="text-[10px] text-red-400 uppercase font-sans font-semibold">
                  Stockout Risk
                </span>
                <div className="text-lg font-bold text-red-400 mt-1">
                  {defaultInsight.stockoutRiskStores} stores
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Top Demand Categories:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {defaultInsight.topCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-gray-900 text-gray-300 text-xs border border-gray-800"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-5 p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Operational Action
              </div>
              <p className="text-gray-300 mt-1 leading-relaxed">
                {defaultInsight.recommendedAction}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-800 flex justify-end">
            <button
              onClick={() => setActiveTab('stores')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow"
            >
              Inspect Cluster Stores &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
