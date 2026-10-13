/**
 * Financial dashboard mock data.
 * YTD totals are the source of truth; monthly series, summary KPIs and the
 * ledger are derived or kept consistent with them.
 */

export const FINANCIAL_YEAR = 2024;

export const YTD_TOTALS = {
  property: { premiums: 3286000, claims: 1264000 },
  auto: { premiums: 4147000, claims: 2173000 },
};

export const PERIOD_CHANGE = {
  premiums: 8.2,
  claims: 12.5,
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Relative monthly shape; scaled so each series sums exactly to its YTD total.
const SERIES_WEIGHTS = {
  propertyPremiums: [0.9, 0.87, 0.92, 0.95, 0.97, 0.99, 1.0, 0.98, 1.03, 1.06, 1.08, 1.13],
  propertyClaims: [0.86, 0.9, 1.0, 0.85, 1.12, 0.98, 0.95, 1.0, 0.92, 1.14, 1.05, 1.23],
  autoPremiums: [0.9, 0.86, 0.93, 0.92, 0.97, 0.99, 1.03, 1.01, 1.05, 1.09, 1.11, 1.14],
  autoClaims: [0.86, 0.78, 0.96, 0.87, 1.0, 0.94, 1.07, 1.03, 0.97, 1.05, 1.0, 1.27],
};

function distribute(total, weights) {
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  const values = weights.map((w) => Math.round((total * w) / weightSum / 1000) * 1000);
  values[values.length - 1] += total - values.reduce((sum, v) => sum + v, 0);
  return values;
}

const monthlySeries = {
  propertyPremiums: distribute(YTD_TOTALS.property.premiums, SERIES_WEIGHTS.propertyPremiums),
  propertyClaims: distribute(YTD_TOTALS.property.claims, SERIES_WEIGHTS.propertyClaims),
  autoPremiums: distribute(YTD_TOTALS.auto.premiums, SERIES_WEIGHTS.autoPremiums),
  autoClaims: distribute(YTD_TOTALS.auto.claims, SERIES_WEIGHTS.autoClaims),
};

export const monthlyTrends = MONTHS.map((month, i) => ({
  month: `${month} ${FINANCIAL_YEAR}`,
  propertyPremiums: monthlySeries.propertyPremiums[i],
  propertyClaims: monthlySeries.propertyClaims[i],
  autoPremiums: monthlySeries.autoPremiums[i],
  autoClaims: monthlySeries.autoClaims[i],
}));

export const portfolioAssets = [
  { id: 'AST-001', name: '123 Maple St Warehouse', category: 'Property', premiumDue: 12500, dueDate: '2025-02-14', totalClaims: 45000, region: 'Northeast' },
  { id: 'AST-002', name: '2022 Freightliner Cascadia', category: 'Auto', premiumDue: 3200, dueDate: '2025-01-31', totalClaims: 18500, region: 'Midwest' },
  { id: 'AST-003', name: '456 Oak Ave Office Building', category: 'Property', premiumDue: 18900, dueDate: '2025-02-27', totalClaims: 72000, region: 'Southeast' },
  { id: 'AST-004', name: '2021 Ford F-150 Fleet (15 units)', category: 'Auto', premiumDue: 8500, dueDate: '2025-02-09', totalClaims: 34200, region: 'Southwest' },
  { id: 'AST-005', name: '789 Pine St Retail Complex', category: 'Property', premiumDue: 22000, dueDate: '2025-03-04', totalClaims: 15000, region: 'West' },
  { id: 'AST-006', name: '2023 Tesla Model 3 Executive', category: 'Auto', premiumDue: 2800, dueDate: '2025-02-19', totalClaims: 8900, region: 'West' },
  { id: 'AST-007', name: '321 Elm St Manufacturing Plant', category: 'Property', premiumDue: 35000, dueDate: '2025-02-04', totalClaims: 125000, region: 'Midwest' },
  { id: 'AST-008', name: '2020 Peterbilt 579 Semi', category: 'Auto', premiumDue: 4100, dueDate: '2025-02-28', totalClaims: 52000, region: 'Northeast' },
  { id: 'AST-009', name: '555 Birch Ln Apartment Complex', category: 'Property', premiumDue: 28500, dueDate: '2025-02-11', totalClaims: 38000, region: 'Southeast' },
  { id: 'AST-010', name: '2022 RAM 2500 Contractor', category: 'Auto', premiumDue: 3600, dueDate: '2025-02-17', totalClaims: 12300, region: 'Southwest' },
  { id: 'AST-011', name: '888 Cedar Rd Storage Facility', category: 'Property', premiumDue: 9500, dueDate: '2025-03-09', totalClaims: 5200, region: 'West' },
  { id: 'AST-012', name: '2021 Chevy Silverado Fleet (8 units)', category: 'Auto', premiumDue: 6200, dueDate: '2025-02-07', totalClaims: 28900, region: 'Midwest' },
  { id: 'AST-013', name: '1010 Willow Way Shopping Center', category: 'Property', premiumDue: 42000, dueDate: '2025-02-24', totalClaims: 95000, region: 'Northeast' },
  { id: 'AST-014', name: '2023 Honda Accord Corporate', category: 'Auto', premiumDue: 2400, dueDate: '2025-03-11', totalClaims: 3500, region: 'Northeast' },
  { id: 'AST-015', name: '777 Spruce St Distribution Center', category: 'Property', premiumDue: 31000, dueDate: '2025-03-14', totalClaims: 22000, region: 'Southwest' },
];

export function getFinancialSummary() {
  const totalPremiums = YTD_TOTALS.property.premiums + YTD_TOTALS.auto.premiums;
  const totalClaims = YTD_TOTALS.property.claims + YTD_TOTALS.auto.claims;

  return {
    totalPremiums,
    totalClaims,
    propertyPremiums: YTD_TOTALS.property.premiums,
    autoPremiums: YTD_TOTALS.auto.premiums,
    propertyClaims: YTD_TOTALS.property.claims,
    autoClaims: YTD_TOTALS.auto.claims,
    lossRatio: (totalClaims / totalPremiums) * 100,
    totalAssets: portfolioAssets.length,
    netRevenue: totalPremiums - totalClaims,
    avgMonthlyPremium: Math.round(totalPremiums / 12),
  };
}
