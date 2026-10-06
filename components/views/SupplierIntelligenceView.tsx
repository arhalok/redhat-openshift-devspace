'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export function SupplierIntelligenceView() {
  const [selectedProduct, setSelectedProduct] = useState<'oil' | 'atta' | 'salt'>('oil');

  const comparisonData = {
    oil: {
      productName: 'Fortune Sunlite Refined Sunflower Oil 1L',
      options: [
        {
          id: 'sup-a-apex',
          name: 'Apex FMCG Hub',
          isBest: false,
          price: '₹120',
          delivery: '2 days',
          reliability: '91%',
          fillRate: '94%',
          moq: '24 units',
        },
        {
          id: 'sup-b-kaveri',
          name: 'Kaveri Valley Direct ⭐',
          isBest: true,
          price: '₹118',
          delivery: '1 day',
          reliability: '96%',
          fillRate: '98%',
          moq: '12 units',
        },
        {
          id: 'sup-c-mysore',
          name: 'Mysore Syndicate',
          isBest: false,
          price: '₹121',
          delivery: 'Today (Express)',
          reliability: '88%',
          fillRate: '92%',
          moq: '48 units',
        },
      ],
      recommendation: {
        winner: 'Kaveri Valley Direct',
        reason: 'Best balance of price (₹118), highest reliability (96%) and accessible MOQ (12).',
      },
    },
    atta: {
      productName: 'Aashirvaad Superior Shudh Chakki Atta 10kg',
      options: [
        {
          id: 'sup-a-apex',
          name: 'Apex FMCG Hub ⭐',
          isBest: true,
          price: '₹445',
          delivery: '18 hours',
          reliability: '94%',
          fillRate: '97%',
          moq: '5 bags',
        },
        {
          id: 'sup-c-mysore',
          name: 'Mysore Syndicate',
          isBest: false,
          price: '₹448',
          delivery: '24 hours',
          reliability: '96%',
          fillRate: '95%',
          moq: '10 bags',
        },
        {
          id: 'sup-d-delta',
          name: 'Delta Wholesalers',
          isBest: false,
          price: '₹442',
          delivery: '3 days',
          reliability: '86%',
          fillRate: '89%',
          moq: '25 bags',
        },
      ],
      recommendation: {
        winner: 'Apex FMCG Hub',
        reason: 'Shortest lead time (18h) with lowest stockout variance and 97% verified fill rate.',
      },
    },
    salt: {
      productName: 'Tata Salt Vacuum Evaporated Iodized 1kg',
      options: [
        {
          id: 'sup-a-apex',
          name: 'Apex FMCG Hub',
          isBest: false,
          price: '₹24.50',
          delivery: '1 day',
          reliability: '92%',
          fillRate: '95%',
          moq: '50 units',
        },
        {
          id: 'sup-c-mysore',
          name: 'Mysore Syndicate ⭐',
          isBest: true,
          price: '₹24.00',
          delivery: '1 day',
          reliability: '96%',
          fillRate: '98%',
          moq: '20 units',
        },
      ],
      recommendation: {
        winner: 'Mysore Syndicate',
        reason: 'Lower wholesale price, accessible MOQ (20), and 98% consistent delivery fulfillment.',
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

      {/* Supplier Cards Grid (Section 16) */}
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
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Avg Delivery</div>
                  <div className="font-mono font-bold text-gray-200 text-sm mt-0.5">
                    {sup.avgDeliveryDays} days
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
                {sup.activeOrdersCount} active orders
              </span>
              <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition">
                <span>View Supplier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Comparison Tool (Section 17) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Interactive Matrix
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Multi-Supplier SKU Sourcing Comparison
            </h2>
          </div>

          {/* Product selector buttons */}
          <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
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

        {/* Side-by-Side Comparison Table (Section 17) */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-800 rounded-lg">
            <thead className="bg-[#0b0f19] text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 border-r border-gray-800">Supplier Offer</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Delivery Lead Time</th>
                <th className="p-3">Reliability</th>
                <th className="p-3">Fill Rate</th>
                <th className="p-3">Minimum Order (MOQ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {activeCompare.options.map((opt) => (
                <tr
                  key={opt.id}
                  className={`transition ${
                    opt.isBest ? 'bg-purple-950/20 font-semibold' : 'hover:bg-gray-800/30'
                  }`}
                >
                  <td className="p-3 font-bold border-r border-gray-800 flex items-center gap-2 text-white">
                    {opt.name}
                    {opt.isBest && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                        RECOMMENDED
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">{opt.price}</td>
                  <td className="p-3 text-gray-300">{opt.delivery}</td>
                  <td className="p-3 font-mono text-emerald-400">{opt.reliability}</td>
                  <td className="p-3 font-mono text-blue-400">{opt.fillRate}</td>
                  <td className="p-3 text-gray-400 font-mono">{opt.moq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendation Box (Section 17) */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-800/40 flex items-start gap-3.5">
          <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
              BEST OVERALL OPTION
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {activeCompare.recommendation.winner}
            </div>
            <p className="text-xs text-gray-300 mt-1">
              <strong>Reason:</strong> {activeCompare.recommendation.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
