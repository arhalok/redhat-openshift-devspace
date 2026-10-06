/**
 * Order Domain Service Implementation
 * Sections 5, 6, 20, 21, 35 of Phase 1 Technical Specification
 */

import { Order, OrderLine, OrderStatus, canTransitionOrder } from '../../domain/orders/types';
import { AuditLog, DomainEvent } from '../../domain/events/types';

export interface CreateOrderCommand {
  workspaceId: string;
  storeId: string;
  supplierId?: string;
  lines: Array<{
    productId: string;
    quantity: number;
    unitPricePaise: number;
  }>;
  requestedDeliveryAt?: string;
  idempotencyKey?: string;
}

export class OrderService {
  private orders: Map<string, Order> = new Map();
  private auditLogs: AuditLog[] = [];
  private events: DomainEvent[] = [];

  async createOrder(command: CreateOrderCommand): Promise<Order> {
    if (!command.lines || command.lines.length === 0) {
      throw new Error('Order must contain at least one order line');
    }

    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let subtotalPaise = 0;
    const orderLines: OrderLine[] = command.lines.map((line, idx) => {
      const lineTotal = line.quantity * line.unitPricePaise;
      subtotalPaise += lineTotal;
      return {
        id: `line-${orderId}-${idx + 1}`,
        orderId,
        productId: line.productId,
        requestedQuantity: line.quantity,
        confirmedQuantity: 0,
        fulfilledQuantity: 0,
        unitPricePaise: line.unitPricePaise,
        lineTotalPaise: lineTotal,
      };
    });

    const order: Order = {
      id: orderId,
      orderNumber,
      workspaceId: command.workspaceId,
      storeId: command.storeId,
      supplierId: command.supplierId,
      status: 'DRAFT',
      priority: 'NORMAL',
      subtotalPaise,
      discountsPaise: 0,
      taxesPaise: Math.round(subtotalPaise * 0.05), // 5% GST in minor units
      deliveryFeePaise: 25000,                      // ₹250.00
      totalPaise: subtotalPaise + Math.round(subtotalPaise * 0.05) + 25000,
      requestedDeliveryAt: command.requestedDeliveryAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      lines: orderLines,
    };

    this.orders.set(orderId, order);

    // Audit log (Section 24)
    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      workspaceId: command.workspaceId,
      action: 'ORDER_CREATED',
      entityType: 'ORDER',
      entityId: orderId,
      after: order,
      createdAt: new Date().toISOString(),
    });

    // Domain event (Section 22)
    this.events.push({
      id: `evt-${Date.now()}`,
      type: 'ORDER_CREATED',
      workspaceId: command.workspaceId,
      aggregateType: 'ORDER',
      aggregateId: orderId,
      occurredAt: new Date().toISOString(),
      version: 1,
      payload: { orderNumber, totalPaise: order.totalPaise },
    });

    return order;
  }

  async submitOrder(orderId: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (!canTransitionOrder(order.status, 'SUBMITTED')) {
      throw new Error(`Invalid state transition from ${order.status} to SUBMITTED`);
    }

    order.status = 'SUBMITTED';
    order.version += 1;
    order.updatedAt = new Date().toISOString();

    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      workspaceId: order.workspaceId,
      action: 'ORDER_SUBMITTED',
      entityType: 'ORDER',
      entityId: orderId,
      after: order,
      createdAt: new Date().toISOString(),
    });

    this.events.push({
      id: `evt-${Date.now()}`,
      type: 'ORDER_SUBMITTED',
      workspaceId: order.workspaceId,
      aggregateType: 'ORDER',
      aggregateId: orderId,
      occurredAt: new Date().toISOString(),
      version: order.version,
      payload: { orderNumber: order.orderNumber },
    });

    return order;
  }

  async transitionOrder(orderId: string, nextStatus: OrderStatus, expectedVersion: number): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Optimistic concurrency check (Section 21)
    if (order.version !== expectedVersion) {
      throw new Error(`409 Conflict: Order version mismatch (${order.version} !== ${expectedVersion})`);
    }

    if (!canTransitionOrder(order.status, nextStatus)) {
      throw new Error(`422 Unprocessable: Cannot transition from ${order.status} to ${nextStatus}`);
    }

    const previousStatus = order.status;
    order.status = nextStatus;
    order.version += 1;
    order.updatedAt = new Date().toISOString();

    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      workspaceId: order.workspaceId,
      action: `ORDER_${nextStatus}`,
      entityType: 'ORDER',
      entityId: orderId,
      before: { status: previousStatus },
      after: { status: nextStatus },
      createdAt: new Date().toISOString(),
    });

    return order;
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }
}
