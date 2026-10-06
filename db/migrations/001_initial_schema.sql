-- Phase 0 Database Schema Contract
-- Kirana-to-Company Logistics Platform
-- Conforms to Sections 7-14, 25, 29, 35 of logistics-foundation.md

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS for exact spatial representation (Section 16.1)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Identity & Tenants (Section 7)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('COMPANY', 'DISTRIBUTOR', 'SUPPLIER', 'OPERATOR', 'ADMIN')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'PROCUREMENT_MANAGER', 'STORE_OWNER', 'SUPPLIER_USER', 'VIEWER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- 2. Stores (Section 8)
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geo_point GEOMETRY(Point, 4326),
    h3_cell VARCHAR(30) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    store_type VARCHAR(50) NOT NULL DEFAULT 'GROCERY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Products & Supplier SKUs (Section 9)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(150) NOT NULL,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    unit VARCHAR(30) NOT NULL,
    pack_size VARCHAR(50) NOT NULL,
    weight_grams INTEGER NOT NULL DEFAULT 0,
    volume_ml INTEGER NOT NULL DEFAULT 0,
    barcode VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    supplier_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geo_point GEOMETRY(Point, 4326),
    service_radius_km DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    reliability_score DOUBLE PRECISION NOT NULL DEFAULT 85.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE supplier_skus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_sku_code VARCHAR(100) NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    pack_description TEXT,
    price_paise BIGINT NOT NULL, -- Integer minor units (INR Paise)
    moq INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    lead_time_hours INTEGER NOT NULL DEFAULT 24,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(supplier_id, supplier_sku_code)
);

-- 4. Inventory Balances & Movements (Section 10)
CREATE TABLE inventory_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    on_hand_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    incoming_quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT available_formula CHECK (on_hand_quantity >= reserved_quantity)
);

CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    location_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('RECEIPT', 'SALE', 'RESERVATION', 'RELEASE', 'TRANSFER', 'DAMAGE', 'RETURN', 'ADJUSTMENT')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100) NOT NULL
);

-- 5. Orders & Order Items (Sections 11 & 12)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    store_id UUID NOT NULL REFERENCES stores(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    subtotal_paise BIGINT NOT NULL DEFAULT 0,
    shipping_fee_paise BIGINT NOT NULL DEFAULT 0,
    discount_paise BIGINT NOT NULL DEFAULT 0,
    tax_paise BIGINT NOT NULL DEFAULT 0,
    total_paise BIGINT NOT NULL DEFAULT 0,
    requested_delivery_start TIMESTAMPTZ NOT NULL,
    requested_delivery_end TIMESTAMPTZ NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'WEB_PORTAL',
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    supplier_sku_id UUID NOT NULL REFERENCES supplier_skus(id),
    requested_quantity INTEGER NOT NULL,
    confirmed_quantity INTEGER NOT NULL DEFAULT 0,
    unit_price_paise BIGINT NOT NULL,
    discount_paise BIGINT NOT NULL DEFAULT 0,
    tax_paise BIGINT NOT NULL DEFAULT 0,
    line_total_paise BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Vehicles, Routes, and Deliveries (Section 14)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    vehicle_code VARCHAR(100) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    capacity_weight_kg DOUBLE PRECISION NOT NULL,
    capacity_volume_m3 DOUBLE PRECISION NOT NULL,
    current_latitude DOUBLE PRECISION NOT NULL,
    current_longitude DOUBLE PRECISION NOT NULL,
    current_geo_point GEOMETRY(Point, 4326),
    availability_status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_code VARCHAR(100) UNIQUE NOT NULL,
    origin_location_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED',
    planned_distance_m INTEGER NOT NULL,
    planned_duration_s INTEGER NOT NULL,
    total_weight_kg DOUBLE PRECISION NOT NULL DEFAULT 0,
    total_volume_m3 DOUBLE PRECISION NOT NULL DEFAULT 0,
    vehicle_id UUID REFERENCES vehicles(id),
    optimization_run_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    stop_type VARCHAR(50) NOT NULL,
    location_id UUID NOT NULL,
    order_id UUID REFERENCES orders(id),
    planned_arrival TIMESTAMPTZ NOT NULL,
    planned_departure TIMESTAMPTZ NOT NULL,
    actual_arrival TIMESTAMPTZ,
    actual_departure TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    route_id UUID NOT NULL REFERENCES routes(id),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    planned_departure TIMESTAMPTZ NOT NULL,
    actual_departure TIMESTAMPTZ,
    planned_arrival TIMESTAMPTZ NOT NULL,
    actual_arrival TIMESTAMPTZ,
    pod_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Exceptions (Section 25)
CREATE TABLE exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DETECTED',
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    recommended_action TEXT NOT NULL,
    action_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Activity Events / Audit Trail (Sections 29 & 35)
CREATE TABLE activity_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    actor_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id UUID NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    previous_state JSONB,
    new_state JSONB,
    request_id VARCHAR(100) NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'USER_UI',
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_request_id VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    user_prompt TEXT NOT NULL,
    selected_tool VARCHAR(100) NOT NULL,
    tool_input JSONB NOT NULL,
    tool_result JSONB,
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    mutation_executed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
