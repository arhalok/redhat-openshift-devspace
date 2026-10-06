'use client';

import React from 'react';
import { useLogistics, NavigationTab } from '../../lib/logistics-state';
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  Factory,
  Package,
  Truck,
  Globe2,
  LineChart,
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Fuel,
  PackageCheck,
  Undo2,
} from 'lucide-react';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    workspaceMode,
    exceptions,
  } = useLogistics();

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'suppliers', label: 'Suppliers', icon: Factory },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'consolidation', label: 'Consolidation', icon: PackageCheck, badge: 'Opportunity', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'return-capacity', label: 'Return Capacity', icon: Undo2, badge: 'New', badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { id: 'network', label: 'Network', icon: Globe2 },
    { id: 'insights', label: 'Insights', icon: LineChart },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  ];

  const unappliedExceptions = exceptions.filter((e) => !e.applied).length;

  return (
    <aside
      className={`border-r border-gray-800 bg-[#0d1322] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Navigation Items */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3 px-2">
          {!isSidebarCollapsed && (
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {workspaceMode === 'operations' ? 'Control Plane' : 'Store Portal'}
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed((prev: boolean) => !prev)}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition group relative ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                />

                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.id === 'overview' && unappliedExceptions > 0 && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Secondary Links */}
      <div className="p-3 border-t border-gray-800 flex flex-col gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition"
          title="System Settings"
        >
          <Settings className="w-4 h-4 text-gray-400 shrink-0" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition"
          title="Operational Documentation & Help"
        >
          <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
          {!isSidebarCollapsed && <span>Help & Docs</span>}
        </button>

        {!isSidebarCollapsed && (
          <div className="mt-2 px-3 py-2 rounded-md bg-[#070b14] border border-gray-800/80 text-[10px] text-gray-500 font-mono">
            <div>Region: BLR-URBAN-01</div>
            <div>H3 Precision: Res 8 (0.7 km²)</div>
          </div>
        )}
      </div>
    </aside>
  );
}
