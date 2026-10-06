'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { MetricCard } from '../common/MetricCard';
import { NetworkMap } from '../map/NetworkMap';
import { StatusBadge } from '../common/StatusBadge';
import {
  Calendar,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  Truck,
  ShieldAlert,
  Fuel,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function ControlTowerView() {
  const {
    setActiveTab,
    exceptions,
    applyExceptionFix,
    setConsolidationState,
    setSelectedOrder,
    orders,
    vehicles,
    routes,
    setCopilotOpen,
    addToast,
  } = useLogistics();

  const handlePreviewException = (id: string) => {
    addToast('Exception Diagnostic', 'Calculated 22-min delay on R-124 caused by Old Airport Road congestion.', 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Network Control Tower
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time multi-echelon dispatch monitoring across Bangalore urban clusters.
          </p>
        </div>

        {/* Date Selector & Manual Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 text-xs text-gray-300">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium">Tuesday, Oct 6, 2026</span>
          </div>
          <button
            onClick={() => addToast('Synced Telemetry', 'Updated live GPS tracking & order queue.', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 9) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <MetricCard
          title="Orders"
          value="1,248"
          delta="↑ 8.4%"
          deltaPositive={true}
          period="Today"
          subtext="₹1.48M Gross Flow"
          variant="blue"
          onClick={() => setActiveTab('orders')}
        />
        <MetricCard
          title="Deliveries"
          value="842"
          delta="↑ 12.1%"
          deltaPositive={true}
          period="Completed"
          subtext="94.2% On-Time SLA"
          variant="green"
          onClick={() => setActiveTab('orders')}
        />
        <MetricCard
          title="Active Vehicles"
          value="72"
          delta="18 EV / 54 ICE"
          deltaPositive={true}
          period="En Route"
          subtext="3 Depots Active"
          variant="neutral"
          onClick={() => setActiveTab('logistics')}
        />
        <MetricCard
          title="At-Risk Orders"
          value="11"
          delta="3 Clusters"
          deltaPositive={false}
          period="Action Req"
          subtext="Projected SLA Breach"
          variant="red"
          onClick={() => setActiveTab('orders')}
        />
        <MetricCard
          title="Vehicle Utilization"
          value="76.4%"
          delta="↑ 4.2%"
          deltaPositive={true}
          period="Average Load"
          subtext="680 kg Avg Payload"
          variant="purple"
          onClick={() => setActiveTab('logistics')}
        />
      </div>

      {/* Primary Visual Surface: Live Network Map (Section 10) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Topology & Fleet Telemetry
            </h2>
            <span className="text-[11px] text-gray-500">
              (Click nodes to inspect stores, vehicles, or H3 zones)
            </span>
          </div>
          <button
            onClick={() => setActiveTab('network')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            Spatial Analysis <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <NetworkMap />
      </div>

      {/* Exceptions & AI Recommendations (Section 8, 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Exceptions Center */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active Exceptions
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {exceptions.filter((e) => !e.applied).length} Open
              </span>
            </div>

            <div className="divide-y divide-gray-800/60 mt-3 space-y-3">
              {exceptions.map((exc) => (
                <div key={exc.id} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          label={exc.category}
                          variant={exc.severity === 'CRITICAL' ? 'red' : 'amber'}
                          size="sm"
                        />
                        <span className="text-xs font-bold text-white">{exc.title}</span>
                      </div>
                      {exc.routeCode && (
                        <div className="text-[11px] font-mono text-blue-400 mt-1">
                          {exc.routeCode} &bull; {exc.affectedStoresCount} stores affected
                        </div>
                      )}
                      <div className="text-xs text-gray-300 mt-1.5">
                        <strong className="text-gray-400">Cause:</strong> {exc.cause}
                      </div>
                      <div className="text-xs text-amber-300/90 mt-0.5">
                        <strong className="text-amber-400/80">Impact:</strong> {exc.impact}
                      </div>
                      <div className="text-xs text-emerald-400 mt-1 font-medium">
                        <strong>Recommended:</strong> {exc.recommendedAction}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {exc.applied ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reassignment Applied
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handlePreviewException(exc.id)}
                          className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => applyExceptionFix(exc.id)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow"
                        >
                          Apply Action
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800/80 flex justify-between items-center text-xs text-gray-400">
            <span>Automated mitigation engine active</span>
            <span className="font-mono text-[11px]">SLA Buffer: 18m</span>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Operational Recommendations
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/50">
                Confidence: 94%
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {/* Recommendation 1: Consolidation */}
              <div className="p-3.5 rounded-lg bg-gray-900/80 border border-purple-900/30">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                    Consolidate 12 Orders into 4 Routes
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    -16.8 km (-28% fuel)
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  East Bangalore corridor (Indiranagar/Koramangala) has overlapping delivery windows. Grouping adjacent orders frees up 4 vehicles.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setActiveTab('consolidation');
                      setConsolidationState('preview');
                    }}
                    className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition shadow flex items-center gap-1"
                  >
                    <span>Review Consolidation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Recommendation 2: Return Capacity */}
              <div className="p-3.5 rounded-lg bg-gray-900/80 border border-blue-900/30">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    Backhaul Return Capacity on Vehicle V-027
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                    +38% Return Space
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  V-027 will complete Jayanagar drops with 38% empty payload. Compatible 340 kg return load ready at Delta East Hub (+4.1 km deviation).
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setActiveTab('return-capacity')}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow flex items-center gap-1"
                  >
                    <span>Inspect Return Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800/80 flex justify-between items-center text-xs">
            <span className="text-gray-400">Want deeper operational explanations?</span>
            <button
              onClick={() => setCopilotOpen(true)}
              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              Ask AI Copilot <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Network Activity & Route Status Feed (Section 8 bottom) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Network Dispatch Activity & Route Status
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('logistics')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            View All Routes &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {routes.map((rt) => (
            <div
              key={rt.id}
              onClick={() => setActiveTab('logistics')}
              className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 hover:border-gray-700 cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{rt.code}</span>
                <StatusBadge
                  label={rt.status}
                  variant={rt.status === 'DELAYED' ? 'red' : 'green'}
                  size="sm"
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Vehicle: <span className="text-white font-mono">{rt.vehicleCode}</span> &bull; {rt.stops} stops &bull; {rt.distanceKm} km
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 font-mono">
                <span>Load: {rt.capacityPct}%</span>
                <span className="text-emerald-400">ETA: {rt.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
