'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import {
  BANGALORE_ORDERS,
  BANGALORE_STORES,
  BANGALORE_SUPPLIERS,
  BANGALORE_VEHICLES,
  BANGALORE_ROUTES,
} from '../../lib/demo-data';
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Store,
  Factory,
  Truck,
  Sparkles,
  Sliders,
  Maximize2,
  PackageCheck,
  Fuel,
  ArrowRight,
  X,
} from 'lucide-react';

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTab,
    setSelectedOrder,
    setSelectedVehicle,
    setSelectedStore,
    setCopilotOpen,
    runRouteOptimization,
    setConsolidationState,
    addToast,
  } = useLogistics();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Build searchable items
  interface CommandItem {
    id: string;
    title: string;
    subtitle: string;
    category: 'Navigation' | 'Action' | 'Order' | 'Store' | 'Supplier' | 'Vehicle';
    icon: React.ReactNode;
    action: () => void;
  }

  const items: CommandItem[] = [
    // Navigation items
    {
      id: 'nav-overview',
      title: 'Go to Overview / Control Tower',
      subtitle: 'Real-time telemetry and network map',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-blue-400" />,
      action: () => {
        setActiveTab('overview');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-orders',
      title: 'Go to Orders',
      subtitle: 'Order management table and lifecycle tracking',
      category: 'Navigation',
      icon: <ShoppingCart className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveTab('orders');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-stores',
      title: 'Go to Stores / Smart Replenishment',
      subtitle: 'Kirana network inventory and proactive recommendations',
      category: 'Navigation',
      icon: <Store className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveTab('stores');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-suppliers',
      title: 'Go to Suppliers Intelligence',
      subtitle: 'Compare vendor reliability, fill rates, and SLAs',
      category: 'Navigation',
      icon: <Factory className="w-4 h-4 text-indigo-400" />,
      action: () => {
        setActiveTab('suppliers');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-logistics',
      title: 'Go to Logistics & Fleet Routes',
      subtitle: 'Dispatch operations and vehicle telemetry',
      category: 'Navigation',
      icon: <Truck className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActiveTab('logistics');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-consolidation',
      title: 'Dynamic Consolidation Opportunity',
      subtitle: 'Merge 12 dispatches into 4 routes (28% fuel saving)',
      category: 'Action',
      icon: <PackageCheck className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveTab('consolidation');
        setConsolidationState('preview');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-optimize',
      title: 'Optimize Network Routes',
      subtitle: 'Run multi-depot vehicle routing algorithm',
      category: 'Action',
      icon: <Fuel className="w-4 h-4 text-purple-400" />,
      action: () => {
        setActiveTab('logistics');
        runRouteOptimization();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-simulator',
      title: 'Open What-If Simulator',
      subtitle: 'Stress test supply chain with +25% demand surge',
      category: 'Navigation',
      icon: <Sliders className="w-4 h-4 text-rose-400" />,
      action: () => {
        setActiveTab('simulator');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-copilot',
      title: 'Ask AI Copilot',
      subtitle: 'Get operational explanations and automated actions',
      category: 'Action',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      action: () => {
        setCopilotOpen(true);
        setCommandPaletteOpen(false);
      },
    },
    // Entity search
    ...BANGALORE_ORDERS.map((o) => ({
      id: `order-${o.id}`,
      title: `${o.orderNumber} — ${o.storeName}`,
      subtitle: `Status: ${o.status} • ₹${(o.valuePaise / 100).toLocaleString('en-IN')}`,
      category: 'Order' as const,
      icon: <ShoppingCart className="w-4 h-4 text-blue-400" />,
      action: () => {
        setActiveTab('orders');
        setSelectedOrder(o);
        setCommandPaletteOpen(false);
      },
    })),
    ...BANGALORE_STORES.map((s) => ({
      id: `store-${s.id}`,
      title: `${s.name} (${s.locality})`,
      subtitle: `Risk: ${s.stockoutRiskLevel} • ${s.phone}`,
      category: 'Store' as const,
      icon: <Store className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveTab('stores');
        setSelectedStore(s);
        setCommandPaletteOpen(false);
      },
    })),
    ...BANGALORE_VEHICLES.map((v) => ({
      id: `veh-${v.id}`,
      title: `${v.code} — ${v.model}`,
      subtitle: `Capacity: ${v.currentCapacityPct}% • Driver: ${v.driverName}`,
      category: 'Vehicle' as const,
      icon: <Truck className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveTab('logistics');
        setSelectedVehicle(v);
        setCommandPaletteOpen(false);
      },
    })),
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-800 bg-[#0b0f19]">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search orders, stores, vehicles, suppliers..."
            className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none text-sm"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded transition"
          >
            <kbd className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-400">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-gray-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No matching commands or entities found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition ${
                  selectedIndex === idx ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-900 border border-gray-800 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-gray-800 text-gray-400">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.subtitle}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-gray-800 bg-[#070b14] flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Use &uarr; &darr; to navigate</span>
          <span>Enter to select &bull; Esc to close</span>
        </div>
      </div>
    </div>
  );
}
