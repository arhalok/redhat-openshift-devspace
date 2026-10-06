# Phase 1 — Data Model, Type Contracts, API Contracts & Service Pseudocode

**Document status:** Implementation contract — Part 3 of Phase 1  
**Audience:** Full-stack developer / coding agent  
**Primary objective:** Convert the Phase 1 product specification into stable technical contracts so the UI, demo engines, and future production engines can evolve without architectural rewrites.

---

## 0. Non-negotiable engineering objective

The Phase 1 prototype must be visually rich and functionally convincing, but it must not trap the project in demo-only architecture.

The central rule is:

> **UI depends on domain contracts, never directly on demo data, optimization libraries, database tables, or LLM SDKs.**

Use this dependency direction:

```text
UI
 ↓
Application Use Cases
 ↓
Domain Services / Interfaces
 ↓
Adapters
 ├── Demo adapters
 ├── Database adapters
 ├── Routing adapter
 ├── Optimization adapter
 ├── Forecast adapter
 └── AI adapter
```

---

## 1. Golden End-to-End Scenario (Section 42)

The entire Phase 1 application is testable through one seeded story:

```text
Store: SHREE GENERAL STORE
Product: Beverage SKU
Current stock: low
        ↓
Smart replenishment recommends 24 units
        ↓
Supplier intelligence recommends Supplier B
        ↓
Order submitted
        ↓
Nearby orders become consolidation candidates
        ↓
Route optimizer creates route
        ↓
Vehicle still has spare capacity
        ↓
Return-capacity engine finds compatible pickup
        ↓
Dashboard receives route update
        ↓
Exception is generated for one delayed supplier
        ↓
AI Copilot explains delay
        ↓
Simulation tests +25% demand
```

---

## 2. Core Service Boundaries & Contracts

- **OrderService**: Manages transaction state machine `DRAFT -> SUBMITTED -> CONFIRMED -> ALLOCATED -> OUT_FOR_DELIVERY -> DELIVERED` with audit events and idempotency.
- **ReplenishmentService**: Evaluates `availableStock = onHand - reserved` against `reorderThreshold = estimatedLeadTimeDemand + safetyStock`.
- **SupplierRecommendationService**: Computes weighted decision scores:
  `0.30*Price + 0.20*Availability + 0.20*Reliability + 0.15*Delivery + 0.10*Distance + 0.05*MOQ`.
- **ConsolidationService**: Clusters nearby open delivery orders by H3 index and evaluates capacity constraints.
- **CapacityMatchingService**: Matches returning vehicles with nearby compatible return-loads / backhauls.
- **SimulationService**: Executes what-if scenarios in isolated sandbox memory without mutating transactional records.
- **CopilotService**: Dispatches typed read and preview tools (`get_network_summary`, `get_order_details`, `find_consolidation_opportunities`, etc.).
