import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  monthlyChartData,
  assetLedger,
  summaryStats,
  formatCurrency,
  formatCurrencyFull,
  formatDate,
} from '../../../data/financialMockData';
import './FinancialDashboardModern.scss';

const PROPERTY_COLOR = '#8a3ffc';
const AUTO_COLOR     = '#0f62fe';
const PREMIUM_COLOR  = '#198038';
const CLAIMS_COLOR   = '#da1e28';

const donutData = [
  { name: 'Property', value: summaryStats.propertyOwedYTD, color: PROPERTY_COLOR },
  { name: 'Auto',     value: summaryStats.autoOwedYTD,     color: AUTO_COLOR },
];

const NET_FACTOR = 0.87;

export default function FinancialDashboardModern() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('gross');
  const [activeTab, setActiveTab] = useState('all');

  const factor = viewMode === 'net' ? NET_FACTOR : 1;

  const filtered = useMemo(() => {
    if (activeTab === 'all') return assetLedger;
    return assetLedger.filter(a => a.category.toLowerCase() === activeTab);
  }, [activeTab]);

  const lossRatio = (summaryStats.lossRatio * 100).toFixed(1);
  const isFavorable = summaryStats.lossRatio < 0.6;

  return (
    <div className="mod-dashboard">
      {/* Hero KPI strip */}
      <div className="mod-hero">
        <div className="mod-hero-context">
          <div className="mod-hero-eyebrow">IFAD · FY 2024 · Insurance Financial Analytics</div>
          <div className="mod-gn-toggle">
            <button
              className={`mod-gn-btn ${viewMode === 'gross' ? 'mod-gn-active' : ''}`}
              onClick={() => setViewMode('gross')}
            >
              Gross
            </button>
            <button
              className={`mod-gn-btn ${viewMode === 'net' ? 'mod-gn-active' : ''}`}
              onClick={() => setViewMode('net')}
            >
              Net
            </button>
          </div>
        </div>
        <div className="mod-kpis">
          <div className="mod-kpi">
            <div className="mod-kpi-number mod-kpi-green">{formatCurrency(summaryStats.totalOwedYTD * factor)}</div>
            <div className="mod-kpi-label">Total Premiums</div>
            <div className="mod-kpi-sub">Year-to-date</div>
          </div>
          <div className="mod-kpi-divider" />
          <div className="mod-kpi">
            <div className="mod-kpi-number mod-kpi-red">{formatCurrency(summaryStats.totalClaimedYTD * factor)}</div>
            <div className="mod-kpi-label">Total Claims</div>
            <div className="mod-kpi-sub">Year-to-date</div>
          </div>
          <div className="mod-kpi-divider" />
          <div className="mod-kpi">
            <div className={`mod-kpi-number ${isFavorable ? 'mod-kpi-green' : 'mod-kpi-red'}`}>{lossRatio}%</div>
            <div className="mod-kpi-label">Loss Ratio</div>
            <div className="mod-kpi-sub">{isFavorable ? 'Favorable' : 'Elevated'} · avg 62%</div>
          </div>
          <div className="mod-kpi-divider" />
          <div className="mod-kpi">
            <div className="mod-kpi-number mod-kpi-blue">{summaryStats.activeAssets}</div>
            <div className="mod-kpi-label">Active Assets</div>
            <div className="mod-kpi-sub">6 Property · 6 Auto</div>
          </div>
        </div>
      </div>

      {/* Chart row */}
      <div className="mod-chart-row">
        {/* Area chart */}
        <div className="mod-card mod-card-lg">
          <div className="mod-card-header">
            <h3 className="mod-card-title">Premium &amp; Claims Trends</h3>
            <span className="mod-card-meta">Monthly · 2024</span>
          </div>
          <ResponsiveContainer width="100%" height={268}>
            <AreaChart data={monthlyChartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gPropPrem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PROPERTY_COLOR} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={PROPERTY_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAutoPrem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={AUTO_COLOR} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={AUTO_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPropClaim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CLAIMS_COLOR} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CLAIMS_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAutoClaim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ff832b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff832b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}K`} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v, name) => [`$${v}K`, name.replace(/([A-Z])/g, ' $1').trim()]}
                contentStyle={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="propertyPremiums" name="Property Premiums" stroke={PROPERTY_COLOR} fill="url(#gPropPrem)" strokeWidth={2} />
              <Area type="monotone" dataKey="autoPremiums"     name="Auto Premiums"     stroke={AUTO_COLOR}     fill="url(#gAutoPrem)" strokeWidth={2} />
              <Area type="monotone" dataKey="propertyClaims"   name="Property Claims"   stroke={CLAIMS_COLOR}   fill="url(#gPropClaim)" strokeWidth={1.5} strokeDasharray="5 3" />
              <Area type="monotone" dataKey="autoClaims"       name="Auto Claims"       stroke="#ff832b"        fill="url(#gAutoClaim)" strokeWidth={1.5} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="mod-card mod-card-sm">
          <div className="mod-card-header">
            <h3 className="mod-card-title">Portfolio Split</h3>
            <span className="mod-card-meta">By Premium Volume</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%" cy="50%"
                innerRadius={58}
                outerRadius={85}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip
                formatter={v => [formatCurrency(v * factor)]}
                contentStyle={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mod-donut-legend">
            {donutData.map(d => (
              <div key={d.name} className="mod-legend-item">
                <span className="mod-legend-dot" style={{ background: d.color }} />
                <div>
                  <div className="mod-legend-name">{d.name}</div>
                  <div className="mod-legend-value">{formatCurrency(d.value * factor)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset ledger */}
      <div className="mod-ledger">
        <div className="mod-ledger-header">
          <h3 className="mod-card-title">Asset Performance Ledger</h3>
          <div className="mod-tabs">
            {['all', 'property', 'auto'].map(tab => (
              <button
                key={tab}
                className={`mod-tab ${activeTab === tab ? 'mod-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? 'All Assets' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mod-table">
          <div className="mod-table-head">
            <span>Asset</span>
            <span>Premium Due</span>
            <span>Due Date</span>
            <span>Total Claims</span>
            <span>Status</span>
          </div>
          {filtered.map(asset => (
            <div
              key={asset.id}
              className="mod-table-row"
              onClick={() => navigate(`/business/${asset.category === 'Auto' ? 'fleet' : 'properties'}`)}
            >
              <div className="mod-asset-cell">
                <span
                  className="mod-category-bar"
                  style={{ background: asset.category === 'Auto' ? AUTO_COLOR : PROPERTY_COLOR }}
                />
                <div>
                  <div className="mod-asset-name">{asset.name}</div>
                  <div className="mod-asset-id">{asset.id}</div>
                </div>
              </div>
              <div className="mod-val">{formatCurrencyFull(asset.premiumDue)}</div>
              <div className="mod-secondary">{formatDate(asset.dueDate)}</div>
              <div className="mod-claims">{formatCurrencyFull(asset.totalClaims)}</div>
              <div>
                <span className={`mod-badge mod-badge-${asset.status.toLowerCase()}`}>
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
