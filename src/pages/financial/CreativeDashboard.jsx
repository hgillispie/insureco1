import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '@carbon/react';
import { Building, CarFront, TrendingUp, TrendingDown, Launch } from '@carbon/icons-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/businessHelpers';
import {
  ytdSummary, filterChartData, applyGrossNet,
  applyGrossNetToChartData, getAssetLedger,
} from '../../data/financialMockData';
import './CreativeDashboard.scss';

const BAR_COLORS = {
  propertyPremiums: '#24a148',
  propertyClaims:   '#da1e28',
  autoPremiums:     '#0f62fe',
  autoClaims:       '#f59e0b',
};

const TIMEFRAME_OPTIONS = [
  { value: '12m', label: 'Last 12 Months' },
  { value: '6m',  label: 'Last 6 Months'  },
  { value: 'ytd', label: 'YTD'            },
];

const REGION_OPTIONS = [
  { value: 'all',            label: 'All Regions'    },
  { value: 'bay-area',       label: 'Bay Area'       },
  { value: 'central-valley', label: 'Central Valley' },
  { value: 'northern-ca',    label: 'Northern CA'    },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="cre-tooltip">
      <p className="cre-tooltip-title">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="cre-tooltip-row">
          <span className="cre-tooltip-dot" style={{ background: p.fill || p.color }} />
          <span className="cre-tooltip-name">{p.name}:</span>
          <strong className="cre-tooltip-val">{formatCurrency(p.value, false)}</strong>
        </div>
      ))}
    </div>
  );
};

function LossRatioArc({ ratio }) {
  // Semi-circle arc from 0% to 100%, ratio is 0–100
  const clamped = Math.min(Math.max(ratio, 0), 100);
  const angle = (clamped / 100) * 180;
  const r = 80;
  const cx = 110, cy = 100;
  const toRad = d => (d * Math.PI) / 180;
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r * Math.cos(Math.PI - toRad(angle));
  const endY = cy - r * Math.sin(toRad(angle));
  const largeArc = angle > 90 ? 1 : 0;
  const color = clamped < 60 ? '#24a148' : clamped < 80 ? '#f59e0b' : '#da1e28';

  return (
    <svg width="220" height="110" className="cre-arc-svg">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(141,141,141,0.2)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Fill */}
      {clamped > 0 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
        />
      )}
      <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize={28} fontWeight={700}>
        {ratio.toFixed(1)}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(141,141,141,0.8)" fontSize={11}>
        LOSS RATIO
      </text>
      <text x={cx - r} y={cy + 18} fill="rgba(141,141,141,0.7)" fontSize={10}>0%</text>
      <text x={cx + r - 16} y={cy + 18} fill="rgba(141,141,141,0.7)" fontSize={10}>100%</text>
    </svg>
  );
}

/**
 * CreativeDashboard — Bold, unconventional, data-forward.
 * Hero section, arc gauge, grouped bar + line chart, progress-bar table.
 */
export default function CreativeDashboard() {
  const navigate = useNavigate();

  const [grossNet, setGrossNet]   = useState('gross');
  const [timeframe, setTimeframe] = useState('12m');
  const [region, setRegion]       = useState('all');
  const [sortField, setSortField] = useState('totalClaims');
  const [sortDir, setSortDir]     = useState('desc');

  const assetLedger = useMemo(() => getAssetLedger(), []);

  const kpis = useMemo(() => ({
    totalOwed:       applyGrossNet(ytdSummary.totalOwedGross, grossNet),
    totalClaimed:    ytdSummary.totalClaimedGross,
    propertyOwed:    applyGrossNet(ytdSummary.propertyOwedGross, grossNet),
    propertyClaimed: ytdSummary.propertyClaimedGross,
    autoOwed:        applyGrossNet(ytdSummary.autoOwedGross, grossNet),
    autoClaimed:     ytdSummary.autoClaimedGross,
    lossRatio:       (ytdSummary.totalClaimedGross / applyGrossNet(ytdSummary.totalOwedGross, grossNet) * 100),
    netPosition:     applyGrossNet(ytdSummary.totalOwedGross, grossNet) - ytdSummary.totalClaimedGross,
  }), [grossNet]);

  const chartData = useMemo(
    () => applyGrossNetToChartData(filterChartData(timeframe), grossNet),
    [timeframe, grossNet],
  );

  const pieData = useMemo(() => [
    { name: 'Property', value: kpis.propertyOwed,    color: '#24a148' },
    { name: 'Auto',     value: kpis.autoOwed,         color: '#0f62fe' },
    { name: 'Prop Claims', value: kpis.propertyClaimed, color: '#a2191f' },
    { name: 'Auto Claims', value: kpis.autoClaimed,   color: '#b45309' },
  ], [kpis]);

  const sortedLedger = useMemo(() => {
    const maxClaims = Math.max(...assetLedger.map(a => a.totalClaims), 1);
    return [...assetLedger]
      .sort((a, b) => {
        const dir = sortDir === 'desc' ? -1 : 1;
        if (sortField === 'totalClaims') return dir * (a.totalClaims - b.totalClaims);
        if (sortField === 'premiumDue')  return dir * (a.premiumDue - b.premiumDue);
        return 0;
      })
      .map(a => ({ ...a, claimsRatio: a.totalClaims / maxClaims }));
  }, [assetLedger, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div className="creative-dashboard">
      {/* ── HERO BAND ── */}
      <div className="cre-hero">
        <div className="cre-hero-inner">
          <div className="cre-hero-left">
            <p className="cre-hero-eyebrow">Portfolio Health · YTD 2024</p>
            <h2 className="cre-hero-headline">Insurance Financial Overview</h2>
            <p className="cre-hero-desc">
              {kpis.lossRatio < 60 ? 'Portfolio performing well — loss ratio is healthy.' : 'Elevated loss ratio. Review underperforming assets.'}
            </p>
            <div className="cre-hero-filter-row">
              <div className="cre-hero-pills">
                <button
                  className={`cre-hero-pill ${grossNet === 'gross' ? 'cre-hero-pill--active' : ''}`}
                  onClick={() => setGrossNet('gross')}
                >Gross</button>
                <button
                  className={`cre-hero-pill ${grossNet === 'net' ? 'cre-hero-pill--active' : ''}`}
                  onClick={() => setGrossNet('net')}
                >Net</button>
              </div>
              <div className="cre-hero-pills">
                {TIMEFRAME_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    className={`cre-hero-pill ${timeframe === o.value ? 'cre-hero-pill--active' : ''}`}
                    onClick={() => setTimeframe(o.value)}
                  >{o.label}</button>
                ))}
              </div>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="cre-hero-select"
              >
                {REGION_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="cre-hero-gauge">
            <LossRatioArc ratio={kpis.lossRatio} />
            <p className="cre-gauge-caption">
              {kpis.lossRatio < 60 ? 'Below 60% — Profitable' : 'Above 60% — Monitor closely'}
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS BAND ── */}
      <div className="cre-stats-band">
        <div className="cre-stat-item">
          <TrendingUp size={20} className="cre-stat-icon cre-stat-icon--up" />
          <div>
            <p className="cre-stat-label">Total Owed (YTD)</p>
            <p className="cre-stat-val">{formatCurrency(kpis.totalOwed, false)}</p>
          </div>
        </div>
        <div className="cre-stat-divider" />
        <div className="cre-stat-item">
          <TrendingDown size={20} className="cre-stat-icon cre-stat-icon--down" />
          <div>
            <p className="cre-stat-label">Total Claimed (YTD)</p>
            <p className="cre-stat-val">{formatCurrency(kpis.totalClaimed, false)}</p>
          </div>
        </div>
        <div className="cre-stat-divider" />
        <div className="cre-stat-item">
          <Building size={20} className="cre-stat-icon cre-stat-icon--neutral" />
          <div>
            <p className="cre-stat-label">Property Premiums</p>
            <p className="cre-stat-val">{formatCurrency(kpis.propertyOwed, false)}</p>
          </div>
        </div>
        <div className="cre-stat-divider" />
        <div className="cre-stat-item">
          <CarFront size={20} className="cre-stat-icon cre-stat-icon--neutral" />
          <div>
            <p className="cre-stat-label">Auto Premiums</p>
            <p className="cre-stat-val">{formatCurrency(kpis.autoOwed, false)}</p>
          </div>
        </div>
        <div className="cre-stat-divider" />
        <div className="cre-stat-item cre-stat-item--highlight">
          <div>
            <p className="cre-stat-label">Net Position</p>
            <p className="cre-stat-val cre-stat-val--positive">
              +{formatCurrency(kpis.netPosition, false)}
            </p>
          </div>
        </div>
      </div>

      {/* ── CHART + PIE ── */}
      <div className="cre-viz-section">
        <div className="cre-chart-card">
          <h4 className="cre-card-title">Expense Visualization</h4>
          <p className="cre-card-subtitle">Monthly premiums vs claims — all asset categories</p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(141,141,141,0.15)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#8d8d8d', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: '#8d8d8d', fontSize: 10 }}
                axisLine={false} tickLine={false} width={42}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                formatter={v => <span style={{ color: 'var(--text-secondary)' }}>{v}</span>}
              />
              <Bar dataKey="propertyPremiums" name="Property Premiums" fill={BAR_COLORS.propertyPremiums} radius={[2, 2, 0, 0]} maxBarSize={14} />
              <Bar dataKey="propertyClaims"   name="Property Claims"   fill={BAR_COLORS.propertyClaims}   radius={[2, 2, 0, 0]} maxBarSize={14} />
              <Bar dataKey="autoPremiums"     name="Auto Premiums"     fill={BAR_COLORS.autoPremiums}     radius={[2, 2, 0, 0]} maxBarSize={14} />
              <Bar dataKey="autoClaims"       name="Auto Claims"       fill={BAR_COLORS.autoClaims}       radius={[2, 2, 0, 0]} maxBarSize={14} />
              <Line
                type="monotone"
                dataKey={d => d.propertyPremiums + d.autoPremiums}
                name="Total Premiums"
                stroke="#da1e28"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 2"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="cre-pie-card">
          <h4 className="cre-card-title">Portfolio Mix</h4>
          <p className="cre-card-subtitle">Premiums &amp; claims breakdown</p>
          <PieChart width={200} height={200} className="cre-pie-chart">
            <Pie
              data={pieData}
              cx={100}
              cy={100}
              outerRadius={85}
              dataKey="value"
              stroke="none"
              paddingAngle={2}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="cre-pie-legend">
            {pieData.map(d => (
              <div key={d.name} className="cre-pie-row">
                <span className="cre-pie-dot" style={{ background: d.color }} />
                <span className="cre-pie-name">{d.name}</span>
                <span className="cre-pie-value">{formatCurrency(d.value, false)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ASSET LEDGER ── */}
      <div className="cre-ledger-section">
        <div className="cre-ledger-header">
          <div>
            <h4 className="cre-card-title">Asset Performance Ledger</h4>
            <p className="cre-card-subtitle">{sortedLedger.length} assets — bar shows relative claims exposure</p>
          </div>
          <div className="cre-ledger-sort">
            <span className="cre-sort-label">Sort by</span>
            <button
              className={`cre-sort-btn ${sortField === 'totalClaims' ? 'cre-sort-btn--active' : ''}`}
              onClick={() => toggleSort('totalClaims')}
            >Highest Claims {sortField === 'totalClaims' && (sortDir === 'desc' ? '↓' : '↑')}</button>
            <button
              className={`cre-sort-btn ${sortField === 'premiumDue' ? 'cre-sort-btn--active' : ''}`}
              onClick={() => toggleSort('premiumDue')}
            >Due Date {sortField === 'premiumDue' && (sortDir === 'desc' ? '↓' : '↑')}</button>
          </div>
        </div>

        <div className="cre-ledger-grid">
          {sortedLedger.map(asset => (
            <div
              key={asset.id}
              className="cre-asset-card"
              onClick={() => navigate(`/financial/asset/${asset.id}`)}
            >
              <div className="cre-asset-card-header">
                <span className={`cre-cat-badge cre-cat-badge--${asset.category.toLowerCase()}`}>
                  {asset.category === 'Property' ? <Building size={11} /> : <CarFront size={11} />}
                  {asset.category}
                </span>
                <button
                  className="cre-launch-btn"
                  onClick={e => { e.stopPropagation(); navigate(`/financial/asset/${asset.id}`); }}
                >
                  <Launch size={12} />
                </button>
              </div>

              <p className="cre-asset-name">{asset.name}</p>

              <div className="cre-asset-amounts">
                <div className="cre-amount-group">
                  <span className="cre-amount-label">Premium</span>
                  <span className="cre-amount-value">{formatCurrency(asset.premiumDue)}</span>
                </div>
                <div className="cre-amount-group cre-amount-group--claims">
                  <span className="cre-amount-label">Claims</span>
                  <span className={`cre-amount-value ${asset.totalClaims > 0 ? 'cre-amount-value--claims' : 'cre-amount-value--none'}`}>
                    {asset.totalClaims > 0 ? formatCurrency(asset.totalClaims) : 'None'}
                  </span>
                </div>
              </div>

              {asset.totalClaims > 0 && (
                <div className="cre-claims-bar-wrapper">
                  <div className="cre-claims-track">
                    <div
                      className="cre-claims-fill"
                      style={{ width: `${Math.min(asset.claimsRatio * 100, 100)}%` }}
                    />
                  </div>
                  <span className="cre-claims-bar-label">
                    {asset.claimsCount} claim{asset.claimsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
