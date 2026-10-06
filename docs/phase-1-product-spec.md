# Phase 1 Product Specification: Kirana-to-Company Platform

**Document type:** Product & Engineering Specification  
**Status:** Phase 1 — Detailed Design  
**Foundation Reference:** `logistics-foundation.md`  
**Purpose:** Define exact screens, user journeys, component inventory, demo scenarios, API contracts, and acceptance criteria for the Phase 1 prototype.

---

## 1. Overview & Operational Loop

Phase 1 realizes the end-to-end flow:
```text
Kirana Store (Smart Replenishment)
        ↓
Supplier Recommendation (Ranking & Sourcing)
        ↓
Order Proposal & Creation (Draft → Confirmed)
        ↓
Network Consolidation (Cluster & Capacity Check)
        ↓
Route & Delivery Allocation (Fleet & Capacity)
        ↓
Control Tower (Real-Time Monitoring & Heatmaps)
        ↓
Exception Center (Detection & Resolution)
        ↓
AI Operations Copilot (Explanation & Tool Preview/Apply)
        ↓
Logistics Simulator (What-if Scenario Projection)
```

---

## 2. Core Modules Specification

### 2.1 Module 1: Control Tower

#### Purpose
Operations hub providing continuous visibility across active deliveries, vehicle capacities, warehouse statuses, and real-time exceptions.

#### Screens & Views
- **Map View (`/operations/control-tower`)**:
  - Full-screen MapLibre abstraction rendering depots, suppliers, kirana stores (clustered via H3), and active vehicle routes.
  - Layer toggles: Route vectors, store pins, supplier hubs, exception heatmaps.
- **Fleet Capacity Panel**:
  - Live vehicle status cards displaying weight & volume utilization bars, driver contact, active route code, and ETA to next stop.
- **Operational Metrics Bar**:
  - Fleet Utilization (%), On-time SLA Rate (%), Active Exceptions Count, Fuel/Distance Saved (km).

#### API Contracts
- `GET /api/routes?status=ACTIVE`
- `GET /api/vehicles?status=ON_ROUTE,AVAILABLE`
- `GET /api/control-tower/metrics`
- `GET /api/events/stream` (Server-Sent Events for real-time map marker and status updates)

#### Acceptance Criteria
- Renders simulated fleet positions and route polylines accurately without lagging.
- Filterable by zone/H3 index, vehicle type, and SLA risk status.
- Clicking any vehicle or route opens its detail drawer with route stops and manifests.

---

### 2.2 Module 2: Smart Replenishment

#### Purpose
Enables kirana store owners or procurement staff to quickly reorder inventory based on deterministic stock thresholds, historical sales velocity, and lead time risk.

#### User Journey
1. Kirana owner opens `/store/replenishment`.
2. System displays prioritized replenishment recommendations with explainable reason codes (e.g. `LOW_CURRENT_STOCK`, `LONG_SUPPLIER_LEAD_TIME`).
3. User selects quantities, reviews supplier candidates, and clicks "Generate Order Proposal".
4. Order draft is created with integer minor unit pricing.

#### Components
- `DemandCell`: Grid showing historical vs. projected demand.
- `RecommendationCard`: Visual card with reason badge, stockout countdown, MOQ requirement, and candidate supplier selector.
- `QuickReorderTable`: Bulk reorder interface with one-click quantity adjustments.

#### API Contracts
- `POST /api/replenishment/recommend`
  - Input: `{ storeId: string, planningHorizonDays: number }`
  - Output: `DemandRecommendation[]` with `reasonCodes`, `recommendedQuantity`, `expectedStockoutDate`.
- `POST /api/orders`
  - Input: `{ storeId: string, items: Array<{ productId: string, supplierSkuId: string, quantity: number }>, idempotencyKey: string }`

---

### 2.3 Module 3: Supplier Intelligence

#### Purpose
Multi-criteria evaluation and ranking of suppliers beyond basic pricing, incorporating fill rate, lead time, distance, and historical reliability.

#### Scoring Formula Contract
`Score = (w_p * PriceScore) + (w_r * ReliabilityScore) + (w_e * ETAScore) + (w_d * DistanceScore) + (w_a * AvailabilityScore)`
- Weights are configurable via organization policies.
- Scores range deterministically from 0.0 to 100.0.

#### Components
- `SupplierScoreCard`: Visual breakdown of supplier reliability score, fill rate percentage, and on-time delivery track record.
- `OfferComparisonTable`: Matrix comparing pricing in paise, MOQ constraints, payment terms, and lead times for a given canonical SKU.

#### API Contracts
- `POST /api/supplier-ranking`
  - Input: `{ productId: string, storeLocation: { lat: number, lng: number }, requiredQuantity: number }`
  - Output: Ranked supplier offers with component scores and fulfillment cost estimates.

---

### 2.4 Module 4: Network Consolidation

#### Purpose
Groups disparate kirana orders destined for common geographic zones (H3 cells) to maximize vehicle capacity and lower cost per unit delivery.

#### Data Model & Candidate Logic
- Candidate groupings require:
  - Geographic proximity (`store.h3_cell` adjacency).
  - Vehicle payload limit compliance (`combined_weight <= capacity_weight_kg` and `combined_volume <= capacity_volume_m3`).
  - Receiving time window overlap (`requested_delivery_start` to `requested_delivery_end`).

#### UI Workflow
- Displays "Consolidation Opportunities" in `/operations/consolidation`.
- Preview route reduction, projected fuel savings, and combined cargo load.
- "Apply Consolidation" merges order fulfillments into a single route dispatch plan.

#### API Contracts
- `GET /api/consolidation/candidates`
- `POST /api/consolidation/apply`
  - Input: `{ candidateId: string, vehicleId: string, idempotencyKey: string }`

---

### 2.5 Module 5: Return-Load / Empty-Capacity Matching

#### Purpose
Matches returning vehicles from outer deliveries with nearby backhaul loads (e.g. supplier-to-warehouse transfers or packaging returns).

#### Screens & Workflow
- `/operations/capacity-matching`:
  - List of returning routes with surplus capacity.
  - Recommended backhaul jobs showing incremental deviation distance (`+4.2 km`), incremental travel time (`+18 mins`), and estimated commercial recovery (`₹1,850`).
  - Interactive "Append Return Load" action updating route stops.

#### API Contracts
- `GET /api/capacity/return-loads/candidates?routeId=...`
- `POST /api/capacity/return-loads/assign`

---

### 2.6 Module 6: Logistics Simulator

#### Purpose
What-if sandbox allowing operations teams to stress-test their distribution network against simulated disruptions without affecting transactional data.

#### Scenarios Supported
1. `peak-demand`: Demand spike (+30% to +100%) across high-density kirana clusters.
2. `supplier-delay`: 24-hour lead time extension on tier-1 FMCG suppliers.
3. `vehicle-shortage`: 35% fleet grounding due to unscheduled maintenance.
4. `warehouse-outage`: Distribution center shutdown with failover rerouting.

#### Output Metrics
- Projected SLA Violations Count
- Vehicle Shortfall Count
- Stockout Impact Matrix
- Estimated Financial Penalty / Incremental Cost

#### API Contracts
- `POST /api/simulations`
  - Input: `{ scenarioName: string, parameters: SimulationParameters }`
- `POST /api/simulations/:id/run`
- `GET /api/simulations/:id`

---

### 2.7 Module 7: Exception Center

#### Purpose
Operational command view to triage, acknowledge, and resolve logistics anomalies in real time.

#### Supported Exception Types
- `STOCKOUT_RISK`: High sales velocity exceeding existing inventory + incoming POs.
- `SUPPLIER_DELAY`: Supplier confirmation window passed without fulfillment acknowledgement.
- `VEHICLE_CAPACITY_CONFLICT`: Cargo weight or volume exceeding physical vehicle thresholds.
- `ROUTE_DELAY`: GPS or simulated travel delay exceeding delivery window SLA.
- `FAILED_DELIVERY`: Kirana closed or consignee unavailable upon delivery arrival.

#### Lifecycle
`DETECTED` → `ACKNOWLEDGED` → `ACTION_PROPOSED` → `ACTION_APPLIED` → `RESOLVED`

#### API Contracts
- `GET /api/exceptions?status=DETECTED,ACKNOWLEDGED`
- `POST /api/exceptions/:id/propose-action`
- `POST /api/exceptions/:id/resolve`

---

### 2.8 Module 8: AI Operations Copilot

#### Purpose
Natural language assistant providing operations explanations, querying network telemetry, and presenting structured action previews for human approval.

#### Guardrail Architecture
- LLM is strictly bounded to read tools and preview tools.
- Mutating commands require two-phase execution:
  1. `preview_route_change` / `preview_consolidation` (Side Effect: NONE, generates diff).
  2. User review in UI modal with explicit "Confirm" click.
  3. `apply_route_change` (Side Effect: HIGH, audited with `activity_events`).

#### Core Tools
- `get_order(orderId)`
- `search_orders(filter)`
- `get_inventory_risk(storeId)`
- `preview_route_change(routeId, modifications)`
- `apply_route_change(previewToken)`
- `explain_exception(exceptionId)`

---

## 3. Demo Scenarios & Seed Topology

### Demo Topology
- **Companies**: 2 Brands (e.g., Apex FMCG, FreshGro Dairy).
- **Suppliers**: 6 Regional Distributors & Hubs in Bangalore.
- **Warehouses**: 3 Fulfillment Depots (North, South, East Bangalore).
- **Kirana Stores**: 60 Stores categorized into 4 geographic clusters.
- **Vehicles**: 25 Delivery Vehicles (EV 3-wheelers, Tata Ace, 14ft Trucks).
- **Products**: 450 SKUs across Beverages, Staples, Snacks, and Personal Care.
- **Orders**: 200 Seeded Historical & In-Flight Orders with diverse statuses.

### Demo Clock Modes
- `REAL_TIME`: Wall-clock execution.
- `ACCELERATED`: 1 real second = 15 simulated seconds for rapid demo flow.
- `PAUSED`: Fixed snapshot for stable product walkthroughs.

---

## 4. Acceptance Criteria & Definition of Done

- [ ] All 8 modules accessible via modern Next.js dashboard UI.
- [ ] Responsive design supporting mobile-first layout for Kirana view and data-dense layout for Operations Control Tower.
- [ ] Deterministic pricing engine enforcing integer paise calculations.
- [ ] Deterministic inventory service respecting `available = on_hand - reserved`.
- [ ] SSE real-time event pipeline driving live status transitions on the Control Tower map.
- [ ] Full two-phase preview-and-apply safety workflow on all AI Copilot operations.
- [ ] Repeatable seed system initializing the full demo topology under 10 seconds.
