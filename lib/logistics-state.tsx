'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BANGALORE_ORDERS,
  BANGALORE_EXCEPTIONS,
  BANGALORE_STORES,
  BANGALORE_SUPPLIERS,
  BANGALORE_VEHICLES,
  BANGALORE_ROUTES,
  BANGALORE_WAREHOUSES,
  OrderRecord,
  ExceptionItem,
  StoreNode,
  VehicleNode,
  RouteVector,
  H3AreaInsight,
  H3_AREA_INSIGHTS,
} from './demo-data';

export type NavigationTab =
  | 'overview'
  | 'orders'
  | 'stores'
  | 'suppliers'
  | 'inventory'
  | 'logistics'
  | 'network'
  | 'insights'
  | 'simulator'
  | 'copilot'
  | 'consolidation'
  | 'return-capacity';

export type WorkspaceMode = 'operations' | 'kirana';
export type DemoScenario =
  | 'normal-day'
  | 'peak-demand'
  | 'supplier-delay'
  | 'vehicle-shortage'
  | 'return-load-opportunity';

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface LogisticsContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  workspaceMode: WorkspaceMode;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  activeScenario: DemoScenario;
  setActiveScenario: (scenario: DemoScenario) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Data
  orders: OrderRecord[];
  exceptions: ExceptionItem[];
  vehicles: VehicleNode[];
  routes: RouteVector[];
  stores: StoreNode[];

  // Entity Drawers & Modals
  selectedOrder: OrderRecord | null;
  setSelectedOrder: (order: OrderRecord | null) => void;
  selectedVehicle: VehicleNode | null;
  setSelectedVehicle: (veh: VehicleNode | null) => void;
  selectedStore: StoreNode | null;
  setSelectedStore: (store: StoreNode | null) => void;
  selectedH3Insight: H3AreaInsight | null;
  setSelectedH3Insight: (insight: H3AreaInsight | null) => void;

  // Global Dialogs & Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Wow Moments States
  consolidationState: 'idle' | 'preview' | 'applied';
  setConsolidationState: (state: 'idle' | 'preview' | 'applied') => void;
  applyConsolidation: () => void;

  optimizationState: 'idle' | 'running' | 'completed' | 'applied';
  optimizationStep: number;
  runRouteOptimization: () => void;
  applyRouteOptimization: () => void;

  returnLoadState: 'idle' | 'preview' | 'applied';
  setReturnLoadState: (state: 'idle' | 'preview' | 'applied') => void;
  applyReturnLoad: () => void;

  // Actions
  applyExceptionFix: (exceptionId: string) => void;
  placeSmartOrder: (storeName: string, items: Array<{ name: string; quantity: number; unitPricePaise: number }>) => string;
}

const LogisticsContext = createContext<LogisticsContextType | null>(null);

export function LogisticsProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('operations');
  const [activeScenario, setActiveScenario] = useState<DemoScenario>('normal-day');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>(BANGALORE_ORDERS);
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(BANGALORE_EXCEPTIONS);
  const [vehicles, setVehicles] = useState<VehicleNode[]>(BANGALORE_VEHICLES);
  const [routes, setRoutes] = useState<RouteVector[]>(BANGALORE_ROUTES);
  const [stores, setStores] = useState<StoreNode[]>(BANGALORE_STORES);

  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleNode | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreNode | null>(BANGALORE_STORES[0]);
  const [selectedH3Insight, setSelectedH3Insight] = useState<H3AreaInsight | null>(null);

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [consolidationState, setConsolidationState] = useState<'idle' | 'preview' | 'applied'>('idle');
  const [optimizationState, setOptimizationState] = useState<'idle' | 'running' | 'completed' | 'applied'>('idle');
  const [optimizationStep, setOptimizationStep] = useState(0);
  const [returnLoadState, setReturnLoadState] = useState<'idle' | 'preview' | 'applied'>('idle');

  // Keyboard shortcut listener (Ctrl+K, Esc, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setSelectedOrder(null);
        setSelectedVehicle(null);
        setSelectedH3Insight(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const applyExceptionFix = (exceptionId: string) => {
    setExceptions((prev) =>
      prev.map((exc) => {
        if (exc.id === exceptionId) {
          return { ...exc, applied: true };
        }
        return exc;
      })
    );
    // Update routes to reflect stop transfer if R-124
    if (exceptionId === 'exc-delay-r124') {
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id === 'route-r124') {
            return { ...r, status: 'IN_TRANSIT', color: '#10b981', stops: 4, distanceKm: 24, eta: '13:58' };
          }
          if (r.id === 'route-r131') {
            return { ...r, stops: 10, distanceKm: 32 };
          }
          return r;
        })
      );
      addToast('Exception Resolved', 'Stops 4 & 5 reassigned to Route R-131. Route R-124 back within SLA window.', 'success');
    } else {
      addToast('Exception Action Applied', 'Operational mitigation queued for audit verification.', 'info');
    }
  };

  const placeSmartOrder = (
    storeName: string,
    items: Array<{ name: string; quantity: number; unitPricePaise: number }>
  ) => {
    const orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalPaise = items.reduce((sum, item) => sum + item.quantity * item.unitPricePaise, 0);

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      storeName,
      storeLocality: 'Indiranagar',
      valuePaise: totalPaise,
      supplierName: 'Apex FMCG Distribution Hub',
      status: 'CONFIRMED',
      deliveryRoute: 'Route R-124',
      vehicleCode: 'V-027',
      createdAt: 'Just now',
      eta: 'Tomorrow 10:00',
      itemCount: items.length,
      items,
      timeline: [
        { time: 'Just now', event: 'Order confirmed and allocated across suppliers', status: 'DONE' },
        { time: 'Today 18:00', event: 'Scheduled dispatch bay staging', status: 'PENDING' },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    addToast('Smart Order Placed', `${orderNum} generated across 3 suppliers totaling ₹${(totalPaise / 100).toLocaleString('en-IN')}`, 'success');
    return orderNum;
  };

  const runRouteOptimization = () => {
    setOptimizationState('running');
    setOptimizationStep(1);

    const steps = [
      { step: 1, delay: 600 },
      { step: 2, delay: 1200 },
      { step: 3, delay: 1800 },
      { step: 4, delay: 2400 },
      { step: 5, delay: 3000 },
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setOptimizationStep(step);
        if (step === 5) {
          setOptimizationState('completed');
          addToast('Optimization Complete', 'Network distance minimized: -421 km, fleet reduced by 11 vehicles.', 'info');
        }
      }, delay);
    });
  };

  const applyRouteOptimization = () => {
    setOptimizationState('applied');
    addToast('Optimized Network Applied', '61 vehicle schedules synced to dispatch telemetry.', 'success');
  };

  const applyConsolidation = () => {
    setConsolidationState('applied');
    addToast('Consolidation Applied', '12 orders consolidated into 4 vehicle runs. 16.8 km saved.', 'success');
  };

  const applyReturnLoad = () => {
    setReturnLoadState('applied');
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.code === 'V-027') {
          return {
            ...v,
            currentCapacityPct: 91,
            currentLoadKg: 455,
            returnCapacityPct: 9,
          };
        }
        return v;
      })
    );
    addToast('Return Load Added', 'Delta East Hub backhaul assigned to V-027. Utilization boosted to 91%.', 'success');
  };

  return (
    <LogisticsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        workspaceMode,
        setWorkspaceMode,
        activeScenario,
        setActiveScenario,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        orders,
        exceptions,
        vehicles,
        routes,
        stores,
        selectedOrder,
        setSelectedOrder,
        selectedVehicle,
        setSelectedVehicle,
        selectedStore,
        setSelectedStore,
        selectedH3Insight,
        setSelectedH3Insight,
        commandPaletteOpen,
        setCommandPaletteOpen,
        copilotOpen,
        setCopilotOpen,
        toasts,
        addToast,
        removeToast,
        consolidationState,
        setConsolidationState,
        applyConsolidation,
        optimizationState,
        optimizationStep,
        runRouteOptimization,
        applyRouteOptimization,
        returnLoadState,
        setReturnLoadState,
        applyReturnLoad,
        applyExceptionFix,
        placeSmartOrder,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const ctx = useContext(LogisticsContext);
  if (!ctx) {
    throw new Error('useLogistics must be used within LogisticsProvider');
  }
  return ctx;
}
