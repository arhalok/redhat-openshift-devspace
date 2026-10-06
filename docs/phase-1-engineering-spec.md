# Phase 1 — Engineering Build Specification
## Part 5 — SQL, Types, APIs, Seed Data, Demo Intelligence & Test Fixtures

> This document is the implementation contract between the Phase 1 product specification and the codebase.
>
> The goal is to make Phase 1 fully buildable while preserving clean seams for replacing demo logic with production routing, ML, integrations, GPS, payments, and AI services later.

---

# 1. Implementation Philosophy

Phase 1 must be:

- visually convincing
- functionally coherent
- deterministic
- testable
- replaceable
- easy for an AI coding agent to implement

Do not build a fake frontend disconnected from the domain.

Do not build production-scale infrastructure prematurely.

Use:

```text
Real application architecture
+
Real database
+
Real API/service contracts
+
Deterministic demo implementations
```

Later replace individual implementations without redesigning the frontend.

---

# 2. Recommended Repository Structure

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── orders/
│   │   ├── stores/
│   │   ├── suppliers/
│   │   ├── inventory/
│   │   ├── logistics/
│   │   ├── network/
│   │   ├── insights/
│   │   ├── simulator/
│   │   └── ai/
│   ├── api/
│   │   ├── orders/
│   │   ├── stores/
│   │   ├── suppliers/
│   │   ├── inventory/
│   │   ├── routes/
│   │   ├── recommendations/
│   │   ├── simulation/
│   │   └── ai/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── map/
│   ├── orders/
│   ├── logistics/
│   ├── suppliers/
│   ├── inventory/
│   ├── insights/
│   ├── simulation/
│   └── ai/
│
├── domain/
│   ├── order/
│   ├── inventory/
│   ├── supplier/
│   ├── logistics/
│   ├── recommendation/
│   ├── simulation/
│   └── ai/
│
├── services/
│   ├── orders/
│   ├── inventory/
│   ├── suppliers/
│   ├── routing/
│   ├── optimization/
│   ├── recommendations/
│   ├── simulation/
│   └── ai/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── events/
│   ├── validation/
│   ├── errors/
│   ├── idempotency/
│   └── observability/
│
├── types/
│   └── api/
│
└── config/
    ├── feature-flags.ts
    └── demo.ts

database/
├── migrations/
├── seeds/
└── fixtures/

tests/
├── unit/
├── integration/
├── api/
└── e2e/
```

---

# 3. Database Technology

Use:

```text
PostgreSQL
PostGIS
```

Optional later:

```text
pgvector
```

Do not add vector search until a Phase 1 feature actually needs it.

---

# 4. Database Conventions

Use:

```text
UUID primary keys
timestamptz
numeric for money
integer for quantities
explicit foreign keys
created_at
updated_at
```

Money must never use floating-point values.

Use:

```sql
numeric(14,2)
```

for monetary amounts.

Coordinates:

```text
latitude
longitude
```

plus PostGIS:

```text
geography(Point, 4326)
```

where spatial queries are needed.

---

# 5. Core Tables

Phase 1 minimum:

```text
users
organizations
organization_members
stores
suppliers
warehouses
products
product_supplier
inventory
orders
order_items
vehicles
routes
route_stops
recommendations
exceptions
events
```

---

# 6. Organizations

```sql
organizations
-------------------------
id
name
slug
type
created_at
updated_at
```

Types:

```text
COMPANY
KIRANA_NETWORK
SUPPLIER_NETWORK
ADMIN
```

Do not hard-code one organization into business logic.

---

# 7. Users

```sql
users
-------------------------
id
name
email
phone
created_at
updated_at
```

Authentication provider details should remain separate from domain records where possible.

---

# 8. Organization Members

```sql
organization_members
-------------------------
id
organization_id
user_id
role
created_at
```

Roles:

```text
OWNER
ADMIN
OPERATOR
STORE_MANAGER
VIEWER
```

Authorization must be enforced server-side.

---

# 9. Stores

```sql
stores
-------------------------
id
organization_id
name
owner_name
phone
address
city
state
postal_code
latitude
longitude
location geography(Point,4326)
status
receiving_start
receiving_end
created_at
updated_at
```

Store status:

```text
ACTIVE
INACTIVE
SUSPENDED
```

---

# 10. Suppliers

```sql
suppliers
-------------------------
id
organization_id
name
phone
address
city
state
postal_code
latitude
longitude
location geography(Point,4326)
reliability_score
fill_rate
average_lead_time_hours
status
created_at
updated_at
```

Scores are internal product metrics, not necessarily externally verified claims.

---

# 11. Warehouses

```sql
warehouses
-------------------------
id
organization_id
name
address
city
state
latitude
longitude
location geography(Point,4326)
capacity_units
status
created_at
updated_at
```

---

# 12. Products

```sql
products
-------------------------
id
organization_id
sku
name
brand
category
subcategory
barcode
unit
pack_size
weight_kg
volume_m3
status
created_at
updated_at
```

Important:

A product record is not the same as a supplier listing.

---

# 13. Product Supplier

```sql
product_supplier
-------------------------
id
product_id
supplier_id
supplier_sku
price
minimum_order_quantity
available_quantity
lead_time_hours
is_active
updated_at
```

This allows multiple suppliers to offer the same logical product.

---

# 14. Inventory

```sql
inventory
-------------------------
id
store_id
product_id
on_hand
reserved
reorder_point
safety_stock
updated_at
```

Available quantity:

```text
available = on_hand - reserved
```

Do not duplicate available quantity as an independently editable field.

---

# 15. Orders

```sql
orders
-------------------------
id
order_number
store_id
supplier_id
status
subtotal
delivery_fee
discount
total
currency
requested_delivery_start
requested_delivery_end
created_at
updated_at
```

Order statuses:

```text
DRAFT
SUBMITTED
CONFIRMED
PREPARING
READY
ASSIGNED
IN_TRANSIT
DELIVERED
CANCELLED
EXCEPTION
```

---

# 16. Order Items

```sql
order_items
-------------------------
id
order_id
product_id
quantity
unit_price
subtotal
created_at
```

Never trust client-provided totals.

The server recalculates:

```text
quantity × unit_price
```

and validates totals.

---

# 17. Vehicles

```sql
vehicles
-------------------------
id
organization_id
vehicle_number
vehicle_type
capacity_weight_kg
capacity_volume_m3
current_weight_kg
current_volume_m3
latitude
longitude
location geography(Point,4326)
status
updated_at
```

Statuses:

```text
AVAILABLE
ASSIGNED
IN_TRANSIT
UNAVAILABLE
MAINTENANCE
```

---

# 18. Routes

```sql
routes
-------------------------
id
route_number
vehicle_id
status
planned_distance_km
planned_duration_minutes
estimated_cost
utilization_percent
optimization_version
planned_start
planned_end
created_at
updated_at
```

---

# 19. Route Stops

```sql
route_stops
-------------------------
id
route_id
sequence
store_id
order_id
planned_arrival
actual_arrival
status
distance_from_previous_km
duration_from_previous_minutes
```

Stop statuses:

```text
PLANNED
EN_ROUTE
ARRIVED
DELIVERED
FAILED
SKIPPED
```

---

# 20. Recommendations

```sql
recommendations
-------------------------
id
organization_id
type
entity_type
entity_id
title
reason
confidence
impact
payload jsonb
status
created_at
expires_at
```

Types:

```text
REPLENISHMENT
SUPPLIER
CONSOLIDATION
RETURN_CAPACITY
ROUTE
STOCKOUT
```

Statuses:

```text
NEW
VIEWED
ACCEPTED
DISMISSED
EXPIRED
```

---

# 21. Exceptions

```sql
exceptions
-------------------------
id
organization_id
type
severity
entity_type
entity_id
title
description
recommended_action
status
created_at
resolved_at
```

Severity:

```text
INFO
WARNING
CRITICAL
```

---

# 22. Events

Use an append-oriented event table for Phase 1.

```sql
events
-------------------------
id
organization_id
event_type
entity_type
entity_id
payload jsonb
created_at
```

Examples:

```text
ORDER_CREATED
ORDER_CONFIRMED
ORDER_ASSIGNED
ROUTE_OPTIMIZED
DELIVERY_STARTED
DELIVERY_COMPLETED
RECOMMENDATION_CREATED
EXCEPTION_CREATED
```

---

# 23. TypeScript Domain Types

Create canonical domain types.

```ts
export type OrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "EXCEPTION";
```

```ts
export interface Product {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  category: string;
  unit: string;
  packSize?: string;
  weightKg?: number;
  volumeM3?: number;
}
```

```ts
export interface InventoryPosition {
  storeId: string;
  productId: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  safetyStock: number;
}
```

---

# 24. Recommendation Contract

```ts
export interface Recommendation {
  id: string;
  type:
    | "REPLENISHMENT"
    | "SUPPLIER"
    | "CONSOLIDATION"
    | "RETURN_CAPACITY"
    | "ROUTE"
    | "STOCKOUT";

  title: string;
  reason: string[];
  confidence?: number;
  impact?: {
    label: string;
    value: number;
    unit: string;
  };

  entity: {
    type: string;
    id: string;
  };

  actions: RecommendationAction[];
}
```

Actions:

```ts
export interface RecommendationAction {
  id: string;
  label: string;
  actionType: string;
  requiresConfirmation: boolean;
}
```

---

# 25. Route Plan Contract

```ts
export interface RoutePlan {
  id: string;
  vehicleId: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  utilizationPercent: number;
  estimatedCost?: number;
}
```

This interface must not depend directly on OR-Tools.

---

# 26. Route Optimization Request

```ts
export interface OptimizeRoutesRequest {
  orderIds: string[];
  vehicleIds: string[];

  constraints: {
    maxRouteDurationMinutes?: number;
    respectTimeWindows: boolean;
    respectVehicleCapacity: boolean;
  };
}
```

---

# 27. Consolidation Contract

```ts
export interface ConsolidationOpportunity {
  id: string;
  orderIds: string[];
  currentRouteCount: number;
  proposedRouteCount: number;
  currentDistanceKm: number;
  proposedDistanceKm: number;
  estimatedImpact: {
    distanceSavedKm: number;
    percentage: number;
  };
}
```

---

# 28. Return Capacity Contract

```ts
export interface ReturnCapacityOpportunity {
  id: string;
  vehicleId: string;
  routeId: string;

  remainingCapacity: {
    weightKg: number;
    volumeM3: number;
  };

  pickup: {
    supplierId: string;
    latitude: number;
    longitude: number;
  };

  load: {
    weightKg: number;
    volumeM3: number;
  };

  additionalDistanceKm: number;
}
```

---

# 29. Simulation Contract

```ts
export interface SimulationScenario {
  demandMultiplier: number;
  vehicleAvailabilityMultiplier: number;
  disabledWarehouseIds: string[];
  maxDeliveryWindowMinutes: number;
}
```

Result:

```ts
export interface SimulationResult {
  baseline: NetworkMetrics;
  simulated: NetworkMetrics;
  differences: NetworkDifferences;
  recommendations: string[];
}
```

---

# 30. Network Metrics

```ts
export interface NetworkMetrics {
  orderCount: number;
  vehicleCount: number;
  routeCount: number;
  totalDistanceKm: number;
  utilizationPercent: number;
  atRiskOrderCount: number;
  estimatedCost: number;
}
```

---

# 31. Service Interfaces

Create interfaces before implementations.

```ts
export interface RoutingService {
  getRoute(request: RouteRequest): Promise<RouteResult>;
  getMatrix(request: MatrixRequest): Promise<TravelMatrix>;
}
```

```ts
export interface OptimizationService {
  optimize(request: OptimizeRoutesRequest): Promise<RoutePlan>;
}
```

```ts
export interface DemandService {
  getReplenishmentRecommendations(
    storeId: string
  ): Promise<Recommendation[]>;
}
```

```ts
export interface SupplierRecommendationService {
  recommendSuppliers(
    productId: string,
    quantity: number,
    constraints?: SupplierConstraints
  ): Promise<SupplierRecommendation[]>;
}
```

---

# 32. Demo Implementations

Phase 1 implementations:

```text
DemoRoutingService
DemoOptimizationService
DemoDemandService
DemoSupplierRecommendationService
DemoConsolidationService
DemoCapacityMatchingService
DemoSimulationService
```

Do not name them:

```text
FakeService
```

because they are legitimate deterministic prototype implementations.

---

# 33. Demo Routing

Input:

```text
origin
destination
```

Output:

```text
distance
duration
polyline
```

For Phase 1:

- use seeded route geometry
- use deterministic calculations
- optionally integrate a real routing engine if convenient
- keep the interface unchanged

Never randomly change a route every refresh.

---

# 34. Demo Demand Algorithm

Use a deterministic scoring model.

Example:

```text
riskScore =
  stockPressure * 0.35
  + demandTrend * 0.25
  + orderFrequency * 0.20
  + leadTimePressure * 0.20
```

Then:

```text
riskScore >= 0.75 → HIGH
0.50–0.74 → MEDIUM
< 0.50 → LOW
```

This is prototype decision logic, not a validated forecasting model.

---

# 35. Replenishment Quantity

For prototype:

```text
targetStock =
  expectedDailyDemand * coverageDays
  + safetyStock
```

Then:

```text
recommendedQuantity =
  max(0, targetStock - availableStock)
```

Round according to MOQ/pack size.

Document these assumptions in code.

---

# 36. Demo Supplier Scoring

Example:

```text
score =
  priceScore * 0.35
  + reliabilityScore * 0.25
  + availabilityScore * 0.20
  + leadTimeScore * 0.15
  + distanceScore * 0.05
```

The weights must be configuration, not scattered magic numbers.

---

# 37. Demo Consolidation

Candidate orders can be consolidated when:

```text
same supplier
+
same delivery window
+
nearby geographic cells
+
compatible vehicle capacity
```

Use H3 cell proximity in the service abstraction.

For initial demo mode:

```text
same H3 parent cell
```

can be sufficient.

---

# 38. Demo Return Matching

Match when:

```text
remaining vehicle capacity >= load requirement
+
pickup geographically compatible
+
time window compatible
+
additional distance below configured threshold
```

Score opportunities by:

```text
capacity utilization improvement
+
distance penalty
+
time penalty
```

---

# 39. Demo Simulation

Simulation should be deterministic.

Given the same scenario:

```text
same input
→ same result
```

Never use uncontrolled random numbers.

Use a fixed seed if randomness is required.

---

# 40. Seed Data Requirements

Minimum:

```text
1 company
2 operations users
50 kirana stores
10 suppliers
2 warehouses
100 vehicles
300 products
2,000 inventory records
500 orders
100 active routes
```

For the visual demo, generate enough geographic density to make the map meaningful.

---

# 41. Geographic Seed Data

Use one coherent demo geography.

Do not randomly scatter stores across the entire country.

Choose:

```text
one city
+
surrounding delivery region
```

with:

- dense central stores
- several outer clusters
- warehouses
- supplier locations
- route corridors

This makes clustering and route optimization visually understandable.

---

# 42. Product Categories

Use realistic FMCG-style categories:

```text
Staples
Snacks
Beverages
Biscuits
Personal Care
Home Care
Dairy
Packaged Foods
```

Do not use real company sales figures.

Product names can be synthetic.

---

# 43. Seed Scenarios

Create explicit fixtures for:

```text
normal_day
stockout_risk
supplier_delay
vehicle_capacity
consolidation_opportunity
return_capacity
route_delay
demand_spike
warehouse_failure
```

These fixtures drive demos and tests.

---

# 44. API Conventions

Use:

```text
/api/v1/...
```

Example:

```text
GET  /api/v1/orders
POST /api/v1/orders
GET  /api/v1/orders/:id
POST /api/v1/orders/:id/confirm
POST /api/v1/orders/:id/cancel
```

Recommendations:

```text
GET /api/v1/recommendations
POST /api/v1/recommendations/:id/accept
POST /api/v1/recommendations/:id/dismiss
```

Optimization:

```text
POST /api/v1/routes/optimize
POST /api/v1/consolidations/preview
POST /api/v1/return-capacity/match
```

Simulation:

```text
POST /api/v1/simulations
```

AI:

```text
POST /api/v1/ai/query
```

---

# 45. API Response Envelope

Use a consistent shape.

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "ROUTE_OPTIMIZATION_FAILED",
    "message": "Unable to optimize the selected routes.",
    "requestId": "..."
  }
}
```

Do not expose internal stack traces to users.

---

# 46. Validation

Use a schema validation library such as Zod.

Every write endpoint must validate:

```text
request body
query parameters
path parameters
authorization
business constraints
```

Never trust frontend validation alone.

---

# 47. Idempotency

Any operation that can be retried must support idempotency.

Examples:

```text
create order
confirm order
apply optimization
accept recommendation
create return load
```

Use:

```text
Idempotency-Key
```

for appropriate APIs.

---

# 48. Events

After important state transitions:

```text
ORDER_CREATED
ORDER_CONFIRMED
ORDER_ASSIGNED
ROUTE_OPTIMIZED
RECOMMENDATION_ACCEPTED
EXCEPTION_CREATED
SIMULATION_COMPLETED
```

emit a domain event.

Phase 1 can persist these events without deploying Kafka/NATS.

---

# 49. Realtime

For Phase 1:

```text
Server-Sent Events
```

is sufficient for dashboard updates.

Potential events:

```text
vehicle.position.updated
order.status.changed
route.optimized
exception.created
```

Do not introduce WebSockets unless bidirectional communication is actually needed.

---

# 50. AI Contract

AI receives tools, not direct database access.

Example tools:

```text
get_network_summary
get_delayed_orders
get_stockout_risks
get_vehicle_capacity
get_route
get_supplier_options
preview_consolidation
preview_route_optimization
run_simulation
```

Write operations:

```text
apply_route_change
accept_recommendation
create_order
```

must require explicit application-level authorization and confirmation where appropriate.

---

# 51. AI Response Schema

Prefer structured output:

```ts
interface AIResponse {
  summary: string;
  evidence: Evidence[];
  recommendations: AIRecommendation[];
  proposedActions: AIAction[];
}
```

This lets the UI render structured cards rather than parsing arbitrary prose.

---

# 52. AI Guardrails

The AI must not:

- invent database facts
- claim a route was optimized if it was not
- claim live GPS access if unavailable
- claim supplier availability without data
- silently execute sensitive actions
- bypass authorization
- expose another organization's data

If information is unavailable:

```text
I don't have enough operational data to determine that.
```

---

# 53. Test Strategy

Minimum tests:

## Unit

```text
replenishment scoring
supplier scoring
consolidation matching
capacity matching
simulation calculations
order transitions
```

## Integration

```text
create order
reserve inventory
confirm supplier
create route
optimize route
accept recommendation
```

## API

Test:

```text
authentication
authorization
validation
error responses
idempotency
```

## E2E

Critical journey:

```text
Store
→ Smart Order
→ Supplier Selection
→ Order
→ Consolidation
→ Route
→ AI explanation
→ Simulation
```

---

# 54. Invariants

These must always hold.

```text
inventory.reserved <= inventory.on_hand
```

```text
order.total =
  subtotal + delivery_fee - discount
```

```text
route.vehicle utilization <= 100%
```

```text
delivered order cannot return to draft
```

```text
cancelled order cannot be delivered
```

```text
AI cannot bypass authorization
```

---

# 55. Demo Reset

Implement:

```text
POST /api/v1/demo/reset
```

The reset must:

1. clear demo transactional state
2. reload deterministic fixtures
3. reset vehicle positions
4. reset orders
5. reset recommendations
6. reset exceptions
7. return the application to the known demo state

This is essential for presentations.

---

# 56. Feature Flags

Create:

```ts
interface FeatureFlags {
  smartReplenishment: boolean;
  supplierIntelligence: boolean;
  consolidation: boolean;
  returnCapacity: boolean;
  simulator: boolean;
  aiCopilot: boolean;
  realRouting: boolean;
  realForecasting: boolean;
}
```

Phase 1 default:

```text
smartReplenishment = true
supplierIntelligence = true
consolidation = true
returnCapacity = true
simulator = true
aiCopilot = true

realRouting = false
realForecasting = false
```

---

# 57. Demo → Production Replacement Matrix

| Phase 1 | Future |
|---|---|
| Demo routing | Valhalla/other routing engine |
| Demo optimization | OR-Tools optimization |
| Demo demand | ML forecasting |
| Seed supplier data | Supplier integrations |
| Seed vehicle data | GPS/telematics |
| SSE | Event bus/WebSockets if needed |
| DB events | NATS/Kafka |
| Basic workflows | Temporal |
| Simple AI tools | Production agent/tool layer |
| Synthetic products | Real catalogs |
| Synthetic inventory | POS/ERP integration |

The frontend should not need to know which implementation is active.

---

# 58. Performance Requirements

Phase 1 targets:

```text
Initial page load:
fast enough for demo

Dashboard API:
< 500ms target for seeded data

Recommendation endpoint:
< 1s target

Demo optimization:
< 3s target

Simulation:
< 3s target
```

If a computation is intentionally longer, show progress.

Do not block the UI without feedback.

---

# 59. Security Requirements

Even in prototype:

- validate every request
- server-side authorization
- no secrets in frontend
- environment variables for credentials
- parameterized queries/ORM
- sanitize user-generated content
- audit sensitive actions
- separate organizations/tenants
- avoid exposing internal IDs unnecessarily
- rate-limit AI endpoints if externally accessible

---

# 60. Observability

At minimum log:

```text
requestId
userId
organizationId
endpoint
duration
status
error code
```

For domain actions:

```text
orderId
routeId
recommendationId
simulationId
```

Never log:

```text
passwords
tokens
API keys
sensitive payment credentials
```

---

# 61. Implementation Order

Build in this order:

```text
STEP 1
Database + migrations

STEP 2
Seed data + demo scenarios

STEP 3
Domain types

STEP 4
Validation schemas

STEP 5
Repositories/data access

STEP 6
Order service

STEP 7
Inventory service

STEP 8
Supplier recommendation service

STEP 9
Demand/replenishment service

STEP 10
Route/consolidation services

STEP 11
Return-capacity service

STEP 12
Simulation service

STEP 13
API endpoints

STEP 14
Realtime updates

STEP 15
UI integration

STEP 16
AI tool layer

STEP 17
E2E testing

STEP 18
Demo reset + polish
```

---

# 62. Coding-Agent Instructions

When using an AI coding agent:

1. Read all Phase 1 `.md` specifications first.
2. Inspect the repository before modifying files.
3. Never invent a parallel architecture.
4. Reuse existing components.
5. Respect service interfaces.
6. Never put database queries directly in UI components.
7. Never put business logic directly in React components.
8. Never hard-code demo records inside JSX.
9. Use seed fixtures.
10. Keep demo implementations deterministic.
11. Add tests for non-trivial business logic.
12. Do not install dependencies without a reason.
13. Do not modify unrelated files.
14. Do not silently change database schema without a migration.
15. Do not expose secrets.
16. Run typecheck after substantial changes.
17. Run tests after service changes.
18. Run production build before declaring Phase 1 complete.

---

# 63. Definition of Engineering Done

Phase 1 engineering is complete when:

- [x] database migrations run from a clean database
- [x] seed data loads deterministically
- [x] demo reset works
- [x] domain types exist
- [x] service interfaces exist
- [x] demo implementations exist
- [x] API contracts are validated
- [x] order lifecycle works
- [x] inventory recommendations work
- [x] supplier recommendations work
- [x] consolidation works
- [x] return-capacity matching works
- [x] simulation works
- [x] map data loads
- [x] realtime updates work where required
- [x] AI can query application data
- [x] AI actions are guarded
- [x] critical workflows have tests
- [x] authorization works
- [x] errors are handled
- [x] production build succeeds
- [x] no critical TypeScript errors remain
- [x] no uncontrolled randomness affects demo behavior
- [x] demo can be reset to a known state

---

# 64. Final Rule

The codebase should make this possible:

```text
Phase 1:

Demo service
      ↓
beautiful UI
      ↓
working product story


Phase 3:

Real engine
      ↓
same service interface
      ↓
same UI
      ↓
real intelligence
```

If replacing a demo service requires rewriting the UI, the abstraction is wrong.

If adding a new logistics algorithm requires rewriting the database, the domain model is wrong.

If adding AI requires giving the LLM direct database access, the architecture is wrong.

The Phase 1 implementation is successful when the product already feels real while the internal architecture remains ready for the real logistics system.
