'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { Sparkles, ArrowRight, CheckCircle2, X, Compass, ChevronRight } from 'lucide-react';

export function GoldenJourneyBar() {
  const {
    goldenJourneyActive,
    goldenJourneyStep,
    startGoldenJourney,
    advanceGoldenJourney,
    stopGoldenJourney,
    setActiveTab,
  } = useLogistics();

  const steps = [
    {
      step: 1,
      title: 'Control Tower Alert',
      summary: 'Critical stockout detected at Laxmi Retail (Jayanagar).',
      targetTab: 'overview',
      actionText: 'Review Recommendation',
    },
    {
      step: 2,
      title: 'Smart Replenishment',
      summary: 'Explainable AI forecasts 1.4 days coverage. Compare suppliers.',
      targetTab: 'stores',
      actionText: 'Compare Suppliers',
    },
    {
      step: 3,
      title: 'Supplier Intelligence',
      summary: 'Evaluate trade-offs: Best Overall vs Cheapest vs Fastest.',
      targetTab: 'suppliers',
      actionText: 'Create Order & Check Bundling',
    },
    {
      step: 4,
      title: 'Dynamic Consolidation',
      summary: '12 nearby East Bangalore orders identified. 16.8 km fuel reduction.',
      targetTab: 'consolidation',
      actionText: 'Inspect Consolidated Routes',
    },
    {
      step: 5,
      title: 'Logistics VRPTW Solver',
      summary: 'Optimize 61 vehicle schedules. Fleet reduction: -11 vehicles.',
      targetTab: 'logistics',
      actionText: 'Check Backhaul Returns',
    },
    {
      step: 6,
      title: 'Return Capacity Backhaul',
      summary: 'Vehicle V-027 returning with 38% empty space. Match Delta packaging.',
      targetTab: 'return-capacity',
      actionText: 'Simulate Demand Surge',
    },
    {
      step: 7,
      title: 'What-If Stress Simulator',
      summary: 'Simulate +20% festive surge & fleet availability deficit in isolation.',
      targetTab: 'simulator',
      actionText: 'Consult AI Operations Copilot',
    },
    {
      step: 8,
      title: 'AI Copilot Resolution',
      summary: 'Ask AI Copilot to synthesize and authorize vehicle rebalancing with safety checks.',
      targetTab: 'copilot',
      actionText: 'Complete Golden Journey',
    },
  ];

  if (!goldenJourneyActive) {
    return (
      <div className="bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-indigo-950/60 border border-blue-800/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-white">Golden UX Journey Walkthrough</span>
            <span className="text-gray-400 ml-2 hidden sm:inline">
              Experience the 8-step intelligent logistics narrative from stockout alert to AI mitigation.
            </span>
          </div>
        </div>
        <button
          onClick={startGoldenJourney}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow flex items-center gap-1.5 shrink-0"
        >
          <span>Start Walkthrough</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const current = steps[goldenJourneyStep - 1] || steps[0];

  return (
    <div className="bg-[#0f172a] border-2 border-purple-500/60 rounded-xl p-3.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black flex items-center justify-center font-mono text-xs shadow">
            {current.step}/8
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                Golden Journey Step {current.step}: {current.title}
              </span>
            </div>
            <div className="text-xs text-white font-medium mt-0.5">{current.summary}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={stopGoldenJourney}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            title="Exit Walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={advanceGoldenJourney}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>{current.actionText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
