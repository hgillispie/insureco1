import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  chartData, assets, kpiData, formatCurrency, formatCurrencyShort,
  CHART_COLORS, SERIES_LABELS,
} from '../../data/financialData';
import './FinancialDashboardCreative.scss';

const PIE_DATA = (kpi) => [
  { name: 'Auto Premiums', value: kpi.autoOwedYTD, color: '#818cf8' },
  { name: 'Property Premiums', value: kpi.propertyOwedYTD, color: '#34d399' },
];

const PIE_CLAIMS_DATA = (kpi) => [
  { name: 'Auto Claims', value: kpi.autoClaimedYTD, color: '#f87171' },
  { name: 'Property Claims', value: kpi.propertyClaimedYTD, color: '#fb923c' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="creative-tooltip">
      <p className="creative-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="creative-tooltip__row" style={{ color: p.color }}>
          {SERIES_LABELS[p.dataKey] || p.dataKey}: <strong>{formatCurrency(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

export default function FinancialDashboardCreative() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('gross');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });
  const [sortBy, setSortBy] = useState('claims');

  const kpi = kpiData[mode];

  const toggleSeries = (key) =>
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));

  const sortedAssets = [...assets].sort((a, b) =>
    sortBy === 'claims' ? b.totalClaims - a.totalClaims : new Date(a.dueDate) - new Date(b.dueDate)
  );

  const lossRatioPct = (kpi.lossRatio * 100).toFixed(1);

  return (
    <div className="creative-dashboard">
      {/* Hero header */}
      <div className="creative-hero">
        <div className="creative-hero__top-bar">
          <button className="creative-hero__back" onClick={() => navigate('/business/financial-dashboard')}>
            ← All Dashboards
          </button>
          <div className="creative-mode-toggle">
            {['gross', 'net'].map((m) => (
              <button
                key={m}
                className={`creative-mode-btn ${mode === m ? 'creative-mode-btn--active' : ''}`}
                onClick={() => setMode(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="creative-hero__content">
          <div className="creative-hero__headline">
            <p className="creative-hero__year"></p>
            <h1 className="creative-hero__title">Financial Analytics</h1>
            <p className="creative-hero__sub">{mode === 'gross' ? 'Gross' : 'Net'} portfolio performance</p>
          </div>

          <div className="creative-hero__kpis">
            <div className="creative-hero-kpi creative-hero-kpi--owed">
              <span className="creative-hero-kpi__label">Total Owed</span>
              <span className="creative-hero-kpi__value">{formatCurrencyShort(kpi.totalOwedYTD)}</span>
              <span className="creative-hero-kpi__detail">{formatCurrency(kpi.totalOwedYTD)}</span>
            </div>
            <div className="creative-hero-kpi__divider" />
            <div className="creative-hero-kpi creative-hero-kpi--claimed">
              <span className="creative-hero-kpi__label">Total Claimed</span>
              <span className="creative-hero-kpi__value">{formatCurrencyShort(kpi.totalClaimedYTD)}</span>
              <span className="creative-hero-kpi__detail">Loss ratio: {lossRatioPct}%</span>
            </div>
            <div className="creative-hero-kpi__divider" />
            <div className="creative-hero-kpi creative-hero-kpi--auto">
              <span className="creative-hero-kpi__label">Auto</span>
              <span className="creative-hero-kpi__value">{formatCurrencyShort(kpi.autoOwedYTD)}</span>
              <span className="creative-hero-kpi__detail">{formatCurrencyShort(kpi.autoClaimedYTD)} claimed</span>
            </div>
            <div className="creative-hero-kpi__divider" />
            <div className="creative-hero-kpi creative-hero-kpi--property">
              <span className="creative-hero-kpi__label">Property</span>
              <span className="creative-hero-kpi__value">{formatCurrencyShort(kpi.propertyOwedYTD)}</span>
              <span className="creative-hero-kpi__detail">{formatCurrencyShort(kpi.propertyClaimedYTD)} claimed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Pie split */}
      <div className="creative-analytics">
        <div className="creative-chart-panel">
          <div className="creative-chart-controls">
            <h2 className="creative-chart-controls__title">Expense Trends</h2>
            <div className="creative-toggle-row">
              {Object.entries(SERIES_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`creative-toggle ${activeSeries[key] ? 'creative-toggle--on' : 'creative-toggle--off'}`}
                  style={{ '--t-color': CHART_COLORS[key] }}
                  onClick={() => toggleSeries(key)}
                  aria-pressed={activeSeries[key]}
                >
                  <span className="creative-toggle__pip" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 16, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-prop-prem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.propertyPremiums} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={CHART_COLORS.propertyPremiums} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-auto-prem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.autoPremiums} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.autoPremiums} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {activeSeries.propertyPremiums && (
                <Area type="monotone" dataKey="propertyPremiums" name="propertyPremiums"
                  stroke={CHART_COLORS.propertyPremiums} strokeWidth={2} fill="url(#grad-prop-prem)" dot={false} />
              )}
              {activeSeries.autoPremiums && (
                <Area type="monotone" dataKey="autoPremiums" name="autoPremiums"
                  stroke={CHART_COLORS.autoPremiums} strokeWidth={2} fill="url(#grad-auto-prem)" dot={false} />
              )}
              {activeSeries.propertyClaims && (
                <Bar dataKey="propertyClaims" name="propertyClaims"
                  fill={CHART_COLORS.propertyClaims} opacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={10} />
              )}
              {activeSeries.autoClaims && (
                <Bar dataKey="autoClaims" name="autoClaims"
                  fill={CHART_COLORS.autoClaims} opacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={10} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="creative-split-panel">
          <h2 className="creative-split-panel__title">Portfolio Split</h2>
          <div className="creative-pie-row">
            <div className="creative-pie-block">
              <p className="creative-pie-block__label">Premiums</p>
              <PieChart width={140} height={140}>
                <Pie data={PIE_DATA(kpi)} cx={70} cy={70} innerRadius={44} outerRadius={64} dataKey="value" strokeWidth={0}>
                  {PIE_DATA(kpi).map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="creative-pie-legend">
                {PIE_DATA(kpi).map((d) => (
                  <div key={d.name} className="creative-pie-legend__item">
                    <span style={{ background: d.color }} className="creative-pie-legend__dot" />
                    <span>{d.name.split(' ')[0]}</span>
                    <span className="creative-pie-legend__val">{formatCurrencyShort(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="creative-pie-block">
              <p className="creative-pie-block__label">Claims</p>
              <PieChart width={140} height={140}>
                <Pie data={PIE_CLAIMS_DATA(kpi)} cx={70} cy={70} innerRadius={44} outerRadius={64} dataKey="value" strokeWidth={0}>
                  {PIE_CLAIMS_DATA(kpi).map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="creative-pie-legend">
                {PIE_CLAIMS_DATA(kpi).map((d) => (
                  <div key={d.name} className="creative-pie-legend__item">
                    <span style={{ background: d.color }} className="creative-pie-legend__dot" />
                    <span>{d.name.split(' ')[0]}</span>
                    <span className="creative-pie-legend__val">{formatCurrencyShort(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset card list */}
      <div className="creative-asset-list">
        <div className="creative-asset-list__header">
          <h2 className="creative-asset-list__title">Asset Performance Ledger</h2>
          <div className="creative-asset-sort">
            <span>Sort:</span>
            <button
              className={`creative-sort-pill ${sortBy === 'claims' ? 'active' : ''}`}
              onClick={() => setSortBy('claims')}
            >Highest Claims</button>
            <button
              className={`creative-sort-pill ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => setSortBy('date')}
            >Due Date</button>
          </div>
        </div>

        <div className="creative-asset-grid">
          {sortedAssets.map((asset) => {
            const isAuto = asset.category === 'Auto';
            const hasHighClaims = asset.totalClaims > 20000;
            return (
              <div
                key={asset.id}
                className={`creative-asset-card ${isAuto ? 'creative-asset-card--auto' : 'creative-asset-card--property'}`}
                onClick={() => navigate(`/business/financial-dashboard/asset/${asset.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/business/financial-dashboard/asset/${asset.id}`)}
              >
                <div className="creative-asset-card__top">
                  <div className="creative-asset-card__cat-badge">
                    {asset.category}
                  </div>
                  {hasHighClaims && (
                    <div className="creative-asset-card__flag">High Claims</div>
                  )}
                </div>
                <h3 className="creative-asset-card__name">{asset.name}</h3>
                <p className="creative-asset-card__id">{asset.id}</p>
                <div className="creative-asset-card__stats">
                  <div className="creative-asset-card__stat">
                    <span className="creative-asset-card__stat-label">Premium</span>
                    <span className="creative-asset-card__stat-val creative-asset-card__stat-val--premium">
                      {formatCurrency(asset.premiumDue)}
                    </span>
                  </div>
                  <div className="creative-asset-card__stat">
                    <span className="creative-asset-card__stat-label">Due</span>
                    <span className="creative-asset-card__stat-val">{asset.dueDate}</span>
                  </div>
                  <div className="creative-asset-card__stat">
                    <span className="creative-asset-card__stat-label">Total Claims</span>
                    <span className={`creative-asset-card__stat-val ${hasHighClaims ? 'creative-asset-card__stat-val--danger' : asset.totalClaims === 0 ? 'creative-asset-card__stat-val--clean' : ''}`}>
                      {asset.totalClaims === 0 ? 'None' : formatCurrency(asset.totalClaims)}
                    </span>
                  </div>
                </div>
                <div className="creative-asset-card__cta">View Details →</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
