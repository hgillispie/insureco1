/**
 * Risk Intelligence Mock Data
 *
 * Provides mock risk scores, trend data, and actionable recommendations
 * for the Risk Intelligence Dashboard feature.
 *
 * Risk scores are on a 0–100 scale (higher = safer / lower risk).
 * Risk levels: high = 0–39, medium = 40–69, low = 70–100
 */

// =============================================================================
// PORTFOLIO-LEVEL RISK SUMMARY
// =============================================================================

export const portfolioRiskSummary = {
  overallScore: 72,
  previousScore: 68,
  trend: 'improving', // 'improving' | 'declining' | 'stable'
  highRiskAssets: 4,
  mediumRiskAssets: 11,
  lowRiskAssets: 21,
  pendingRecommendations: 6,
  lastUpdated: '2024-03-15',
};

// =============================================================================
// SCORE BREAKDOWN BY CATEGORY
// =============================================================================

export const riskCategories = [
  {
    id: 'fleet-safety',
    label: 'Fleet Safety',
    score: 65,
    previousScore: 60,
    trend: 'improving',
    description: 'Driver behavior, vehicle age, maintenance records, and claim history.',
  },
  {
    id: 'property-condition',
    label: 'Property Condition',
    score: 78,
    previousScore: 78,
    trend: 'stable',
    description: 'Building age, inspection recency, structural rating, and maintenance.',
  },
  {
    id: 'location-risk',
    label: 'Location Risk',
    score: 74,
    previousScore: 71,
    trend: 'improving',
    description: 'Weather exposure, crime rates, proximity to fire stations, and flood zones.',
  },
  {
    id: 'claims-history',
    label: 'Claims History',
    score: 70,
    previousScore: 75,
    trend: 'declining',
    description: 'Frequency, severity, and recency of filed claims across all assets.',
  },
];

// =============================================================================
// MONTHLY TREND DATA (last 6 months)
// =============================================================================

export const riskTrendData = [
  { month: 'Oct', score: 61 },
  { month: 'Nov', score: 64 },
  { month: 'Dec', score: 66 },
  { month: 'Jan', score: 68 },
  { month: 'Feb', score: 70 },
  { month: 'Mar', score: 72 },
];

// =============================================================================
// ASSET RISK SCORES
// Keyed by asset ID (matching businessMockData.js IDs)
// =============================================================================

export const assetRiskScores = {
  // Properties
  'PROP-2024-001': { score: 74, level: 'low', factors: ['2 past claims', 'Good inspection record', 'Urban location'] },
  'PROP-2024-002': { score: 38, level: 'high', factors: ['Open claim', 'Overdue inspection', 'Flood-prone waterfront'] },
  'PROP-2024-003': { score: 88, level: 'low', factors: ['No claims', 'Recent construction', 'Strong building class'] },
  'PROP-2024-004': { score: 52, level: 'medium', factors: ['3 past claims', 'Aging structure', 'High foot traffic'] },
  'PROP-2024-005': { score: 55, level: 'medium', factors: ['Heavy equipment risk', 'Industrial classification', '1 past claim'] },
  'PROP-2024-006': { score: 91, level: 'low', factors: ['No claims', 'Modern facility', 'Regular inspections'] },
  'PROP-2024-007': { score: 42, level: 'medium', factors: ['2 past claims', 'Older structure (1985)', 'Restaurant fire risk'] },
  'PROP-2024-008': { score: 70, level: 'low', factors: ['Large exposure', '1 past claim', 'Good inspection record'] },
  'PROP-2024-009': { score: 36, level: 'high', factors: ['Open claim', 'Overdue inspection', 'High-activity environment'] },
  'PROP-2024-010': { score: 85, level: 'low', factors: ['No claims', 'Modern facility', 'High-value equipment'] },
  'PROP-2024-011': { score: 61, level: 'medium', factors: ['Pending renewal', 'No recent claims', 'Storage fire exposure'] },
  'PROP-2024-012': { score: 79, level: 'low', factors: ['1 past claim', 'Modern building', 'Good occupancy'] },

  // Vehicles
  'VEH-2024-001': { score: 68, level: 'medium', factors: ['1 collision claim', 'High mileage', 'Delivery route'] },
  'VEH-2024-002': { score: 90, level: 'low', factors: ['No claims', 'Low mileage', 'New model year'] },
  'VEH-2024-003': { score: 55, level: 'medium', factors: ['2 claims', 'High mileage', 'Passenger transport'] },
  'VEH-2024-004': { score: 88, level: 'low', factors: ['No claims', 'Low mileage', 'Recent model'] },
  'VEH-2024-005': { score: 35, level: 'high', factors: ['Open claim', 'In repair status', 'Collision history'] },
  'VEH-2024-006': { score: 92, level: 'low', factors: ['No claims', 'Low mileage', 'Recent model'] },
  'VEH-2024-007': { score: 67, level: 'medium', factors: ['1 past claim', 'Moderate mileage', 'Compact van'] },
  'VEH-2024-008': { score: 83, level: 'low', factors: ['No claims', 'Moderate mileage', 'Well maintained'] },
  'VEH-2024-009': { score: 32, level: 'high', factors: ['3 claims', 'Very high mileage', 'Semi truck risk'] },
  'VEH-2024-010': { score: 72, level: 'low', factors: ['1 past claim', 'Moderate mileage', 'Box truck'] },
  'VEH-2024-011': { score: 95, level: 'low', factors: ['No claims', 'Very low mileage', 'Newest model'] },
  'VEH-2024-012': { score: 54, level: 'medium', factors: ['2 claims', 'High mileage', 'Older model'] },
  'VEH-2024-013': { score: 93, level: 'low', factors: ['No claims', 'Very low mileage', 'EV — lower risk'] },
  'VEH-2024-014': { score: 66, level: 'medium', factors: ['1 past claim', 'Moderate mileage', 'Delivery use'] },
  'VEH-2024-015': { score: 91, level: 'low', factors: ['No claims', 'Low mileage', 'Recent model'] },
  'VEH-2024-016': { score: 57, level: 'medium', factors: ['2 claims', 'High mileage', 'Larger vehicle'] },
  'VEH-2024-017': { score: 94, level: 'low', factors: ['No claims', 'Very low mileage', 'New model'] },
  'VEH-2024-018': { score: 29, level: 'high', factors: ['4 claims', 'Open claim', 'Very high mileage', 'Jackknife incident'] },
  'VEH-2024-019': { score: 71, level: 'low', factors: ['1 past claim', 'Moderate mileage', 'Cargo van'] },
  'VEH-2024-020': { score: 96, level: 'low', factors: ['No claims', 'Very low mileage', 'Newest model'] },
  'VEH-2024-021': { score: 87, level: 'low', factors: ['No claims', 'Low mileage', 'Executive transport'] },
  'VEH-2024-022': { score: 90, level: 'low', factors: ['No claims', 'Low mileage', 'Recent model'] },
  'VEH-2024-023': { score: 73, level: 'low', factors: ['1 past claim', 'Moderate mileage'] },
  'VEH-2024-024': { score: 50, level: 'medium', factors: ['2 claims', 'High mileage', 'Older model'] },
  'VEH-2024-025': { score: 93, level: 'low', factors: ['No claims', 'Very low mileage', 'New model'] },
  'VEH-2024-026': { score: 84, level: 'low', factors: ['No claims', 'Moderate mileage', 'Executive SUV'] },
  'VEH-2024-027': { score: 89, level: 'low', factors: ['No claims', 'Low mileage', 'Recent model'] },
  'VEH-2024-028': { score: 65, level: 'medium', factors: ['1 past claim', 'Moderate-high mileage'] },
  'VEH-2024-029': { score: 96, level: 'low', factors: ['No claims', 'Very low mileage', 'New model'] },
  'VEH-2024-030': { score: 33, level: 'high', factors: ['3 claims', 'Very high mileage (198k)', 'Semi truck risk'] },
};

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

export const riskRecommendations = [
  {
    id: 'REC-001',
    priority: 'high',
    category: 'Property',
    assetId: 'PROP-2024-002',
    assetName: 'Waterfront Warehouse',
    title: 'Schedule overdue inspection',
    description:
      'The Waterfront Warehouse inspection is 4 months overdue. An up-to-date inspection report can improve your risk score and may be required to avoid a policy lapse.',
    scoreImpact: 10,
    estimatedAnnualSavings: 890,
    status: 'pending', // 'pending' | 'done' | 'dismissed'
  },
  {
    id: 'REC-002',
    priority: 'high',
    category: 'Fleet',
    assetId: 'VEH-2024-018',
    assetName: '2019 Peterbilt 579',
    title: 'Enroll in telematics program',
    description:
      'This semi truck has 4 claims and 245,000+ miles. Enrolling in a telematics monitoring program can demonstrate safe driving behavior and reduce your premium by up to 15%.',
    scoreImpact: 12,
    estimatedAnnualSavings: 936,
    status: 'pending',
  },
  {
    id: 'REC-003',
    priority: 'high',
    category: 'Fleet',
    assetId: 'VEH-2024-009',
    assetName: '2020 Freightliner Cascadia',
    title: 'Install dashcam and driver monitoring',
    description:
      'With 3 claims and 128,000+ miles, installing a dashcam can protect drivers in disputed claims and lower the risk score for this high-mileage semi truck.',
    scoreImpact: 9,
    estimatedAnnualSavings: 582,
    status: 'pending',
  },
  {
    id: 'REC-004',
    priority: 'medium',
    category: 'Property',
    assetId: 'PROP-2024-009',
    assetName: 'Fitness Center',
    title: 'Install slip-and-fall prevention flooring',
    description:
      'High-activity fitness facilities are prone to liability claims. Anti-slip flooring in wet areas can reduce this risk and qualify you for a liability premium discount.',
    scoreImpact: 8,
    estimatedAnnualSavings: 340,
    status: 'pending',
  },
  {
    id: 'REC-005',
    priority: 'medium',
    category: 'Property',
    assetId: 'PROP-2024-007',
    assetName: 'Restaurant & Bar',
    title: 'Upgrade fire suppression system',
    description:
      'The restaurant was built in 1985 and has had 2 claims. Modernizing the kitchen fire suppression system can significantly reduce fire risk and lower your annual premium.',
    scoreImpact: 11,
    estimatedAnnualSavings: 480,
    status: 'pending',
  },
  {
    id: 'REC-006',
    priority: 'medium',
    category: 'Fleet',
    assetId: 'VEH-2024-030',
    assetName: '2020 Kenworth T680',
    title: 'Schedule preventive maintenance check',
    description:
      'This vehicle has 198,000+ miles and 3 claims. A documented preventive maintenance record can lower the risk score and demonstrate responsible fleet management.',
    scoreImpact: 7,
    estimatedAnnualSavings: 415,
    status: 'pending',
  },
];

// =============================================================================
// RISK ALERTS
// =============================================================================

export const riskAlerts = [
  {
    id: 'ALERT-001',
    severity: 'high',
    title: 'High wind advisory near 3 properties',
    description: 'A wind advisory is active in the San Francisco Bay Area through tomorrow. Review your Waterfront Warehouse, Downtown Office Building, and Hotel Downtown.',
    affectedAssets: ['PROP-2024-001', 'PROP-2024-002', 'PROP-2024-008'],
    timestamp: '2024-03-15T09:00:00Z',
  },
  {
    id: 'ALERT-002',
    severity: 'medium',
    title: 'Open claim unresolved for 25+ days',
    description: 'Claim CLM-BUS-2024-015 on the Peterbilt 579 has been open for over 25 days. Follow up with your adjuster to avoid delays.',
    affectedAssets: ['VEH-2024-018'],
    timestamp: '2024-03-15T08:00:00Z',
  },
  {
    id: 'ALERT-003',
    severity: 'low',
    title: 'Policy renewal approaching for Storage Facility',
    description: 'The Storage Facility policy expires in 30 days. Log in to review renewal terms and avoid a coverage gap.',
    affectedAssets: ['PROP-2024-011'],
    timestamp: '2024-03-14T12:00:00Z',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the risk level label and color token for a given score
 */
export function getRiskLevel(score) {
  if (score >= 70) return { level: 'low', label: 'Low Risk' };
  if (score >= 40) return { level: 'medium', label: 'Medium Risk' };
  return { level: 'high', label: 'High Risk' };
}

/**
 * Get risk score for a specific asset ID
 */
export function getAssetRiskScore(assetId) {
  return assetRiskScores[assetId] || { score: 70, level: 'low', factors: [] };
}

/**
 * Get all pending recommendations sorted by priority
 */
export function getPendingRecommendations() {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return riskRecommendations
    .filter(rec => rec.status === 'pending')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
