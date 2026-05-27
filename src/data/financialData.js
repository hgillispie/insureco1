export const chartData = [
  { month: 'Jan', propertyPremiums: 98500, propertyClaims: 34200, autoPremiums: 142300, autoClaims: 67800 },
  { month: 'Feb', propertyPremiums: 101200, propertyClaims: 28900, autoPremiums: 138700, autoClaims: 71200 },
  { month: 'Mar', propertyPremiums: 99800, propertyClaims: 41500, autoPremiums: 145600, autoClaims: 63400 },
  { month: 'Apr', propertyPremiums: 103400, propertyClaims: 38700, autoPremiums: 151200, autoClaims: 58900 },
  { month: 'May', propertyPremiums: 97600, propertyClaims: 52300, autoPremiums: 148900, autoClaims: 82300 },
  { month: 'Jun', propertyPremiums: 106700, propertyClaims: 44100, autoPremiums: 153400, autoClaims: 75600 },
  { month: 'Jul', propertyPremiums: 104300, propertyClaims: 31800, autoPremiums: 149800, autoClaims: 69100 },
  { month: 'Aug', propertyPremiums: 108900, propertyClaims: 47200, autoPremiums: 156700, autoClaims: 88400 },
  { month: 'Sep', propertyPremiums: 102100, propertyClaims: 39500, autoPremiums: 152300, autoClaims: 74200 },
  { month: 'Oct', propertyPremiums: 111200, propertyClaims: 55600, autoPremiums: 158900, autoClaims: 91300 },
  { month: 'Nov', propertyPremiums: 107600, propertyClaims: 43800, autoPremiums: 154200, autoClaims: 79800 },
  { month: 'Dec', propertyPremiums: 113400, propertyClaims: 48900, autoPremiums: 161500, autoClaims: 84700 },
];

export const assets = [
  {
    id: 'AUTO-001',
    name: '2022 Freightliner Cascadia',
    category: 'Auto',
    premiumDue: 2847,
    dueDate: '2025-07-15',
    totalClaims: 18450,
    driver: 'Marcus Thompson',
    vin: '3AKJHHDR7NSNF3841',
    coverageLimit: 500000,
    policyStart: '2022-03-01',
    claims: [
      { id: 'CLM-2024-001', date: '2024-03-15', type: 'Collision', amount: 12400, status: 'Settled' },
      { id: 'CLM-2023-008', date: '2023-09-22', type: 'Liability', amount: 6050, status: 'Settled' },
    ],
  },
  {
    id: 'AUTO-002',
    name: '2021 Peterbilt 579',
    category: 'Auto',
    premiumDue: 3120,
    dueDate: '2025-07-22',
    totalClaims: 5200,
    driver: 'Sarah Mitchell',
    vin: '1XP4D49X7KD123456',
    coverageLimit: 500000,
    policyStart: '2021-06-15',
    claims: [
      { id: 'CLM-2024-003', date: '2024-01-08', type: 'Collision', amount: 5200, status: 'Settled' },
    ],
  },
  {
    id: 'PROP-001',
    name: '123 Maple St Warehouse',
    category: 'Property',
    premiumDue: 4560,
    dueDate: '2025-08-01',
    totalClaims: 31200,
    address: '123 Maple St, Chicago IL 60601',
    sqft: 24000,
    coverageLimit: 2000000,
    policyStart: '2020-01-01',
    claims: [
      { id: 'CLM-2023-012', date: '2023-11-30', type: 'Fire Damage', amount: 21500, status: 'Settled' },
      { id: 'CLM-2022-004', date: '2022-07-14', type: 'Water Damage', amount: 9700, status: 'Settled' },
    ],
  },
  {
    id: 'AUTO-003',
    name: '2023 Kenworth T680',
    category: 'Auto',
    premiumDue: 2980,
    dueDate: '2025-08-10',
    totalClaims: 0,
    driver: 'James Rodriguez',
    vin: '1XKYD49X1NJ123789',
    coverageLimit: 500000,
    policyStart: '2023-02-01',
    claims: [],
  },
  {
    id: 'PROP-002',
    name: '456 Industrial Blvd',
    category: 'Property',
    premiumDue: 6200,
    dueDate: '2025-08-15',
    totalClaims: 87400,
    address: '456 Industrial Blvd, Detroit MI 48201',
    sqft: 48000,
    coverageLimit: 5000000,
    policyStart: '2019-05-01',
    claims: [
      { id: 'CLM-2024-007', date: '2024-04-02', type: 'Structural', amount: 42000, status: 'In Review' },
      { id: 'CLM-2023-019', date: '2023-08-18', type: 'Flood', amount: 28900, status: 'Settled' },
      { id: 'CLM-2021-003', date: '2021-02-10', type: 'Wind Damage', amount: 16500, status: 'Settled' },
    ],
  },
  {
    id: 'AUTO-004',
    name: '2020 Volvo VNL 760',
    category: 'Auto',
    premiumDue: 2640,
    dueDate: '2025-08-20',
    totalClaims: 42100,
    driver: 'David Park',
    vin: '4V4NC9EH9LN123456',
    coverageLimit: 500000,
    policyStart: '2020-09-01',
    claims: [
      { id: 'CLM-2024-002', date: '2024-02-20', type: 'Collision', amount: 28400, status: 'Settled' },
      { id: 'CLM-2022-011', date: '2022-12-05', type: 'Theft', amount: 13700, status: 'Settled' },
    ],
  },
  {
    id: 'PROP-003',
    name: '789 Commerce Center',
    category: 'Property',
    premiumDue: 5340,
    dueDate: '2025-09-01',
    totalClaims: 12800,
    address: '789 Commerce Dr, Atlanta GA 30301',
    sqft: 32000,
    coverageLimit: 3000000,
    policyStart: '2021-08-15',
    claims: [
      { id: 'CLM-2023-025', date: '2023-06-11', type: 'Vandalism', amount: 12800, status: 'Settled' },
    ],
  },
  {
    id: 'AUTO-005',
    name: '2022 International LT',
    category: 'Auto',
    premiumDue: 2750,
    dueDate: '2025-09-08',
    totalClaims: 7650,
    driver: 'Lisa Chen',
    vin: '3HSCUAPR5NN123456',
    coverageLimit: 500000,
    policyStart: '2022-11-01',
    claims: [
      { id: 'CLM-2024-006', date: '2024-03-28', type: 'Liability', amount: 7650, status: 'In Review' },
    ],
  },
];

export const kpiData = {
  gross: {
    totalOwedYTD: 2847593,
    totalClaimedYTD: 1234567,
    autoOwedYTD: 1654231,
    autoClaimedYTD: 789234,
    propertyOwedYTD: 1193362,
    propertyClaimedYTD: 445333,
    lossRatio: 0.434,
  },
  net: {
    totalOwedYTD: 2562834,
    totalClaimedYTD: 1111110,
    autoOwedYTD: 1488808,
    autoClaimedYTD: 710311,
    propertyOwedYTD: 1074026,
    propertyClaimedYTD: 400799,
    lossRatio: 0.433,
  },
};

export const CHART_COLORS = {
  propertyPremiums: '#24a148',
  propertyClaims: '#da1e28',
  autoPremiums: '#0f62fe',
  autoClaims: '#f1620f',
};

export const SERIES_LABELS = {
  propertyPremiums: 'Property Premiums',
  propertyClaims: 'Property Claims',
  autoPremiums: 'Auto Premiums',
  autoClaims: 'Auto Claims',
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export const formatCurrencyShort = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};
