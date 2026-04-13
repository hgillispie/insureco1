import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Button,
  Heading,
  Tag,
  InlineNotification,
} from '@carbon/react';
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Subtract,
  Warning,
  CheckmarkFilled,
  Building,
  CarFront,
  ChevronRight,
} from '@carbon/icons-react';
import {
  portfolioRiskSummary,
  riskCategories,
  riskTrendData,
  assetRiskScores,
  riskRecommendations,
  riskAlerts,
  getRiskLevel,
} from '../../data/riskData';
import { mockProperties, mockVehicles } from '../../data/businessMockData';
import './RiskIntelligencePage.scss';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Circular gauge showing the portfolio risk score visually
 */
function RiskScoreGauge({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getGaugeColor = (s) => {
    if (s >= 70) return 'var(--color-success)';
    if (s >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="risk-gauge" aria-label={`Risk score: ${score} out of 100`}>
      <svg viewBox="0 0 130 130" className="gauge-svg">
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="12"
        />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke={getGaugeColor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 65 65)"
          className="gauge-progress"
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score">{score}</span>
        <span className="gauge-label">/ 100</span>
      </div>
    </div>
  );
}

/**
 * Trend indicator arrow with color
 */
function TrendBadge({ trend, previousScore, currentScore }) {
  const diff = currentScore - previousScore;
  const abseDiff = Math.abs(diff);

  if (trend === 'improving') {
    return (
      <span className="trend-badge trend-badge--improving">
        <ArrowUp size={14} /> +{abseDiff} pts
      </span>
    );
  }
  if (trend === 'declining') {
    return (
      <span className="trend-badge trend-badge--declining">
        <ArrowDown size={14} /> -{abseDiff} pts
      </span>
    );
  }
  return (
    <span className="trend-badge trend-badge--stable">
      <Subtract size={14} /> No change
    </span>
  );
}

/**
 * Horizontal mini score bar used in category breakdown
 */
function ScoreBar({ score }) {
  const getBarColor = (s) => {
    if (s >= 70) return 'var(--color-success)';
    if (s >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="score-bar" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="score-bar__fill"
        style={{ width: `${score}%`, background: getBarColor(score) }}
      />
    </div>
  );
}

/**
 * Risk level tag with appropriate semantic color
 */
function RiskTag({ level, label }) {
  const typeMap = { low: 'green', medium: 'warm-gray', high: 'red' };
  return <Tag type={typeMap[level] || 'gray'} size="sm">{label || getRiskLevel(0).label}</Tag>;
}

/**
 * Mini sparkline trend chart (SVG-only, no library needed)
 */
function TrendSparkline({ data }) {
  const width = 200;
  const height = 48;
  const padding = 4;
  const scores = data.map((d) => d.score);
  const min = Math.min(...scores) - 5;
  const max = Math.max(...scores) + 5;
  const xStep = (width - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padding + i * xStep;
    const y = height - padding - ((d.score - min) / (max - min)) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-sparkline" aria-hidden="true">
      <polyline
        fill="none"
        stroke="var(--interactive-primary)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyline}
      />
      {data.map((d, i) => {
        const [x, y] = points[i].split(',');
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="var(--interactive-primary)" />
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function RiskIntelligencePage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(riskRecommendations);
  const [sortField, setSortField] = useState('score');
  const [sortDir, setSortDir] = useState('asc'); // asc = highest risk first

  // Build combined asset list with risk scores
  const allAssets = [
    ...mockProperties.map((p) => ({
      id: p.id,
      name: p.name,
      type: 'property',
      subtype: p.propertyType,
      location: `${p.city}, ${p.state}`,
      monthlyPremium: p.monthlyPremium,
      claimsCount: p.claimsCount,
      ...(assetRiskScores[p.id] || { score: 70, level: 'low', factors: [] }),
    })),
    ...mockVehicles.map((v) => ({
      id: v.id,
      name: `${v.year} ${v.make} ${v.model}`,
      type: 'vehicle',
      subtype: v.vehicleType,
      location: v.assignedDriver,
      monthlyPremium: v.monthlyPremium,
      claimsCount: v.claimsCount,
      ...(assetRiskScores[v.id] || { score: 70, level: 'low', factors: [] }),
    })),
  ];

  // Sort assets by score (asc = lowest score / highest risk first by default)
  const sortedAssets = [...allAssets].sort((a, b) => {
    if (sortField === 'score') return sortDir === 'asc' ? a.score - b.score : b.score - a.score;
    if (sortField === 'name') return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    if (sortField === 'claims') return sortDir === 'asc' ? b.claimsCount - a.claimsCount : a.claimsCount - b.claimsCount;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleMarkDone = (recId) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'done' } : r))
    );
  };

  const handleDismiss = (recId) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'dismissed' } : r))
    );
  };

  const pendingRecs = recommendations.filter((r) => r.status === 'pending');
  const { overallScore, previousScore, trend, highRiskAssets, mediumRiskAssets, pendingRecommendations } =
    portfolioRiskSummary;

  const navigateToAsset = (asset) => {
    if (asset.type === 'property') {
      navigate(`/business/properties/${asset.id}`);
    } else {
      navigate(`/business/fleet/${asset.id}`);
    }
  };

  return (
    <Grid fullWidth className="risk-intelligence-page">
      {/* Page Header */}
      <Column lg={16} md={8} sm={4} className="page-header">
        <Heading className="page-title">Risk Intelligence</Heading>
        <p className="page-subtitle">
          Understand your exposure across all insured assets and take action to reduce risk and lower premiums.
        </p>
      </Column>

      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <Column lg={16} md={8} sm={4} className="alerts-section">
          {riskAlerts.map((alert) => (
            <InlineNotification
              key={alert.id}
              kind={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}
              title={alert.title}
              subtitle={alert.description}
              lowContrast
              className="risk-alert"
            />
          ))}
        </Column>
      )}

      {/* ===== SECTION 1: Risk Overview ===== */}
      <Column lg={16} md={8} sm={4}>
        <Heading className="section-title">Portfolio Overview</Heading>
      </Column>

      {/* Score Gauge Card */}
      <Column lg={5} md={4} sm={4}>
        <Tile className="overview-tile overview-tile--gauge">
          <p className="overview-tile__label">Overall Risk Score</p>
          <RiskScoreGauge score={overallScore} />
          <div className="overview-tile__trend">
            <TrendBadge trend={trend} previousScore={previousScore} currentScore={overallScore} />
            <span className="overview-tile__trend-note">vs. last month</span>
          </div>
          <div className="trend-chart-wrapper">
            <p className="trend-chart-label">6-Month Trend</p>
            <div className="trend-chart-row">
              {riskTrendData.map((d) => (
                <div key={d.month} className="trend-chart-bar-col">
                  <div
                    className="trend-chart-bar"
                    style={{ height: `${(d.score / 100) * 48}px` }}
                    title={`${d.month}: ${d.score}`}
                  />
                  <span className="trend-chart-month">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </Tile>
      </Column>

      {/* Score Breakdown */}
      <Column lg={6} md={4} sm={4}>
        <Tile className="overview-tile overview-tile--categories">
          <p className="overview-tile__label">Score Breakdown</p>
          <div className="category-list">
            {riskCategories.map((cat) => (
              <div key={cat.id} className="category-row">
                <div className="category-row__header">
                  <span className="category-row__name">{cat.label}</span>
                  <div className="category-row__meta">
                    <span className="category-row__score">{cat.score}</span>
                    <TrendBadge trend={cat.trend} previousScore={cat.previousScore} currentScore={cat.score} />
                  </div>
                </div>
                <ScoreBar score={cat.score} />
                <p className="category-row__desc">{cat.description}</p>
              </div>
            ))}
          </div>
        </Tile>
      </Column>

      {/* High-Level Asset Counts */}
      <Column lg={5} md={8} sm={4}>
        <div className="asset-count-grid">
          <Tile className="asset-count-tile asset-count-tile--high">
            <Warning size={24} className="asset-count-icon" />
            <h3 className="asset-count-value">{highRiskAssets}</h3>
            <p className="asset-count-label">High-Risk Assets</p>
            <p className="asset-count-note">Immediate action recommended</p>
          </Tile>
          <Tile className="asset-count-tile asset-count-tile--medium">
            <Warning size={24} className="asset-count-icon" />
            <h3 className="asset-count-value">{mediumRiskAssets}</h3>
            <p className="asset-count-label">Medium-Risk Assets</p>
            <p className="asset-count-note">Monitor and improve</p>
          </Tile>
          <Tile className="asset-count-tile asset-count-tile--recommendations">
            <CheckmarkFilled size={24} className="asset-count-icon" />
            <h3 className="asset-count-value">{pendingRecs.length}</h3>
            <p className="asset-count-label">Open Recommendations</p>
            <p className="asset-count-note">Act to improve your score</p>
          </Tile>
        </div>
      </Column>

      {/* ===== SECTION 2: Asset Risk List ===== */}
      <Column lg={16} md={8} sm={4}>
        <Tile className="asset-table-tile">
          <div className="asset-table-header">
            <Heading className="section-title section-title--inline">Asset Risk Rankings</Heading>
            <p className="asset-table-subtitle">All properties and vehicles ranked by risk score. Click a row to view details.</p>
          </div>

          <div className="asset-table-scroll">
            <table className="asset-risk-table" aria-label="Asset risk rankings">
              <thead>
                <tr>
                  <th className="col-type">Type</th>
                  <th
                    className={`col-name sortable ${sortField === 'name' ? 'sorted' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Asset {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="col-location">Location / Driver</th>
                  <th
                    className={`col-claims sortable ${sortField === 'claims' ? 'sorted' : ''}`}
                    onClick={() => handleSort('claims')}
                  >
                    Claims {sortField === 'claims' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="col-risk-level">Risk Level</th>
                  <th
                    className={`col-score sortable ${sortField === 'score' ? 'sorted' : ''}`}
                    onClick={() => handleSort('score')}
                  >
                    Score {sortField === 'score' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="col-action" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map((asset) => {
                  const { level, label } = getRiskLevel(asset.score);
                  return (
                    <tr
                      key={asset.id}
                      className={`asset-row asset-row--${level}`}
                      onClick={() => navigateToAsset(asset)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && navigateToAsset(asset)}
                      role="button"
                      aria-label={`View details for ${asset.name}`}
                    >
                      <td className="col-type">
                        {asset.type === 'property' ? (
                          <Building size={16} className="asset-type-icon" />
                        ) : (
                          <CarFront size={16} className="asset-type-icon" />
                        )}
                      </td>
                      <td className="col-name">
                        <span className="asset-name">{asset.name}</span>
                        <span className="asset-subtype">{asset.subtype}</span>
                      </td>
                      <td className="col-location">{asset.location}</td>
                      <td className="col-claims">{asset.claimsCount}</td>
                      <td className="col-risk-level">
                        <RiskTag level={level} label={label} />
                      </td>
                      <td className="col-score">
                        <span className={`score-badge score-badge--${level}`}>{asset.score}</span>
                      </td>
                      <td className="col-action">
                        <ChevronRight size={16} className="row-chevron" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Tile>
      </Column>

      {/* ===== SECTION 3: Recommendations ===== */}
      <Column lg={16} md={8} sm={4}>
        <div className="recommendations-header">
          <Heading className="section-title">Recommendations</Heading>
          <p className="recommendations-subtitle">
            Act on these suggestions to lower your risk score and reduce annual premiums.
          </p>
        </div>
      </Column>

      {pendingRecs.length === 0 && (
        <Column lg={16} md={8} sm={4}>
          <Tile className="no-recs-tile">
            <CheckmarkFilled size={32} className="no-recs-icon" />
            <p className="no-recs-text">All recommendations have been addressed. Great work!</p>
          </Tile>
        </Column>
      )}

      {pendingRecs.map((rec) => (
        <Column key={rec.id} lg={8} md={8} sm={4}>
          <Tile className={`rec-card rec-card--${rec.priority}`}>
            <div className="rec-card__header">
              <Tag
                type={rec.priority === 'high' ? 'red' : 'warm-gray'}
                size="sm"
                className="rec-priority-tag"
              >
                {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
              </Tag>
              <span className="rec-category">{rec.category}</span>
            </div>

            <h4 className="rec-card__title">{rec.title}</h4>
            <p className="rec-card__asset">{rec.assetName}</p>
            <p className="rec-card__description">{rec.description}</p>

            <div className="rec-card__impact">
              <div className="rec-impact-stat">
                <span className="rec-impact-value">+{rec.scoreImpact} pts</span>
                <span className="rec-impact-label">Score impact</span>
              </div>
              <div className="rec-impact-stat">
                <span className="rec-impact-value">${rec.estimatedAnnualSavings.toLocaleString()}/yr</span>
                <span className="rec-impact-label">Est. savings</span>
              </div>
            </div>

            <div className="rec-card__actions">
              <Button
                kind="primary"
                size="sm"
                renderIcon={CheckmarkFilled}
                onClick={() => handleMarkDone(rec.id)}
              >
                Mark as Done
              </Button>
              <Button
                kind="ghost"
                size="sm"
                onClick={() => {
                  const asset = rec.assetId;
                  if (asset.startsWith('PROP')) navigate(`/business/properties/${asset}`);
                  else navigate(`/business/fleet/${asset}`);
                }}
                renderIcon={ArrowRight}
              >
                View Asset
              </Button>
              <Button kind="ghost" size="sm" onClick={() => handleDismiss(rec.id)}>
                Dismiss
              </Button>
            </div>
          </Tile>
        </Column>
      ))}

      {/* Bottom padding */}
      <Column lg={16} md={8} sm={4} className="page-bottom-spacer" />
    </Grid>
  );
}
