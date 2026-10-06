/**
 * Zod Validation Schemas for REST API Endpoints
 * Section 46 of Phase 1 Engineering Build Specification
 */

import { z } from 'zod';

// Order creation schema (Section 15, 16)
export const CreateOrderItemSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.number().int().positive('quantity must be a positive integer'),
  unitPrice: z.number().positive('unitPrice must be positive'),
});

export const CreateOrderSchema = z.object({
  storeId: z.string().min(1, 'storeId is required'),
  supplierId: z.string().min(1, 'supplierId is required'),
  items: z.array(CreateOrderItemSchema).min(1, 'At least one item is required'),
  requestedDeliveryStart: z.string().datetime().optional(),
  requestedDeliveryEnd: z.string().datetime().optional(),
});

// Route optimization schema (Section 26)
export const OptimizeRoutesSchema = z.object({
  orderIds: z.array(z.string()).min(1, 'At least one orderId is required'),
  vehicleIds: z.array(z.string()).default([]),
  constraints: z.object({
    maxRouteDurationMinutes: z.number().positive().optional(),
    respectTimeWindows: z.boolean().default(true),
    respectVehicleCapacity: z.boolean().default(true),
  }).default({ respectTimeWindows: true, respectVehicleCapacity: true }),
});

// Simulation scenario schema (Section 29)
export const RunSimulationSchema = z.object({
  demandMultiplier: z.number().min(0.1).max(5.0).default(1.0),
  vehicleAvailabilityMultiplier: z.number().min(0.1).max(2.0).default(1.0),
  disabledWarehouseIds: z.array(z.string()).default([]),
  maxDeliveryWindowMinutes: z.number().int().positive().default(240),
});

// AI Query schema (Sections 50, 51)
export const AIQuerySchema = z
  .object({
    prompt: z.string().optional(),
    query: z.string().optional(),
    workspaceId: z.string().optional(),
    confirmActionId: z.string().optional(),
  })
  .refine((data) => !!(data.prompt || data.query), {
    message: 'prompt or query is required',
  });

// Recommendation action schema (Section 20)
export const RecommendationActionSchema = z.object({
  actionId: z.string().min(1),
  confirmed: z.boolean().default(false),
});
