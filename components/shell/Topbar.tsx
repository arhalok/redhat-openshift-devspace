'use client';

import React, { useState } from 'react';
import { useLogistics, DemoScenario } from '../../lib/logistics-state';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  Building2,
  Store,
  ShieldAlert,
} from 'lucide-react';

export function Topbar() {
  const {
    workspaceMode,
    setWorkspaceMode,
    activeScenario,
    setActiveScenario,
    setCommandPaletteOpen,
    setCopilotOpen,
    setKeyboardHelpOpen,
    exceptions,
    addToast,
    setActiveTab,
    lastUpdated,
    refreshTelemetry,
    resetDemo,
  } = useLogistics();

  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const scenarioNames: Record<DemoScenario, string> = {
    'normal-day': 'Normal Operations',
    'peak-demand': 'Peak Demand (+60%)',
    'supplier-delay': 'Supplier Delay Bottleneck',
    'vehicle-shortage': 'Fleet Shortage (-35%)',
    'return-load-opportunity': 'Backhaul Recovery Match',
  };

  const handleRefresh = () => {
    addToast('Telemetry Refreshed', 'Synced latest dispatch, GPS, and inventory data across Bangalore network.', 'info');
  };

  const activeExceptionsCount = exceptions.filter((e) => !e.applied).length;

  return (
    <header className="h-14 border-b border-gray-800 bg-[#0d1322] px-4 flex items-center justify-between text-sm z-30 sticky top-0">
      {/* Left: Brand & Workspace Switcher */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 font-bold text-base text-white cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition">
            ◆
          </div>
          <div className="flex flex-col">
            <span className="leading-none text-white tracking-tight flex items-center gap-1.5">
              KiranaFlow
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono font-normal">
                Phase 1
              </span>
            </span>
            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
              Logistics Control Platform
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-800" />

        {/* Workspace Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setWorkspaceDropdownOpen(!workspaceDropdownOpen);
              setScenarioDropdownOpen(false);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 hover:bg-gray-800/60 text-xs font-medium text-gray-200 transition"
          >
            {workspaceMode === 'operations' ? (
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Store className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>
              {workspaceMode === 'operations'
                ? 'Bangalore Operations Hub'
                : 'Kirana Store (Sharma General)'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {workspaceDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl p-1 z-40">
              <div className="text-[10px] font-semibold text-gray-500 uppercase px-2 py-1">
                Select Workspace Surface
              </div>
              <button
                onClick={() => {
                  setWorkspaceMode('operations');
                  setWorkspaceDropdownOpen(false);
                  setActiveTab('overview');
                }}
                className={`w-full text-left p-2 rounded text-xs flex items-center gap-2.5 transition ${
                  workspaceMode === 'operations'
                    ? 'bg-blue-600/20 text-blue-300 font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-medium text-white">Operations Control Tower</div>
                  <div className="text-[11px] text-gray-400">Desktop-first hub telemetry & routing</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setWorkspaceMode('kirana');
                  setWorkspaceDropdownOpen(false);
                  setActiveTab('stores');
                }}
                className={`w-full text-left p-2 rounded text-xs flex items-center gap-2.5 transition ${
                  workspaceMode === 'kirana'
                    ? 'bg-amber-600/20 text-amber-300 font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Store className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-medium text-white">Kirana Store Experience</div>
                  <div className="text-[11px] text-gray-400">Mobile-first smart replenishment</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search / Command Palette Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-gray-800 bg-[#070b14] hover:border-gray-700 text-xs text-gray-400 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <span>Search orders, stores, routes, vehicles...</span>
          </div>
          <kbd className="text-[10px] bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700 text-gray-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions: Scenario Selector, AI Copilot, Notifications, Refresh */}
      <div className="flex items-center gap-2.5">
        {/* Scenario Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setScenarioDropdownOpen(!scenarioDropdownOpen);
              setWorkspaceDropdownOpen(false);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-xs text-gray-300 font-medium transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline text-gray-400">Scenario:</span>
            <span className="text-white font-semibold">{scenarioNames[activeScenario]}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {scenarioDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl p-1 z-40">
              <div className="text-[10px] font-semibold text-gray-500 uppercase px-2 py-1">
                Deterministic Scenarios
              </div>
              {(Object.keys(scenarioNames) as DemoScenario[]).map((sc) => (
                <button
                  key={sc}
                  onClick={() => {
                    setActiveScenario(sc);
                    setScenarioDropdownOpen(false);
                    addToast('Scenario Activated', `Now running in ${scenarioNames[sc]} mode.`, 'info');
                  }}
                  className={`w-full text-left p-2 rounded text-xs transition ${
                    activeScenario === sc
                      ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium">{scenarioNames[sc]}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DEMO DATA indicator & Reset Button (Section 52) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded border border-amber-500/30 bg-amber-500/10 text-[11px] font-mono text-amber-300">
          <span className="font-bold">DEMO DATA</span>
          <button
            onClick={resetDemo}
            className="text-amber-400 hover:text-white underline text-[10px] ml-1 font-sans"
            title="Reset to clean baseline data"
          >
            Reset
          </button>
        </div>

        {/* AI Copilot Quick Button */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Refresh Telemetry */}
        <button
          onClick={refreshTelemetry}
          title={`Refresh Telemetry (Updated ${lastUpdated})`}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Keyboard shortcut help trigger (?) */}
        <button
          onClick={() => setKeyboardHelpOpen(true)}
          title="Keyboard Shortcuts (?)"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition hidden sm:block font-mono text-xs font-bold"
        >
          ?
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setScenarioDropdownOpen(false);
              setWorkspaceDropdownOpen(false);
            }}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition relative"
          >
            <Bell className="w-4 h-4" />
            {activeExceptionsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl p-3 z-40">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-xs font-semibold text-white">
                <span>Active Alerts ({activeExceptionsCount})</span>
                <span className="text-[10px] text-gray-400 font-mono">Live Feeds</span>
              </div>
              <div className="divide-y divide-gray-800 max-h-60 overflow-y-auto mt-2">
                {exceptions.map((exc) => (
                  <div key={exc.id} className="py-2 text-xs">
                    <div className="flex items-center justify-between font-medium text-gray-200">
                      <span className="flex items-center gap-1.5 text-rose-400">
                        <ShieldAlert className="w-3.5 h-3.5" /> {exc.title}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {exc.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{exc.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow">
          OP
        </div>
      </div>
    </header>
  );
}
