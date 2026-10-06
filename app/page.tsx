'use client';

import React, { useState } from 'react';
import { generateSeedData } from '../simulation/seed';
import { formatINR } from '../lib/money';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'control-tower' | 'replenishment' | 'orders' | 'consolidation' | 'simulator'>('control-tower');
  const seed = generateSeedData('normal-day');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-14 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-lg text-white">
          <span className="text-blue-500">◆</span>
          <span>KiranaFlow</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
            Phase 1
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Bangalore B2B Distribution Hub &bull; Scenario: Normal Operations
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-60 border-r border-gray-800 bg-[#0d1322] p-4 flex flex-col justify-between">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Operations</div>
            <button
              onClick={() => setActiveTab('control-tower')}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === 'control-tower' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Control Tower
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === 'orders' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Order Workflow
            </button>
            <button
              onClick={() => setActiveTab('consolidation')}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === 'consolidation' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Consolidation
            </button>

            <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2 mt-4">Kirana Store</div>
            <button
              onClick={() => setActiveTab('replenishment')}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === 'replenishment' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Smart Replenishment
            </button>

            <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2 mt-4">Intelligence</div>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === 'simulator' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              What-if Simulator
            </button>
          </nav>

          <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
            Deterministic INR Minor Units<br />
            PostGIS Geometries
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'control-tower' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Network Control Tower</h1>
                <p className="text-sm text-gray-400">Live operational telemetry across Bangalore distribution network.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-lg">
                  <div className="text-xs uppercase text-gray-400 font-semibold">Active Stores</div>
                  <div className="text-2xl font-bold mt-1 text-white">{seed.stores.length}</div>
                  <div className="text-xs text-emerald-400 mt-1">4 Bangalore Clusters</div>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-lg">
                  <div className="text-xs uppercase text-gray-400 font-semibold">Suppliers</div>
                  <div className="text-2xl font-bold mt-1 text-white">{seed.suppliers.length}</div>
                  <div className="text-xs text-emerald-400 mt-1">94.2% Fill Rate Average</div>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-lg">
                  <div className="text-xs uppercase text-gray-400 font-semibold">Fleet Vehicles</div>
                  <div className="text-2xl font-bold mt-1 text-white">{seed.vehicles.length}</div>
                  <div className="text-xs text-amber-400 mt-1">76% Capacity Utilization</div>
                </div>
                <div className="bg-[#111827] border border-red-950/50 p-4 rounded-lg">
                  <div className="text-xs uppercase text-red-400 font-semibold">Stockout Exceptions</div>
                  <div className="text-2xl font-bold mt-1 text-red-400">1 Critical</div>
                  <div className="text-xs text-red-400/80 mt-1">Jayanagar Atta 10kg</div>
                </div>
              </div>

              {/* Topology Summary */}
              <div className="bg-[#111827] border border-gray-800 rounded-lg p-5">
                <h2 className="text-base font-bold text-white mb-3">Core Distribution Topologies</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-900/60 p-4 rounded border border-gray-800">
                    <h3 className="font-semibold text-blue-400 mb-2">Registered Kiranas</h3>
                    <ul className="space-y-2 text-gray-300">
                      {seed.stores.map((s) => (
                        <li key={s.id} className="flex justify-between">
                          <span>{s.name} ({s.city})</span>
                          <span className="text-xs font-mono text-gray-500">H3: {s.h3Cell.slice(0, 8)}...</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-900/60 p-4 rounded border border-gray-800">
                    <h3 className="font-semibold text-emerald-400 mb-2">Regional Suppliers</h3>
                    <ul className="space-y-2 text-gray-300">
                      {seed.suppliers.map((sup) => (
                        <li key={sup.id} className="flex justify-between">
                          <span>{sup.name}</span>
                          <span className="text-xs text-emerald-400 font-semibold">{sup.reliabilityScore}% Reliability</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'replenishment' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Smart Replenishment</h1>
                <p className="text-sm text-gray-400">Proactive inventory suggestions with deterministic reason codes.</p>
              </div>

              <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase border-b border-gray-800">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Supplier SKU</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {seed.supplierSkus.map((sku) => (
                      <tr key={sku.id} className="hover:bg-gray-800/30">
                        <td className="p-3 font-semibold text-white">{sku.supplierName}</td>
                        <td className="p-3 font-mono text-xs text-gray-400">{sku.supplierSkuCode}</td>
                        <td className="p-3">{sku.packDescription}</td>
                        <td className="p-3 font-semibold text-emerald-400">{formatINR(sku.pricePaise)}</td>
                        <td className="p-3 text-xs">{sku.leadTimeHours} hours</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Order Workflow</h1>
                <p className="text-sm text-gray-400">Strict state transition validation and transaction audit log.</p>
              </div>
              <div className="p-6 bg-[#111827] border border-gray-800 rounded-lg">
                <p className="text-sm text-gray-300">
                  Transaction lifecycle conforms to: <code>DRAFT &rarr; SUBMITTED &rarr; CONFIRMED &rarr; READY_FOR_DISPATCH &rarr; DISPATCHED &rarr; DELIVERED</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'consolidation' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Dynamic Consolidation</h1>
                <p className="text-sm text-gray-400">Grouping adjacent orders into single vehicle runs to minimize route deviations.</p>
              </div>
              <div className="p-6 bg-[#111827] border border-emerald-900/40 rounded-lg bg-emerald-950/10">
                <h2 className="text-base font-bold text-emerald-400 mb-2">Consolidation Candidate Detected</h2>
                <p className="text-sm text-gray-300">
                  East Bangalore corridor orders merged from 3 dispatches (44.6 km) down to 1 Tata Ace route (27.8 km), achieving <strong>28% fuel savings</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">What-if Simulator</h1>
                <p className="text-sm text-gray-400">Evaluate supply chain shocks in sandbox isolation.</p>
              </div>
              <div className="p-6 bg-[#111827] border border-purple-900/40 rounded-lg bg-purple-950/10">
                <h2 className="text-base font-bold text-purple-400 mb-2">Scenario: Peak Demand (+35%)</h2>
                <p className="text-sm text-gray-300">
                  Simulating festival surge across FMCG staples. Projected vehicle shortfall: 5 electric 3-wheelers required for morning dispatch window.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
