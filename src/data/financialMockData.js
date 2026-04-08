/**
 * Financial Mock Data
 * Insurance Financial Analytics Dashboard (IFAD) data layer.
 *
 * Provides:
 *  - Monthly historical premiums & claims for the chart
 *  - YTD summary numbers for KPI cards
 *  - Asset ledger combining properties + vehicles with claim totals
 */

import { mockProperties, mockVehicles, mockBusinessClaims } from './businessMockData';

// =============================================================================
// MONTHLY CHART DATA (last 12 months)
// =============================================================================
export const monthlyFinancialData = [
  { month: "Apr '23", propertyPremiums: 31200, propertyClaims: 4200,  autoPremiums: 6500, autoClaims: 850   },
  { month: "May '23", propertyPremiums: 31200, propertyClaims: 2800,  autoPremiums: 6500, autoClaims: 0     },
  { month: "Jun '23", propertyPremiums: 32400, propertyClaims: 0,     autoPremiums: 6800, autoClaims: 850   },
  { month: "Jul '23", propertyPremiums: 32400, propertyClaims: 0,     autoPremiums: 6800, autoClaims: 0     },
  { month: "Aug '23", propertyPremiums: 32400, propertyClaims: 8900,  autoPremiums: 6800, autoClaims: 0     },
  { month: "Sep '23", propertyPremiums: 32400, propertyClaims: 0,     autoPremiums: 6800, autoClaims: 18500 },
  { month: "Oct '23", propertyPremiums: 33200, propertyClaims: 0,     autoPremiums: 6900, autoClaims: 2100  },
  { month: "Nov '23", propertyPremiums: 33200, propertyClaims: 3200,  autoPremiums: 6900, autoClaims: 0     },
  { month: "Dec '23", propertyPremiums: 33200, propertyClaims: 15400, autoPremiums: 6900, autoClaims: 0     },
  { month: "Jan '24", propertyPremiums: 33830, propertyClaims: 0,     autoPremiums: 7015, autoClaims: 5200  },
  { month: "Feb '24", propertyPremiums: 33830, propertyClaims: 12500, autoPremiums: 7015, autoClaims: 6800  },
  { month: "Mar '24", propertyPremiums: 33830, propertyClaims: 9500,  autoPremiums: 7015, autoClaims: 22000 },
];

// =============================================================================
// YTD SUMMARY (2024, Q1 — Jan through Mar)
// Net = 85% of gross (15% reinsurance ceded)
// =============================================================================
export const ytdSummary = {
  totalOwedGross:      122535,
  totalClaimedGross:   56000,
  propertyOwedGross:   101490,
  propertyClaimedGross: 22000,
  autoOwedGross:       21045,
  autoClaimedGross:    34000,
  lossRatio:           45.7,   // 56000 / 122535
  netMultiplier:       0.85,
};

// =============================================================================
// ASSET LEDGER BUILDER
// =============================================================================

/**
 * Returns a combined list of all properties + vehicles,
 * each enriched with their total lifecycle claim amounts.
 */
export function getAssetLedger() {
  const propertyRows = mockProperties.map(prop => {
    const claims = mockBusinessClaims.filter(c => c.assetId === prop.id);
    const totalClaims = claims.reduce((sum, c) => sum + c.claimAmount, 0);
    return {
      id: prop.id,
      name: prop.name,
      category: 'Property',
      premiumDue: prop.monthlyPremium,
      dueDate: '2024-04-01',
      totalClaims,
      claimsCount: claims.length,
      status: prop.status,
    };
  });

  const vehicleRows = mockVehicles.map(veh => {
    const claims = mockBusinessClaims.filter(c => c.assetId === veh.id);
    const totalClaims = claims.reduce((sum, c) => sum + c.claimAmount, 0);
    return {
      id: veh.id,
      name: `${veh.year} ${veh.make} ${veh.model}`,
      category: 'Auto',
      premiumDue: veh.monthlyPremium,
      dueDate: '2024-04-01',
      totalClaims,
      claimsCount: claims.length,
      status: veh.status,
    };
  });

  return [...propertyRows, ...vehicleRows];
}

// =============================================================================
// HELPERS
// =============================================================================

/** Slice chart data by timeframe selection */
export function filterChartData(timeframe) {
  switch (timeframe) {
    case 'ytd': return monthlyFinancialData.slice(-3);
    case '6m':  return monthlyFinancialData.slice(-6);
    default:    return monthlyFinancialData;
  }
}

/** Apply 15% reinsurance deduction to premium series when "Net" is selected */
export function applyGrossNetToChartData(data, grossNet) {
  if (grossNet === 'gross') return data;
  return data.map(d => ({
    ...d,
    propertyPremiums: Math.round(d.propertyPremiums * 0.85),
    autoPremiums: Math.round(d.autoPremiums * 0.85),
  }));
}

/** Apply gross/net multiplier to a single dollar value */
export function applyGrossNet(value, grossNet) {
  return grossNet === 'net' ? value * 0.85 : value;
}

// Portfolio split for charts
export const portfolioPieData = [
  { name: 'Property Premiums', value: 101490, color: '#24a148' },
  { name: 'Auto Premiums',     value: 21045,  color: '#0f62fe' },
];
