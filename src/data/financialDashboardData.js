/**
 * Financial Dashboard Mock Data
 *
 * Derives a unified Asset Performance Ledger (Auto + Property) and
 * Summary Statistics from the existing business mock data, plus a
 * synthetic monthly time series for the Expense Visualization chart.
 * Shared by all three dashboard prototypes (conservative/modern/wild).
 */

import {
  mockProperties,
  mockVehicles,
  mockBusinessClaims,
  getClaimsForAsset,
} from './businessMockData';

const CURRENT_FISCAL_YEAR = '2024';

const REGION_BY_CITY = {
  'San Francisco': 'Bay Area North',
  Oakland: 'Bay Area North',
  Berkeley: 'Bay Area North',
  Sacramento: 'Sacramento Region',
  'San Jose': 'Bay Area South',
  'Santa Clara': 'Bay Area South',
  Sunnyvale: 'Bay Area South',
  'Mountain View': 'Bay Area South',
  'Palo Alto': 'Bay Area South',
  Fremont: 'Bay Area South',
  Hayward: 'Bay Area South',
};

const VEHICLE_REGIONS = ['Bay Area North', 'Bay Area South', 'Sacramento Region'];

// Deterministic "random" offset from an asset id so due dates/regions are stable across renders
function seedFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  return hash;
}

function computeDueDate(seed) {
  const base = new Date('2024-04-01');
  base.setDate(base.getDate() + (seed % 45));
  return base.toISOString().split('T')[0];
}

function claimsTotalsForAsset(assetId) {
  const claims = getClaimsForAsset(assetId);
  return {
    claimsCount: claims.length,
    totalClaimsAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
  };
}

export const financialAssets = [
  ...mockProperties.map((property) => {
    const seed = seedFromId(property.id);
    const { claimsCount, totalClaimsAmount } = claimsTotalsForAsset(property.id);
    return {
      id: property.id,
      name: property.name,
      category: 'Property',
      subtype: property.propertyType,
      region: REGION_BY_CITY[property.city] || 'Other',
      premiumDue: property.monthlyPremium,
      yearlyPremium: property.yearlyPremium,
      dueDate: computeDueDate(seed),
      claimsCount,
      totalClaimsAmount,
      status: property.status,
    };
  }),
  ...mockVehicles.map((vehicle) => {
    const seed = seedFromId(vehicle.id);
    const { claimsCount, totalClaimsAmount } = claimsTotalsForAsset(vehicle.id);
    return {
      id: vehicle.id,
      name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      category: 'Auto',
      subtype: vehicle.vehicleType,
      region: VEHICLE_REGIONS[seed % VEHICLE_REGIONS.length],
      premiumDue: vehicle.monthlyPremium,
      yearlyPremium: vehicle.yearlyPremium,
      dueDate: computeDueDate(seed),
      claimsCount,
      totalClaimsAmount,
      status: vehicle.status,
    };
  }),
];

export const availableRegions = [
  'All Regions',
  'Bay Area North',
  'Bay Area South',
  'Sacramento Region',
];

function sum(list, key) {
  return list.reduce((total, item) => total + item[key], 0);
}

/**
 * Summary Statistics (PRD 2.1). "Net" is approximated as gross minus a
 * flat servicing/recovery adjustment since the mock data has no ledger
 * of credits or subrogation recoveries.
 */
export function getSummaryStats({ view = 'gross', region = 'All Regions' } = {}) {
  const assets =
    region === 'All Regions'
      ? financialAssets
      : financialAssets.filter((a) => a.region === region);

  const properties = assets.filter((a) => a.category === 'Property');
  const autos = assets.filter((a) => a.category === 'Auto');

  const claimsInFilter = mockBusinessClaims.filter((claim) => {
    const asset = assets.find((a) => a.id === claim.assetId);
    return asset && claim.incidentDate.startsWith(CURRENT_FISCAL_YEAR);
  });

  const grossOwed = sum(assets, 'yearlyPremium');
  const grossClaimed = sum(claimsInFilter, 'claimAmount');
  const adjustment = view === 'net' ? 0.92 : 1;
  const claimAdjustment = view === 'net' ? 0.95 : 1;

  return {
    totalOwed: grossOwed * adjustment,
    totalClaimed: grossClaimed * claimAdjustment,
    propertyOwed: sum(properties, 'yearlyPremium') * adjustment,
    autoOwed: sum(autos, 'yearlyPremium') * adjustment,
    propertyClaimed:
      claimsInFilter
        .filter((c) => c.assetType === 'property')
        .reduce((t, c) => t + c.claimAmount, 0) * claimAdjustment,
    autoClaimed:
      claimsInFilter
        .filter((c) => c.assetType === 'vehicle')
        .reduce((t, c) => t + c.claimAmount, 0) * claimAdjustment,
  };
}

// Deterministic pseudo-random wave so the chart looks organic but is stable across renders
function wave(base, month, amplitude, phase) {
  return Math.round(base * (1 + amplitude * Math.sin((month + phase) / 2)));
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Monthly time series for the Expense Visualization chart (PRD 2.2).
 */
export function getMonthlyExpenseSeries() {
  const propertyPremiumBase = sum(
    financialAssets.filter((a) => a.category === 'Property'),
    'premiumDue'
  );
  const autoPremiumBase = sum(
    financialAssets.filter((a) => a.category === 'Auto'),
    'premiumDue'
  );
  const propertyClaimBase = propertyPremiumBase * 0.35;
  const autoClaimBase = autoPremiumBase * 0.3;

  return MONTHS.map((month, i) => ({
    month,
    'Property Premiums': wave(propertyPremiumBase, i, 0.08, 0),
    'Property Claims': wave(propertyClaimBase, i, 0.45, 2),
    'Auto Premiums': wave(autoPremiumBase, i, 0.06, 1),
    'Auto Claims': wave(autoClaimBase, i, 0.5, 4),
  }));
}

export function getAssetById(assetId) {
  return financialAssets.find((a) => a.id === assetId);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
