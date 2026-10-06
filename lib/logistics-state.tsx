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
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface TelemetryEvent {
  event: string;
  timestamp: string;
  meta?: Record<string, any>;
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
  keyboardHelpOpen: boolean;
  setKeyboardHelpOpen: (open: boolean) => void;
  orderCreationModalOpen: boolean;
  setOrderCreationModalOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  addToast: (
    title: string,
    message?: string,
    type?: 'success' | 'info' | 'warning' | 'error',
    action?: { label: string; onClick: () => void },
    durationMs?: number
  ) => void;
  removeToast: (id: string) => void;

  // Freshness & Demo Management
  lastUpdated: string;
  refreshTelemetry: () => void;
  resetDemo: () => Promise<void>;

  // UX Telemetry (Section 53)
  telemetryEvents: TelemetryEvent[];
  trackTelemetry: (event: string, meta?: Record<string, any>) => void;

  // Golden UX Journey (Section 56)
  goldenJourneyActive: boolean;
  goldenJourneyStep: number;
  startGoldenJourney: () => void;
  advanceGoldenJourney: () => void;
  stopGoldenJourney: () => void;

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

  // Actions & Undo (Section 16)
  applyExceptionFix: (exceptionId: string) => void;
  placeSmartOrder: (
    storeName: string,
    items: Array<{ name: string; quantity: number; unitPricePaise: number }>,
    supplierName?: string
  ) => string;
  undoLastOrder: () => void;
  lastCreatedOrderId: string | null;

  // Dismissals
  dismissedRecIds: string[];
  dismissRecommendation: (id: string) => void;
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
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [orderCreationModalOpen, setOrderCreationModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [consolidationState, setConsolidationState] = useState<'idle' | 'preview' | 'applied'>('idle');
  const [optimizationState, setOptimizationState] = useState<'idle' | 'running' | 'completed' | 'applied'>('idle');
  const [optimizationStep, setOptimizationStep] = useState(0);
  const [returnLoadState, setReturnLoadState] = useState<'idle' | 'preview' | 'applied'>('idle');

  // Freshness & Telemetry
  const [lastUpdated, setLastUpdated] = useState('2 min ago');
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([]);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(null);
  const [dismissedRecIds, setDismissedRecIds] = useState<string[]>([]);

  // Golden UX Journey State (Section 56)
  const [goldenJourneyActive, setGoldenJourneyActive] = useState(false);
  const [goldenJourneyStep, setGoldenJourneyStep] = useState(1);

  const trackTelemetry = (event: string, meta?: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    setTelemetryEvents((prev) => [...prev, { event, timestamp, meta }]);
    if (typeof window !== 'undefined') {
      // Light non-intrusive log for validation
      console.debug(`[Telemetry] ${event}`, meta);
    }
  };

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success',
    action?: { label: string; onClick: () => void },
    durationMs = 4500
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener (Ctrl+K, Esc, ?, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setKeyboardHelpOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setKeyboardHelpOpen(false);
        setOrderCreationModalOpen(false);
        setSelectedOrder(null);
        setSelectedVehicle(null);
        setSelectedH3Insight(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshTelemetry = () => {
    setLastUpdated('Just now');
    trackTelemetry('telemetry_refreshed');
    addToast('Telemetry Refreshed', 'Synced live dispatch, GPS, and inventory data across Bangalore network.', 'info');
  };

  const resetDemo = async () => {
    try {
      trackTelemetry('demo_reset');
      setOrders(BANGALORE_ORDERS);
      setExceptions(BANGALORE_EXCEPTIONS);
      setVehicles(BANGALORE_VEHICLES);
      setRoutes(BANGALORE_ROUTES);
      setStores(BANGALORE_STORES);
      setConsolidationState('idle');
      setOptimizationState('idle');
      setOptimizationStep(0);
      setReturnLoadState('idle');
      setDismissedRecIds([]);
      setGoldenJourneyActive(false);
      setGoldenJourneyStep(1);
      setLastUpdated('Just now');

      // Attempt call to server API reset endpoint if online
      try {
        await fetch('/api/v1/demo/reset', { method: 'POST' });
      } catch {
        // Fallback gracefully in standalone mock
      }

      addToast('Demo State Reset', 'Restored 100% deterministic baseline data and cleared scenario overrides.', 'success');
    } catch {
      addToast('Demo Reset Completed', 'Baseline parameters restored.', 'info');
    }
  };

  // Golden Journey Walkthrough Methods
  const startGoldenJourney = () => {
    setGoldenJourneyActive(true);
    setGoldenJourneyStep(1);
    setActiveTab('overview');
    trackTelemetry('golden_journey_started');
    addToast('Golden Journey Started', 'Follow the guided path through the intelligent logistics story.', 'info');
  };

  const advanceGoldenJourney = () => {
    setGoldenJourneyStep((prev) => {
      const next = prev + 1;
      trackTelemetry('golden_journey_step', { step: next });
      if (next === 2) setActiveTab('stores');
      else if (next === 3) setActiveTab('suppliers');
      else if (next === 4) setActiveTab('consolidation');
      else if (next === 5) setActiveTab('logistics');
      else if (next === 6) setActiveTab('return-capacity');
      else if (next === 7) setActiveTab('simulator');
      else if (next === 8) setActiveTab('copilot');
      else if (next > 8) {
        setGoldenJourneyActive(false);
        addToast('Golden Journey Completed!', 'You experienced the full loop from alert to AI mitigation.', 'success');
        return 1;
      }
      return next;
    });
  };

  const stopGoldenJourney = () => {
    setGoldenJourneyActive(false);
    trackTelemetry('golden_journey_stopped');
  };

  const dismissRecommendation = (id: string) => {
    setDismissedRecIds((prev) => [...prev, id]);
    trackTelemetry('recommendation_dismissed', { id });
    addToast('Recommendation Dismissed', 'Audit trail updated; recommendation will not re-surface today.', 'info', {
      label: 'Undo',
      onClick: () => {
        setDismissedRecIds((prev) => prev.filter((item) => item !== id));
      },
    });
  };

  const applyExceptionFix = (exceptionId: string) => {
    trackTelemetry('exception_action_applied', { exceptionId });
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
    items: Array<{ name: string; quantity: number; unitPricePaise: number }>,
    supplierName = 'Apex FMCG Distribution Hub'
  ) => {
    const orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalPaise = items.reduce((sum, item) => sum + item.quantity * item.unitPricePaise, 0);

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      storeName,
      storeLocality: 'Indiranagar',
      valuePaise: totalPaise,
      supplierName,
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
    setLastCreatedOrderId(newOrder.id);
    trackTelemetry('order_created', { orderNumber: orderNum, storeName, totalPaise });

    addToast(
      'Order Placed Successfully',
      `${orderNum} generated (${items.length} items, ₹${(totalPaise / 100).toLocaleString('en-IN')})`,
      'success',
      {
        label: 'Undo',
        onClick: () => undoLastOrder(),
      },
      8000
    );

    return orderNum;
  };

  const undoLastOrder = () => {
    if (!lastCreatedOrderId) return;
    trackTelemetry('order_cancelled', { orderId: lastCreatedOrderId });
    setOrders((prev) => prev.filter((o) => o.id !== lastCreatedOrderId));
    setLastCreatedOrderId(null);
    addToast('Order Cancelled', 'Reverted optimistic order placement. Inventory hold released.', 'info');
  };

  const runRouteOptimization = () => {
    trackTelemetry('route_optimized');
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
    trackTelemetry('route_optimization_applied');
    setOptimizationState('applied');
    addToast('Optimized Network Applied', '61 vehicle schedules synced to dispatch telemetry.', 'success');
  };

  const applyConsolidation = () => {
    trackTelemetry('consolidation_applied');
    setConsolidationState('applied');
    addToast('Consolidation Applied', '12 orders consolidated into 4 vehicle runs. 16.8 km saved.', 'success');
  };

  const applyReturnLoad = () => {
    trackTelemetry('return_capacity_matched');
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
        keyboardHelpOpen,
        setKeyboardHelpOpen,
        orderCreationModalOpen,
        setOrderCreationModalOpen,
        toasts,
        addToast,
        removeToast,
        lastUpdated,
        refreshTelemetry,
        resetDemo,
        telemetryEvents,
        trackTelemetry,
        goldenJourneyActive,
        goldenJourneyStep,
        startGoldenJourney,
        advanceGoldenJourney,
        stopGoldenJourney,
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
        undoLastOrder,
        lastCreatedOrderId,
        dismissedRecIds,
        dismissRecommendation,
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
