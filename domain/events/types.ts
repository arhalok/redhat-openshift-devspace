/**
 * Domain Events & Audit Log Contract
 * Sections 22 & 24 of Phase 1 Technical Specification
 */

export interface DomainEvent<T = unknown> {
  id: string;
  type: string;
  workspaceId: string;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  payload: T;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  createdAt: string;
}
