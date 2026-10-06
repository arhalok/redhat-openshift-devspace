'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { REPLENISHMENT_CATALOG, BANGALORE_STORES } from '../../lib/demo-data';
import {
  Sparkles,
  Package,
  Truck,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export function KiranaStoreHomeView() {
  const {
    selectedStore,
    setActiveTab,
    orders,
    setSelectedOrder,
    placeSmartOrder,
  } = useLogistics();

  const store = selectedStore || BANGALORE_STORES[0];
  const highRiskItems = REPLENISHMENT_CATALOG.filter((i) => i.risk === 'High');

  const handleInstantSmartOrder = () => {
    const items = highRiskItems.map((i) => ({
      name: i.productName,
      quantity: i.recommendedUnits,
      unitPricePaise: i.unitPricePaise,
    }));
    placeSmartOrder(store.name, items);
    setActiveTab('orders');
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto w-full pb-16">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Kirana Portal &bull; {store.locality}
            </span>
            <h1 className="text-xl font-bold text-white mt-0.5">{store.name}</h1>
            <p className="text-xs text-blue-200 mt-1">Namaste, {store.ownerName}!</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 text-xl font-bold">
            🏪
          </div>
        </div>

        {/* Primary Action (Wow Moment 1: Instant Smart Order) */}
        <div className="mt-5 pt-4 border-t border-blue-800/40">
          <div className="text-xs text-blue-100 mb-2">
            ✨ <strong>{highRiskItems.length} essential products</strong> need restocking before weekend demand.
          </div>
          <button
            onClick={handleInstantSmartOrder}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Smart Order ({highRiskItems.length} Recommended Items)</span>
          </button>
        </div>
      </div>

      {/* Stockout Alerts Box */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Stockout Alerts ({highRiskItems.length})
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('stores')}
            className="text-xs text-blue-400 font-semibold"
          >
            Review All &rarr;
          </button>
        </div>

        <div className="space-y-2">
          {highRiskItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-white">{item.productName}</div>
                <div className="text-[11px] text-rose-400 mt-0.5">
                  Only {item.currentStock} left (need {item.expectedNeed})
                </div>
              </div>
              <button
                onClick={() => setActiveTab('stores')}
                className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold text-[11px]"
              >
                +Add {item.recommendedUnits}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Deliveries Quick Tracker */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Incoming Delivery
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            ETA 14:20 Today
          </span>
        </div>

        <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">ORD-10284</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
              IN TRANSIT
            </span>
          </div>
          <p className="text-gray-300 text-[11px] mt-1">
            Route R-124 &bull; Tata Ace (KA-01-EV-4091) &bull; Passing Domlur Flyover
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/80 pt-2">
            <span>12 products &bull; ₹18,420</span>
            <button
              onClick={() => {
                const ord = orders.find((o) => o.orderNumber === 'ORD-10284');
                if (ord) {
                  setSelectedOrder(ord);
                  setActiveTab('orders');
                }
              }}
              className="text-blue-400 font-semibold flex items-center gap-1"
            >
              <span>Track Live</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('suppliers')}
          className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-left transition"
        >
          <div className="font-bold text-white text-xs">Compare Suppliers</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Check best rates & lead times</div>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-left transition"
        >
          <div className="font-bold text-white text-xs">Order History</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Past invoices & OTP proof</div>
        </button>
      </div>
    </div>
  );
}
