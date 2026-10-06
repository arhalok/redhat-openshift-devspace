/**
 * Auditability, Activity Events, and AI Action Log
 * Sections 29 & 35 of logistics-foundation.md
 */

export interface ActivityEvent {
  id: string;
  type: string;
  actorId: string;
  organizationId: string;
  aggregateType: string;
  aggregateId: string;
  version: number;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  requestId: string;
  source: 'USER_UI' | 'SYSTEM_JOB' | 'AI_COPILOT' | 'WEBHOOK';
  occurredAt: string;
}

export interface AIAuditLog {
  id: string;
  userRequestId: string;
  userId: string;
  organizationId: string;
  userPrompt: string;
  selectedTool: string;
  toolInput: Record<string, unknown>;
  toolResult?: Record<string, unknown>;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  mutationExecuted: boolean;
  createdAt: string;
}
