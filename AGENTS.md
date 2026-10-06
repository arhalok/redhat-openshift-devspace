# AI Agent Operating Guidelines & Architecture Contract

You are working on a modular monolith for the Kirana-to-Company B2B Logistics and Distribution Platform.

## Core Rules & Guardrails

### 1. Architectural Integrity
- **Modular Monolith**: Organized around business domains with explicit service contracts. Never introduce microservices without measured necessity.
- **Strict Separation of Concerns**:
  - Web UI never accesses the database directly.
  - Route handlers remain thin: parse, validate (Zod), authorize, call application service, serialize response.
  - Business logic strictly resides in domain/application services.
  - External providers (routing, maps, ERP, payments) must live behind adapters.
  - AI adapters must NOT mutate database tables directly.

### 2. Deterministic vs. AI Boundary
- LLMs assist with interpretation, explanation, search, and orchestration.
- **Never use LLMs for deterministic calculations**: Money, inventory arithmetic, vehicle capacity constraints, and route optimization MUST be deterministic.
- Mutating AI tools must require an explicit two-step **Preview -> Confirm/Apply** workflow with authorization checks.

### 3. Financial & Quantity Integrity
- **Money Handling**: Never use floating point numbers. Store monetary amounts as integer minor units (paise in INR, e.g. ₹125.50 = `12550`).
- **Inventory Balance Formula**: Always maintain `available = on_hand - reserved`. Stock changes must create auditable inventory movements.

### 4. Concurrency & Idempotency
- All externally retryable write commands (orders, payments, reservations) must require an `idempotency_key`.
- Handle concurrent mutations using database transactions, optimistic locks, or row-level locking.

### 5. Time & Geospatial Standards
- Store all timestamps in UTC internally; convert to local timezone (`Asia/Kolkata`) only at the presentation boundary.
- Time windows (`requested_delivery_start`, `planned_arrival`, etc.) are first-class fields.
- PostGIS spatial `Point` is the source of truth for coordinates; H3 is for derived spatial indexing/clustering.

### 6. Feature Implementation Workflow
When implementing any feature:
1. Identify the relevant business domain (`domains/`).
2. Define or update the service contract interface (`services/`).
3. Implement deterministic business logic and demo-compatible adapters.
4. Expose the capability through a validated API with the standard response/error envelope.
5. Connect UI domain components using the shared design tokens.
6. Write unit and integration tests covering positive and edge cases.
7. Preserve reproducible demo scenarios and seed determinism.
