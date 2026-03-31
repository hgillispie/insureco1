// Financial Dashboard Mock Data
// Shared across all three prototype variations

// Monthly trend data for charts (Jan-Dec)
export const monthlyTrendData = [
  { month: 'Jan', propertyPremiums: 142000, propertyClaims: 38000, autoPremiums: 98000, autoClaims: 52000 },
  { month: 'Feb', propertyPremiums: 148000, propertyClaims: 41000, autoPremiums: 101000, autoClaims: 47000 },
  { month: 'Mar', propertyPremiums: 151000, propertyClaims: 55000, autoPremiums: 105000, autoClaims: 63000 },
  { month: 'Apr', propertyPremiums: 155000, propertyClaims: 32000, autoPremiums: 108000, autoClaims: 44000 },
  { month: 'May', propertyPremiums: 160000, propertyClaims: 48000, autoPremiums: 112000, autoClaims: 58000 },
  { month: 'Jun', propertyPremiums: 158000, propertyClaims: 72000, autoPremiums: 110000, autoClaims: 71000 },
  { month: 'Jul', propertyPremiums: 163000, propertyClaims: 65000, autoPremiums: 115000, autoClaims: 82000 },
  { month: 'Aug', propertyPremiums: 167000, propertyClaims: 58000, autoPremiums: 118000, autoClaims: 69000 },
  { month: 'Sep', propertyPremiums: 170000, propertyClaims: 43000, autoPremiums: 120000, autoClaims: 51000 },
  { month: 'Oct', propertyPremiums: 172000, propertyClaims: 39000, autoPremiums: 122000, autoClaims: 46000 },
  { month: 'Nov', propertyPremiums: 175000, propertyClaims: 51000, autoPremiums: 125000, autoClaims: 55000 },
  { month: 'Dec', propertyPremiums: 178000, propertyClaims: 45000, autoPremiums: 128000, autoClaims: 60000 },
];

// Asset performance ledger data
export const assetLedgerData = [
  { id: 'A-001', name: '2022 Freightliner Cascadia', category: 'Auto', premiumDue: 4250, dueDate: '2025-08-15', totalClaims: 18750, region: 'Northeast', grossPremium: 4250, netPremium: 3825, status: 'current' },
  { id: 'A-002', name: '2021 Peterbilt 579', category: 'Auto', premiumDue: 3800, dueDate: '2025-07-22', totalClaims: 32100, region: 'Southeast', grossPremium: 3800, netPremium: 3420, status: 'overdue' },
  { id: 'P-001', name: '123 Maple St Warehouse', category: 'Property', premiumDue: 8500, dueDate: '2025-09-01', totalClaims: 45200, region: 'Northeast', grossPremium: 8500, netPremium: 7650, status: 'current' },
  { id: 'A-003', name: '2023 Volvo VNL 860', category: 'Auto', premiumDue: 5100, dueDate: '2025-07-30', totalClaims: 8900, region: 'Midwest', grossPremium: 5100, netPremium: 4590, status: 'current' },
  { id: 'P-002', name: '456 Oak Ave Office Complex', category: 'Property', premiumDue: 12400, dueDate: '2025-08-10', totalClaims: 67800, region: 'West', grossPremium: 12400, netPremium: 11160, status: 'current' },
  { id: 'A-004', name: '2020 Kenworth T680', category: 'Auto', premiumDue: 3200, dueDate: '2025-07-18', totalClaims: 41300, region: 'Southeast', grossPremium: 3200, netPremium: 2880, status: 'overdue' },
  { id: 'P-003', name: '789 Pine Rd Retail Center', category: 'Property', premiumDue: 15800, dueDate: '2025-09-15', totalClaims: 23400, region: 'West', grossPremium: 15800, netPremium: 14220, status: 'current' },
  { id: 'A-005', name: '2024 International LT', category: 'Auto', premiumDue: 5800, dueDate: '2025-08-05', totalClaims: 2100, region: 'Midwest', grossPremium: 5800, netPremium: 5220, status: 'current' },
  { id: 'P-004', name: '321 Elm St Distribution Hub', category: 'Property', premiumDue: 9200, dueDate: '2025-08-20', totalClaims: 89500, region: 'Northeast', grossPremium: 9200, netPremium: 8280, status: 'current' },
  { id: 'A-006', name: '2023 Mack Anthem', category: 'Auto', premiumDue: 4700, dueDate: '2025-07-25', totalClaims: 15600, region: 'Southeast', grossPremium: 4700, netPremium: 4230, status: 'current' },
  { id: 'P-005', name: '555 Cedar Blvd Factory', category: 'Property', premiumDue: 22000, dueDate: '2025-09-30', totalClaims: 112000, region: 'Midwest', grossPremium: 22000, netPremium: 19800, status: 'current' },
  { id: 'A-007', name: '2021 Western Star 5700', category: 'Auto', premiumDue: 3600, dueDate: '2025-08-12', totalClaims: 27800, region: 'West', grossPremium: 3600, netPremium: 3240, status: 'current' },
];

// Summary statistics (computed from data)
export function computeSummaryStats(assets, viewMode = 'gross') {
  const premiumKey = viewMode === 'gross' ? 'grossPremium' : 'netPremium';

  const autoAssets = assets.filter(a => a.category === 'Auto');
  const propertyAssets = assets.filter(a => a.category === 'Property');

  const totalOwed = assets.reduce((sum, a) => sum + a[premiumKey], 0);
  const totalClaimed = assets.reduce((sum, a) => sum + a.totalClaims, 0);
  const autoOwed = autoAssets.reduce((sum, a) => sum + a[premiumKey], 0);
  const autoClaimed = autoAssets.reduce((sum, a) => sum + a.totalClaims, 0);
  const propertyOwed = propertyAssets.reduce((sum, a) => sum + a[premiumKey], 0);
  const propertyClaimed = propertyAssets.reduce((sum, a) => sum + a.totalClaims, 0);

  return {
    totalOwed,
    totalClaimed,
    autoOwed,
    autoClaimed,
    propertyOwed,
    propertyClaimed,
    lossRatio: totalClaimed / (totalOwed * 12), // annualized estimate
    assetCount: assets.length,
  };
}

// Filter helpers
export const regions = ['All Regions', 'Northeast', 'Southeast', 'Midwest', 'West'];
export const timeframes = ['Year-to-Date', 'Q1', 'Q2', 'Q3', 'Q4', 'Last 12 Months'];

export function filterAssets(assets, { region, category }) {
  let filtered = [...assets];
  if (region && region !== 'All Regions') {
    filtered = filtered.filter(a => a.region === region);
  }
  if (category && category !== 'All') {
    filtered = filtered.filter(a => a.category === category);
  }
  return filtered;
}

// Format currency
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format date
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
