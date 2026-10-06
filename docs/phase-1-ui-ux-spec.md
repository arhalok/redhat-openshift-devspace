# Phase 1 — UI/UX Specification
## Part 4 — Product Interface, Interaction & Visual System

> **Purpose:** This document translates the Phase 1 product and technical contracts into an implementation-ready UI/UX specification.
>
> It is intentionally focused on the **visible product experience**. The interface must make the underlying logistics intelligence understandable without exposing unnecessary technical complexity.

---

# 1. Product Experience Goal

The product should feel like a modern logistics control platform rather than:

- a grocery marketplace,
- a generic admin dashboard,
- a map with pins,
- or a chatbot attached to CRUD screens.

The desired experience is:

> **Simple for a kirana user. Powerful for an operations user. Intelligent without being confusing.**

The interface should continuously answer four questions:

1. What is happening?
2. What needs attention?
3. Why is it happening?
4. What should I do next?

---

# 2. Primary User Experiences

Phase 1 supports two major surfaces.

## 2.1 Kirana experience

Primary jobs:

- discover recommended products
- replenish stock
- compare suppliers
- create orders
- track deliveries
- understand why recommendations are made

The interface should be extremely simple.

## 2.2 Company / Operations experience

Primary jobs:

- monitor the network
- identify exceptions
- inspect demand
- optimize deliveries
- consolidate orders
- use vehicle capacity
- simulate scenarios
- ask the AI copilot for operational explanations/actions

This interface can be information-dense.

---

# 3. Global Application Shell

Desktop layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo │ Workspace ▼ │ Search / Command K       │ Bell │ User │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Overview      │                                              │
│ Orders        │                  MAIN CONTENT                │
│ Stores        │                                              │
│ Suppliers     │                                              │
│ Inventory     │                                              │
│ Logistics     │                                              │
│ Network       │                                              │
│ Insights      │                                              │
│ Simulator     │                                              │
│ AI Copilot    │                                              │
│               │                                              │
├───────────────┤                                              │
│ Settings      │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

## Navigation

Primary items:

```text
Overview
Orders
Stores
Suppliers
Inventory
Logistics
Network
Insights
Simulator
AI Copilot
```

Secondary:

```text
Settings
Help
Account
```

The navigation should support:

- active state
- keyboard navigation
- collapsed desktop mode
- responsive mobile navigation
- tooltips when collapsed

---

# 4. Visual Direction

## 4.1 Design principles

Use:

- high information density without visual clutter
- restrained color
- strong typography hierarchy
- clear status indicators
- generous spacing around important actions
- subtle borders
- minimal shadows
- restrained animation

Avoid:

- excessive gradients
- excessive glassmorphism
- giant hero sections inside operational screens
- decorative charts with no decision value
- excessive rounded cards
- animation on every interaction
- fake "AI" visual effects

---

# 5. Color Semantics

Color must communicate meaning consistently.

Recommended semantic system:

```text
Neutral       normal information
Blue          active / informational
Green         healthy / completed / positive
Amber         warning / attention
Red           critical / failed
Purple        AI / intelligence
```

Do not use color as the only indicator.

For example:

```text
🔴 Critical
🟠 Attention
🟢 Healthy
```

should also have text labels.

---

# 6. Typography Hierarchy

Use one primary UI font.

Recommended:

```text
Inter
```

Suggested hierarchy:

```text
Page title       24–32px
Section title    18–20px
Card title       14–16px
Body             14px
Secondary        12–13px
Metadata         11–12px
```

Do not make everything large.

Operational interfaces should prioritize information density.

---

# 7. Core Component System

Create reusable components before implementing pages.

## Layout

```text
AppShell
Sidebar
Topbar
PageContainer
PageHeader
Section
Panel
SplitPane
```

## Data

```text
MetricCard
DataTable
StatusBadge
PriorityBadge
Avatar
ProgressBar
Timeline
ActivityFeed
EmptyState
Skeleton
```

## Actions

```text
Button
IconButton
Dropdown
CommandPalette
Modal
Drawer
Popover
ConfirmationDialog
Toast
```

## Logistics

```text
MapView
RouteCard
VehicleCard
OrderCard
SupplierCard
StoreCard
CapacityBar
RouteTimeline
ExceptionCard
OptimizationSummary
```

## Intelligence

```text
RecommendationCard
ConfidenceBadge
InsightCard
ReasonList
SimulationPanel
AICopilot
```

---

# 8. Control Tower — Primary Screen

Route:

```text
/overview
```

This is the first screen for company/operations users.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Network Control Tower                     Date ▼   Refresh    │
├──────────────────────────────────────────────────────────────┤
│ Orders │ Deliveries │ Vehicles │ At Risk │ Utilization       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                         LIVE MAP                              │
│                                                              │
│                     ● Warehouse                               │
│              ● ● ●          ───────                           │
│           ● ● ● ● ●                 ● ●                       │
│                                                              │
├─────────────────────────────┬────────────────────────────────┤
│ Exceptions                  │ AI Recommendations             │
│                             │                                │
│ 🔴 Route delayed            │ Consolidate 12 orders          │
│ 🟠 Supplier delay           │ into 4 routes                  │
│ 🟠 Stockout risk            │                                │
│                             │ [Review]                        │
├─────────────────────────────┴────────────────────────────────┤
│ Network activity / route status                               │
└──────────────────────────────────────────────────────────────┘
```

---

# 9. KPI Cards

Display:

```text
Orders
Deliveries
Active Vehicles
At-Risk Orders
Vehicle Utilization
```

Each card:

```text
Orders
1,248
↑ 8.4%

Today
```

Clicking a KPI should navigate to its detailed view.

Do not make KPI cards decorative.

---

# 10. Network Map

The map is one of the most important visual components.

## Layers

Support toggling:

```text
Stores
Suppliers
Warehouses
Vehicles
Routes
Demand
Exceptions
H3 zones
```

## Map interactions

Click:

```text
Store
```

opens a side panel.

Click:

```text
Vehicle
```

shows:

```text
Vehicle V-027
Status: En route
Capacity: 62%
Stops: 6
ETA: 14:20
```

Click:

```text
Route
```

shows route details.

---

# 11. Map Performance Rules

Do not render thousands of individual DOM markers.

Use:

- clustering
- viewport filtering
- marker aggregation
- canvas/WebGL rendering where appropriate

For Phase 1 demo data, normal map markers are acceptable.

The map layer must remain replaceable.

---

# 12. Exception Center

Route:

```text
/overview → Exceptions
```

Display only issues requiring attention.

Categories:

```text
Delivery
Inventory
Supplier
Vehicle
Order
Payment
```

Example:

```text
🔴 DELIVERY DELAY

Route R-124
3 stores affected

Cause:
Vehicle reassignment

Impact:
~22 minute delay

Recommended:
Move stops 4 and 5 to R-131

[Preview] [Apply]
```

---

# 13. Smart Replenishment

Route:

```text
/stores/:storeId/replenishment
```

## Main screen

```text
Smart Replenishment

We found 8 products worth reviewing.

┌───────────────────────────────────────────────────────────┐
│ Product       Stock    Expected Need    Risk    Action     │
│ Maggi         18       32               High    +12        │
│ Tata Salt      9       20               High    +12        │
│ Oil           15       22               Medium  +8         │
└───────────────────────────────────────────────────────────┘

[ Add All Recommendations ]
```

---

# 14. Recommendation Explanation

Every intelligent recommendation should be explainable.

Click:

```text
Why?
```

Show:

```text
WHY THIS WAS RECOMMENDED

✓ Current inventory is below target
✓ Recent demand increased
✓ Supplier lead time is 2 days
✓ Safety stock requirement is 8 units

Confidence
82%
```

Never say:

> "AI says you need this."

Give operational reasons.

---

# 15. Smart Order Creation

After selecting recommendations:

```text
Review Smart Order
```

Show:

```text
12 products
₹18,420 estimated value

Supplier allocation
────────────────────────
Supplier A    ₹8,420
Supplier B    ₹6,800
Supplier C    ₹3,200

Expected delivery:
Tomorrow
```

Actions:

```text
[Edit]
[Compare suppliers]
[Place order]
```

---

# 16. Supplier Intelligence

Route:

```text
/suppliers
```

Supplier cards:

```text
Supplier B

Reliability       94%
Avg delivery      1.2 days
Fill rate         97%
Distance          7.2 km
Active orders     18

[View supplier]
```

---

# 17. Supplier Comparison

When a product has multiple supplier options:

```text
┌────────────────────────────────────────────────────┐
│ Product: Cooking Oil                                       │
├────────────────────────────────────────────────────┤
│ Supplier A │ Supplier B ⭐ │ Supplier C                     │
│ ₹120       │ ₹118          │ ₹121                           │
│ 2 days     │ 1 day         │ Today                          │
│ 91%        │ 96%           │ 88%                            │
│ MOQ 24     │ MOQ 12        │ MOQ 48                         │
└────────────────────────────────────────────────────┘
```

Recommendation:

```text
BEST OVERALL OPTION
Supplier B

Reason:
Best balance of price, reliability and delivery time.
```

---

# 18. Order Management

Route:

```text
/orders
```

Tabs:

```text
All
Pending
Confirmed
Preparing
In Transit
Delivered
Exceptions
```

Table:

```text
Order ID
Store
Value
Supplier
Status
Delivery
Created
```

Clicking an order opens a detail drawer/page.

---

# 19. Order Detail

```text
ORD-10284

Status:
IN TRANSIT

Store:
Sharma General Store

Supplier:
Supplier B

────────────────────────────

Items
12 products

────────────────────────────

Delivery
Route R-124
Vehicle V-027
ETA 14:20

────────────────────────────

Timeline

09:12 Order created
09:15 Supplier confirmed
10:04 Packed
10:31 Dispatched
12:42 In transit
```

Use a timeline instead of paragraphs.

---

# 20. Dynamic Consolidation

Route:

```text
/logistics/consolidation
```

Display opportunities:

```text
CONSOLIDATION OPPORTUNITY

12 nearby orders

Current:
12 delivery trips
48 km

Potential:
4 delivery routes
31 km

[Preview Consolidation]
```

When preview is clicked:

```text
BEFORE → AFTER
```

with map animation.

---

# 21. Route Optimization

Route:

```text
/logistics/routes
```

Show:

```text
Route R-124

Vehicle:
V-027

Stops:
6

Distance:
31 km

Capacity:
62%

ETA:
14:20
```

Primary CTA:

```text
[ Optimize Network ]
```

---

# 22. Optimization Experience

Do not instantly change the map.

Show a short staged progress state:

```text
Optimizing network...

✓ Grouping nearby deliveries
✓ Checking vehicle capacity
✓ Checking delivery windows
✓ Evaluating route distance
✓ Comparing alternatives

Optimization complete
```

Then show:

```text
BEFORE
72 vehicles
1,842 km

AFTER
61 vehicles
1,421 km

[Review Changes]
```

For demo mode, clearly mark simulated values.

---

# 23. Return Capacity

Inside route/vehicle detail:

```text
VEHICLE V-027

Current utilization
62%

Return capacity
38%

Nearby compatible load found

Supplier Delta
Pickup: 2.8 km
Weight: 340 kg

[Preview Return Load]
```

After preview:

```text
Additional distance
+4.1 km

Estimated capacity utilization
62% → 91%

[Add Return Load]
```

This should feel like a decision-support tool, not a random recommendation.

---

# 24. Network Insights

Route:

```text
/network
```

Provide:

```text
Demand Density
Supply Density
Delivery Density
Vehicle Capacity
Risk Zones
```

Allow switching analytical layers.

---

# 25. H3 / Demand View

Click a geographic cell:

```text
AREA INSIGHT

Stores:
84

Daily orders:
312

Demand trend:
↑ 14%

Stockout risk:
17 stores

Top categories:
Beverages
Snacks
Staples

Recommended action:
Increase local supply allocation
```

The user should understand the insight without knowing what H3 is.

---

# 26. What-If Simulator

Route:

```text
/simulator
```

Use a left configuration panel and right result panel.

```text
┌──────────────────────┬─────────────────────────────────────┐
│ SCENARIO             │ RESULT                              │
│                      │                                     │
│ Demand   +25%        │ Vehicles needed     +8              │
│ Vehicles -10%        │ SLA risks           13              │
│ Warehouse B OFF      │ Cost impact         +₹18,200        │
│ SLA      4h          │                                     │
│                      │ Recommendation:                     │
│ [Run Simulation]     │ Reallocate 2 vehicles               │
└──────────────────────┴─────────────────────────────────────┘
```

Use sliders/selectors rather than requiring text input.

---

# 27. AI Operations Copilot

Open from:

```text
topbar
or
dedicated /ai route
```

## Suggested prompts

```text
Why are deliveries delayed today?

Which stores are at stockout risk?

Find unused vehicle capacity.

What should we optimize first?

What changed in today's network?

Simulate a 20% demand increase.
```

This helps users discover functionality.

---

# 28. AI Response Design

AI responses should contain:

```text
Answer
Evidence
Recommended action
Action buttons
```

Example:

```text
11 deliveries are currently at risk.

Main causes:
• 5 vehicle reassignment issues
• 3 supplier delays
• 2 overloaded routes
• 1 warehouse delay

Recommended:
Move stops 7 and 9 from R-21 to R-18.

[Preview]
[Apply]
```

Do not produce giant conversational paragraphs.

---

# 29. AI Action Confirmation

For destructive or operationally meaningful actions:

```text
AI proposes action
        ↓
Preview
        ↓
User confirmation
        ↓
Execute
        ↓
Audit event
```

Do not allow an LLM to silently change:

- orders
- inventory
- routes
- payments
- supplier records

without the required application-level authorization.

---

# 30. Command Palette

Keyboard:

```text
Ctrl + K
```

Actions:

```text
Create order
Search order
Find store
Find supplier
Open route
Optimize network
Open simulator
Ask AI
Go to overview
```

Search should support:

```text
order ID
store
supplier
product
vehicle
route
```

---

# 31. Keyboard Shortcuts

Recommended:

```text
Ctrl/Cmd + K    Command palette
/               Search
G then O        Overview
G then L        Logistics
G then S        Suppliers
G then I        Inventory
C               Create order
Esc             Close overlay
```

Shortcuts should never interfere with text input.

---

# 32. Loading States

Every data-heavy component must have a skeleton.

Examples:

```text
MetricSkeleton
TableSkeleton
MapSkeleton
CardSkeleton
TimelineSkeleton
```

Avoid blank white screens.

---

# 33. Empty States

Every page needs an intentional empty state.

Example:

```text
No exceptions

Everything is currently operating normally.
```

Do not simply show:

```text
No data
```

---

# 34. Error States

Errors must explain:

1. what failed
2. whether the user's data was saved
3. what the user can do next

Example:

```text
Route optimization failed

Your current routes have not been changed.

[Retry]
[Keep Existing Routes]
```

---

# 35. Toast Notifications

Use for short-lived confirmations:

```text
Order created
Route optimized
Supplier selected
Simulation completed
```

Do not put important information only inside a toast.

---

# 36. Drawers vs Pages

Use drawers for:

- quick inspection
- order preview
- store preview
- vehicle preview
- supplier preview
- exception details

Use full pages for:

- complex workflows
- route planning
- simulation
- analytics
- configuration
- long forms

---

# 37. Mobile Experience

The company control tower is desktop-first.

The kirana experience is mobile-first.

Kirana bottom navigation:

```text
Home
Order
Orders
Inventory
Account
```

Primary mobile action:

```text
Smart Order
```

should be easy to reach.

---

# 38. Responsive Breakpoints

Use the design system's standard responsive breakpoints.

At smaller widths:

- collapse sidebar
- stack KPI cards
- convert tables to cards where necessary
- simplify maps
- use bottom sheets
- keep primary actions visible

Do not simply shrink desktop layouts.

---

# 39. Motion Design

Animation should communicate state changes.

Use:

- subtle map route transitions
- number count-up for important KPI updates
- drawer transitions
- optimization progress
- consolidation animation
- simulation result transition

Avoid:

- constant floating animations
- excessive hover effects
- long page transitions

Animation duration should generally be short.

---

# 40. The "Wow" Moments

Phase 1 should deliberately contain these visual moments.

## Wow 1 — Smart Order

User clicks:

```text
Smart Order
```

and the system instantly builds a recommended basket.

## Wow 2 — Consolidation

12 individual deliveries visually merge into 4 optimized routes.

## Wow 3 — Return Capacity

A vehicle route shows unused capacity and discovers a compatible return shipment.

## Wow 4 — Network Optimization

The map changes from:

```text
BEFORE
```

to:

```text
AFTER
```

with a clear explanation.

## Wow 5 — Simulation

User changes:

```text
Demand +25%
```

and the network recalculates.

## Wow 6 — AI Action

User asks:

```text
Why are deliveries delayed?
```

AI identifies causes and offers a concrete operational action.

---

# 41. UX Rules for Intelligent Features

Every recommendation must have:

```text
Recommendation
Reason
Confidence when meaningful
Impact
Action
```

Example:

```text
Recommended:
Order 12 units

Why:
Current stock + demand + lead time

Impact:
Lower stockout risk

[Add to order]
```

This creates trust.

---

# 42. Do Not Fake Intelligence

Demo mode can use seeded deterministic data.

It must not pretend that:

- simulated savings are real
- forecast accuracy is real
- GPS is live
- supplier data is real
- AI has access to unavailable data

Use labels such as:

```text
Demo
Simulated
Estimated
Prototype
```

where appropriate.

---

# 43. Design System Implementation Order

Build components in this order:

```text
1. Typography
2. Colors/tokens
3. Button
4. Input
5. Badge
6. Card
7. Dialog
8. Drawer
9. Table
10. Tabs
11. Command palette
12. Navigation
13. Metric cards
14. Timeline
15. Map
16. Logistics components
17. Recommendation components
18. AI components
```

Do not create one-off styling for every page.

---

# 44. Page Implementation Order

Implement in this exact sequence:

```text
1. App shell
2. Overview / Control Tower
3. Smart Replenishment
4. Supplier Intelligence
5. Orders
6. Logistics / Routes
7. Consolidation
8. Return Capacity
9. Network Insights
10. Simulator
11. AI Copilot
12. responsive/mobile polish
```

---

# 45. Demo Navigation Flow

The primary demonstration path should be:

```text
Overview
  ↓
Stockout Risk
  ↓
Store
  ↓
Smart Replenishment
  ↓
Supplier Recommendation
  ↓
Create Order
  ↓
Network Consolidation
  ↓
Route Optimization
  ↓
Return Capacity
  ↓
AI Explanation
  ↓
Simulator
```

Every step should be reachable in a few clicks.

---

# 46. Definition of UI/UX Done

Phase 1 UI is complete when:

- [x] navigation is consistent
- [x] Control Tower looks production-quality
- [x] map works with seeded data
- [x] Smart Replenishment works
- [x] recommendations are explainable
- [x] Supplier Intelligence works
- [x] order creation works
- [x] order states are visible
- [x] consolidation can be previewed
- [x] route optimization has a visible before/after
- [x] return-capacity opportunity is visible
- [x] simulator produces understandable results
- [x] AI Copilot can answer using application data
- [x] AI actions require proper confirmation
- [x] loading states exist
- [x] empty states exist
- [x] errors are recoverable
- [x] responsive behavior works
- [x] keyboard shortcuts work
- [x] no fake live-data claims exist
- [x] no major screen depends on hard-coded JSX data
- [x] components are reusable

---

# 47. Final UX Principle

The interface should never make the user think:

> "What does this technology do?"

It should make them think:

> **"What should I do next?"**

The technology stays underneath.

The product surfaces:

```text
SEE
→ UNDERSTAND
→ DECIDE
→ ACT
```

That is the core Phase 1 experience.
