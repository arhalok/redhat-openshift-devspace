'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { OrderRecord } from '../../lib/demo-data';
import { StatusBadge, mapOrderStatusToVariant } from '../common/StatusBadge';
import { Drawer } from '../common/Drawer';
import { EmptyState } from '../common/EmptyState';
import {
  ShoppingCart,
  Clock,
  Truck,
  Building2,
  Package,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
  Search,
  Check,
  Plus,
  ShieldAlert,
} from 'lucide-react';

export function OrderManagementView() {
  const { orders, selectedOrder, setSelectedOrder, setOrderCreationModalOpen, addToast } = useLogistics();

  const [activeTab, setActiveTab] = useState<
    'ALL' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'EXCEPTION'
  >('ALL');

  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDispatchOrder, setConfirmDispatchOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesTab = activeTab === 'ALL' || ord.status === activeTab;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs: Array<{
    id: 'ALL' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'EXCEPTION';
    label: string;
  }> = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'PREPARING', label: 'Preparing' },
    { id: 'IN_TRANSIT', label: 'In Transit' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'EXCEPTION', label: 'Exceptions' },
  ];

  const handleExecuteDispatch = () => {
    if (!confirmDispatchOrder) return;
    addToast(
      'Vehicle Dispatched',
      `Order ${confirmDispatchOrder.orderNumber} staged onto route ${confirmDispatchOrder.deliveryRoute}.`,
      'success'
    );
    setConfirmDispatchOrder(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Order Management
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
              STRICT STATE MACHINE
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Tracking lifecycle state transitions across kirana stores and regional distribution hubs.
          </p>
        </div>

        {/* Search & Rapid Order Creation CTA */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, store, vendor..."
              className="w-full bg-[#111827] border border-gray-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setOrderCreationModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order (&lt;30s)</span>
          </button>
        </div>
      </div>

      {/* Tabs (Section 18) */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const count =
            tab.id === 'ALL'
              ? orders.length
              : orders.filter((o) => o.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-blue-800 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Data Table (Section 18) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found matching this filter"
            description="Create a replenishment order or change the active lifecycle status tab."
            actionText="Create Order Now"
            onAction={() => setOrderCreationModalOpen(true)}
            icon={<ShoppingCart className="w-6 h-6" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Store</th>
                  <th className="py-3.5 px-4">Value</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Delivery Route</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-gray-800/50 cursor-pointer transition group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white group-hover:text-blue-400">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{ord.storeName}</div>
                      <div className="text-[11px] text-gray-500">{ord.storeLocality}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ₹{(ord.valuePaise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{ord.supplierName}</td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        label={ord.status}
                        variant={mapOrderStatusToVariant(ord.status)}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400">
                      <div className="text-gray-200">{ord.deliveryRoute}</div>
                      <div className="text-[10px] text-gray-500">{ord.vehicleCode}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{ord.createdAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-400 hover:text-blue-300 p-1 rounded">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Drawer (Section 19) */}
      {selectedOrder && (
        <Drawer
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={selectedOrder.orderNumber}
          subtitle={`Detailed dispatch lifecycle for ${selectedOrder.storeName}`}
          footer={
            <>
              {selectedOrder.status === 'CONFIRMED' && (
                <button
                  onClick={() => setConfirmDispatchOrder(selectedOrder)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow"
                >
                  Dispatch Vehicle
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-5">
            {/* Header info card */}
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-400">Current Status</div>
                <div className="mt-1">
                  <StatusBadge
                    label={selectedOrder.status}
                    variant={mapOrderStatusToVariant(selectedOrder.status)}
                    size="md"
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-gray-400">Total Value</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ₹{(selectedOrder.valuePaise / 100).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Store & Supplier */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Store</div>
                <div className="font-semibold text-white mt-0.5">{selectedOrder.storeName}</div>
                <div className="text-[11px] text-gray-400">{selectedOrder.storeLocality}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Supplier</div>
                <div className="font-semibold text-white mt-0.5">{selectedOrder.supplierName}</div>
                <div className="text-[11px] text-gray-400">North Bangalore Hub</div>
              </div>
            </div>

            {/* Delivery Metadata */}
            <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs">
              <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1">
                Delivery Telemetry
              </div>
              <div className="grid grid-cols-3 gap-2 text-gray-300">
                <div>
                  <span className="text-gray-500 text-[11px]">Route:</span>{' '}
                  <span className="font-bold text-white">{selectedOrder.deliveryRoute}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px]">Vehicle:</span>{' '}
                  <span className="font-bold text-white">{selectedOrder.vehicleCode}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px]">ETA:</span>{' '}
                  <span className="font-bold text-emerald-400">{selectedOrder.eta}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Items ({selectedOrder.itemCount} SKUs)
              </h4>
              <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg max-h-44 overflow-y-auto">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between text-xs">
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-mono text-gray-300">
                      ₹{((item.quantity * item.unitPricePaise) / 100).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Lifecycle Step Timeline
              </h4>
              <div className="relative pl-6 space-y-4 border-l border-gray-800 ml-2">
                {selectedOrder.timeline.map((step, idx) => {
                  const isDone = step.status === 'DONE';
                  const isActive = step.status === 'ACTIVE';

                  return (
                    <div key={idx} className="relative text-xs">
                      <span
                        className={`absolute -left-[31px] top-0.5 w-3 h-3 rounded-full border-2 ${
                          isDone
                            ? 'bg-emerald-500 border-gray-900'
                            : isActive
                            ? 'bg-blue-500 border-gray-900 animate-ping'
                            : 'bg-gray-800 border-gray-700'
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-400 text-[11px]">
                          {step.time}
                        </span>
                        <span
                          className={`font-semibold ${
                            isDone ? 'text-white' : isActive ? 'text-blue-400' : 'text-gray-500'
                          }`}
                        >
                          {step.event}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Confirmation Dialog for Irreversible Operations (Section 16) */}
      {confirmDispatchOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmDispatchOrder(null)}
          />

          <div className="relative w-full max-w-md bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Vehicle Dispatch
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Section 16: This action will dispatch vehicle {confirmDispatchOrder.vehicleCode} onto {confirmDispatchOrder.deliveryRoute}. Once rolling, stops cannot be retracted without return penalty.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDispatchOrder(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDispatch}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
