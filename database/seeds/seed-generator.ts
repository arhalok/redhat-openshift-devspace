/**
 * Deterministic Seed Data Generator for Bangalore Kirana Distribution Network
 * Conforms to Sections 40-43 of Phase 1 Engineering Build Specification
 * Scale:
 * - 1 Organization
 * - 2 Operations Users
 * - 50 Kirana Stores across Bangalore Clusters
 * - 10 Suppliers
 * - 2 Warehouses
 * - 100 Fleet Vehicles
 * - 300 Products across 8 FMCG Categories
 * - 2,000 Inventory Records
 * - 500 Orders with order items
 * - 100 Active Routes with Route Stops
 */

function createLcgRng(seed = 42) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function generatePhase1SeedDataset(seedNumber = 42) {
  const rng = createLcgRng(seedNumber);

  // 1. Organization & Users (Section 6, 7, 8)
  const organization = {
    id: 'org-blr-core',
    name: 'KiranaFlow Bangalore Logistics Network',
    slug: 'kiranaflow-blr',
    type: 'COMPANY',
    createdAt: '2026-01-01T00:00:00Z',
  };

  const users = [
    {
      id: 'usr-ops-01',
      name: 'Sunil Verma',
      email: 'sunil.verma@kiranaflow.internal',
      phone: '+91 98450 11001',
      role: 'ADMIN',
    },
    {
      id: 'usr-ops-02',
      name: 'Pooja Hegde',
      email: 'pooja.hegde@kiranaflow.internal',
      phone: '+91 98450 11002',
      role: 'OPERATOR',
    },
  ];

  // 2. Warehouses (Section 11) - 2 nodes
  const warehouses = [
    {
      id: 'wh-ypr-central',
      name: 'North Bangalore Central Depot',
      address: 'Plot 12, Yeshwanthpur Industrial Area',
      city: 'Bangalore',
      state: 'Karnataka',
      latitude: 13.0285,
      longitude: 77.5408,
      capacityUnits: 80000,
      status: 'ACTIVE',
    },
    {
      id: 'wh-ecity-fulfillment',
      name: 'South Bangalore Fulfillment Hub',
      address: 'Hosur Road, Electronic City Phase 1',
      city: 'Bangalore',
      state: 'Karnataka',
      latitude: 12.8452,
      longitude: 77.6602,
      capacityUnits: 65000,
      status: 'ACTIVE',
    },
  ];

  // 3. Suppliers (Section 10) - 10 nodes across Bangalore corridors
  const supplierNames = [
    { name: 'Apex FMCG Distribution Hub', cat: 'Staples & Packaged Foods', lat: 13.021, lng: 77.535 },
    { name: 'Kaveri Valley Dairy & Perishables', cat: 'Dairy & Fresh', lat: 12.852, lng: 77.651 },
    { name: 'Mysore Grain Wholesale Syndicate', cat: 'Flour, Rice & Sugar', lat: 13.029, lng: 77.528 },
    { name: 'Delta Beverage & FMCG Wholesalers', cat: 'Beverages & Snacks', lat: 12.998, lng: 77.689 },
    { name: 'Karnataka Oil & Spices Syndicate', cat: 'Edible Oils & Spices', lat: 12.965, lng: 77.558 },
    { name: 'Bangalore Confectionery & Biscuits Co', cat: 'Biscuits & Confectionery', lat: 12.981, lng: 77.632 },
    { name: 'Hindustan Home & Hygiene Depot', cat: 'Home Care & Detergents', lat: 13.042, lng: 77.519 },
    { name: 'Chamundi Personal Care Supply', cat: 'Personal Care & Soaps', lat: 12.915, lng: 77.605 },
    { name: 'Deccan Packaged Foods Distributor', cat: 'Packaged Foods & Noodles', lat: 12.948, lng: 77.712 },
    { name: 'Cauvery Cold Storage & Agro Hub', cat: 'Dairy & Perishables', lat: 12.872, lng: 77.628 },
  ];

  const suppliers = supplierNames.map((s, idx) => ({
    id: `sup-${idx + 1}`,
    name: s.name,
    category: s.cat,
    phone: `+91 80 2839 ${1000 + idx}`,
    address: `${s.name} Industrial Facility, Bangalore`,
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: `5600${10 + idx}`,
    latitude: s.lat,
    longitude: s.lng,
    reliabilityScore: Math.round(85 + rng() * 14),
    fillRate: Math.round(88 + rng() * 11),
    averageLeadTimeHours: Math.round(12 + rng() * 24),
    status: 'ACTIVE',
  }));

  // 4. Kirana Stores (Section 9) - 50 stores across 6 Bangalore clusters
  const clusters = [
    { name: 'Indiranagar', lat: 12.9719, lng: 77.6412, h3: '88618925d3fffff' },
    { name: 'Koramangala', lat: 12.9345, lng: 77.6256, h3: '8861892557fffff' },
    { name: 'Jayanagar', lat: 12.9237, lng: 77.5925, h3: '886189240bfffff' },
    { name: 'Whitefield', lat: 12.958, lng: 77.721, h3: '8861892e67fffff' },
    { name: 'Malleshwaram', lat: 13.003, lng: 77.571, h3: '8861892511fffff' },
    { name: 'Peenya', lat: 13.031, lng: 77.519, h3: '8861892745fffff' },
  ];

  const stores = [];
  for (let i = 1; i <= 50; i++) {
    const cluster = clusters[(i - 1) % clusters.length];
    // Add jitter within 1.5 km of cluster centroid
    const lat = cluster.lat + (rng() - 0.5) * 0.02;
    const lng = cluster.lng + (rng() - 0.5) * 0.02;

    stores.push({
      id: `store-${i}`,
      name: i === 1 ? 'Sharma General Store' : i === 2 ? 'Venkateshwara Super Traders' : i === 3 ? 'Laxmi Retail & General Provisions' : `Kirana Store #${i} (${cluster.name})`,
      ownerName: `Owner ${i}`,
      phone: `+91 98450 ${10000 + i}`,
      address: `${10 + (i % 30)}th Main, ${cluster.name}, Bangalore`,
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560038',
      latitude: lat,
      longitude: lng,
      h3Cell: cluster.h3,
      status: 'ACTIVE',
      receivingStart: '08:00:00',
      receivingEnd: '21:00:00',
    });
  }

  // 5. Vehicles (Section 17) - 100 vehicles
  const vehicleTypes = [
    { type: 'EV_3_WHEELER', weightKg: 500, volumeM3: 2.5 },
    { type: 'TATA_ACE', weightKg: 1000, volumeM3: 4.8 },
    { type: 'BOLERO_PICKUP', weightKg: 1200, volumeM3: 6.2 },
    { type: '14FT_TRUCK', weightKg: 3500, volumeM3: 16.0 },
  ];

  const vehicles = [];
  for (let i = 1; i <= 100; i++) {
    const vType = vehicleTypes[(i - 1) % vehicleTypes.length];
    const isAvailable = rng() > 0.15;
    const currentWeight = isAvailable ? Math.round(vType.weightKg * (0.4 + rng() * 0.5)) : 0;
    const currentVol = isAvailable ? Number((vType.volumeM3 * (0.4 + rng() * 0.5)).toFixed(2)) : 0;
    const storeLoc = stores[i % stores.length];

    vehicles.push({
      id: `veh-${i}`,
      vehicleNumber: i === 1 ? 'V-027' : i === 2 ? 'V-131' : i === 3 ? 'V-108' : `KA-0${(i % 5) + 1}-TR-${1000 + i}`,
      vehicleType: vType.type,
      capacityWeightKg: vType.weightKg,
      capacityVolumeM3: vType.volumeM3,
      currentWeightKg: currentWeight,
      currentVolumeM3: currentVol,
      latitude: storeLoc.latitude,
      longitude: storeLoc.longitude,
      status: isAvailable ? (rng() > 0.4 ? 'IN_TRANSIT' : 'AVAILABLE') : 'MAINTENANCE',
    });
  }

  // 6. Products (Section 12) - 300 products across 8 categories
  const categories = [
    'Staples', 'Snacks', 'Beverages', 'Biscuits',
    'Personal Care', 'Home Care', 'Dairy', 'Packaged Foods'
  ];

  const products = [];
  const productSuppliers = [];

  for (let i = 1; i <= 300; i++) {
    const cat = categories[(i - 1) % categories.length];
    const sku = `SKU-FMCG-${String(i).padStart(4, '0')}`;
    const name = i === 1
      ? 'Aashirvaad Superior Shudh Chakki Atta 10kg'
      : i === 2
      ? 'Fortune Sunlite Refined Sunflower Oil 1L'
      : i === 3
      ? 'Parle-G Gold Biscuits Case'
      : i === 4
      ? 'Tata Salt Vacuum Evaporated 1kg'
      : `${cat} Product Brand Item #${i}`;

    const weightKg = Number((0.2 + rng() * 9.8).toFixed(2));
    const volumeM3 = Number((weightKg * 0.0012).toFixed(4));

    products.push({
      id: `prod-${i}`,
      sku,
      name,
      category: cat,
      unit: weightKg > 4 ? 'BAG' : 'PACK',
      packSize: weightKg > 4 ? '10kg' : '1kg',
      weightKg,
      volumeM3,
      status: 'ACTIVE',
    });

    // Assign 1-3 suppliers per product
    const assignedSupCount = Math.floor(1 + rng() * 2.5);
    for (let sIdx = 0; sIdx < assignedSupCount; sIdx++) {
      const sup = suppliers[(i + sIdx) % suppliers.length];
      const basePrice = Math.round(20 + rng() * 450);
      productSuppliers.push({
        id: `ps-${i}-${sIdx}`,
        productId: `prod-${i}`,
        supplierId: sup.id,
        supplierSku: `${sup.id.toUpperCase()}-${sku}`,
        priceNumeric: basePrice.toFixed(2),
        minimumOrderQuantity: Math.floor(2 + rng() * 10),
        availableQuantity: Math.floor(50 + rng() * 300),
        leadTimeHours: sup.averageLeadTimeHours,
        isActive: true,
      });
    }
  }

  // 7. Inventory Records (Section 14) - 2,000 records
  const inventory = [];
  let invCount = 0;
  for (let s = 0; s < stores.length && invCount < 2000; s++) {
    const store = stores[s];
    // 40 products per store = 50 * 40 = 2000 records
    for (let p = 1; p <= 40 && invCount < 2000; p++) {
      invCount++;
      const onHand = Math.floor(1 + rng() * 35);
      const reserved = Math.floor(rng() * Math.min(onHand, 6));

      inventory.push({
        id: `inv-${invCount}`,
        storeId: store.id,
        productId: `prod-${p}`,
        onHand,
        reserved,
        reorderPoint: 12,
        safetyStock: 6,
      });
    }
  }

  // 8. Orders (Section 15, 16) - 500 orders
  const orders = [];
  const orderItems = [];
  const orderStatuses = [
    'DELIVERED', 'IN_TRANSIT', 'PREPARING', 'CONFIRMED', 'SUBMITTED', 'DRAFT', 'EXCEPTION'
  ];

  for (let i = 1; i <= 500; i++) {
    const store = stores[(i - 1) % stores.length];
    const sup = suppliers[(i - 1) % suppliers.length];
    const status = orderStatuses[(i - 1) % orderStatuses.length];
    const itemCount = Math.floor(2 + rng() * 5);

    let subtotal = 0;
    for (let it = 1; it <= itemCount; it++) {
      const prod = products[((i * 3 + it) % products.length)];
      const qty = Math.floor(1 + rng() * 12);
      const unitPrice = Math.round(40 + rng() * 400);
      const itemSubtotal = qty * unitPrice;
      subtotal += itemSubtotal;

      orderItems.push({
        id: `oi-${i}-${it}`,
        orderId: `ord-${i}`,
        productId: prod.id,
        quantity: qty,
        unitPriceNumeric: unitPrice.toFixed(2),
        subtotalNumeric: itemSubtotal.toFixed(2),
      });
    }

    const deliveryFee = 150.0;
    const discount = i % 5 === 0 ? 100.0 : 0.0;
    const total = subtotal + deliveryFee - discount;

    orders.push({
      id: `ord-${i}`,
      orderNumber: `ORD-${10000 + i}`,
      storeId: store.id,
      supplierId: sup.id,
      status,
      subtotalNumeric: subtotal.toFixed(2),
      deliveryFeeNumeric: deliveryFee.toFixed(2),
      discountNumeric: discount.toFixed(2),
      totalNumeric: total.toFixed(2),
      currency: 'INR',
      requestedDeliveryStart: '2026-10-06T09:00:00Z',
      requestedDeliveryEnd: '2026-10-06T18:00:00Z',
      createdAt: '2026-10-06T08:00:00Z',
    });
  }

  // 9. Routes (Section 18, 19) - 100 active routes
  const routes = [];
  const routeStops = [];

  for (let i = 1; i <= 100; i++) {
    const veh = vehicles[(i - 1) % vehicles.length];
    const stopsCount = Math.floor(4 + rng() * 6);
    const distanceKm = Number((18 + rng() * 32).toFixed(1));
    const durationMinutes = Math.round(distanceKm * 3.2);

    routes.push({
      id: `route-${i}`,
      routeNumber: `R-${100 + i}`,
      vehicleId: veh.id,
      status: i % 8 === 0 ? 'DELAYED' : i % 3 === 0 ? 'COMPLETED' : 'IN_TRANSIT',
      plannedDistanceKm: distanceKm,
      plannedDurationMinutes: durationMinutes,
      estimatedCostNumeric: (distanceKm * 28.5).toFixed(2),
      utilizationPercent: Number((55 + rng() * 38).toFixed(1)),
      plannedStart: '2026-10-06T08:30:00Z',
      plannedEnd: '2026-10-06T17:00:00Z',
    });

    for (let s = 1; s <= stopsCount; s++) {
      const store = stores[(i * 2 + s) % stores.length];
      routeStops.push({
        id: `stop-${i}-${s}`,
        routeId: `route-${i}`,
        sequence: s,
        storeId: store.id,
        plannedArrival: `2026-10-06T${String(9 + Math.floor(s * 0.8)).padStart(2, '0')}:30:00Z`,
        status: s <= 2 ? 'DELIVERED' : s === 3 ? 'ARRIVED' : 'PLANNED',
        distanceFromPreviousKm: Number((2 + rng() * 4).toFixed(1)),
        durationFromPreviousMinutes: Math.round(10 + rng() * 15),
      });
    }
  }

  return {
    organization,
    users,
    warehouses,
    suppliers,
    stores,
    vehicles,
    products,
    productSuppliers,
    inventory,
    orders,
    orderItems,
    routes,
    routeStops,
    metrics: {
      organizationCount: 1,
      userCount: users.length,
      warehouseCount: warehouses.length,
      supplierCount: suppliers.length,
      storeCount: stores.length,
      vehicleCount: vehicles.length,
      productCount: products.length,
      inventoryCount: inventory.length,
      orderCount: orders.length,
      routeCount: routes.length,
    },
  };
}
