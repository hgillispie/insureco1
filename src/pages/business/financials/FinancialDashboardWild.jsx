import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import {
  quarterlyChartData,
  assetLedger,
  summaryStats,
  formatCurrency,
  formatCurrencyFull,
  formatDate,
} from '../../../data/financialMockData';
import './FinancialDashboardWild.scss';

const topByHighestClaims = [...assetLedger].sort((a, b) => b.totalClaims - a.totalClaims);
const maxClaims = topByHighestClaims[0].totalClaims;

const gaugeData = [{ name: 'Loss Ratio', value: summaryStats.lossRatio * 100, fill: '#ff6b6b' }];

const QuarterTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="wild-tooltip">
      <div className="wild-tooltip-label">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.fill }}>
          {p.name}: ${p.value}K
        </div>
      ))}
    </div>
  );
};

export default function FinancialDashboardWild() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const premiumsTotal = formatCurrency(summaryStats.totalOwedYTD);
  const claimsTotal = formatCurrency(summaryStats.totalClaimedYTD);
  const claimsWidthPct = (summaryStats.totalClaimedYTD / summaryStats.totalOwedYTD) * 100;

  return (
    <div className="wild-dashboard">
      {/* Dramatic header */}
      <div className="wild-header">
        <div className="wild-header-inner">
          <div className="wild-title-col">
            <div className="wild-eyebrow">FY 2024 · Insurance Portfolio Analytics</div>
            <h1 className="wild-main-title">Financial<br />Analytics</h1>
          </div>
          <div className="wild-mega-stats">
            <div className="wild-mega-stat">
              <div className="wild-stat-number wild-num-green">{premiumsTotal}</div>
              <div className="wild-stat-label">Total Premiums</div>
              <div className="wild-progress-bar">
                <div className="wild-progress-fill wild-fill-green" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="wild-mega-stat">
              <div className="wild-stat-number wild-num-red">{claimsTotal}</div>
              <div className="wild-stat-label">Total Claims Paid</div>
              <div className="wild-progress-bar">
                <div className="wild-progress-fill wild-fill-red" style={{ width: `${claimsWidthPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main body */}
      <div className="wild-body">
        {/* Left panel */}
        <div className="wild-left-panel">
          {/* Quarterly bar chart */}
          <div className="wild-panel-block">
            <div className="wild-block-eyebrow">QUARTERLY BREAKDOWN</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={quarterlyChartData} barCategoryGap="28%" barGap={3} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={v => `${v}K`}
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<QuarterTooltip />} />
                <Bar dataKey="premiums" name="Premiums" fill="#42be65" radius={[4, 4, 0, 0]} />
                <Bar dataKey="claims"   name="Claims"   fill="#ff6b6b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="wild-chart-legend">
              <span><span className="wild-legend-dot" style={{ background: '#42be65' }} />Premiums</span>
              <span><span className="wild-legend-dot" style={{ background: '#ff6b6b' }} />Claims</span>
            </div>
          </div>

          {/* Loss ratio gauge */}
          <div className="wild-panel-block">
            <div className="wild-block-eyebrow">PORTFOLIO LOSS RATIO</div>
            <div className="wild-gauge-row">
              <div className="wild-gauge-chart">
                <ResponsiveContainer width={160} height={120}>
                  <RadialBarChart
                    cx="50%" cy="88%"
                    innerRadius="55%" outerRadius="95%"
                    startAngle={180} endAngle={0}
                    barSize={14}
                    data={gaugeData}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background={{ fill: 'rgba(255,255,255,0.08)' }}
                      dataKey="value"
                      cornerRadius={6}
                      angleAxisId={0}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="wild-gauge-info">
                <div className="wild-gauge-number">{(summaryStats.lossRatio * 100).toFixed(1)}%</div>
                <div className="wild-gauge-sub">vs 62% industry avg</div>
                <div className="wild-favorable-badge">FAVORABLE ↓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — asset cards */}
        <div className="wild-right-panel">
          <div className="wild-block-eyebrow">ASSETS RANKED BY CLAIMS EXPOSURE</div>
          <div className="wild-asset-list">
            {topByHighestClaims.map((asset, idx) => {
              const claimsRatio = asset.totalClaims / maxClaims;
              const isHighRisk = claimsRatio > 0.45;
              return (
                <div
                  key={asset.id}
                  className={`wild-asset-card ${isHighRisk ? 'wild-card-risk' : ''} ${hovered === asset.id ? 'wild-card-hover' : ''}`}
                  onClick={() => navigate(`/business/${asset.category === 'Auto' ? 'fleet' : 'properties'}`)}
                  onMouseEnter={() => setHovered(asset.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="wild-card-rank">#{idx + 1}</div>
                  <div className="wild-card-main">
                    <div className="wild-card-name">{asset.name}</div>
                    <div className="wild-card-meta">
                      <span className={`wild-cat-tag wild-cat-${asset.category.toLowerCase()}`}>
                        {asset.category}
                      </span>
                      <span className="wild-card-date">{formatDate(asset.dueDate)}</span>
                      <span className={`wild-status-dot wild-status-${asset.status.toLowerCase()}`} />
                    </div>
                  </div>
                  <div className="wild-card-claims-col">
                    <div className="wild-card-claims-num">{formatCurrency(asset.totalClaims)}</div>
                    <div className="wild-card-bar-wrap">
                      <div className="wild-card-bar-fill" style={{ width: `${claimsRatio * 100}%` }} />
                    </div>
                    <div className="wild-card-premium">Prem: {formatCurrencyFull(asset.premiumDue)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
