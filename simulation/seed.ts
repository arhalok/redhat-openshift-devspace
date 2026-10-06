/**
 * Deterministic Demo Topology Seed Generator
 * Sections 40, 59 of logistics-foundation.md
 * Generates reproducible demo dataset for Bangalore Kirana distribution network.
 */

import { Store } from '../domains/store/types';
import { Product, SupplierSKU } from '../domains/product/types';
import { Supplier } from '../domains/supplier/types';
import { Vehicle } from '../domains/delivery/types';
import { DEMO_SCENARIOS, ScenarioConfig } from './scenarios';

// Pseudo-random number generator for deterministic seeds (Section 59)
function createSeededRng(seed = 123456) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateSeedData(scenarioName = 'normal-day') {
  const scenario: ScenarioConfig = DEMO_SCENARIOS[scenarioName] || DEMO_SCENARIOS['normal-day'];
  const rng = createSeededRng(42);

  const orgId = 'org-b2b-logistics-core';

  // 1. Core Suppliers in Bangalore
  const suppliers: Supplier[] = [
    {
      id: 'sup-bangalore-central',
      organizationId: orgId,
      name: 'Apex FMCG Distribution Hub',
      supplierType: 'DISTRIBUTOR',
      address: 'Yeshwanthpur Industrial Area, Bangalore',
      latitude: 13.0285,
      longitude: 77.5408,
      geoPoint: { latitude: 13.0285, longitude: 77.5408 },
      serviceRadiusKm: 30,
      status: 'ACTIVE',
      reliabilityScore: 92.5,
      operationalFacts: {
        confirmationRate: 0.98,
        fillRate: 0.94,
        onTimeRate: 0.91,
        cancellationRate: 0.02,
        shortageRate: 0.04,
        returnRate: 0.01,
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'sup-dairy-fresh',
      organizationId: orgId,
      name: 'Kaveri Valley Dairy & Perishables',
      supplierType: 'DIRECT_BRAND',
      address: 'Hosur Road Electronic City, Bangalore',
      latitude: 12.8452,
      longitude: 77.6602,
      geoPoint: { latitude: 12.8452, longitude: 77.6602 },
      serviceRadiusKm: 25,
      status: 'ACTIVE',
      reliabilityScore: 88.0,
      operationalFacts: {
        confirmationRate: 0.95,
        fillRate: 0.90,
        onTimeRate: 0.86,
        cancellationRate: 0.03,
        shortageRate: 0.07,
        returnRate: 0.02,
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  // 2. Canonical Products
  const products: Product[] = [
    {
      id: 'prod-atta-10kg',
      brand: 'Aashirvaad',
      name: 'Superior Shudh Chakki Atta 10kg',
      normalizedName: 'aashirvaad-atta-10kg',
      category: 'Staples',
      subcategory: 'Flour',
      unit: 'BAG',
      packSize: '10kg',
      weightGrams: 10000,
      volumeMl: 12000,
      barcode: '8901030382901',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'prod-oil-sunflower-1l',
      brand: 'Fortune',
      name: 'Sunlite Refined Sunflower Oil 1L Pouch',
      normalizedName: 'fortune-sunflower-oil-1l',
      category: 'Edible Oils',
      subcategory: 'Refined Oil',
      unit: 'POUCH',
      packSize: '1L',
      weightGrams: 910,
      volumeMl: 1000,
      barcode: '8906007281023',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'prod-biscuits-parle-g',
      brand: 'Parle',
      name: 'Parle-G Gold Biscuits (Case of 24x100g)',
      normalizedName: 'parle-g-case-24',
      category: 'Packaged Foods',
      subcategory: 'Biscuits',
      unit: 'CASE',
      packSize: '24x100g',
      weightGrams: 2400,
      volumeMl: 4500,
      barcode: '8901719102914',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  // 3. Supplier SKUs (prices stored strictly in paise)
  const supplierSkus: SupplierSKU[] = [
    {
      id: 'sku-atta-apex',
      supplierId: 'sup-bangalore-central',
      productId: 'prod-atta-10kg',
      supplierSkuCode: 'APEX-ATT-10K',
      supplierName: 'Apex FMCG Distribution Hub',
      packDescription: 'Bag of 10kg',
      pricePaise: 44500, // ₹445.00
      moq: 5,
      availableQuantity: 280,
      leadTimeHours: Math.round(18 * scenario.supplierLeadTimeMultiplier),
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'sku-oil-apex',
      supplierId: 'sup-bangalore-central',
      productId: 'prod-oil-sunflower-1l',
      supplierSkuCode: 'APEX-OIL-1L',
      supplierName: 'Apex FMCG Distribution Hub',
      packDescription: 'Carton of 12 pouches',
      pricePaise: 138000, // ₹1,380.00
      moq: 2,
      availableQuantity: 150,
      leadTimeHours: Math.round(24 * scenario.supplierLeadTimeMultiplier),
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  // 4. Sample Kirana Stores across Bangalore Clusters
  const stores: Store[] = [
    {
      id: 'store-indiranagar-01',
      organizationId: orgId,
      name: 'Sri Manjunatha Provision Store',
      ownerName: 'Manjunath Gowda',
      phone: '+91 98450 12345',
      addressLine: '12th Main Rd, HAL 2nd Stage, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560038',
      latitude: 12.9719,
      longitude: 77.6412,
      geoPoint: { latitude: 12.9719, longitude: 77.6412 },
      h3Cell: '88618925d3fffff',
      status: 'ACTIVE',
      storeType: 'GROCERY',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'store-koramangala-02',
      organizationId: orgId,
      name: 'Venkateshwara Super Traders',
      ownerName: 'Ramesh Patel',
      phone: '+91 98450 67890',
      addressLine: '80 Feet Rd, 4th Block, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560034',
      latitude: 12.9345,
      longitude: 77.6256,
      geoPoint: { latitude: 12.9345, longitude: 77.6256 },
      h3Cell: '8861892557fffff',
      status: 'ACTIVE',
      storeType: 'GENERAL',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'store-jayanagar-03',
      organizationId: orgId,
      name: 'Laxmi Retail & General Stores',
      ownerName: 'Suresh Kumar',
      phone: '+91 98450 11223',
      addressLine: '4th T Block, Jayanagar',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560041',
      latitude: 12.9237,
      longitude: 77.5925,
      geoPoint: { latitude: 12.9237, longitude: 77.5925 },
      h3Cell: '886189240bfffff',
      status: 'ACTIVE',
      storeType: 'GROCERY',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  // 5. Fleet Vehicles
  const vehicles: Vehicle[] = [
    {
      id: 'veh-ev-01',
      organizationId: orgId,
      vehicleCode: 'KA-01-EV-4091',
      vehicleType: 'EV_3_WHEELER',
      capacityWeightKg: 500,
      capacityVolumeM3: 2.5,
      currentLatitude: 12.9719,
      currentLongitude: 77.6412,
      currentGeoPoint: { latitude: 12.9719, longitude: 77.6412 },
      availabilityStatus: rng() < scenario.vehicleAvailabilityRatio ? 'AVAILABLE' : 'MAINTENANCE',
      availableFrom: '2026-10-06T06:00:00Z',
      availableUntil: '2026-10-06T20:00:00Z',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'veh-ace-02',
      organizationId: orgId,
      vehicleCode: 'KA-03-AA-8921',
      vehicleType: 'TATA_ACE',
      capacityWeightKg: 1000,
      capacityVolumeM3: 4.8,
      currentLatitude: 12.9345,
      currentLongitude: 77.6256,
      currentGeoPoint: { latitude: 12.9345, longitude: 77.6256 },
      availabilityStatus: 'AVAILABLE',
      availableFrom: '2026-10-06T06:00:00Z',
      availableUntil: '2026-10-06T20:00:00Z',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  return {
    scenario,
    suppliers,
    products,
    supplierSkus,
    stores,
    vehicles,
    summary: {
      supplierCount: suppliers.length,
      productCount: products.length,
      skuCount: supplierSkus.length,
      storeCount: stores.length,
      vehicleCount: vehicles.length,
    },
  };
}
