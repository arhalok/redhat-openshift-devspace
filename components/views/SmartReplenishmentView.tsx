'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import {
  BANGALORE_STORES,
  REPLENISHMENT_CATALOG,
  ReplenishmentItem,
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
  Star,
  X,
  TrendingUp,
} from 'lucide-react';

export function SmartReplenishmentView() {
  const {
    selectedStore,
    setSelectedStore,
    placeSmartOrder,
    setActiveTab,
    addToast,
    dismissedRecIds,
    dismissRecommendation,
    setOrderCreationModalOpen,
  } = useLogistics();

  const [quantities, setQuantities] = useState<Record<string, number>>(
    REPLENISHMENT_CATALOG.reduce((acc, item) => ({ ...acc, [item.id]: item.recommendedUnits }), {})
  );

  const [activeDrawerItem, setActiveDrawerItem] = useState<ReplenishmentItem | null>(null);
  const [selectedSupplierForDrawer, setSelectedSupplierForDrawer] = useState<'apex' | 'mysore' | 'kaveri'>('apex');

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const currentStore = selectedStore || BANGALORE_STORES[0];

  const visibleCatalog = REPLENISHMENT_CATALOG.filter((i) => !dismissedRecIds.includes(i.id));
  const selectedItemsList = visibleCatalog.filter((i) => (quantities[i.id] || 0) > 0);
  const totalValuePaise = selectedItemsList.reduce(
    (sum, i) => sum + (quantities[i.id] || 0) * i.unitPricePaise,
    0
  );

  const handleCreateOrderFromDrawer = (item: ReplenishmentItem) => {
    const qty = quantities[item.id] || item.recommendedUnits;
    const orderNum = placeSmartOrder(currentStore.name, [
      {
        name: item.productName,
        quantity: qty,
        unitPricePaise: item.unitPricePaise,
      },
    ]);
    setActiveDrawerItem(null);
  };

  const handleBatchAllOrders = () => {
    const items = selectedItemsList.map((i) => ({
      name: i.productName,
      quantity: quantities[i.id] || 0,
      unitPricePaise: i.unitPricePaise,
    }));
    placeSmartOrder(currentStore.name, items);
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
            Explainable replenishment signals moving from Signal &rarr; Explanation &rarr; Recommendation &rarr; Action &rarr; Result.
          </p>
        </div>

        {/* Store Selector & Fast Order Button */}
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

          <button
            onClick={() => setOrderCreationModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Order (&lt;30s)</span>
          </button>
        </div>
      </div>

      {/* Decision Summary Card (Section 2.1 & 12.1) */}
      <div className="bg-[#111827] border border-blue-900/40 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {visibleCatalog.length} products recommended for replenishment today
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Targeted to prevent weekend stockouts at {currentStore.name} while respecting supplier vehicle delivery windows.
            </p>
          </div>
        </div>

        <button
          onClick={handleBatchAllOrders}
          disabled={selectedItemsList.length === 0}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Replenish All Selected ({selectedItemsList.length})</span>
        </button>
      </div>

      {/* Main Table/Card Hybrid (Section 12.1) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0f19] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Store</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4">Suggested Qty</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">ETA</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {visibleCatalog.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500">
                    All replenishment recommendations handled or dismissed for today.
                  </td>
                </tr>
              ) : (
                visibleCatalog.map((item) => {
                  const qty = quantities[item.id] || item.recommendedUnits;
                  const estimatedDays =
                    item.currentStock <= 2
                      ? '~0.8 days left'
                      : item.currentStock <= 5
                      ? '~1.4 days left'
                      : '~2.5 days left';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setActiveDrawerItem(item)}
                      className="hover:bg-gray-800/40 cursor-pointer transition group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {currentStore.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-blue-400 transition">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {item.category} &bull; ₹{(item.unitPricePaise / 100).toLocaleString('en-IN')}/unit
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <span className={item.currentStock <= 3 ? 'text-red-400 font-bold' : 'text-gray-200'}>
                          {item.currentStock} units
                        </span>
                        <div className="text-[10px] text-gray-500">Below safety level</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {estimatedDays}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {item.recommendedUnits} cases
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <div>{item.suggestedSupplier}</div>
                        <div className="text-[10px] text-purple-400 font-medium">Best overall option</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-300">
                        {item.supplierLeadTimeDays === 1 ? 'Tomorrow 10:00' : '+2 Days'}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          label={item.risk === 'High' ? 'CRITICAL' : item.risk === 'Medium' ? 'ATTENTION' : 'HEALTHY'}
                          variant={item.risk === 'High' ? 'red' : item.risk === 'Medium' ? 'amber' : 'green'}
                          size="sm"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActiveDrawerItem(item)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => dismissRecommendation(item.id)}
                            className="px-2 py-1 rounded text-gray-500 hover:text-gray-300 text-xs transition"
                            title="Dismiss recommendation"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Action Summary */}
        <div className="p-4 border-t border-gray-800 bg-[#0b0f19] flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Selected for Restock:{' '}
            <span className="font-bold text-white">{selectedItemsList.length} products</span> &bull; Estimated Basket Value:{' '}
            <span className="font-bold text-emerald-400 font-mono">
              ₹{(totalValuePaise / 100).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={handleBatchAllOrders}
            disabled={selectedItemsList.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition flex items-center gap-2 disabled:opacity-50"
          >
            <span>Create Consolidated Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 12.3 Replenishment Side Drawer (Preserves Page Context) */}
      {activeDrawerItem && (
        <Drawer
          isOpen={Boolean(activeDrawerItem)}
          onClose={() => setActiveDrawerItem(null)}
          title={`${currentStore.name}`}
          subtitle={`${activeDrawerItem.productName} — ${activeDrawerItem.recommendedUnits} cases suggested`}
          footer={
            <>
              <button
                onClick={() => setActiveDrawerItem(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateOrderFromDrawer(activeDrawerItem)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Create Order</span>
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-5 text-xs">
            {/* Header Product Card */}
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                Explainable Decision Recommendation
              </div>
              <div className="text-base font-bold text-white mt-1">
                {activeDrawerItem.productName}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {activeDrawerItem.category} &bull; Suggested: {activeDrawerItem.recommendedUnits} cases
              </div>
            </div>

            {/* WHY THIS IS RECOMMENDED (Section 12.3) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Why this is recommended
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Current Stock</div>
                  <div className="text-sm font-bold text-rose-400 mt-1">
                    {activeDrawerItem.currentStock} units
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Expected Demand</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {activeDrawerItem.expectedNeed} units
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Supplier Lead Time</div>
                  <div className="text-sm font-bold text-blue-400 mt-1">
                    {activeDrawerItem.supplierLeadTimeDays} day
                  </div>
                </div>
              </div>

              {/* Concrete Signals Checklist */}
              <div className="p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 space-y-2">
                {activeDrawerItem.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Confidence Signals (Section 11) */}
              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">High Confidence</span>
                  <span className="text-[10px] font-mono text-purple-400">Deterministic Model</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1">
                  Based on recent sales velocity, current shelf inventory, vendor lead times, and weekend cluster basket affinity.
                </p>
              </div>
            </div>

            {/* SUPPLIER OPTIONS (Section 12.3 & 13) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Supplier Fulfillment Options
              </h4>

              <div className="space-y-2">
                {/* Option 1: Best overall */}
                <div
                  onClick={() => setSelectedSupplierForDrawer('apex')}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedSupplierForDrawer === 'apex'
                      ? 'bg-purple-950/30 border-purple-500 text-white'
                      : 'bg-gray-900/60 border-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Apex FMCG Distribution Hub</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      Recommended
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-gray-400">
                    <div>Price: <strong className="text-emerald-400">₹{(activeDrawerItem.unitPricePaise / 100).toFixed(2)}</strong></div>
                    <div>ETA: <strong className="text-white">Tomorrow 10:00</strong></div>
                    <div>Reliability: <strong className="text-emerald-400">96%</strong></div>
                  </div>
                </div>

                {/* Option 2: Cheapest */}
                <div
                  onClick={() => setSelectedSupplierForDrawer('mysore')}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedSupplierForDrawer === 'mysore'
                      ? 'bg-purple-950/30 border-purple-500 text-white'
                      : 'bg-gray-900/60 border-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Mysore Grain Syndicate</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Cheapest
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-gray-400">
                    <div>Price: <strong className="text-emerald-400">₹{((activeDrawerItem.unitPricePaise * 0.97) / 100).toFixed(2)}</strong></div>
                    <div>ETA: <strong className="text-amber-400">+2 Days</strong></div>
                    <div>Reliability: <strong className="text-gray-300">91%</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPECTED RESULT (Section 12.3) */}
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
              <div className="text-[10px] font-bold uppercase text-emerald-400">Expected Result</div>
              <ul className="mt-1 space-y-1 text-gray-200 text-xs">
                <li>&bull; Eliminates estimated 92% stockout probability before weekend</li>
                <li>&bull; Maintains next morning delivery window without rush logistics surcharges</li>
              </ul>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
