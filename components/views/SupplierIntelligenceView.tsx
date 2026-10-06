'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { BANGALORE_SUPPLIERS, SupplierNode } from '../../lib/demo-data';
import { StatusBadge } from '../common/StatusBadge';
import {
  Factory,
  ShieldCheck,
  Clock,
  Truck,
  Star,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ChevronRight,
  Filter,
  ShoppingCart,
  AlertTriangle,
  Info,
} from 'lucide-react';

export function SupplierIntelligenceView() {
  const { setOrderCreationModalOpen, setActiveTab } = useLogistics();
  const [selectedProduct, setSelectedProduct] = useState<'atta' | 'oil' | 'salt'>('atta');

  const comparisonData = {
    atta: {
      productName: 'Aashirvaad Superior Shudh Chakki Atta 10kg',
      options: [
        {
          id: 'sup-a-apex',
          name: 'Apex FMCG Distribution Hub',
          badge: 'Best Overall',
          price: '₹445',
          delivery: '18 hours',
          reliability: '96%',
          fillRate: '97%',
          moq: '5 bags',
          tradeoff: 'Fastest ETA (18h) + highest verified fill-rate',
        },
        {
          id: 'sup-c-mysore',
          name: 'Mysore Grain Syndicate',
          badge: 'Cheapest',
          price: '₹438',
          delivery: '+2 days',
          reliability: '88%',
          fillRate: '91%',
          moq: '25 bags',
          tradeoff: 'Lowest unit price, but 2-day delivery window and 88% reliability',
        },
        {
          id: 'sup-b-kaveri',
          name: 'Kaveri Valley Direct Express',
          badge: 'Fastest',
          price: '₹460',
          delivery: '4 hours',
          reliability: '98%',
          fillRate: '99%',
          moq: '10 bags',
          tradeoff: 'Same-day express dispatch at premium freight rate',
        },
      ],
      recommendation: {
        winner: 'Apex FMCG Distribution Hub',
        reason: 'Optimal operational trade-off: ₹445 price point, 18h turnaround, and 96% fulfillment reliability.',
      },
    },
    oil: {
      productName: 'Fortune Sunlite Refined Sunflower Oil 1L Pouch',
      options: [
        {
          id: 'sup-a-apex',
          name: 'Apex FMCG Distribution Hub',
          badge: 'Best Overall',
          price: '₹118',
          delivery: '1 day',
          reliability: '96%',
          fillRate: '98%',
          moq: '12 units',
          tradeoff: 'Lowest net landed cost with bundled freight discount',
        },
        {
          id: 'sup-c-mysore',
          name: 'Mysore Grain Syndicate',
          badge: 'Cheapest',
          price: '₹116',
          delivery: '2 days',
          reliability: '89%',
          fillRate: '92%',
          moq: '48 units',
          tradeoff: '₹2 cheaper/unit, but high MOQ (48 units) strains kirana working capital',
        },
        {
          id: 'sup-d-delta',
          name: 'Delta FMCG Wholesalers',
          badge: 'Fastest',
          price: '₹122',
          delivery: 'Same day',
          reliability: '94%',
          fillRate: '96%',
          moq: '24 units',
          tradeoff: 'Rapid staging from East Bangalore warehouse',
        },
      ],
      recommendation: {
        winner: 'Apex FMCG Distribution Hub',
        reason: 'Best overall: Accessible MOQ (12), ₹118 price, and 98% verified delivery reliability.',
      },
    },
    salt: {
      productName: 'Tata Salt Vacuum Evaporated Iodized 1kg',
      options: [
        {
          id: 'sup-c-mysore',
          name: 'Mysore Grain Syndicate',
          badge: 'Best Overall',
          price: '₹24.00',
          delivery: '1 day',
          reliability: '96%',
          fillRate: '98%',
          moq: '20 units',
          tradeoff: 'Lowest wholesale rate + 98% consistency',
        },
        {
          id: 'sup-a-apex',
          name: 'Apex FMCG Distribution Hub',
          badge: 'Cheapest',
          price: '₹24.50',
          delivery: '1 day',
          reliability: '94%',
          fillRate: '95%',
          moq: '50 units',
          tradeoff: 'Slightly higher price & larger minimum order',
        },
      ],
      recommendation: {
        winner: 'Mysore Grain Syndicate',
        reason: 'Lowest wholesale price, accessible MOQ (20), and 98% consistent delivery fulfillment.',
      },
    },
  };

  const activeCompare = comparisonData[selectedProduct];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Supplier Intelligence
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            VENDOR PERFORMANCE INDEX
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Algorithmic vendor ranking factoring reliability, fill rates, geographic distance, and SKU-level SLAs.
        </p>
      </div>

      {/* Core Principle Banner (Section 13: Cheapest ≠ Best) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-blue-950/40 border border-indigo-800/40 text-xs flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Core Principle: Cheapest &ne; Best</div>
            <p className="text-gray-300 mt-0.5 leading-relaxed">
              Our sourcing engine scores suppliers using a composite index: <strong>Reliability (40%)</strong>, <strong>Lead Time (30%)</strong>, and <strong>Price (30%)</strong>. A cheaper supplier with lower fill rate frequently causes downstream stockouts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOrderCreationModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow flex items-center gap-1.5 shrink-0"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>New Sourcing Order</span>
        </button>
      </div>

      {/* Supplier Comparison Tool (Section 13) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Trade-Off Decision Matrix
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Multi-Supplier SKU Sourcing Comparison
            </h2>
          </div>

          {/* Product selector buttons */}
          <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setSelectedProduct('atta')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                selectedProduct === 'atta'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Atta 10kg
            </button>
            <button
              onClick={() => setSelectedProduct('oil')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                selectedProduct === 'oil'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Cooking Oil 1L
            </button>
            <button
              onClick={() => setSelectedProduct('salt')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                selectedProduct === 'salt'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tata Salt 1kg
            </button>
          </div>
        </div>

        {/* Selected Product Title */}
        <div className="mt-4 text-xs text-gray-400">
          Comparing quotes for:{' '}
          <span className="font-bold text-white text-sm">{activeCompare.productName}</span>
        </div>

        {/* Side-by-Side Comparison Table (Section 13) */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-800 rounded-lg">
            <thead className="bg-[#0b0f19] text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 border-r border-gray-800">Supplier</th>
                <th className="p-3">Cost</th>
                <th className="p-3">ETA</th>
                <th className="p-3">Reliability</th>
                <th className="p-3">Fill Rate</th>
                <th className="p-3">Recommendation</th>
                <th className="p-3">Trade-Off Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {activeCompare.options.map((opt) => (
                <tr
                  key={opt.id}
                  className={`transition ${
                    opt.badge === 'Best Overall' ? 'bg-purple-950/20 font-semibold' : 'hover:bg-gray-800/30'
                  }`}
                >
                  <td className="p-3 font-bold border-r border-gray-800 text-white">
                    {opt.name}
                  </td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">{opt.price}</td>
                  <td className="p-3 text-gray-300 font-mono">{opt.delivery}</td>
                  <td className="p-3 font-mono text-emerald-400">{opt.reliability}</td>
                  <td className="p-3 font-mono text-blue-400">{opt.fillRate}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        opt.badge === 'Best Overall'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : opt.badge === 'Cheapest'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300 text-[11px]">{opt.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendation Box (Section 13) */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-800/40 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                BEST OVERALL SOURCING CHOICE
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {activeCompare.recommendation.winner}
              </div>
              <p className="text-xs text-gray-300 mt-1">
                <strong>Operational Rationale:</strong> {activeCompare.recommendation.reason}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOrderCreationModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow flex items-center gap-1.5 shrink-0"
          >
            <span>Select & Order</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BANGALORE_SUPPLIERS.map((sup) => (
          <div
            key={sup.id}
            className="bg-[#111827] border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex flex-col justify-between transition shadow-md group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                    {sup.name}
                  </h3>
                  <div className="text-[11px] text-gray-400 mt-0.5">{sup.category}</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-amber-400 shrink-0">
                  <Factory className="w-4 h-4" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-2 rounded-md bg-gray-900/60 border border-gray-800/80">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Reliability</div>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                    {sup.reliabilityScore}%
                  </div>
                </div>
                <div className="p-2 rounded-md bg-gray-900/60 border border-gray-800/80">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Fill Rate</div>
                  <div className="font-mono font-bold text-blue-400 text-sm mt-0.5">
                    {sup.fillRate}%
                  </div>
                </div>
                <div className="p-2 rounded-md bg-gray-900/60 border border-gray-800/80">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Avg Lead Time</div>
                  <div className="font-mono font-bold text-gray-200 text-sm mt-0.5">
                    {sup.avgLeadTimeHours}h
                  </div>
                </div>
                <div className="p-2 rounded-md bg-gray-900/60 border border-gray-800/80">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Distance</div>
                  <div className="font-mono font-bold text-gray-200 text-sm mt-0.5">
                    {sup.distanceKm} km
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono text-[11px]">
                {sup.activeOrdersCount} active dispatches
              </span>
              <button
                onClick={() => setOrderCreationModalOpen(true)}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Order Direct</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
