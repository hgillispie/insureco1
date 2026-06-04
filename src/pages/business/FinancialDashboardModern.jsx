import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  chartData, assets, kpiData, formatCurrency, formatCurrencyShort,
  CHART_COLORS, SERIES_LABELS,
} from '../../data/financialData';
import './FinancialDashboardModern.scss';

const SORT_KEYS = {
  totalClaims: (a, b) => b.totalClaims - a.totalClaims,
  dueDate: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  premiumDue: (a, b) => b.premiumDue - a.premiumDue,
};

export default function FinancialDashboardModern() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('gross');
  const [sortKey, setSortKey] = useState('totalClaims');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });

  const kpi = kpiData[mode];

  const toggleSeries = (key) =>
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));

  const sortedAssets = [...assets].sort(SORT_KEYS[sortKey]);

  const kpiCards = [
    {
      label: 'Total Owed',
      value: formatCurrencyShort(kpi.totalOwedYTD),
      sub: 'Year-to-date premiums',
      accent: '#0f62fe',
    },
    {
      label: 'Total Claimed',
      value: formatCurrencyShort(kpi.totalClaimedYTD),
      sub: `${(kpi.lossRatio * 100).toFixed(1)}% loss ratio`,
      accent: '#da1e28',
    },
    {
      label: 'Auto Portfolio',
      value: formatCurrencyShort(kpi.autoOwedYTD),
      sub: `${formatCurrencyShort(kpi.autoClaimedYTD)} claimed`,
      accent: '#6929c4',
    },
    {
      label: 'Property Portfolio',
      value: formatCurrencyShort(kpi.propertyOwedYTD),
      sub: `${formatCurrencyShort(kpi.propertyClaimedYTD)} claimed`,
      accent: '#24a148',
    },
  ];

  return (
    <div className="modern-dashboard">
      {/* Top nav bar */}
      <nav className="modern-nav">
        <button className="modern-nav__back" onClick={() => navigate('/business/financial-dashboard')}>
          ← Back
        </button>
        <div className="modern-nav__brand">
          <span className="modern-nav__dot" />
          IFAD Analytics
        </div>
        <div className="modern-nav__mode">
          {['gross', 'net'].map((m) => (
            <button
              key={m}
              className={`modern-mode-btn ${mode === m ? 'modern-mode-btn--active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* KPI strip */}
      <div className="modern-kpi-strip">
        {kpiCards.map((card) => (
          <div key={card.label} className="modern-kpi-card" style={{ '--card-accent': card.accent }}>
            <div className="modern-kpi-card__accent-line" />
            <p className="modern-kpi-card__label">{card.label}</p>
            <p className="modern-kpi-card__value">{card.value}</p>
            <p className="modern-kpi-card__sub">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart section */}
      <div className="modern-chart-section">
        <div className="modern-chart-header">
          <div>
            <h2 className="modern-chart-header__title">Expense Visualization</h2>
            <p className="modern-chart-header__sub">Toggle series to compare specific portfolios</p>
          </div>
          <div className="modern-series-pills">
            {Object.entries(SERIES_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`modern-series-pill ${activeSeries[key] ? 'modern-series-pill--on' : 'modern-series-pill--off'}`}
                style={{ '--pill-color': CHART_COLORS[key] }}
                onClick={() => toggleSeries(key)}
                aria-pressed={activeSeries[key]}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 16, bottom: 0 }}>
            <defs>
              {Object.entries(CHART_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => [formatCurrency(value), SERIES_LABELS[name] || name]}
              contentStyle={{
                background: 'var(--background-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--text-secondary)' }}
            />
            {activeSeries.propertyPremiums && (
              <Area type="monotone" dataKey="propertyPremiums" name="propertyPremiums"
                stroke={CHART_COLORS.propertyPremiums} strokeWidth={2} dot={false}
                fill={`url(#grad-propertyPremiums)`} />
            )}
            {activeSeries.propertyClaims && (
              <Area type="monotone" dataKey="propertyClaims" name="propertyClaims"
                stroke={CHART_COLORS.propertyClaims} strokeWidth={2} dot={false}
                fill={`url(#grad-propertyClaims)`} />
            )}
            {activeSeries.autoPremiums && (
              <Area type="monotone" dataKey="autoPremiums" name="autoPremiums"
                stroke={CHART_COLORS.autoPremiums} strokeWidth={2} dot={false}
                fill={`url(#grad-autoPremiums)`} />
            )}
            {activeSeries.autoClaims && (
              <Area type="monotone" dataKey="autoClaims" name="autoClaims"
                stroke={CHART_COLORS.autoClaims} strokeWidth={2} dot={false}
                fill={`url(#grad-autoClaims)`} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Asset ledger */}
      <div className="modern-ledger">
        <div className="modern-ledger-header">
          <div>
            <h2 className="modern-ledger-header__title">Asset Performance Ledger</h2>
            <p className="modern-ledger-header__sub">Click any row to view full asset details</p>
          </div>
          <div className="modern-sort-controls">
            <span className="modern-sort-label">Sort by</span>
            {[
              { key: 'totalClaims', label: 'Highest Claims' },
              { key: 'dueDate', label: 'Due Date' },
              { key: 'premiumDue', label: 'Premium' },
            ].map((s) => (
              <button
                key={s.key}
                className={`modern-sort-btn ${sortKey === s.key ? 'modern-sort-btn--active' : ''}`}
                onClick={() => setSortKey(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="modern-ledger-table">
          <div className="modern-ledger-thead">
            <span>Asset</span>
            <span>Category</span>
            <span>Premium Due</span>
            <span>Due Date</span>
            <span>Total Claims</span>
          </div>
          {sortedAssets.map((asset) => (
            <div
              key={asset.id}
              className="modern-ledger-row"
              onClick={() => navigate(`/business/financial-dashboard/asset/${asset.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/business/financial-dashboard/asset/${asset.id}`)}
            >
              <div className="modern-ledger-row__asset">
                <span className="modern-ledger-row__name">{asset.name}</span>
                <span className="modern-ledger-row__id">{asset.id}</span>
              </div>
              <div>
                <span className={`modern-cat-badge modern-cat-badge--${asset.category.toLowerCase()}`}>
                  {asset.category}
                </span>
              </div>
              <div className="modern-ledger-row__number">{formatCurrency(asset.premiumDue)}</div>
              <div className="modern-ledger-row__date">{asset.dueDate}</div>
              <div className={`modern-ledger-row__claims ${asset.totalClaims > 20000 ? 'modern-ledger-row__claims--high' : ''}`}>
                {asset.totalClaims === 0 ? (
                  <span className="modern-ledger-row__no-claims">—</span>
                ) : (
                  formatCurrency(asset.totalClaims)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
