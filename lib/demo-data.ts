/**
 * Comprehensive Bangalore Logistics Topology & Seed Data
 * Phase 1 — UI/UX Specification: Part 4
 */

export interface GeoLocation {
  lat: number;
  lng: number;
  label: string;
}

export interface StoreNode {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  address: string;
  locality: string;
  lat: number;
  lng: number;
  h3Index: string;
  stockoutRiskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dailyOrderVolume: number;
  criticalItem?: string;
  currentStockUnits?: number;
  targetStockUnits?: number;
}

export interface SupplierNode {
  id: string;
  name: string;
  hubName: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  reliabilityScore: number;
  fillRate: number;
  avgLeadTimeHours: number;
  avgDeliveryDays: number;
  distanceKm: number;
  activeOrdersCount: number;
  pricingTier: 'LOW' | 'MEDIUM' | 'PREMIUM';
  moq: number;
}

export interface WarehouseNode {
  id: string;
  name: string;
  code: string;
  locality: string;
  lat: number;
  lng: number;
  capacityUtilization: number;
  activeVehicles: number;
  status: 'ONLINE' | 'MAINTENANCE';
}

export interface VehicleNode {
  id: string;
  code: string;
  model: string;
  type: 'EV_3_WHEELER' | 'TATA_ACE' | 'BOLERO_PICKUP';
  driverName: string;
  lat: number;
  lng: number;
  status: 'EN_ROUTE' | 'AT_DEPOT' | 'UNLOADING' | 'MAINTENANCE';
  currentCapacityPct: number;
  capacityKg: number;
  currentLoadKg: number;
  stopsCount: number;
  eta: string;
  currentRouteId: string;
  returnCapacityPct: number;
  compatibleReturnLoad?: {
    supplierName: string;
    pickupDistanceKm: number;
    weightKg: number;
    destination: string;
    recoveryPaise: number;
  };
}

export interface RouteVector {
  id: string;
  code: string;
  vehicleCode: string;
  vehicleType: string;
  status: 'IN_TRANSIT' | 'PLANNED' | 'DELAYED' | 'COMPLETED';
  stops: number;
  distanceKm: number;
  capacityPct: number;
  eta: string;
  color: string;
  coordinates: Array<[number, number]>;
  waypointNames: string[];
}

export interface ReplenishmentItem {
  id: string;
  productName: string;
  category: string;
  currentStock: number;
  expectedNeed: number;
  risk: 'High' | 'Medium' | 'Low';
  recommendedUnits: number;
  unitPricePaise: number;
  suggestedSupplier: string;
  supplierLeadTimeDays: number;
  confidencePct: number;
  reasons: string[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  storeName: string;
  storeLocality: string;
  valuePaise: number;
  supplierName: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'EXCEPTION';
  deliveryRoute: string;
  vehicleCode: string;
  createdAt: string;
  eta: string;
  itemCount: number;
  items: Array<{ name: string; quantity: number; unitPricePaise: number }>;
  timeline: Array<{ time: string; event: string; status: 'DONE' | 'ACTIVE' | 'PENDING' }>;
}

export interface ExceptionItem {
  id: string;
  category: 'Delivery' | 'Inventory' | 'Supplier' | 'Vehicle' | 'Order' | 'Payment';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  routeCode?: string;
  affectedStoresCount: number;
  cause: string;
  impact: string;
  recommendedAction: string;
  applied: boolean;
  actionDetails: {
    fromRoute?: string;
    toRoute?: string;
    reallocatedStops?: number[];
  };
}

export interface H3AreaInsight {
  h3Index: string;
  locality: string;
  storesCount: number;
  dailyOrdersCount: number;
  demandTrendPct: number;
  stockoutRiskStores: number;
  topCategories: string[];
  recommendedAction: string;
}

// 1. Bangalore Distribution Warehouses / Depots
export const BANGALORE_WAREHOUSES: WarehouseNode[] = [
  {
    id: 'wh-north',
    name: 'North Bangalore Central Depot',
    code: 'HUB-YPR-01',
    locality: 'Yeshwanthpur Industrial Area',
    lat: 13.0285,
    lng: 77.5408,
    capacityUtilization: 82,
    activeVehicles: 34,
    status: 'ONLINE',
  },
  {
    id: 'wh-south',
    name: 'South Bangalore Fulfillment Hub',
    code: 'HUB-ECITY-02',
    locality: 'Electronic City Phase 1',
    lat: 12.8452,
    lng: 77.6602,
    capacityUtilization: 68,
    activeVehicles: 27,
    status: 'ONLINE',
  },
  {
    id: 'wh-east',
    name: 'East Hub Intermediate Cross-Dock',
    code: 'HUB-WFD-03',
    locality: 'Whitefield Export Zone',
    lat: 12.9698,
    lng: 77.7499,
    capacityUtilization: 74,
    activeVehicles: 11,
    status: 'ONLINE',
  },
];

// 2. Bangalore Suppliers
export const BANGALORE_SUPPLIERS: SupplierNode[] = [
  {
    id: 'sup-a-apex',
    name: 'Apex FMCG Distribution Hub',
    hubName: 'Apex Hub North',
    category: 'Packaged Foods & Staples',
    address: 'Plot 42, Yeshwanthpur Ind. Area, Bangalore',
    lat: 13.021,
    lng: 77.535,
    reliabilityScore: 94,
    fillRate: 97,
    avgLeadTimeHours: 18,
    avgDeliveryDays: 1.2,
    distanceKm: 7.2,
    activeOrdersCount: 18,
    pricingTier: 'LOW',
    moq: 12,
  },
  {
    id: 'sup-b-kaveri',
    name: 'Kaveri Valley Dairy & Perishables',
    hubName: 'Kaveri South Hub',
    category: 'Dairy, Bakery & Fresh',
    address: 'Hosur Road, Electronic City, Bangalore',
    lat: 12.852,
    lng: 77.651,
    reliabilityScore: 88,
    fillRate: 91,
    avgLeadTimeHours: 12,
    avgDeliveryDays: 1.0,
    distanceKm: 14.5,
    activeOrdersCount: 12,
    pricingTier: 'MEDIUM',
    moq: 24,
  },
  {
    id: 'sup-c-mysore',
    name: 'Mysore Grain Wholesale Syndicate',
    hubName: 'Mysore Syndicate West',
    category: 'Grains, Atta & Edible Oils',
    address: 'APMC Yard, Goraguntepalya, Bangalore',
    lat: 13.029,
    lng: 77.528,
    reliabilityScore: 96,
    fillRate: 98,
    avgLeadTimeHours: 24,
    avgDeliveryDays: 1.4,
    distanceKm: 8.9,
    activeOrdersCount: 22,
    pricingTier: 'LOW',
    moq: 20,
  },
  {
    id: 'sup-d-delta',
    name: 'Delta Beverage & FMCG Wholesalers',
    hubName: 'Delta East Hub',
    category: 'Beverages & Confectionery',
    address: 'Old Madras Road, KR Puram, Bangalore',
    lat: 12.998,
    lng: 77.689,
    reliabilityScore: 91,
    fillRate: 93,
    avgLeadTimeHours: 16,
    avgDeliveryDays: 1.1,
    distanceKm: 11.2,
    activeOrdersCount: 9,
    pricingTier: 'MEDIUM',
    moq: 15,
  },
];

// 3. Registered Kirana Stores across Bangalore
export const BANGALORE_STORES: StoreNode[] = [
  {
    id: 'store-sharma',
    name: 'Sharma General Store',
    ownerName: 'Sunil Sharma',
    phone: '+91 98450 12345',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar',
    locality: 'Indiranagar',
    lat: 12.9719,
    lng: 77.6412,
    h3Index: '88618925d3fffff',
    stockoutRiskLevel: 'HIGH',
    dailyOrderVolume: 28,
    criticalItem: 'Superior Shudh Chakki Atta 10kg',
    currentStockUnits: 2,
    targetStockUnits: 14,
  },
  {
    id: 'store-venkateshwara',
    name: 'Venkateshwara Super Traders',
    ownerName: 'Ramesh Patel',
    phone: '+91 98450 67890',
    address: '80 Feet Road, 4th Block, Koramangala',
    locality: 'Koramangala',
    lat: 12.9345,
    lng: 77.6256,
    h3Index: '8861892557fffff',
    stockoutRiskLevel: 'MEDIUM',
    dailyOrderVolume: 34,
    criticalItem: 'Fortune Refined Sunflower Oil 1L',
    currentStockUnits: 5,
    targetStockUnits: 20,
  },
  {
    id: 'store-laxmi',
    name: 'Laxmi Retail & General Provisions',
    ownerName: 'Suresh Kumar',
    phone: '+91 98450 11223',
    address: '4th T Block, 10th Main, Jayanagar',
    locality: 'Jayanagar',
    lat: 12.9237,
    lng: 77.5925,
    h3Index: '886189240bfffff',
    stockoutRiskLevel: 'CRITICAL',
    dailyOrderVolume: 42,
    criticalItem: 'Aashirvaad Atta 10kg & Tata Salt',
    currentStockUnits: 1,
    targetStockUnits: 18,
  },
  {
    id: 'store-gupta',
    name: 'Gupta Provisions & Mini Mart',
    ownerName: 'Anil Gupta',
    phone: '+91 98450 33445',
    address: 'Varthur Main Road, Thubarahalli, Whitefield',
    locality: 'Whitefield',
    lat: 12.958,
    lng: 77.721,
    h3Index: '8861892e67fffff',
    stockoutRiskLevel: 'LOW',
    dailyOrderVolume: 22,
    criticalItem: 'Parle-G Gold Biscuits',
    currentStockUnits: 12,
    targetStockUnits: 16,
  },
  {
    id: 'store-malleshwaram',
    name: 'Malleshwaram Daily Grocers',
    ownerName: 'Venkat Rao',
    phone: '+91 98450 77889',
    address: '8th Cross, Sampige Road, Malleshwaram',
    locality: 'Malleshwaram',
    lat: 13.003,
    lng: 77.571,
    h3Index: '8861892511fffff',
    stockoutRiskLevel: 'LOW',
    dailyOrderVolume: 30,
    criticalItem: 'Tata Tea Gold 500g',
    currentStockUnits: 8,
    targetStockUnits: 12,
  },
  {
    id: 'store-peenya',
    name: 'Shree Krishna Industrial Traders',
    ownerName: 'Dinesh Hegde',
    phone: '+91 98450 99001',
    address: 'Near Peenya 1st Stage Bus Stop',
    locality: 'Peenya',
    lat: 13.031,
    lng: 77.519,
    h3Index: '8861892745fffff',
    stockoutRiskLevel: 'MEDIUM',
    dailyOrderVolume: 19,
    criticalItem: 'Sugar 5kg Bags',
    currentStockUnits: 4,
    targetStockUnits: 15,
  },
];

// 4. Fleet Vehicles
export const BANGALORE_VEHICLES: VehicleNode[] = [
  {
    id: 'veh-027',
    code: 'V-027',
    model: 'Mahindra Zor Grand (EV)',
    type: 'EV_3_WHEELER',
    driverName: 'Raghavan Nair',
    lat: 12.962,
    lng: 77.632,
    status: 'EN_ROUTE',
    currentCapacityPct: 62,
    capacityKg: 500,
    currentLoadKg: 310,
    stopsCount: 6,
    eta: '14:20',
    currentRouteId: 'route-r124',
    returnCapacityPct: 38,
    compatibleReturnLoad: {
      supplierName: 'Delta East Hub (Supplier Delta)',
      pickupDistanceKm: 2.8,
      weightKg: 340,
      destination: 'North Bangalore Central Depot',
      recoveryPaise: 185000,
    },
  },
  {
    id: 'veh-131',
    code: 'V-131',
    model: 'Tata Ace Gold CNG',
    type: 'TATA_ACE',
    driverName: 'Manjunath Swamy',
    lat: 12.941,
    lng: 77.608,
    status: 'EN_ROUTE',
    currentCapacityPct: 78,
    capacityKg: 1000,
    currentLoadKg: 780,
    stopsCount: 8,
    eta: '15:05',
    currentRouteId: 'route-r131',
    returnCapacityPct: 22,
  },
  {
    id: 'veh-108',
    code: 'V-108',
    model: 'Mahindra Bolero Maxi Truck',
    type: 'BOLERO_PICKUP',
    driverName: 'Praveen Gowda',
    lat: 12.981,
    lng: 77.712,
    status: 'EN_ROUTE',
    currentCapacityPct: 84,
    capacityKg: 1200,
    currentLoadKg: 1008,
    stopsCount: 5,
    eta: '13:45',
    currentRouteId: 'route-r108',
    returnCapacityPct: 16,
  },
  {
    id: 'veh-204',
    code: 'V-204',
    model: 'Euler Motors HiLoad EV',
    type: 'EV_3_WHEELER',
    driverName: 'Syed Imran',
    lat: 13.018,
    lng: 77.552,
    status: 'AT_DEPOT',
    currentCapacityPct: 0,
    capacityKg: 688,
    currentLoadKg: 0,
    stopsCount: 0,
    eta: 'Ready',
    currentRouteId: '',
    returnCapacityPct: 100,
  },
];

// 5. Active & Planned Routes
export const BANGALORE_ROUTES: RouteVector[] = [
  {
    id: 'route-r124',
    code: 'Route R-124',
    vehicleCode: 'V-027',
    vehicleType: 'EV 3-Wheeler',
    status: 'DELAYED',
    stops: 6,
    distanceKm: 31,
    capacityPct: 62,
    eta: '14:20',
    color: '#ef4444', // Red for delayed
    coordinates: [
      [13.0285, 77.5408], // Yeshwanthpur Hub
      [13.003, 77.571],  // Malleshwaram
      [12.9719, 77.6412], // Indiranagar
      [12.9345, 77.6256], // Koramangala
      [12.9237, 77.5925], // Jayanagar
    ],
    waypointNames: ['Central Hub', 'Malleshwaram', 'Indiranagar', 'Koramangala', 'Jayanagar'],
  },
  {
    id: 'route-r131',
    code: 'Route R-131',
    vehicleCode: 'V-131',
    vehicleType: 'Tata Ace CNG',
    status: 'IN_TRANSIT',
    stops: 8,
    distanceKm: 27,
    capacityPct: 78,
    eta: '15:05',
    color: '#3b82f6', // Blue for active
    coordinates: [
      [12.8452, 77.6602], // Electronic City Hub
      [12.915, 77.61],
      [12.9345, 77.6256],
      [12.962, 77.632],
    ],
    waypointNames: ['South Hub', 'BTM Layout', 'Koramangala', 'Domlur'],
  },
  {
    id: 'route-r108',
    code: 'Route R-108',
    vehicleCode: 'V-108',
    vehicleType: 'Bolero Pickup',
    status: 'IN_TRANSIT',
    stops: 5,
    distanceKm: 38,
    capacityPct: 84,
    eta: '13:45',
    color: '#10b981', // Emerald for on-time
    coordinates: [
      [13.0285, 77.5408],
      [12.998, 77.689],
      [12.9698, 77.7499],
      [12.958, 77.721],
    ],
    waypointNames: ['Central Hub', 'KR Puram', 'Whitefield Zone', 'Thubarahalli'],
  },
];

// 6. Smart Replenishment Catalog
export const REPLENISHMENT_CATALOG: ReplenishmentItem[] = [
  {
    id: 'rep-atta-10k',
    productName: 'Aashirvaad Superior Shudh Chakki Atta 10kg',
    category: 'Staples / Flour',
    currentStock: 2,
    expectedNeed: 14,
    risk: 'High',
    recommendedUnits: 12,
    unitPricePaise: 44500, // ₹445.00
    suggestedSupplier: 'Apex FMCG Distribution Hub',
    supplierLeadTimeDays: 1,
    confidencePct: 88,
    reasons: [
      'Current inventory (2 bags) is 85% below 7-day safety threshold',
      'Recent daily checkout rate accelerated by +28% in Indiranagar corridor',
      'Supplier lead time is 18 hours with 97% verified fill rate',
      'Safety stock requirement calculated at 10 bags',
    ],
  },
  {
    id: 'rep-oil-1l',
    productName: 'Fortune Sunlite Refined Sunflower Oil 1L Pouch',
    category: 'Edible Oils',
    currentStock: 5,
    expectedNeed: 20,
    risk: 'High',
    recommendedUnits: 15,
    unitPricePaise: 11800, // ₹118.00
    suggestedSupplier: 'Apex FMCG Distribution Hub',
    supplierLeadTimeDays: 1,
    confidencePct: 84,
    reasons: [
      'Inventory covers only 1.2 days of historical turnover',
      'Diwali / festival restocking demand detected in cluster',
      'Supplier Tier-1 bulk discount active at 12+ units',
    ],
  },
  {
    id: 'rep-parle-g',
    productName: 'Parle-G Gold Biscuits (Case of 24x100g)',
    category: 'Packaged Foods',
    currentStock: 3,
    expectedNeed: 15,
    risk: 'High',
    recommendedUnits: 12,
    unitPricePaise: 19200, // ₹192.00
    suggestedSupplier: 'Apex FMCG Distribution Hub',
    supplierLeadTimeDays: 1,
    confidencePct: 92,
    reasons: [
      'Velocity exceeds 4 cases per week; stockout imminent in 36 hours',
      'Stable pricing and 98% supplier order acceptance',
    ],
  },
  {
    id: 'rep-tata-salt',
    productName: 'Tata Salt Vacuum Evaporated Iodized 1kg',
    category: 'Staples / Seasoning',
    currentStock: 6,
    expectedNeed: 24,
    risk: 'High',
    recommendedUnits: 18,
    unitPricePaise: 2400, // ₹24.00
    suggestedSupplier: 'Mysore Grain Wholesale Syndicate',
    supplierLeadTimeDays: 1,
    confidencePct: 95,
    reasons: [
      'High basket affinity item present in 64% of kirana consumer transactions',
      'Current stock (6 bags) below minimum presentation threshold',
    ],
  },
  {
    id: 'rep-maggi-noodles',
    productName: 'Maggi 2-Minute Masala Noodles (Pack of 12)',
    category: 'Packaged Foods',
    currentStock: 8,
    expectedNeed: 24,
    risk: 'Medium',
    recommendedUnits: 16,
    unitPricePaise: 16800, // ₹168.00
    suggestedSupplier: 'Apex FMCG Distribution Hub',
    supplierLeadTimeDays: 1,
    confidencePct: 79,
    reasons: [
      'Steady weekday consumption trend across young professional cluster',
      'Supplier offering bundled freight discount',
    ],
  },
  {
    id: 'rep-dairy-milk',
    productName: 'Nandini GoodLife UHT Toned Milk 1L Tetra',
    category: 'Dairy',
    currentStock: 10,
    expectedNeed: 30,
    risk: 'Medium',
    recommendedUnits: 20,
    unitPricePaise: 5400, // ₹54.00
    suggestedSupplier: 'Kaveri Valley Dairy & Perishables',
    supplierLeadTimeDays: 1,
    confidencePct: 82,
    reasons: [
      'Extended shelf-life product with high turnover rate',
      'Daily morning dispatch ensures zero chill-chain breaks',
    ],
  },
  {
    id: 'rep-sugar-5k',
    productName: 'Madhur Pure & Hygienic Sugar 5kg',
    category: 'Staples',
    currentStock: 4,
    expectedNeed: 12,
    risk: 'Medium',
    recommendedUnits: 8,
    unitPricePaise: 22000, // ₹220.00
    suggestedSupplier: 'Mysore Grain Wholesale Syndicate',
    supplierLeadTimeDays: 2,
    confidencePct: 76,
    reasons: [
      'Lead time is 48 hours; order placement required before weekend surge',
    ],
  },
  {
    id: 'rep-surf-excel',
    productName: 'Surf Excel Easy Wash Detergent Powder 1kg',
    category: 'Home Care',
    currentStock: 5,
    expectedNeed: 15,
    risk: 'Low',
    recommendedUnits: 10,
    unitPricePaise: 13500, // ₹135.00
    suggestedSupplier: 'Apex FMCG Distribution Hub',
    supplierLeadTimeDays: 2,
    confidencePct: 71,
    reasons: [
      'Buffer inventory optimization; non-perishable staple replenishment',
    ],
  },
];

// 7. Seed Orders for Bangalore Network
export const BANGALORE_ORDERS: OrderRecord[] = [
  {
    id: 'ord-10284',
    orderNumber: 'ORD-10284',
    storeName: 'Sharma General Store',
    storeLocality: 'Indiranagar',
    valuePaise: 1842000, // ₹18,420.00
    supplierName: 'Apex FMCG Distribution Hub',
    status: 'IN_TRANSIT',
    deliveryRoute: 'Route R-124',
    vehicleCode: 'V-027',
    createdAt: '2026-10-06 09:12',
    eta: '14:20 Today',
    itemCount: 12,
    items: [
      { name: 'Aashirvaad Chakki Atta 10kg', quantity: 12, unitPricePaise: 44500 },
      { name: 'Fortune Sunflower Oil 1L', quantity: 15, unitPricePaise: 11800 },
      { name: 'Parle-G Gold Biscuits Case', quantity: 12, unitPricePaise: 19200 },
      { name: 'Tata Salt 1kg', quantity: 18, unitPricePaise: 2400 },
    ],
    timeline: [
      { time: '09:12', event: 'Order created via Smart Replenishment', status: 'DONE' },
      { time: '09:15', event: 'Supplier confirmed allocation', status: 'DONE' },
      { time: '10:04', event: 'Items packed at Yeshwanthpur Hub', status: 'DONE' },
      { time: '10:31', event: 'Dispatched on Tata Ace route R-124', status: 'DONE' },
      { time: '12:42', event: 'In transit — currently passing Domlur Flyover', status: 'ACTIVE' },
      { time: '14:20', event: 'Estimated delivery at store', status: 'PENDING' },
    ],
  },
  {
    id: 'ord-10285',
    orderNumber: 'ORD-10285',
    storeName: 'Venkateshwara Super Traders',
    storeLocality: 'Koramangala',
    valuePaise: 2460000, // ₹24,600.00
    supplierName: 'Kaveri Valley Dairy & Perishables',
    status: 'PREPARING',
    deliveryRoute: 'Route R-131',
    vehicleCode: 'V-131',
    createdAt: '2026-10-06 10:05',
    eta: '16:00 Today',
    itemCount: 8,
    items: [
      { name: 'Nandini GoodLife Milk 1L', quantity: 40, unitPricePaise: 5400 },
      { name: 'Amul Butter 500g', quantity: 15, unitPricePaise: 26000 },
    ],
    timeline: [
      { time: '10:05', event: 'Order created', status: 'DONE' },
      { time: '10:20', event: 'Supplier confirmed', status: 'DONE' },
      { time: '11:15', event: 'Staging in cold warehouse bay 3', status: 'ACTIVE' },
      { time: '13:00', event: 'Loading onto V-131', status: 'PENDING' },
      { time: '16:00', event: 'Estimated arrival', status: 'PENDING' },
    ],
  },
  {
    id: 'ord-10286',
    orderNumber: 'ORD-10286',
    storeName: 'Laxmi Retail & General Stores',
    storeLocality: 'Jayanagar',
    valuePaise: 980000, // ₹9,800.00
    supplierName: 'Mysore Grain Wholesale Syndicate',
    status: 'CONFIRMED',
    deliveryRoute: 'Route R-124',
    vehicleCode: 'V-027',
    createdAt: '2026-10-06 11:30',
    eta: '17:30 Today',
    itemCount: 5,
    items: [
      { name: 'Aashirvaad Chakki Atta 10kg', quantity: 10, unitPricePaise: 44500 },
      { name: 'Madhur Sugar 5kg', quantity: 15, unitPricePaise: 22000 },
    ],
    timeline: [
      { time: '11:30', event: 'Order submitted', status: 'DONE' },
      { time: '11:45', event: 'Confirmed by Mysore Syndicate', status: 'DONE' },
      { time: '14:00', event: 'Pick and pack scheduled', status: 'ACTIVE' },
      { time: '17:30', event: 'Estimated arrival', status: 'PENDING' },
    ],
  },
  {
    id: 'ord-10287',
    orderNumber: 'ORD-10287',
    storeName: 'Gupta Provisions & Mini Mart',
    storeLocality: 'Whitefield',
    valuePaise: 3120000, // ₹31,200.00
    supplierName: 'Apex FMCG Distribution Hub',
    status: 'DELIVERED',
    deliveryRoute: 'Route R-108',
    vehicleCode: 'V-108',
    createdAt: '2026-10-06 07:45',
    eta: 'Delivered at 11:22',
    itemCount: 16,
    items: [
      { name: 'Parle-G Case', quantity: 20, unitPricePaise: 19200 },
      { name: 'Maggi 2-Minute Noodles', quantity: 30, unitPricePaise: 16800 },
    ],
    timeline: [
      { time: '07:45', event: 'Order created', status: 'DONE' },
      { time: '08:00', event: 'Confirmed', status: 'DONE' },
      { time: '08:45', event: 'Dispatched on V-108', status: 'DONE' },
      { time: '11:22', event: 'Delivered with OTP verification', status: 'DONE' },
    ],
  },
  {
    id: 'ord-10288',
    orderNumber: 'ORD-10288',
    storeName: 'Malleshwaram Daily Grocers',
    storeLocality: 'Malleshwaram',
    valuePaise: 1420000, // ₹14,200.00
    supplierName: 'Apex FMCG Distribution Hub',
    status: 'PENDING',
    deliveryRoute: 'Pending Assignment',
    vehicleCode: 'Unassigned',
    createdAt: '2026-10-06 12:15',
    eta: 'Tomorrow Morning',
    itemCount: 6,
    items: [
      { name: 'Tata Tea Gold 500g', quantity: 24, unitPricePaise: 31000 },
    ],
    timeline: [
      { time: '12:15', event: 'Order draft submitted', status: 'DONE' },
      { time: '12:30', event: 'Awaiting automatic route batching', status: 'ACTIVE' },
    ],
  },
  {
    id: 'ord-10289',
    orderNumber: 'ORD-10289',
    storeName: 'Shree Krishna Industrial Traders',
    storeLocality: 'Peenya',
    valuePaise: 870000, // ₹8,700.00
    supplierName: 'Mysore Grain Wholesale Syndicate',
    status: 'EXCEPTION',
    deliveryRoute: 'Route R-124',
    vehicleCode: 'V-027',
    createdAt: '2026-10-06 08:30',
    eta: 'Delayed (+45m)',
    itemCount: 4,
    items: [
      { name: 'Sugar 5kg Bags', quantity: 15, unitPricePaise: 22000 },
    ],
    timeline: [
      { time: '08:30', event: 'Order placed', status: 'DONE' },
      { time: '09:00', event: 'Confirmed', status: 'DONE' },
      { time: '11:00', event: 'Delayed due to vehicle reassignment', status: 'ACTIVE' },
    ],
  },
];

// 8. Active Exceptions for Bangalore Network
export const BANGALORE_EXCEPTIONS: ExceptionItem[] = [
  {
    id: 'exc-delay-r124',
    category: 'Delivery',
    severity: 'CRITICAL',
    title: 'Route Delay & SLA Breach Risk',
    routeCode: 'Route R-124',
    affectedStoresCount: 3,
    cause: 'Vehicle reassignment and arterial bottleneck on Old Airport Road',
    impact: '~22 minute projected delay affecting Indiranagar and Jayanagar deliveries',
    recommendedAction: 'Move stops 4 and 5 from Route R-124 to Route R-131',
    applied: false,
    actionDetails: {
      fromRoute: 'Route R-124',
      toRoute: 'Route R-131',
      reallocatedStops: [4, 5],
    },
  },
  {
    id: 'exc-sup-delay',
    category: 'Supplier',
    severity: 'HIGH',
    title: 'Perishable Supplier Lead Time Spike',
    affectedStoresCount: 2,
    cause: 'Cold chain facility maintenance at Kaveri Perishables (+18h lead time)',
    impact: 'Koramangala dairy delivery postponed past morning peak window',
    recommendedAction: 'Re-route immediate milk orders to Mysore Syndicate alternative hub',
    applied: false,
    actionDetails: {},
  },
  {
    id: 'exc-stockout-jayanagar',
    category: 'Inventory',
    severity: 'HIGH',
    title: 'Stockout Risk on FMCG Staples',
    affectedStoresCount: 1,
    cause: 'Laxmi Retail Atta on-hand reduced to 1 bag against daily 8-bag demand',
    impact: 'High stockout probability within 4 business hours',
    recommendedAction: 'Trigger priority Smart Replenishment batch with Apex Hub',
    applied: false,
    actionDetails: {},
  },
];

// 9. Spatial / H3 Area Insights
export const H3_AREA_INSIGHTS: Record<string, H3AreaInsight> = {
  '88618925d3fffff': {
    h3Index: '88618925d3fffff',
    locality: 'East Bangalore (Indiranagar / Domlur)',
    storesCount: 84,
    dailyOrdersCount: 312,
    demandTrendPct: 14,
    stockoutRiskStores: 17,
    topCategories: ['Beverages', 'Snacks', 'Staples'],
    recommendedAction: 'Increase local supply allocation and consolidate afternoon dispatches',
  },
  '8861892557fffff': {
    h3Index: '8861892557fffff',
    locality: 'South-East Corridor (Koramangala)',
    storesCount: 96,
    dailyOrdersCount: 420,
    demandTrendPct: 22,
    stockoutRiskStores: 9,
    topCategories: ['Dairy & Fresh', 'Packaged Foods', 'Edible Oils'],
    recommendedAction: 'Schedule additional EV-3-Wheeler midday shuttle from South Hub',
  },
  '886189240bfffff': {
    h3Index: '886189240bfffff',
    locality: 'South Corridor (Jayanagar / JP Nagar)',
    storesCount: 71,
    dailyOrdersCount: 265,
    demandTrendPct: 8,
    stockoutRiskStores: 23,
    topCategories: ['Flour & Grains', 'Spices', 'Cleaning'],
    recommendedAction: 'Expedite replenishment buffer to mitigate stockout clustering',
  },
};
