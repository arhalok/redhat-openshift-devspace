'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { KiranaBottomNav } from './KiranaBottomNav';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '../common/ToastContainer';
import { Drawer } from '../common/Drawer';

// Views
import { ControlTowerView } from '../views/ControlTowerView';
import { SmartReplenishmentView } from '../views/SmartReplenishmentView';
import { SupplierIntelligenceView } from '../views/SupplierIntelligenceView';
import { OrderManagementView } from '../views/OrderManagementView';
import { LogisticsRoutesView } from '../views/LogisticsRoutesView';
import { DynamicConsolidationView } from '../views/DynamicConsolidationView';
import { ReturnCapacityView } from '../views/ReturnCapacityView';
import { NetworkInsightsView } from '../views/NetworkInsightsView';
import { WhatIfSimulatorView } from '../views/WhatIfSimulatorView';
import { AICopilotView } from '../views/AICopilotView';
import { KiranaStoreHomeView } from '../views/KiranaStoreHomeView';

export function AppShell() {
  const {
    activeTab,
    workspaceMode,
    copilotOpen,
    setCopilotOpen,
    selectedH3Insight,
    setSelectedH3Insight,
    setActiveTab,
  } = useLogistics();

  const renderActiveView = () => {
    // If in Kirana mode and on Home, show KiranaStoreHomeView
    if (workspaceMode === 'kirana' && activeTab === 'overview') {
      return <KiranaStoreHomeView />;
    }

    switch (activeTab) {
      case 'overview':
        return <ControlTowerView />;
      case 'orders':
        return <OrderManagementView />;
      case 'stores':
      case 'inventory':
        return <SmartReplenishmentView />;
      case 'suppliers':
        return <SupplierIntelligenceView />;
      case 'logistics':
        return <LogisticsRoutesView />;
      case 'consolidation':
        return <DynamicConsolidationView />;
      case 'return-capacity':
        return <ReturnCapacityView />;
      case 'network':
      case 'insights':
        return <NetworkInsightsView />;
      case 'simulator':
        return <WhatIfSimulatorView />;
      case 'copilot':
        return <AICopilotView />;
      default:
        return <ControlTowerView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Topbar */}
      <Topbar />

      {/* Main Workspace: Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (hidden on small screens if in Kirana mode) */}
        <Sidebar />

        {/* Content View Container */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Kirana Mobile Bottom Bar */}
      <KiranaBottomNav />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Persistent AI Copilot Modal (when opened from Topbar or anywhere) */}
      {copilotOpen && (
        <Drawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          title="AI Operations Copilot"
          subtitle="Real-time logistics reasoning & operational actions"
          width="xl"
        >
          <AICopilotView />
        </Drawer>
      )}

      {/* H3 Area Insight Drawer */}
      {selectedH3Insight && (
        <Drawer
          isOpen={Boolean(selectedH3Insight)}
          onClose={() => setSelectedH3Insight(null)}
          title={selectedH3Insight.locality}
          subtitle={`H3 Index: ${selectedH3Insight.h3Index}`}
          footer={
            <button
              onClick={() => {
                setSelectedH3Insight(null);
                setActiveTab('stores');
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition"
            >
              Inspect Cluster Stores
            </button>
          }
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-sans">Active Stores</span>
                <div className="text-base font-bold text-white mt-1">
                  {selectedH3Insight.storesCount}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-sans">Daily Orders</span>
                <div className="text-base font-bold text-white mt-1">
                  {selectedH3Insight.dailyOrdersCount}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-sans">Demand Trend</span>
                <div className="text-base font-bold text-emerald-400 mt-1">
                  ↑ {selectedH3Insight.demandTrendPct}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900 border border-red-900/60 bg-red-950/20">
                <span className="text-[10px] text-red-400 uppercase font-sans">Stockout Risk</span>
                <div className="text-base font-bold text-red-400 mt-1">
                  {selectedH3Insight.stockoutRiskStores} stores
                </div>
              </div>
            </div>

            <div>
              <span className="text-gray-400 font-semibold uppercase text-[10px]">
                Top Categories:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedH3Insight.topCategories.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-gray-300">
              <span className="font-bold text-purple-300">Recommended Operational Action:</span>
              <p className="mt-1">{selectedH3Insight.recommendedAction}</p>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
