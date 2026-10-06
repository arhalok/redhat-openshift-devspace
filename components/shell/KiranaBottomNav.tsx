'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { Home, Sparkles, ShoppingBag, Package, User } from 'lucide-react';

export function KiranaBottomNav() {
  const { activeTab, setActiveTab, workspaceMode } = useLogistics();

  if (workspaceMode !== 'kirana') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1322] border-t border-gray-800 px-4 py-2 flex items-center justify-around md:hidden shadow-lg">
      <button
        onClick={() => setActiveTab('stores')}
        className={`flex flex-col items-center gap-1 text-[11px] ${
          activeTab === 'stores' ? 'text-blue-400 font-semibold' : 'text-gray-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      {/* Primary Mobile CTA: Smart Order */}
      <button
        onClick={() => setActiveTab('stores')}
        className="flex flex-col items-center -mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-lg border-2 border-[#0d1322] hover:scale-105 transition"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTab('orders')}
        className={`flex flex-col items-center gap-1 text-[11px] ${
          activeTab === 'orders' ? 'text-blue-400 font-semibold' : 'text-gray-400'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Orders</span>
      </button>

      <button
        onClick={() => setActiveTab('inventory')}
        className={`flex flex-col items-center gap-1 text-[11px] ${
          activeTab === 'inventory' ? 'text-blue-400 font-semibold' : 'text-gray-400'
        }`}
      >
        <Package className="w-5 h-5" />
        <span>Inventory</span>
      </button>

      <button
        onClick={() => setActiveTab('overview')}
        className="flex flex-col items-center gap-1 text-[11px] text-gray-400"
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </button>
    </nav>
  );
}
