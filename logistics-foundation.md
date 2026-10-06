# Kirana-to-Company Logistics Platform — Foundation Specification

**Document type:** Engineering Foundation / Architecture Contract  
**Status:** Phase 0 — Foundation  
**Purpose:** Establish a stable technical foundation for a web-first prototype that can evolve into a production B2B distribution and logistics platform without major architectural rewrites.

---

## 1. Product Definition

### 1.1 Product thesis

The platform coordinates the physical and commercial flow between:

```text
Companies / Brands
        ↓
Distributors / Suppliers / Warehouses
        ↓
Logistics Network
        ↓
Kirana Stores
```

The system should eventually help answer five operational questions:

1. **What should the store order?**
2. **Who should fulfill it?**
3. **How should demand be consolidated?**
4. **How should delivery capacity be allocated and routed?**
5. **What exceptions require human action?**

The application is therefore an **operations and distribution platform**, not only an ordering marketplace.

### 1.2 Product principles

- **Operational value over feature count.**
- **The UI exposes decisions, not raw infrastructure.**
- **Deterministic services handle money, inventory, routing constraints, and state transitions.**
- **LLMs assist with interpretation, explanation, search, and orchestration; they do not become the source of truth for transactional decisions.**
- **Every advanced capability must have a replaceable interface.**
- **Demo/simulation data must be explicitly separated from live data.**
- **No business-critical logic should be trapped inside the frontend.**
- **Prefer a modular monolith for the prototype; split services only when scale or ownership justifies it.**

---

# 2. Phase 0 Scope

Phase 0 does **not** attempt to finish the product.

It creates the architecture that allows Phase 1 to move quickly while preserving a clean path to real logistics engines.

### Phase 0 must establish

```text
Repository structure
Environment configuration
Database + migrations
Authentication boundary
Domain models
Service interfaces
API conventions
Validation
Error model
Logging
Observability hooks
Demo data / seed system
Demo-service adapters
Feature flags
Testing foundation
CI checks
UI component system
Map abstraction
AI tool boundary
```

### Phase 0 should NOT establish

```text
Nationwide logistics integrations
Production fleet telematics
Full fintech / lending
Complex warehouse automation
Microservice infrastructure
Large-scale event streaming cluster
Dozens of ML models
Real-time GPS at national scale
```

Those are later-stage concerns.

---

# 3. Target Architecture

## 3.1 Recommended architecture style

Use a **modular monolith with explicit domain boundaries**.

```text
                         ┌──────────────────────┐
                         │       WEB UI         │
                         │ Next.js / TypeScript │
                         └──────────┬───────────┘
                                    │
                              HTTP / SSE
                                    │
                         ┌──────────▼───────────┐
                         │     API / BFF        │
                         │ Auth + Validation    │
                         └──────────┬───────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
   Order Domain              Supply Domain             Logistics Domain
   Inventory                 Suppliers                 Routes / Vehicles
   Store                     Products                  Capacity / Delivery
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                           Application Services
                                    │
        ┌───────────────┬───────────┼──────────────┬───────────────┐
        ▼               ▼           ▼              ▼               ▼
   PostgreSQL        Redis      Geo Adapter     AI Adapter     Event Adapter
   + PostGIS                    / Routing       / LLM          / Message Bus
        │
        ▼
   pgvector (later / optional)
```

The architecture should allow these implementations to change without changing the UI or core domain contracts.

---

# 4. Technology Foundation

## 4.1 Web application

### Frontend

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** or another accessible component system
- **TanStack Query** where client-side server state management is required
- **Zod** for shared input validation where appropriate

### Why

The website must support two very different experiences:

```text
Kirana experience
→ extremely simple
→ mobile-friendly
→ fast actions

Operations/company experience
→ data dense
→ maps
→ exceptions
→ optimization controls
```

Use the same design system while keeping the interaction model different.

---

## 4.2 Backend

Start with a **single backend application**.

Recommended options:

- TypeScript backend within the Next.js application for the prototype, or
- a dedicated **NestJS** / Node.js service if backend complexity grows quickly.

Do not create separate microservices merely to make the architecture diagram look impressive.

The code should nevertheless be organized into modules so that extraction is possible later.

---

## 4.3 Database

### Primary database

**PostgreSQL**

### Spatial extension

**PostGIS**

### Vector search

**pgvector** later when semantic matching / document retrieval is actually needed.

### Cache

**Redis** later / where measured latency or temporary state justifies it.

PostgreSQL should remain the initial source of truth for transactional entities.

---

# 5. Repository Structure

Use a structure that separates presentation from domain logic.

```text
/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── maps/
│   ├── tables/
│   ├── orders/
│   ├── inventory/
│   ├── logistics/
│   ├── suppliers/
│   ├── insights/
│   └── ai/
│
├── domains/
│   ├── identity/
│   ├── workspace/
│   ├── store/
│   ├── company/
│   ├── product/
│   ├── supplier/
│   ├── inventory/
│   ├── order/
│   ├── delivery/
│   ├── vehicle/
│   ├── route/
│   ├── demand/
│   └── simulation/
│
├── services/
│   ├── routing/
│   ├── optimization/
│   ├── forecasting/
│   ├── supplier-ranking/
│   ├── capacity-matching/
│   ├── recommendation/
│   ├── geospatial/
│   └── ai/
│
├── infrastructure/
│   ├── db/
│   ├── cache/
│   ├── storage/
│   ├── events/
│   ├── external/
│   └── observability/
│
├── lib/
│   ├── auth/
│   ├── validation/
│   ├── errors/
│   ├── dates/
│   ├── money/
│   └── ids/
│
├── simulation/
│   ├── generators/
│   ├── scenarios/
│   ├── seed.ts
│   └── demo-clock.ts
│
├── db/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── docs/
│   ├── foundation.md
│   ├── architecture.md
│   ├── domain-model.md
│   ├── api.md
│   ├── decisions/
│   └── demo/
│
├── .env.example
├── package.json
└── README.md
```

### Rule

No frontend component should directly query database tables.

No AI function should directly mutate database tables.

All writes go through domain/application services.

---

# 6. Domain Model

The first stable domain model should be broad enough for future work but not over-engineered.

## 6.1 Core entities

```text
Organization / Workspace
 ├── User
 ├── Membership
 ├── Company
 ├── Store
 ├── Supplier
 ├── Warehouse
 ├── Vehicle
 ├── Product
 ├── Inventory
 ├── Order
 ├── OrderItem
 ├── Delivery
 ├── Route
 ├── RouteStop
 ├── SupplierOffer
 ├── Recommendation
 ├── Exception
 ├── Simulation
 └── ActivityEvent
```

---

# 7. Identity and Tenant Model

The platform must support multi-tenant behavior from the beginning.

## Core tables

### `users`

```text
id
email
phone
name
status
created_at
updated_at
```

### `organizations`

```text
id
name
slug
type
status
created_at
updated_at
```

Suggested organization types:

```text
COMPANY
DISTRIBUTOR
SUPPLIER
OPERATOR
ADMIN
```

### `memberships`

```text
id
user_id
organization_id
role
created_at
```

All tenant-owned records should carry `organization_id` where applicable.

Never hard-code organization ownership into UI code.

---

# 8. Store Model

### `stores`

```text
id
organization_id
name
owner_name
phone
address_line
city
state
postal_code
latitude
longitude
geo_point
h3_cell
status
store_type
created_at
updated_at
```

Use a spatial `Point` representation in PostGIS.

Store the H3 cell as a derived geographic index, not as the sole location source of truth.

---

# 9. Product Model

This is a critical future-proofing decision.

A product shown by two suppliers may refer to the same commercial SKU.

Separate:

```text
Canonical Product
        ↓
Supplier SKU / Offer
```

## `products`

```text
id
brand
name
normalized_name
category
subcategory
unit
pack_size
weight_grams
volume_ml
barcode
status
created_at
updated_at
```

## `supplier_skus`

```text
id
supplier_id
product_id
supplier_sku_code
supplier_name
pack_description
price
moq
available_quantity
lead_time_hours
active
created_at
updated_at
```

This enables later product identity matching using:

```text
barcode
rules
OCR
embeddings
LLM-assisted normalization
```

without changing the core model.

---

# 10. Inventory Model

Inventory should never be represented only by a single `stock` integer.

At minimum:

```text
on_hand
reserved
available
incoming
```

### Logical formula

```text
available = on_hand - reserved
```

### `inventory_balances`

```text
id
location_id
product_id
on_hand_quantity
reserved_quantity
incoming_quantity
updated_at
```

### `inventory_movements`

```text
id
product_id
location_id
type
quantity
reference_type
reference_id
occurred_at
created_by
```

Movement types should include:

```text
RECEIPT
SALE
RESERVATION
RELEASE
TRANSFER
DAMAGE
RETURN
ADJUSTMENT
```

Do not mutate stock blindly in multiple code paths.

All important stock changes should create a movement or auditable transaction.

---

# 11. Order Model

## `orders`

```text
id
organization_id
order_number
store_id
supplier_id
status
currency
subtotal
shipping_fee
discount
tax
total
requested_delivery_start
requested_delivery_end
source
created_at
updated_at
```

### Order statuses

```text
DRAFT
SUBMITTED
CONFIRMED
PARTIALLY_FULFILLED
READY_FOR_DISPATCH
DISPATCHED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
EXCEPTION
```

Avoid scattering status strings throughout the codebase.

Use a central status definition plus explicit transition rules.

---

# 12. Order Item Model

### `order_items`

```text
id
order_id
product_id
supplier_sku_id
requested_quantity
confirmed_quantity
unit_price
discount
tax
line_total
created_at
updated_at
```

Later support substitutions without redesigning orders.

Possible future fields:

```text
substitution_allowed
substituted_product_id
substitution_reason
```

---

# 13. Supplier Model

### `suppliers`

```text
id
organization_id
name
supplier_type
address
latitude
longitude
geo_point
service_radius_km
status
reliability_score
created_at
updated_at
```

Do not store only a manually assigned supplier score.

Eventually calculate reliability from actual events:

```text
confirmation rate
fill rate
on-time rate
cancellation rate
shortage rate
return rate
```

Keep both:

```text
raw operational facts
computed score
```

---

# 14. Delivery and Logistics Model

## `vehicles`

```text
id
organization_id
vehicle_code
vehicle_type
capacity_weight_kg
capacity_volume_m3
current_latitude
current_longitude
current_geo_point
availability_status
available_from
available_until
created_at
updated_at
```

## `deliveries`

```text
id
order_id
vehicle_id
route_id
status
planned_departure
actual_departure
planned_arrival
actual_arrival
pod_status
created_at
updated_at
```

## `routes`

```text
id
route_code
origin_location_id
status
planned_distance_m
planned_duration_s
total_weight_kg
total_volume_m3
vehicle_id
optimization_run_id
created_at
updated_at
```

## `route_stops`

```text
id
route_id
sequence
stop_type
location_id
order_id
planned_arrival
planned_departure
actual_arrival
actual_departure
status
```

This supports future route re-optimization without redesigning the order domain.

---

# 15. Money Handling

Never use floating point numbers for monetary values in business logic.

Recommended representation:

```text
integer minor units
```

Example:

```text
₹125.50 → 12550 paise
```

Store currency explicitly:

```text
currency = INR
```

Centralize money operations in a small utility/module.

---

# 16. Geographic Foundation

Use three concepts together.

## 16.1 PostGIS

Source of truth for precise geographic data.

Store:

```text
store point
supplier point
warehouse point
vehicle point
route geometry
service areas
```

## 16.2 H3

Derived spatial indexing layer.

Use for:

```text
store clustering
demand heatmaps
supplier density
territory analysis
route preprocessing
network analytics
```

Do not use H3 as a replacement for exact geometry.

## 16.3 Map abstraction

The application should depend on a `MapProvider` interface rather than directly embedding provider-specific logic everywhere.

Example conceptual interface:

```ts
interface MapProvider {
  renderMap(...): ...
  renderMarkers(...): ...
  renderRoutes(...): ...
  fitBounds(...): ...
}
```

This makes it possible to change map rendering technology later.

---

# 17. Routing Architecture

Routing and optimization are separate concepts.

### Routing engine answers:

> How long / how far is A → B?

### Optimization engine answers:

> Which sequence of stops should each vehicle serve?

Keep these separate.

```text
RoutingEngine
    ↓
travel time / distance matrix
    ↓
OptimizationEngine
    ↓
route plan
```

### Interface

```ts
interface RoutingService {
  getRoute(input: RouteRequest): Promise<RouteResult>;
  getMatrix(input: MatrixRequest): Promise<TravelMatrix>;
}
```

### Interface

```ts
interface RouteOptimizer {
  optimize(input: OptimizationInput): Promise<OptimizationResult>;
}
```

Phase 1 can use deterministic demo implementations.

Later replace them with real routing + OR-Tools implementations.

---

# 18. Optimization Model Contract

Create the optimization input model before integrating an optimization library.

```text
OptimizationInput
 ├── depot(s)
 ├── vehicles
 │    ├── capacity_weight
 │    ├── capacity_volume
 │    ├── availability window
 │    └── current location
 ├── stops
 │    ├── location
 │    ├── demand weight
 │    ├── demand volume
 │    ├── time window
 │    └── priority
 └── objective configuration
```

Potential objective terms:

```text
minimize_distance
minimize_duration
minimize_vehicle_count
minimize_cost
maximize_fill_rate
protect_sla
```

Make objectives configurable rather than hard-coded.

---

# 19. Demo vs Real Implementations

This is one of the most important architectural rules.

## Interfaces first

Example:

```ts
interface DemandRecommendationService {
  recommend(input: DemandInput): Promise<DemandRecommendation[]>;
}
```

Phase 1:

```text
DemoDemandRecommendationService
```

Later:

```text
ForecastDemandRecommendationService
```

Same API contract.

Repeat this pattern for:

```text
Demand
Supplier ranking
Routing
Optimization
Capacity matching
Simulation
AI
```

### Never do this

```ts
if (DEMO_MODE) {
   // 700 lines of fake logic
}
```

### Prefer this

```ts
const demandService = serviceRegistry.demand;
const result = await demandService.recommend(input);
```

Demo/live selection belongs in configuration / dependency injection, not scattered through product code.

---

# 20. Service Registry / Dependency Injection

Create an application-level registry.

Conceptually:

```ts
interface ServiceRegistry {
  orders: OrderService;
  inventory: InventoryService;
  suppliers: SupplierService;
  routing: RoutingService;
  optimizer: RouteOptimizer;
  demand: DemandRecommendationService;
  capacity: CapacityMatchingService;
  simulation: SimulationService;
  ai: AIAssistantService;
}
```

Then the application can start with:

```text
Demo implementations
```

and later move to:

```text
Production implementations
```

without changing page-level logic.

---

# 21. Smart Replenishment Foundation

The user-facing feature is:

> **What should this store order now?**

The backend contract should be independent of the model used.

### Input

```text
store_id
product_id
on_hand
historical demand
lead_time
minimum order quantity
supplier availability
planning horizon
```

### Output

```text
product
recommended_quantity
confidence
reason_codes
supplier_candidates
expected_stockout_date
```

Use explainable reason codes:

```text
LOW_CURRENT_STOCK
HIGH_RECENT_DEMAND
LONG_SUPPLIER_LEAD_TIME
LOCAL_DEMAND_INCREASE
REORDER_PATTERN
PROMOTIONAL_SIGNAL
```

The UI should show the reasons.

The LLM may convert reason codes into natural language, but it should not invent the underlying facts.

---

# 22. Supplier Recommendation Foundation

Do not encode supplier choice as:

```text
lowest price wins
```

Use a scoring interface.

### Inputs

```text
price
availability
MOQ
ETA
distance
historical reliability
fill rate
on-time rate
```

### Output

```text
ranked suppliers
score
expected fulfillment cost
explanation
```

Keep the scoring policy configurable.

Example:

```text
price_weight
eta_weight
reliability_weight
distance_weight
availability_weight
```

Future pricing models can be introduced without changing the UI contract.

---

# 23. Dynamic Order Consolidation

The foundation should treat consolidation as a domain operation.

```text
candidate orders
      ↓
geographic grouping
      ↓
compatibility checks
      ↓
capacity checks
      ↓
service-level constraints
      ↓
consolidated shipment proposal
```

### `ConsolidationCandidate`

```text
order_ids
supplier_ids
geographic_cluster
combined_weight
combined_volume
latest_allowed_delivery
estimated_savings
```

Do not automatically execute consolidation merely because it is cheaper.

Constraints may include:

```text
SLA
product compatibility
temperature requirements
vehicle capacity
supplier compatibility
store receiving windows
```

---

# 24. Return-Load / Empty-Capacity Matching

This should be modeled separately from route optimization.

### Input

```text
vehicle
current route
remaining capacity
current location
destination
availability window
```

### Candidate loads

```text
pickup location
pickup time
load weight
load volume
destination
service constraints
```

### Output

```text
candidate load
incremental distance
incremental duration
estimated value
constraint violations
recommendation
```

Phase 1 may use deterministic proximity + capacity rules.

Later use optimization.

---

# 25. Exception Engine

This should become a first-class domain.

### `exceptions`

```text
id
type
severity
entity_type
entity_id
status
detected_at
resolved_at
recommended_action
```

Exception types:

```text
STOCKOUT_RISK
SUPPLIER_DELAY
VEHICLE_CAPACITY_CONFLICT
ROUTE_DELAY
FAILED_DELIVERY
PAYMENT_MISMATCH
ORDER_ANOMALY
WAREHOUSE_DELAY
```

### Lifecycle

```text
DETECTED
 ↓
ACKNOWLEDGED
 ↓
ACTION_PROPOSED
 ↓
ACTION_APPLIED
 ↓
RESOLVED
```

This enables the future AI Copilot to reason over actual system exceptions.

---

# 26. AI Foundation

AI must be an application layer, not the architecture.

## 26.1 Separate these concerns

```text
LLM
Tool definitions
Business services
Database
Guardrails
Audit log
```

The LLM should call approved tools.

Example tools:

```text
get_order()
search_orders()
get_inventory_risk()
get_route()
get_supplier_options()
preview_route_change()
create_replenishment_order()
create_consolidation_plan()
run_simulation()
```

Mutating tools must be explicit.

Prefer:

```text
preview → confirm/apply
```

for consequential changes.

---

# 27. AI Tool Contract

Every tool should have:

```text
name
description
input schema
output schema
authorization requirement
side_effect level
idempotency behavior
```

Example conceptual metadata:

```text
Tool: optimize_route
Side effect: NONE
Authorization: operations_manager

Tool: apply_route_change
Side effect: HIGH
Authorization: operations_manager
Confirmation: REQUIRED
```

This creates a safer path for agentic operations.

---

# 28. Simulation Foundation

The simulator is a product feature, but its architecture should remain separate from live transactional data.

```text
Live Data
   │
   └── read snapshot
           ↓
      Simulation State
           ↓
      scenario changes
           ↓
      simulation engine
           ↓
      projected result
```

Simulation must never silently mutate production/live records.

### Scenario inputs

```text
demand multiplier
vehicle availability
warehouse availability
supplier availability
SLA target
fuel/cost assumptions
```

### Outputs

```text
vehicle requirement
route count
distance
duration
cost estimate
SLA risk
stockout risk
recommended actions
```

---

# 29. Event Model

Even in the modular monolith, define domain events.

Examples:

```text
OrderCreated
OrderConfirmed
InventoryReserved
InventoryReleased
SupplierConfirmed
DeliveryAssigned
VehicleDispatched
RouteChanged
DeliveryCompleted
StockoutRiskDetected
ExceptionCreated
PaymentReconciled
```

### Event envelope

All events should conceptually contain:

```text
id
type
occurred_at
actor_id
organization_id
aggregate_type
aggregate_id
version
payload
correlation_id
causation_id
```

Do not introduce Kafka/NATS just because events exist.

Start with an in-process event dispatcher or outbox pattern where appropriate.

Introduce an external broker when there is a real need.

---

# 30. Idempotency

Any operation that may be retried must be safe to retry.

This is crucial for:

```text
order creation
payment operations
inventory reservation
route application
external integrations
webhooks
sync jobs
AI actions
```

Use an `idempotency_key` for externally retried commands.

Example:

```text
POST /orders
Idempotency-Key: 9c8e...
```

A duplicate request must not create duplicate business records.

---

# 31. API Design

Use resource-oriented APIs with explicit commands for domain actions.

Examples:

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id
POST   /api/orders/:id/confirm
POST   /api/orders/:id/cancel
```

For logistics:

```text
GET    /api/routes
GET    /api/routes/:id
POST   /api/routes/optimize
POST   /api/routes/:id/preview-change
POST   /api/routes/:id/apply-change
```

For intelligence:

```text
GET    /api/inventory/risks
POST   /api/replenishment/recommend
POST   /api/supplier-ranking
```

For simulation:

```text
POST   /api/simulations
GET    /api/simulations/:id
POST   /api/simulations/:id/run
```

For AI:

```text
POST   /api/ai/chat
POST   /api/ai/tool-preview
```

Do not put business logic in route handlers.

Route handlers should mostly perform:

```text
parse
validate
authorize
call service
serialize response
```

---

# 32. API Response Convention

Success:

```json
{
  "data": {},
  "meta": {
    "requestId": "..."
  }
}
```

Error:

```json
{
  "error": {
    "code": "ORDER_INVALID_STATE",
    "message": "Order cannot be dispatched from its current state.",
    "requestId": "...",
    "details": {}
  }
}
```

Do not expose raw database errors to users.

---

# 33. Validation

Use schema validation at system boundaries.

Validate:

```text
HTTP input
AI tool input
webhook payloads
external API responses
import files
simulation parameters
```

Never trust client-side validation alone.

---

# 34. Authorization

Start with role-based access control.

Example roles:

```text
OWNER
ADMIN
OPERATIONS_MANAGER
DISPATCHER
PROCUREMENT_MANAGER
STORE_OWNER
SUPPLIER_USER
VIEWER
```

Separate:

```text
authentication
authorization
business eligibility
```

Example:

> A user may be authenticated, but still not authorized to apply a route change.

---

# 35. Auditability

Every important mutation should be auditable.

Create an `activity_events` or audit table.

Record:

```text
actor
organization
action
entity
previous_state
new_state
timestamp
request_id
source
```

Important AI actions must also log:

```text
user request
selected tool
tool input
tool result
approval
mutation
```

Never rely on chat history alone as an audit trail.

---

# 36. Observability

From Phase 0 establish structured logs.

Every request should ideally carry:

```text
request_id
organization_id
user_id
route
latency
status
```

Later support:

```text
OpenTelemetry
metrics
traces
logs
```

Important metrics:

```text
API latency
error rate
order creation success
optimization duration
recommendation latency
AI tool failures
route application failures
sync failures
```

---

# 37. Database Rules

1. Use migrations for every schema change.
2. Never modify production schema manually.
3. Add indexes based on actual query patterns.
4. Use foreign keys for core relationships.
5. Use database constraints for invariants where practical.
6. Use transactions for multi-record business operations.
7. Store timestamps in UTC.
8. Convert to local time only at the UI / presentation boundary.
9. Use explicit status transition rules.
10. Keep seed/demo data reproducible.

---

# 38. Concurrency Rules

Logistics and inventory systems have concurrent writes.

Design for:

```text
same order updated twice
same inventory reserved twice
supplier responds late
route modified while dispatch is happening
webhook delivered more than once
AI command retried
```

Use where needed:

```text
transactions
row-level locking
optimistic concurrency/version fields
idempotency
unique constraints
```

Never assume two users cannot act on the same record simultaneously.

---

# 39. Time and SLA Model

Time windows must be first-class fields.

Avoid storing only:

```text
"tomorrow"
```

Store precise timestamps:

```text
requested_delivery_start
requested_delivery_end
planned_arrival
actual_arrival
```

For user display:

```text
Asia/Kolkata
```

Internally:

```text
UTC
```

---

# 40. Demo Dataset Design

The Phase 1 experience should have realistic relationships, not random unrelated rows.

Minimum demo topology:

```text
1–3 Companies
5–10 Suppliers
3–5 Warehouses
50–200 Kirana Stores
20–80 Vehicles
300–1,500 Products
500–5,000 Orders
```

The exact size is configurable.

### Demo data must contain meaningful scenarios

Examples:

```text
stockout risk
supplier delay
vehicle under-utilization
consolidatable orders
over-capacity route
return-load opportunity
late delivery
high-demand geographic cluster
```

Do not create data where everything is healthy.

The demo should contain operational tension so that the intelligence features have something to solve.

---

# 41. Demo Scenario System

Instead of hard-coding one demo, define named scenarios.

Examples:

```text
normal-day
peak-demand
supplier-delay
warehouse-outage
vehicle-shortage
route-overload
return-load-opportunity
```

Scenario config should control:

```text
demand multiplier
vehicle availability
supplier failures
warehouse availability
traffic multiplier
order volume
```

This gives the Phase 1 simulator a stable foundation.

---

# 42. Demo Clock

For prototypes, a controlled simulation clock is useful.

Allow:

```text
REAL_TIME
ACCELERATED
FIXED_SCENARIO
```

Example:

```text
1 real minute = 15 simulated minutes
```

This allows delivery and exception events to visibly evolve during a demo.

Do not mix simulated time and production time in the same persistence model without an explicit mode boundary.

---

# 43. Frontend Design System

Create a reusable design system before building ten different pages.

### Core primitives

```text
Button
Input
Select
Dialog
Drawer
Tooltip
Badge
Tabs
Card
Table
Command Palette
Toast
Dropdown
Skeleton
Empty State
Error State
```

### Domain components

```text
OrderStatusBadge
RiskBadge
SupplierScore
RouteSummary
VehicleCapacityBar
InventoryRiskCard
ExceptionCard
DemandCell
RecommendationCard
```

The UI should use domain components rather than duplicating styling and logic in every page.

---

# 44. UX Rules

## Kirana UX

Optimize for:

```text
few taps
large touch targets
search
reorder
smart recommendations
clear price
clear delivery promise
```

## Operations UX

Optimize for:

```text
dense information
filtering
keyboard navigation
maps
bulk actions
exceptions
preview → apply
```

### General rule

Do not expose the same complexity to every user.

The operations system can be sophisticated while the kirana experience stays simple.

---

# 45. Command Palette

Create the command infrastructure early.

Examples:

```text
Create order
Search store
Open route
Optimize network
View exceptions
Find stockout risks
Open simulator
Ask AI
```

Commands should map to application actions rather than page-specific hacks.

---

# 46. Realtime Strategy

For the prototype, start with:

```text
SSE / Server-Sent Events
```

Use it for:

```text
vehicle updates
order status
optimization progress
simulation progress
exception creation
AI action progress
```

Only move to WebSockets when bidirectional real-time communication is actually required.

---

# 47. Background Jobs

The first version may use a lightweight job runner or managed scheduling mechanism.

Jobs may include:

```text
recalculate risk
refresh supplier reliability
update vehicle status
generate recommendations
process sync queue
expire reservations
```

Keep job logic in application services rather than embedding business logic directly inside scheduler code.

Later, Temporal can manage long-running workflows if operational complexity justifies it.

---

# 48. External Integrations Boundary

Create an `infrastructure/external` layer.

Future integrations could include:

```text
ERP
POS
GPS / telematics
messaging / WhatsApp
payment provider
GST / invoicing systems
supplier catalog feeds
logistics providers
```

External systems should map into internal canonical models.

Never leak an external provider's schema throughout the entire application.

---

# 49. Integration Adapter Pattern

Example:

```ts
interface SupplierCatalogProvider {
  fetchCatalog(input: CatalogRequest): Promise<CanonicalProductOffer[]>;
}
```

Implementation examples later:

```text
CSV supplier import
REST supplier API
ERP connector
manual catalog upload
```

All feed the same canonical model.

---

# 50. CSV / Excel Import Foundation

Many real businesses will not have clean APIs.

Support importing:

```text
products
supplier catalogs
stores
inventory
orders
```

Pipeline:

```text
Upload
 ↓
Parse
 ↓
Validate
 ↓
Preview
 ↓
Map columns
 ↓
Normalize
 ↓
Commit
```

Never directly import unvalidated rows into core tables.

---

# 51. Data Normalization Layer

Create normalization utilities for:

```text
phone numbers
postal codes
city/state names
product names
units
pack sizes
addresses
SKU identifiers
```

This layer becomes extremely important when different companies use different naming conventions.

---

# 52. Search Architecture

Start with PostgreSQL full-text / indexed search.

Use semantic search only when justified.

Search should eventually span:

```text
products
orders
stores
suppliers
routes
exceptions
activity
```

Do not immediately introduce vector search for every query.

Use exact / structured filters when exactness matters.

---

# 53. Recommendation Architecture

Recommendations are not the same thing as predictions.

Separate:

```text
Prediction
→ What may happen?

Recommendation
→ What should we do?

Action
→ Execute it.
```

Example:

```text
Forecast:
Product may stock out in 2 days.

Recommendation:
Order 24 units from Supplier B.

Action:
Create draft purchase order.
```

This separation should exist in code.

---

# 54. ML Architecture

Do not hard-code the ML model into business logic.

Define:

```text
ForecastService
```

with model implementations behind it.

Possible future implementations:

```text
baseline moving average
statistical model
LightGBM
XGBoost
other forecasting model
```

The application consumes:

```text
forecast value
prediction interval / uncertainty where available
model/version metadata
```

Do not expose fake accuracy percentages.

---

# 55. ML Feature Store Principle

For the prototype, a full feature store is unnecessary.

Keep feature computation explicit and versioned.

Possible features later:

```text
sales_lag_1
sales_lag_7
rolling_mean_7
rolling_mean_28
day_of_week
festival_indicator
promotion_indicator
supplier_lead_time
store_order_frequency
local_cluster_demand
```

Store the model version used for important forecasts.

---

# 56. Security Baseline

At minimum:

```text
secure password / external auth
session management
RBAC
input validation
CSRF protection where applicable
rate limiting
secret management
secure headers
file upload validation
audit logging
```

Never put service secrets in frontend code.

Never use production credentials in seed data.

---

# 57. File / Document Handling

If invoices, delivery photos, or supplier files are introduced:

```text
Object storage
    ↓
metadata in PostgreSQL
```

Database should hold:

```text
file_id
entity_type
entity_id
storage_key
mime_type
size
checksum
created_at
```

Not the binary payload itself unless there is a specific reason.

---

# 58. Testing Strategy

## Unit tests

Test:

```text
order state transitions
inventory calculations
supplier scoring
route constraints
recommendation rules
money calculations
H3 assignment
simulation calculations
```

## Integration tests

Test:

```text
create order
reserve stock
confirm order
assign delivery
apply route change
```

## E2E tests

Critical flows:

```text
Kirana → Smart Order → Submit
Operations → Optimize → Preview → Apply
Operations → Exception → Resolve
Simulator → Run scenario → Display result
AI → Tool preview → Approval → Apply
```

### Rule

Every major Phase 1 feature should have at least one happy-path E2E flow.

---

# 59. Testing Demo Determinism

Demo scenarios must produce repeatable results.

Use:

```text
fixed random seeds
fixed timestamps or demo clock
versioned scenario config
stable fixtures
```

This prevents a presentation from changing unexpectedly.

---

# 60. CI / Quality Gates

Every push should run:

```text
lint
format check
type check
unit tests
build
```

Later add:

```text
integration tests
E2E tests
security scanning
migration validation
```

The goal is simple:

> Main should remain buildable.

---

# 61. Environment Strategy

Use separate configuration for:

```text
local
demo
staging
production
```

At minimum:

```text
DATABASE_URL
AUTH_SECRET
AI_API_KEY
MAP_CONFIG
APP_ENV
DEMO_MODE
```

Never hard-code secrets.

Commit `.env.example`, never real secrets.

---

# 62. Feature Flags

Introduce a simple feature flag layer early.

Examples:

```text
SMART_REPLENISHMENT
SUPPLIER_RECOMMENDATIONS
NETWORK_CONSOLIDATION
RETURN_LOAD_MATCHING
SIMULATOR
AI_COPILOT
VOICE_ORDERING
LIVE_GPS
```

This allows incomplete future features to remain behind flags.

---

# 63. Configuration Over Hardcoding

Important operating assumptions should be configurable.

Examples:

```text
max route duration
vehicle capacity rules
delivery windows
supplier score weights
consolidation radius
simulation parameters
reorder thresholds
```

Do not bury business policy inside arbitrary constants across the codebase.

---

# 64. Architecture Decision Rules

When choosing a technology, ask:

### Question 1
Does it solve a real product requirement?

### Question 2
Can we replace it later?

### Question 3
Does it introduce operational burden disproportionate to the prototype?

### Question 4
Does it create vendor lock-in at the domain layer?

### Question 5
Is the technology visible through a meaningful user capability?

If the answer to all five is weak, do not add the technology yet.

---

# 65. What Must NOT Become Coupled

Keep these boundaries strict:

```text
UI ≠ database
UI ≠ routing provider
UI ≠ LLM provider
Order domain ≠ map provider
Forecasting ≠ UI
Optimization ≠ LLM
Supplier schema ≠ internal canonical schema
Simulation ≠ live transaction state
```

These separations are what prevent expensive rewrites later.

---

# 66. Suggested Phase 1 Product Modules

Build these modules on top of the foundation:

```text
1. Control Tower
2. Smart Replenishment
3. Supplier Intelligence
4. Network Consolidation
5. Return Capacity Matching
6. Logistics Simulator
7. AI Operations Copilot
8. Exception Center
```

These should consume the interfaces established in Phase 0.

---

# 67. Phase 1 Data Flow

```text
                    ┌───────────────┐
                    │   Demo Data   │
                    └───────┬───────┘
                            ↓
                     Canonical Models
                            ↓
      ┌─────────────────────┼─────────────────────┐
      ↓                     ↓                     ↓
  Inventory             Orders                Supply
      │                     │                     │
      └─────────────────────┼─────────────────────┘
                            ↓
                     Intelligence Layer
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
     Replenishment     Consolidation     Capacity Match
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ↓
                      Logistics Plan
                            ↓
                         Control Tower
```

The UI should make this chain visible.

---

# 68. Phase 1 Demo Contract

Every intelligence feature should expose four things to the UI:

```text
1. recommendation
2. evidence
3. expected impact
4. action
```

Example:

```text
RECOMMENDATION
Consolidate 8 deliveries.

EVIDENCE
Orders are geographically compatible and fit vehicle capacity.

EXPECTED IMPACT
Lower estimated route distance.

ACTION
[ Preview ] [ Apply ]
```

This is much stronger than a black-box "AI result".

---

# 69. UX Contract for Intelligent Actions

Every automated action should follow:

```text
Detect
 ↓
Explain
 ↓
Preview
 ↓
Apply
 ↓
Audit
```

For low-risk actions, `Apply` may be immediate.

For high-impact actions, require explicit confirmation.

---

# 70. Prototype-to-Production Migration Strategy

## Phase 1

```text
Demo DB
Demo services
Seeded scenarios
```

## Phase 2

```text
Real transactional DB
Real order workflows
Real user accounts
```

## Phase 3

```text
Real routing
Real optimization
Real forecasting
```

## Phase 4

```text
External integrations
Live vehicle data
Payments
Messaging
```

## Phase 5

```text
Scale bottlenecks
Event infrastructure
Workflow orchestration
Service extraction where justified
```

The UI and domain contracts should remain mostly stable across these transitions.

---

# 71. Suggested Initial Technical Decisions

| Area | Phase 0 decision | Replaceable later? |
|---|---|---|
| Web | Next.js + TypeScript | Yes |
| Styling | Tailwind + component system | Yes |
| DB | PostgreSQL | Harder, but possible |
| Geo | PostGIS | Yes |
| Spatial index | H3 | Yes |
| Map rendering | MapLibre-compatible abstraction | Yes |
| Routing | Service interface + demo adapter | Yes |
| Optimization | Service interface + demo adapter | Yes |
| Forecasting | Service interface + demo adapter | Yes |
| AI | Provider abstraction | Yes |
| Cache | Optional Redis abstraction | Yes |
| Events | Domain event interfaces | Yes |
| External integrations | Adapter layer | Yes |
| Auth | Auth provider behind auth boundary | Yes |
| File storage | Object storage abstraction | Yes |
```

The specific vendor/provider should never become the domain model.

---

# 72. Initial Build Order

Do these in order.

## Step 1 — Repository

```text
folders
lint
format
TypeScript
README
.env.example
```

## Step 2 — Database

```text
organizations
users
memberships
stores
suppliers
products
supplier_skus
inventory
orders
order_items
vehicles
routes
route_stops
exceptions
activity_events
```

## Step 3 — Migrations + Seed

```text
migration system
seed script
scenario generator
```

## Step 4 — Shared domain types

Create canonical types and validation schemas.

## Step 5 — Service interfaces

Implement contracts for:

```text
orders
inventory
supplier ranking
routing
optimization
demand
capacity
simulation
AI
```

## Step 6 — Demo implementations

Use deterministic data and rules.

## Step 7 — API layer

Expose domain actions through validated APIs.

## Step 8 — UI system

Create design tokens + reusable components.

## Step 9 — Phase 1 screens

Build in this order:

```text
Control Tower
Smart Replenishment
Supplier Intelligence
Logistics Optimization
Return Capacity
Simulator
AI Copilot
Exception Center
```

## Step 10 — Tests

Add tests before expanding the product.

---

# 73. Definition of Done for Phase 0

Phase 0 is complete only when all of the following are true:

```text
[ ] Project starts locally
[ ] Project builds successfully
[ ] Type checking passes
[ ] Lint passes
[ ] Database migrations run from an empty database
[ ] Demo seed can recreate the dataset
[ ] Demo scenarios are deterministic
[ ] Core entities exist
[ ] Core status transitions are validated
[ ] API error model exists
[ ] Auth boundary exists
[ ] RBAC boundary exists
[ ] Service interfaces exist
[ ] Demo service implementations exist
[ ] Frontend does not access DB directly
[ ] AI cannot directly mutate DB
[ ] Map provider is abstracted
[ ] Routing is abstracted
[ ] Optimization is abstracted
[ ] Forecasting is abstracted
[ ] Feature flags exist
[ ] Audit events exist
[ ] Basic logging exists
[ ] CI checks exist
```

---

# 74. Definition of Done for Phase 1

The first visible product milestone is complete when a user can experience this end-to-end flow:

```text
Kirana Store
   ↓
Smart Replenishment
   ↓
Supplier Recommendation
   ↓
Order Proposal
   ↓
Network Consolidation
   ↓
Route / Capacity Recommendation
   ↓
Control Tower
   ↓
Exception Detection
   ↓
AI Explanation
   ↓
Simulation / What-if analysis
```

And the website makes each step understandable without exposing implementation complexity.

---

# 75. Non-Negotiable Rules for Future Developers / AI Agents

These rules should be included in the repository README and agent instructions.

### Rule 1
**Inspect before modifying.**

### Rule 2
**Do not change the database schema casually.**

### Rule 3
**Do not bypass domain/application services.**

### Rule 4
**Do not put provider-specific assumptions into canonical domain models.**

### Rule 5
**Do not put business logic in UI components.**

### Rule 6
**Do not call LLMs for deterministic calculations.**

### Rule 7
**Do not use AI output as the source of truth for inventory, price, money, or route constraints.**

### Rule 8
**Do not add a dependency unless it solves a concrete requirement.**

### Rule 9
**Preserve demo mode while implementing real integrations.**

### Rule 10
**Every major mutation must be auditable.**

### Rule 11
**Use idempotency for retryable operations.**

### Rule 12
**Keep interfaces stable while implementations evolve.**

### Rule 13
**Prefer a modular monolith until measured scale demands decomposition.**

### Rule 14
**Never fabricate real-world operational metrics. Mark simulated values as demo/simulation data.**

### Rule 15
**Before adding a new major feature, identify the domain it belongs to and its service boundary.**

---

# 76. Recommended Agent Instruction

Put a condensed version of these instructions in `AGENTS.md` / equivalent project-agent configuration.

```text
You are working on a modular monolith for a B2B logistics and distribution platform.

Before modifying code:
- inspect the repository structure;
- inspect the relevant domain, service, tests, and database schema;
- identify existing abstractions before creating new ones.

Architecture rules:
- frontend must not access the database directly;
- route handlers must remain thin;
- business logic belongs in domain/application services;
- external providers must be behind adapters;
- routing, optimization, forecasting, AI, and simulation must have interfaces;
- do not couple the UI to a specific provider;
- do not couple business logic to an LLM provider;
- do not use LLMs for deterministic financial, inventory, or routing calculations;
- demo implementations must remain replaceable by production implementations;
- use migrations for schema changes;
- use UTC timestamps internally;
- use integer minor units for money;
- use idempotency for retryable write operations;
- maintain auditability of important mutations;
- do not introduce microservices unless required by a documented constraint.

When implementing a feature:
1. identify the domain;
2. define/update the service contract;
3. implement business logic;
4. expose it through a validated API;
5. connect the UI;
6. add tests;
7. update documentation if architecture changes.

Do not change unrelated functionality.
Do not install dependencies without a concrete reason.
Do not expose fake production statistics as real data.
```

---

# 77. Future Technology Attachment Points

These technologies can be introduced later without redesigning the core domain if the interfaces remain stable.

```text
PostGIS       → geographic truth
H3            → geographic indexing
MapLibre      → map rendering
Routing       → travel-time/distance engine
OR-Tools      → route optimization
LightGBM      → demand prediction
pgvector      → semantic search / matching
OCR           → document and invoice ingestion
Speech        → conversational ordering
LLM           → AI operations interface
NATS/Kafka    → event distribution
Temporal      → durable workflows
Object store  → documents / evidence
OpenTelemetry → observability
```

The important design rule is:

> **Technology should plug into the foundation, not redefine the foundation.**

---

# 78. Long-Term Platform Model

The architecture should eventually support this loop:

```text
                 ┌─────────────────────┐
                 │     DEMAND          │
                 │ Orders / Inventory  │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │    PREDICTION       │
                 │ Demand / Stock Risk │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │     SOURCING        │
                 │ Supplier Selection  │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │   CONSOLIDATION     │
                 │ Demand Aggregation  │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │    OPTIMIZATION     │
                 │ Capacity / Routing  │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │     EXECUTION       │
                 │ Delivery / POD      │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │      LEARNING       │
                 │ Outcomes / Errors   │
                 └──────────┬──────────┘
                            │
                            └───────────────↺
```

This is the architectural direction of the product.

---

# 79. Final Foundation Principle

The application should be built so that **the interface can become much more sophisticated than the initial implementation without requiring a rewrite of the core system**.

The prototype may start with:

```text
Demo data
Deterministic rules
Simple routing simulation
Simple recommendation logic
Mock integrations
```

Later it can progressively replace those pieces with:

```text
real transactional data
real routing
mathematical optimization
ML forecasting
live integrations
real vehicle telemetry
AI agents
workflow orchestration
network-level intelligence
```

The architecture remains stable because the product is organized around **business domains and explicit service contracts**, rather than around whichever technology happens to be implemented first.

---

# 80. Immediate Next Deliverable After This Foundation

The next document should be:

```text
`phase-1-product-spec.md`
```

It should define the exact screens, user journeys, component inventory, demo scenarios, API contracts, and acceptance criteria for:

```text
Control Tower
Smart Replenishment
Supplier Intelligence
Network Consolidation
Return Capacity Matching
Simulator
Exception Center
AI Operations Copilot
```

That document should be written directly against this foundation so Phase 1 can be implemented without changing the underlying architecture.
