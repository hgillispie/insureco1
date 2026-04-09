import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tag } from '@carbon/react';
import { Building, CarFront, ArrowRight, View } from '@carbon/icons-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/businessHelpers';
import {
  ytdSummary, filterChartData, applyGrossNet,
  applyGrossNetToChartData, getAssetLedger, portfolioPieData,
} from '../../data/financialMockData';
import './ModernDashboard.scss';

const AREA_COLORS = {
  propertyPremiums: '#24a148',
  propertyClaims:   '#da1e28',
  autoPremiums:     '#0f62fe',
  autoClaims:       '#f59e0b',
};

const SERIES_CONFIG = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: AREA_COLORS.propertyPremiums },
  { key: 'propertyClaims',   label: 'Property Claims',   color: AREA_COLORS.propertyClaims   },
  { key: 'autoPremiums',     label: 'Auto Premiums',     color: AREA_COLORS.autoPremiums     },
  { key: 'autoClaims',       label: 'Auto Claims',       color: AREA_COLORS.autoClaims       },
];

const TIMEFRAME_OPTIONS = [
  { value: '12m', label: '12M' },
  { value: '6m',  label: '6M'  },
  { value: 'ytd', label: 'YTD' },
];

const REGION_OPTIONS = [
  { value: 'all',           label: 'All Regions'    },
  { value: 'bay-area',      label: 'Bay Area'        },
  { value: 'central-valley', label: 'Central Valley' },
  { value: 'northern-ca',   label: 'Northern CA'    },
];

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="mod-tooltip">
      <p className="mod-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="mod-tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span> <strong>{formatCurrency(p.value, false)}</strong>
        </p>
      ))}
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, total }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" className="pie-center-label-top" fill="var(--text-secondary)" fontSize={11}>
      Total Owed
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-primary)" fontSize={16} fontWeight={700}>
      {formatCurrency(total, false)}
    </text>
  </>
);

/**
 * ModernDashboard — Contemporary, data-forward, minimal.
 * Large typography, gradient area charts, floating cards.
 */
export default function ModernDashboard() {
  const navigate = useNavigate();

  const [grossNet, setGrossNet]   = useState('gross');
  const [timeframe, setTimeframe] = useState('12m');
  const [region, setRegion]       = useState('all');
  const [sortField, setSortField] = useState('totalClaims');
  const [sortDir, setSortDir]     = useState('desc');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims:   true,
    autoPremiums:     true,
    autoClaims:       true,
  });

  const assetLedger = useMemo(() => getAssetLedger(), []);

  const kpis = useMemo(() => ({
    totalOwed:       applyGrossNet(ytdSummary.totalOwedGross, grossNet),
    totalClaimed:    ytdSummary.totalClaimedGross,
    propertyOwed:    applyGrossNet(ytdSummary.propertyOwedGross, grossNet),
    propertyClaimed: ytdSummary.propertyClaimedGross,
    autoOwed:        applyGrossNet(ytdSummary.autoOwedGross, grossNet),
    autoClaimed:     ytdSummary.autoClaimedGross,
    lossRatio:       (ytdSummary.totalClaimedGross / applyGrossNet(ytdSummary.totalOwedGross, grossNet) * 100),
  }), [grossNet]);

  const chartData = useMemo(
    () => applyGrossNetToChartData(filterChartData(timeframe), grossNet),
    [timeframe, grossNet],
  );

  const pieData = useMemo(() => [
    { name: 'Property', value: kpis.propertyOwed, color: '#24a148' },
    { name: 'Auto',     value: kpis.autoOwed,     color: '#0f62fe' },
  ], [kpis]);

  const sortedLedger = useMemo(() => {
    return [...assetLedger].sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      if (sortField === 'totalClaims') return dir * (a.totalClaims - b.totalClaims);
      if (sortField === 'premiumDue')  return dir * (a.premiumDue - b.premiumDue);
      return 0;
    });
  }, [assetLedger, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleSeries = (key) =>
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="modern-dashboard">
      {/* ── Filter Bar ── */}
      <div className="mod-filter-bar">
        <div className="mod-pill-group">
          <button
            className={`mod-pill ${grossNet === 'gross' ? 'mod-pill--active' : ''}`}
            onClick={() => setGrossNet('gross')}
          >Gross</button>
          <button
            className={`mod-pill ${grossNet === 'net' ? 'mod-pill--active' : ''}`}
            onClick={() => setGrossNet('net')}
          >Net</button>
        </div>

        <div className="mod-pill-group">
          {TIMEFRAME_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`mod-pill ${timeframe === o.value ? 'mod-pill--active' : ''}`}
              onClick={() => setTimeframe(o.value)}
            >{o.label}</button>
          ))}
        </div>

        <div className="mod-region-select">
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="mod-native-select"
          >
            {REGION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── KPI Metrics ── */}
      <div className="mod-metrics-row">
        <div className="mod-metric-card">
          <p className="mod-metric-label">Total Owed (YTD)</p>
          <p className="mod-metric-value mod-metric-value--owed">
            {formatCurrency(kpis.totalOwed, false)}
          </p>
          <div className="mod-metric-footer">
            <span className="mod-metric-sub mod-metric-sub--property">
              <Building size={12} /> {formatCurrency(kpis.propertyOwed, false)}
            </span>
            <span className="mod-metric-sub mod-metric-sub--auto">
              <CarFront size={12} /> {formatCurrency(kpis.autoOwed, false)}
            </span>
          </div>
        </div>

        <div className="mod-metric-card">
          <p className="mod-metric-label">Total Claimed (YTD)</p>
          <p className="mod-metric-value mod-metric-value--claimed">
            {formatCurrency(kpis.totalClaimed, false)}
          </p>
          <div className="mod-metric-footer">
            <span className="mod-metric-sub mod-metric-sub--property">
              <Building size={12} /> {formatCurrency(kpis.propertyClaimed, false)}
            </span>
            <span className="mod-metric-sub mod-metric-sub--auto">
              <CarFront size={12} /> {formatCurrency(kpis.autoClaimed, false)}
            </span>
          </div>
        </div>

        <div className="mod-metric-card">
          <p className="mod-metric-label">Loss Ratio</p>
          <p className="mod-metric-value mod-metric-value--ratio">
            {kpis.lossRatio.toFixed(1)}%
          </p>
          <p className="mod-metric-note">Claimed / Owed — healthy below 60%</p>
        </div>

        <div className="mod-metric-card mod-metric-card--accent">
          <p className="mod-metric-label">Net Premium Position</p>
          <p className="mod-metric-value mod-metric-value--positive">
            {formatCurrency(kpis.totalOwed - kpis.totalClaimed, false)}
          </p>
          <p className="mod-metric-note">Owed minus claims</p>
        </div>
      </div>

      {/* ── Chart + Portfolio Split ── */}
      <div className="mod-viz-row">
        <div className="mod-chart-card">
          <div className="mod-chart-header">
            <div>
              <h4 className="mod-chart-title">Expense Visualization</h4>
              <p className="mod-chart-subtitle">Premiums &amp; claims over time</p>
            </div>
            <div className="mod-legend">
              {SERIES_CONFIG.map(s => (
                <button
                  key={s.key}
                  className={`mod-legend-item ${!activeSeries[s.key] ? 'mod-legend-item--muted' : ''}`}
                  onClick={() => toggleSeries(s.key)}
                >
                  <span className="mod-legend-dot" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                {SERIES_CONFIG.map(s => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={s.color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(141,141,141,0.15)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#8d8d8d', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: '#8d8d8d', fontSize: 10 }}
                axisLine={false} tickLine={false} width={45}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              {SERIES_CONFIG.map(s =>
                activeSeries[s.key] ? (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    fill={`url(#grad-${s.key})`}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ) : null,
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mod-donut-card">
          <h4 className="mod-chart-title">Portfolio Split</h4>
          <p className="mod-chart-subtitle">By premium owed</p>
          <PieChart width={200} height={200} className="mod-pie-chart">
            <Pie
              data={pieData}
              cx={100}
              cy={100}
              innerRadius={58}
              outerRadius={88}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <CustomPieLabel cx={100} cy={100} total={kpis.totalOwed} />
          </PieChart>
          <div className="mod-pie-legend">
            {pieData.map(d => (
              <div key={d.name} className="mod-pie-legend-row">
                <span className="mod-pie-dot" style={{ background: d.color }} />
                <span className="mod-pie-leg-name">{d.name}</span>
                <span className="mod-pie-leg-value">{formatCurrency(d.value, false)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Asset Ledger ── */}
      <div className="mod-ledger-card">
        <div className="mod-ledger-header">
          <div>
            <h4 className="mod-chart-title">Asset Performance Ledger</h4>
            <p className="mod-chart-subtitle">{sortedLedger.length} assets — click to drill down</p>
          </div>
          <div className="mod-ledger-sort">
            <span className="mod-sort-label">Sort by</span>
            <button
              className={`mod-sort-btn ${sortField === 'totalClaims' ? 'mod-sort-btn--active' : ''}`}
              onClick={() => toggleSort('totalClaims')}
            >Claims {sortField === 'totalClaims' && (sortDir === 'desc' ? '↓' : '↑')}</button>
            <button
              className={`mod-sort-btn ${sortField === 'premiumDue' ? 'mod-sort-btn--active' : ''}`}
              onClick={() => toggleSort('premiumDue')}
            >Premium {sortField === 'premiumDue' && (sortDir === 'desc' ? '↓' : '↑')}</button>
          </div>
        </div>

        <div className="mod-table-wrapper">
          <table className="mod-table">
            <thead>
              <tr>
                <th className="mod-th">Asset</th>
                <th className="mod-th">Type</th>
                <th className="mod-th mod-th--right">Premium / Mo</th>
                <th className="mod-th">Due</th>
                <th className="mod-th mod-th--right">Total Claims</th>
                <th className="mod-th mod-th--center">Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedLedger.map(asset => (
                <tr
                  key={asset.id}
                  className="mod-tr"
                  onClick={() => navigate(`/financial/asset/${asset.id}`)}
                >
                  <td className="mod-td mod-td--name">{asset.name}</td>
                  <td className="mod-td">
                    <span className={`mod-type-badge mod-type-badge--${asset.category.toLowerCase()}`}>
                      {asset.category === 'Property' ? <Building size={11} /> : <CarFront size={11} />}
                      {asset.category}
                    </span>
                  </td>
                  <td className="mod-td mod-td--right mod-td--mono">
                    {formatCurrency(asset.premiumDue)}
                  </td>
                  <td className="mod-td mod-td--muted">Apr 01, 2024</td>
                  <td className={`mod-td mod-td--right mod-td--mono ${asset.totalClaims > 0 ? 'mod-td--claims' : 'mod-td--muted'}`}>
                    {asset.totalClaims > 0 ? formatCurrency(asset.totalClaims) : '—'}
                  </td>
                  <td className="mod-td mod-td--center">
                    <button
                      className="mod-view-btn"
                      onClick={e => { e.stopPropagation(); navigate(`/financial/asset/${asset.id}`); }}
                    >
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
