// Monthly financials — values are in $K (thousands)
export const monthlyChartData = [
  { month: 'Jan', propertyPremiums: 142, propertyClaims: 38, autoPremiums: 89, autoClaims: 54 },
  { month: 'Feb', propertyPremiums: 138, propertyClaims: 45, autoPremiums: 91, autoClaims: 61 },
  { month: 'Mar', propertyPremiums: 145, propertyClaims: 29, autoPremiums: 94, autoClaims: 48 },
  { month: 'Apr', propertyPremiums: 149, propertyClaims: 52, autoPremiums: 97, autoClaims: 72 },
  { month: 'May', propertyPremiums: 152, propertyClaims: 41, autoPremiums: 99, autoClaims: 58 },
  { month: 'Jun', propertyPremiums: 158, propertyClaims: 67, autoPremiums: 103, autoClaims: 81 },
  { month: 'Jul', propertyPremiums: 161, propertyClaims: 44, autoPremiums: 106, autoClaims: 65 },
  { month: 'Aug', propertyPremiums: 165, propertyClaims: 38, autoPremiums: 109, autoClaims: 59 },
  { month: 'Sep', propertyPremiums: 163, propertyClaims: 71, autoPremiums: 112, autoClaims: 88 },
  { month: 'Oct', propertyPremiums: 168, propertyClaims: 49, autoPremiums: 115, autoClaims: 70 },
  { month: 'Nov', propertyPremiums: 172, propertyClaims: 55, autoPremiums: 118, autoClaims: 76 },
  { month: 'Dec', propertyPremiums: 178, propertyClaims: 62, autoPremiums: 122, autoClaims: 83 },
];

// Quarterly rollups (premiums + claims, all in $K)
export const quarterlyChartData = [
  { quarter: 'Q1', premiums: 699, claims: 275 },
  { quarter: 'Q2', premiums: 758, claims: 371 },
  { quarter: 'Q3', premiums: 816, claims: 365 },
  { quarter: 'Q4', premiums: 873, claims: 395 },
];

export const assetLedger = [
  { id: 'AUTO-001', name: '2022 Freightliner Cascadia', category: 'Auto',     premiumDue: 2840,  dueDate: '2025-02-15', totalClaims: 18750,  status: 'Active' },
  { id: 'PROP-001', name: '123 Maple St Warehouse',      category: 'Property', premiumDue: 5120,  dueDate: '2025-02-01', totalClaims: 84300,  status: 'Active' },
  { id: 'AUTO-002', name: '2021 Kenworth T680',           category: 'Auto',     premiumDue: 3150,  dueDate: '2025-02-28', totalClaims: 31200,  status: 'Active' },
  { id: 'PROP-002', name: '455 Commerce Dr Office Complex',category: 'Property', premiumDue: 7890,  dueDate: '2025-02-10', totalClaims: 126500, status: 'Active' },
  { id: 'AUTO-003', name: '2023 Peterbilt 579',           category: 'Auto',     premiumDue: 2660,  dueDate: '2025-03-01', totalClaims: 4200,   status: 'Active' },
  { id: 'PROP-003', name: '88 Industrial Pkwy Storage',   category: 'Property', premiumDue: 3400,  dueDate: '2025-02-20', totalClaims: 52100,  status: 'Active' },
  { id: 'AUTO-004', name: '2020 Volvo VNL 760',           category: 'Auto',     premiumDue: 3890,  dueDate: '2025-03-15', totalClaims: 67800,  status: 'Review' },
  { id: 'PROP-004', name: '1200 Harbor Blvd Retail Center',category: 'Property', premiumDue: 11200, dueDate: '2025-02-05', totalClaims: 198400, status: 'Review' },
  { id: 'AUTO-005', name: '2022 Mack Anthem',             category: 'Auto',     premiumDue: 2980,  dueDate: '2025-03-01', totalClaims: 9600,   status: 'Active' },
  { id: 'PROP-005', name: '37 Oakwood Ave Restaurant',    category: 'Property', premiumDue: 2100,  dueDate: '2025-02-28', totalClaims: 14800,  status: 'Active' },
  { id: 'AUTO-006', name: '2019 International LT',        category: 'Auto',     premiumDue: 4200,  dueDate: '2025-02-18', totalClaims: 89400,  status: 'Review' },
  { id: 'PROP-006', name: '590 Tech Campus Building A',   category: 'Property', premiumDue: 9800,  dueDate: '2025-03-05', totalClaims: 41700,  status: 'Active' },
];

// Derived from sum of monthly data * 1000
export const summaryStats = {
  totalOwedYTD: 3146000,
  totalClaimedYTD: 1406000,
  propertyOwedYTD: 1891000,
  propertyClaimedYTD: 591000,
  autoOwedYTD: 1255000,
  autoClaimedYTD: 815000,
  lossRatio: 0.447,
  activeAssets: 12,
};

export const regions = ['All Regions', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];

export const formatCurrency = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
};

export const formatCurrencyFull = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
};
