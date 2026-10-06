'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { BANGALORE_STORES, BANGALORE_SUPPLIERS, REPLENISHMENT_CATALOG } from '../../lib/demo-data';
import { ShoppingCart, CheckCircle2, ArrowRight, ArrowLeft, Clock, ShieldCheck, Star, X } from 'lucide-react';

export function OrderCreationModal() {
  const {
    orderCreationModalOpen,
    setOrderCreationModalOpen,
    placeSmartOrder,
    setActiveTab,
    selectedStore,
  } = useLogistics();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProductId, setSelectedProductId] = useState<string>(REPLENISHMENT_CATALOG[0].id);
  const [quantity, setQuantity] = useState<number>(18);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup-a-apex');

  if (!orderCreationModalOpen) return null;

  const currentStore = selectedStore || BANGALORE_STORES[0];
  const selectedProduct = REPLENISHMENT_CATALOG.find((p) => p.id === selectedProductId) || REPLENISHMENT_CATALOG[0];

  const supplierOptions = [
    {
      id: 'sup-a-apex',
      name: 'Apex FMCG Distribution Hub',
      badge: 'Best Overall',
      pricePaise: selectedProduct.unitPricePaise,
      leadTime: 'Tomorrow 10:00',
      reliability: '96%',
      distanceKm: 7.2,
      note: '₹8.40 lower/case, 1 day faster ETA, 12 km closer',
    },
    {
      id: 'sup-c-mysore',
      name: 'Mysore Grain Wholesale Syndicate',
      badge: 'Cheapest',
      pricePaise: Math.round(selectedProduct.unitPricePaise * 0.97),
      leadTime: '+2 Days',
      reliability: '91%',
      distanceKm: 8.9,
      note: 'Lower wholesale price, longer buffer lead time',
    },
    {
      id: 'sup-b-kaveri',
      name: 'Kaveri Valley Direct Express',
      badge: 'Fastest',
      pricePaise: Math.round(selectedProduct.unitPricePaise * 1.04),
      leadTime: 'Today Express (4 hrs)',
      reliability: '98%',
      distanceKm: 14.5,
      note: 'Express dispatch window with verified cold chain',
    },
  ];

  const activeSupplier = supplierOptions.find((s) => s.id === selectedSupplierId) || supplierOptions[0];
  const totalPaise = quantity * activeSupplier.pricePaise;

  const handlePlaceOrder = () => {
    placeSmartOrder(
      currentStore.name,
      [
        {
          name: selectedProduct.productName,
          quantity,
          unitPricePaise: activeSupplier.pricePaise,
        },
      ],
      activeSupplier.name
    );
    setOrderCreationModalOpen(false);
    setStep(1);
    setActiveTab('orders');
  };

  const resetAndClose = () => {
    setOrderCreationModalOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />

      <div className="relative w-full max-w-xl bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Step Tracker */}
        <div className="p-4 bg-[#0b0f19] border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                Rapid Order Creation (&lt;30s Target)
              </span>
              <span className="text-gray-500 text-xs">•</span>
              <span className="text-xs text-gray-300 font-medium">{currentStore.name}</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              Step {step} of 4:{' '}
              {step === 1 && 'What do you need?'}
              {step === 2 && 'How much do you need?'}
              {step === 3 && 'Choose best fulfillment option'}
              {step === 4 && 'Review & confirm order'}
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-900 h-1">
          <div
            className="bg-blue-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 text-xs text-gray-300">
          {/* STEP 1: What do you need? */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-gray-200 block">
                Select from recommended replenishment catalog or popular fast-movers:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {REPLENISHMENT_CATALOG.map((prod) => {
                  const isSelected = selectedProductId === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setQuantity(prod.recommendedUnits);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-900/70 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-white leading-tight">{prod.productName}</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {prod.category} • ₹{(prod.unitPricePaise / 100).toLocaleString('en-IN')}/unit
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1.5 font-mono">
                        Safety recommendation: +{prod.recommendedUnits} units
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: How much? */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-xs text-gray-400">Selected Product</div>
                <div className="text-base font-bold text-white mt-0.5">{selectedProduct.productName}</div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Baseline price: ₹{(selectedProduct.unitPricePaise / 100).toLocaleString('en-IN')} / unit
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-200 block mb-2">
                  Order Quantity (Smart default: {selectedProduct.recommendedUnits} units)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 6))}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-lg font-bold text-white transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-24 text-center py-2 bg-gray-950 border border-gray-700 rounded-lg text-white font-mono font-bold text-base focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 6)}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-lg font-bold text-white transition"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-400 ml-2">units / cases</span>
                </div>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500">Quick batch presets:</span>
                {[6, 12, 18, 24, 48].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                      quantity === q
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Best fulfillment option */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-200 block mb-1">
                Compare supplier trade-offs (Cheapest ≠ best):
              </label>

              <div className="space-y-2.5">
                {supplierOptions.map((opt) => {
                  const isSelected = selectedSupplierId === opt.id;
                  const totalQuotePaise = quantity * opt.pricePaise;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSupplierId(opt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-purple-950/30 border-purple-500 text-white shadow-md'
                          : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{opt.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold ${
                              opt.badge === 'Best Overall'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : opt.badge === 'Cheapest'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          ₹{(totalQuotePaise / 100).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-gray-400 font-mono">
                        <div>ETA: <span className="text-white">{opt.leadTime}</span></div>
                        <div>Reliability: <span className="text-emerald-400">{opt.reliability}</span></div>
                        <div>Distance: <span className="text-white">{opt.distanceKm} km</span></div>
                      </div>

                      <div className="text-[11px] text-gray-400 mt-1.5 italic">
                        {opt.note}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Store Destination:</span>
                  <span className="font-bold text-white">{currentStore.name} ({currentStore.locality})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Product & Quantity:</span>
                  <span className="font-bold text-white font-mono">
                    {quantity}x {selectedProduct.productName}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Chosen Supplier:</span>
                  <span className="font-bold text-purple-300">{activeSupplier.name} ({activeSupplier.badge})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Committed ETA:</span>
                  <span className="font-bold text-emerald-400 font-mono">{activeSupplier.leadTime}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm">
                  <span className="font-bold text-gray-200">Total Order Value:</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    ₹{(totalPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Smart defaults indicator */}
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 text-[11px] text-gray-300 flex items-center justify-between">
                <span>Smart defaults: Delivery window 09:00 - 13:00 • Route R-124 auto-allocated</span>
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-[#0b0f19] border-t border-gray-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-3.5 py-1.5 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 text-xs font-semibold text-gray-300 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Confirm & Place Order</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
