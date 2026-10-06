'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import {
  BANGALORE_STORES,
  REPLENISHMENT_CATALOG,
  ReplenishmentItem,
  BANGALORE_SUPPLIERS,
} from '../../lib/demo-data';
import { StatusBadge } from '../common/StatusBadge';
import { Drawer } from '../common/Drawer';
import {
  Sparkles,
  HelpCircle,
  Plus,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Store,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function SmartReplenishmentView() {
  const {
    selectedStore,
    setSelectedStore,
    placeSmartOrder,
    setActiveTab,
    addToast,
  } = useLogistics();

  const [quantities, setQuantities] = useState<Record<string, number>>(
    REPLENISHMENT_CATALOG.reduce((acc, item) => ({ ...acc, [item.id]: item.recommendedUnits }), {})
  );

  const [explainItem, setExplainItem] = useState<ReplenishmentItem | null>(null);
  const [smartOrderDrawerOpen, setSmartOrderDrawerOpen] = useState(false);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const currentStore = selectedStore || BANGALORE_STORES[0];

  const selectedItemsList = REPLENISHMENT_CATALOG.filter((i) => (quantities[i.id] || 0) > 0);
  const totalValuePaise = selectedItemsList.reduce(
    (sum, i) => sum + (quantities[i.id] || 0) * i.unitPricePaise,
    0
  );

  const handlePlaceOrder = () => {
    const items = selectedItemsList.map((i) => ({
      name: i.productName,
      quantity: quantities[i.id] || 0,
      unitPricePaise: i.unitPricePaise,
    }));

    const orderNum = placeSmartOrder(currentStore.name, items);
    setSmartOrderDrawerOpen(false);
    setActiveTab('orders');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Store Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Smart Replenishment
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              PROACTIVE STOCK PROTECTION
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Deterministic demand forecasting and vendor safety buffer calculations.
          </p>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400 font-medium">Inspecting Store:</label>
          <div className="relative">
            <select
              value={currentStore.id}
              onChange={(e) => {
                const s = BANGALORE_STORES.find((store) => store.id === e.target.value);
                if (s) setSelectedStore(s);
              }}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              {BANGALORE_STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.locality})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Banner (Section 13) */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-800/40 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              We found {REPLENISHMENT_CATALOG.length} products worth reviewing for {currentStore.name}.
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Based on recent consumer checkout acceleration, weekend safety targets, and supplier lead times.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSmartOrderDrawerOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add All Recommendations</span>
        </button>
      </div>

      {/* Main Replenishment Table (Section 13) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0f19] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Expected Need</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Recommended</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4 text-center">Explainability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {REPLENISHMENT_CATALOG.map((item) => {
                const qty = quantities[item.id] || 0;

                return (
                  <tr key={item.id} className="hover:bg-gray-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.productName}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {item.category} &bull; ₹{(item.unitPricePaise / 100).toLocaleString('en-IN')}/unit
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      <span className={item.currentStock <= 3 ? 'text-red-400 font-bold' : 'text-gray-200'}>
                        {item.currentStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300">
                      {item.expectedNeed} units
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        label={item.risk}
                        variant={item.risk === 'High' ? 'red' : item.risk === 'Medium' ? 'amber' : 'blue'}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      +{item.recommendedUnits}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setExplainItem(item)}
                        className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-blue-400 text-xs font-semibold inline-flex items-center gap-1 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why?</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Action Summary */}
        <div className="p-4 border-t border-gray-800 bg-[#0b0f19] flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Selected: <span className="font-bold text-white">{selectedItemsList.length} items</span> &bull; Estimated Value:{' '}
            <span className="font-bold text-emerald-400 font-mono">
              ₹{(totalValuePaise / 100).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={() => setSmartOrderDrawerOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition flex items-center gap-2"
          >
            <span>Review Smart Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* "Why?" Explainability Modal (Section 14) */}
      {explainItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setExplainItem(null)}
          />

          <div className="relative w-full max-w-md bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Explainable Decision Support
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Why this was recommended:
                </h3>
                <p className="text-xs text-gray-400">{explainItem.productName}</p>
              </div>
              <button
                onClick={() => setExplainItem(null)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                &times;
              </button>
            </div>

            {/* Operational Reason Checklist */}
            <div className="mt-4 space-y-2.5">
              {explainItem.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {/* Confidence Metric */}
            <div className="mt-5 p-3 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase">
                  Forecast Confidence
                </div>
                <div className="text-xs text-gray-300 mt-0.5">
                  Verified against 90-day seasonal baseline
                </div>
              </div>
              <div className="text-lg font-bold font-mono text-purple-400">
                {explainItem.confidencePct}%
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setExplainItem(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Order Review Drawer (Section 15) */}
      <Drawer
        isOpen={smartOrderDrawerOpen}
        onClose={() => setSmartOrderDrawerOpen(false)}
        title="Review Smart Order"
        subtitle={`Optimized basket for ${currentStore.name}`}
        footer={
          <>
            <button
              onClick={() => setSmartOrderDrawerOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-800 transition"
            >
              Edit Basket
            </button>
            <button
              onClick={() => {
                setSmartOrderDrawerOpen(false);
                setActiveTab('suppliers');
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-medium text-gray-200 hover:bg-gray-800 transition"
            >
              Compare Suppliers
            </button>
            <button
              onClick={handlePlaceOrder}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30"
            >
              Place Order Now
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          {/* Basket Overview */}
          <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Total Products</div>
              <div className="text-xl font-bold text-white">{selectedItemsList.length} items</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Estimated Value</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ₹{(totalValuePaise / 100).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Supplier Multi-Sourcing Allocation Breakdown (Section 15) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Supplier Allocation & Fulfillment Split
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white">Apex FMCG Distribution Hub</span>
                  <div className="text-[11px] text-gray-400">Atta, Edible Oil, Confectionery</div>
                </div>
                <div className="font-mono font-bold text-white">
                  ₹{((totalValuePaise * 0.46) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white">Kaveri Valley Dairy & Perishables</span>
                  <div className="text-[11px] text-gray-400">Fresh dairy & morning drops</div>
                </div>
                <div className="font-mono font-bold text-white">
                  ₹{((totalValuePaise * 0.37) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white">Mysore Grain Wholesale Syndicate</span>
                  <div className="text-[11px] text-gray-400">Salt, Sugar & Bulk bags</div>
                </div>
                <div className="font-mono font-bold text-white">
                  ₹{((totalValuePaise * 0.17) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          {/* SLA & Delivery Commitment */}
          <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-300">Expected Delivery</div>
              <div className="text-gray-400 text-[11px]">Tomorrow between 09:00 - 13:00</div>
            </div>
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>

          {/* Line items preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Itemized Replenishment List
            </h4>
            <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg max-h-48 overflow-y-auto">
              {selectedItemsList.map((item) => (
                <div key={item.id} className="p-2.5 flex justify-between text-xs">
                  <div>
                    <div className="font-medium text-white">{item.productName}</div>
                    <div className="text-[11px] text-gray-500 font-mono">Qty: {quantities[item.id]}</div>
                  </div>
                  <div className="font-mono text-gray-300">
                    ₹{(((quantities[item.id] || 0) * item.unitPricePaise) / 100).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
