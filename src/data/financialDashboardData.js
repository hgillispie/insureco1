/**
 * financialDashboardData.js
 *
 * Centralized mock data and utility functions for the Insurance Financial
 * Analytics Dashboard (IFAD) prototypes. This file is intentionally shared
 * across all three prototype variants (Conservative, Modern, Wild) so that
 * visual comparisons between layouts are always apples-to-apples — any data
 * change here is automatically reflected in every prototype.
 *
 * When this dashboard is wired to a real backend, replace the exported
 * constants with API calls and keep the utility functions (computeSummaryStats,
 * filterAssets, formatCurrency, formatDate) as-is; their signatures won't need
 * to change.
 */

// ---------------------------------------------------------------------------
// monthlyTrendData
//
// Twelve months of aggregated premium and claim figures used to populate the
// Expense Visualization chart (Section 2.2 of the PRD). Each entry represents
// one calendar month and contains four data series:
//
//   propertyPremiums – total premiums collected on Property policies that month
//   propertyClaims   – total claims paid/reserved on Property policies that month
//   autoPremiums     – total premiums collected on Auto policies that month
//   autoClaims       – total claims paid/reserved on Auto policies that month
//
// All values are in USD. The data is intentionally shaped so that premiums
// consistently outpace claims (healthy loss ratio), with a spike in Jun–Jul to
// simulate a catastrophe season for demo purposes.
// ---------------------------------------------------------------------------
export const monthlyTrendData = [
  { month: 'Jan', propertyPremiums: 142000, propertyClaims: 38000, autoPremiums: 98000,  autoClaims: 52000 },
  { month: 'Feb', propertyPremiums: 148000, propertyClaims: 41000, autoPremiums: 101000, autoClaims: 47000 },
  { month: 'Mar', propertyPremiums: 151000, propertyClaims: 55000, autoPremiums: 105000, autoClaims: 63000 },
  { month: 'Apr', propertyPremiums: 155000, propertyClaims: 32000, autoPremiums: 108000, autoClaims: 44000 },
  { month: 'May', propertyPremiums: 160000, propertyClaims: 48000, autoPremiums: 112000, autoClaims: 58000 },
  { month: 'Jun', propertyPremiums: 158000, propertyClaims: 72000, autoPremiums: 110000, autoClaims: 71000 }, // storm season spike
  { month: 'Jul', propertyPremiums: 163000, propertyClaims: 65000, autoPremiums: 115000, autoClaims: 82000 }, // storm season tail
  { month: 'Aug', propertyPremiums: 167000, propertyClaims: 58000, autoPremiums: 118000, autoClaims: 69000 },
  { month: 'Sep', propertyPremiums: 170000, propertyClaims: 43000, autoPremiums: 120000, autoClaims: 51000 },
  { month: 'Oct', propertyPremiums: 172000, propertyClaims: 39000, autoPremiums: 122000, autoClaims: 46000 },
  { month: 'Nov', propertyPremiums: 175000, propertyClaims: 51000, autoPremiums: 125000, autoClaims: 55000 },
  { month: 'Dec', propertyPremiums: 178000, propertyClaims: 45000, autoPremiums: 128000, autoClaims: 60000 },
];

// ---------------------------------------------------------------------------
// assetLedgerData
//
// Individual asset records that populate the Asset Performance Ledger table
// (Section 2.3 of the PRD). Each record represents one insured asset — either
// a commercial vehicle (Auto) or a physical location (Property).
//
// Field definitions:
//   id           – unique asset identifier; prefix 'A-' = Auto, 'P-' = Property
//   name         – human-readable asset name shown in the table
//   category     – 'Auto' | 'Property' — used for filtering and badge styling
//   premiumDue   – dollar amount of the next scheduled premium payment
//   dueDate      – ISO date string of the next premium due date
//   totalClaims  – lifetime cumulative claims value for this asset (used to
//                  identify high-loss-ratio assets per PRD requirement)
//   region       – geographic region; must match a value in the `regions` array
//   grossPremium – full premium before any reinsurance or adjustments (= premiumDue)
//   netPremium   – premium after deducting reinsurance cessions (~10% discount)
//   status       – 'current' | 'overdue' — drives status badge color in the table
//
// Sorting by totalClaims descending will surface the highest-risk assets first,
// satisfying the PRD's requirement to quickly identify underperforming assets.
// ---------------------------------------------------------------------------
export const assetLedgerData = [
  { id: 'A-001', name: '2022 Freightliner Cascadia',    category: 'Auto',     premiumDue: 4250,  dueDate: '2025-08-15', totalClaims: 18750,  region: 'Northeast', grossPremium: 4250,  netPremium: 3825,  status: 'current' },
  { id: 'A-002', name: '2021 Peterbilt 579',            category: 'Auto',     premiumDue: 3800,  dueDate: '2025-07-22', totalClaims: 32100,  region: 'Southeast', grossPremium: 3800,  netPremium: 3420,  status: 'overdue' },
  { id: 'P-001', name: '123 Maple St Warehouse',        category: 'Property', premiumDue: 8500,  dueDate: '2025-09-01', totalClaims: 45200,  region: 'Northeast', grossPremium: 8500,  netPremium: 7650,  status: 'current' },
  { id: 'A-003', name: '2023 Volvo VNL 860',            category: 'Auto',     premiumDue: 5100,  dueDate: '2025-07-30', totalClaims: 8900,   region: 'Midwest',   grossPremium: 5100,  netPremium: 4590,  status: 'current' },
  { id: 'P-002', name: '456 Oak Ave Office Complex',    category: 'Property', premiumDue: 12400, dueDate: '2025-08-10', totalClaims: 67800,  region: 'West',      grossPremium: 12400, netPremium: 11160, status: 'current' },
  { id: 'A-004', name: '2020 Kenworth T680',            category: 'Auto',     premiumDue: 3200,  dueDate: '2025-07-18', totalClaims: 41300,  region: 'Southeast', grossPremium: 3200,  netPremium: 2880,  status: 'overdue' },
  { id: 'P-003', name: '789 Pine Rd Retail Center',     category: 'Property', premiumDue: 15800, dueDate: '2025-09-15', totalClaims: 23400,  region: 'West',      grossPremium: 15800, netPremium: 14220, status: 'current' },
  { id: 'A-005', name: '2024 International LT',         category: 'Auto',     premiumDue: 5800,  dueDate: '2025-08-05', totalClaims: 2100,   region: 'Midwest',   grossPremium: 5800,  netPremium: 5220,  status: 'current' },
  { id: 'P-004', name: '321 Elm St Distribution Hub',   category: 'Property', premiumDue: 9200,  dueDate: '2025-08-20', totalClaims: 89500,  region: 'Northeast', grossPremium: 9200,  netPremium: 8280,  status: 'current' },
  { id: 'A-006', name: '2023 Mack Anthem',              category: 'Auto',     premiumDue: 4700,  dueDate: '2025-07-25', totalClaims: 15600,  region: 'Southeast', grossPremium: 4700,  netPremium: 4230,  status: 'current' },
  { id: 'P-005', name: '555 Cedar Blvd Factory',        category: 'Property', premiumDue: 22000, dueDate: '2025-09-30', totalClaims: 112000, region: 'Midwest',   grossPremium: 22000, netPremium: 19800, status: 'current' },
  { id: 'A-007', name: '2021 Western Star 5700',        category: 'Auto',     premiumDue: 3600,  dueDate: '2025-08-12', totalClaims: 27800,  region: 'West',      grossPremium: 3600,  netPremium: 3240,  status: 'current' },
];

// ---------------------------------------------------------------------------
// computeSummaryStats(assets, viewMode)
//
// Derives the four KPI card values from a (potentially filtered) asset array.
// Called any time the region filter or Gross/Net toggle changes so the header
// stats always reflect exactly what's shown in the table.
//
// Parameters:
//   assets   – array of asset records (may be the full set or a filtered subset)
//   viewMode – 'gross' | 'net' — determines which premium field is summed
//
// Returns an object with:
//   totalOwed      – sum of all premiums (monthly); multiply by 12 for YTD display
//   totalClaimed   – sum of all lifetime claims across the filtered asset set
//   autoOwed       – totalOwed scoped to Auto assets only
//   autoClaimed    – totalClaimed scoped to Auto assets only
//   propertyOwed   – totalOwed scoped to Property assets only
//   propertyClaimed– totalClaimed scoped to Property assets only
//   lossRatio      – totalClaimed / annualized premiums; >0.7 is flagged as high-risk
//   assetCount     – total number of assets in the filtered set
// ---------------------------------------------------------------------------
export function computeSummaryStats(assets, viewMode = 'gross') {
  // Select the correct premium field based on the Gross/Net toggle
  const premiumKey = viewMode === 'gross' ? 'grossPremium' : 'netPremium';

  const autoAssets     = assets.filter(a => a.category === 'Auto');
  const propertyAssets = assets.filter(a => a.category === 'Property');

  const totalOwed      = assets.reduce((sum, a) => sum + a[premiumKey], 0);
  const totalClaimed   = assets.reduce((sum, a) => sum + a.totalClaims, 0);
  const autoOwed       = autoAssets.reduce((sum, a) => sum + a[premiumKey], 0);
  const autoClaimed    = autoAssets.reduce((sum, a) => sum + a.totalClaims, 0);
  const propertyOwed   = propertyAssets.reduce((sum, a) => sum + a[premiumKey], 0);
  const propertyClaimed= propertyAssets.reduce((sum, a) => sum + a.totalClaims, 0);

  return {
    totalOwed,
    totalClaimed,
    autoOwed,
    autoClaimed,
    propertyOwed,
    propertyClaimed,
    // Loss ratio = lifetime claims / annualized premiums (monthly premium * 12).
    // This is an approximation for prototype purposes; a production implementation
    // should use earned premiums over the same period as the claims.
    lossRatio: totalClaimed / (totalOwed * 12),
    assetCount: assets.length,
  };
}

// ---------------------------------------------------------------------------
// Filter configuration
//
// `regions`   – dropdown options for the region filter; 'All Regions' is the
//               catch-all that disables region filtering.
// `timeframes` – dropdown options for the timeframe filter (UI only in Phase 1;
//               functional filtering against real date ranges is a Phase 2 item).
// ---------------------------------------------------------------------------
export const regions   = ['All Regions', 'Northeast', 'Southeast', 'Midwest', 'West'];
export const timeframes = ['Year-to-Date', 'Q1', 'Q2', 'Q3', 'Q4', 'Last 12 Months'];

// ---------------------------------------------------------------------------
// filterAssets(assets, { region, category })
//
// Returns a filtered copy of the asset array without mutating the original.
// Filters are applied additively (AND logic): both region and category must
// match when both are provided.
//
// Parameters:
//   assets   – source asset array to filter
//   region   – region string to match, or 'All Regions' to skip region filtering
//   category – 'Auto' | 'Property' | 'All' to skip category filtering
// ---------------------------------------------------------------------------
export function filterAssets(assets, { region, category }) {
  let filtered = [...assets]; // shallow copy — never mutate the source array

  if (region && region !== 'All Regions') {
    filtered = filtered.filter(a => a.region === region);
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(a => a.category === category);
  }

  return filtered;
}

// ---------------------------------------------------------------------------
// formatCurrency(value)
//
// Formats a numeric USD value as a locale-aware currency string with no
// decimal places (e.g. 18750 → "$18,750"). Used consistently across all
// prototype variants to ensure the same formatting in every table and chart.
// ---------------------------------------------------------------------------
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ---------------------------------------------------------------------------
// formatDate(dateStr)
//
// Converts an ISO date string (YYYY-MM-DD) into a human-readable short date
// (e.g. '2025-08-15' → 'Aug 15, 2025') for display in the Due Date column.
// ---------------------------------------------------------------------------
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
