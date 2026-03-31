import React, { useState, useMemo } from 'react';
import {
  Grid, Column, Tile, Heading, Tag, Button,
  ContentSwitcher, Switch, Dropdown, Tabs, TabList, Tab,
  TabPanels, TabPanel,
} from '@carbon/react';
import {
  ArrowUp, ArrowDown, CaretSort, ArrowRight,
  Finance, ChartLineData, Portfolio, WarningAlt,
} from '@carbon/icons-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  monthlyTrendData, assetLedgerData, computeSummaryStats,
  filterAssets, formatCurrency, formatDate, regions,
} from '../../data/financialDashboardData';
import { useNavigate } from 'react-router-dom';
import './FinancialDashboardModern.scss';

const SERIES_CONFIG = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#24a148' },
  { key: 'propertyClaims', label: 'Property Claims', color: '#da1e28' },
  { key: 'autoPremiums', label: 'Auto Premiums', color: '#0f62fe' },
  { key: 'autoClaims', label: 'Auto Claims', color: '#ff832b' },
];

function KPICard({ icon: Icon, label, value, change, changeType, children }) {
  return (
    <div className="fin-modern__kpi-card">
      <div className="fin-modern__kpi-icon-wrap">
        <Icon size={20} />
      </div>
      <span className="fin-modern__kpi-label">{label}</span>
      <span className="fin-modern__kpi-value">{value}</span>
      {change && (
        <span className={`fin-modern__kpi-change fin-modern__kpi-change--${changeType}`}>
          {changeType === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {change}
        </span>
      )}
      {children}
    </div>
  );
}

export default function FinancialDashboardModern() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('gross');
  const [region, setRegion] = useState('All Regions');
  const [chartTab, setChartTab] = useState(0);
  const [sortKey, setSortKey] = useState('totalClaims');
  const [sortDir, setSortDir] = useState('desc');

  const filteredAssets = useMemo(() => filterAssets(assetLedgerData, { region }), [region]);
  const stats = useMemo(() => computeSummaryStats(filteredAssets, viewMode), [filteredAssets, viewMode]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredAssets, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <CaretSort size={14} />;
    return sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  // Chart data filtered by tab
  const chartPremiumData = monthlyTrendData.map(d => ({
    month: d.month,
    property: d.propertyPremiums,
    auto: d.autoPremiums,
  }));

  const chartClaimsData = monthlyTrendData.map(d => ({
    month: d.month,
    property: d.propertyClaims,
    auto: d.autoClaims,
  }));

  return (
    <div className="fin-modern">
      {/* Header */}
      <div className="fin-modern__header">
        <div>
          <Heading className="fin-modern__title">Financial Analytics</Heading>
          <p className="fin-modern__subtitle">Modern Sleek Layout</p>
        </div>
        <div className="fin-modern__header-actions">
          <ContentSwitcher
            onChange={(e) => setViewMode(e.name)}
            selectedIndex={viewMode === 'gross' ? 0 : 1}
            size="sm"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
          <Dropdown
            id="region-modern"
            label="Region"
            size="sm"
            items={regions}
            selectedItem={region}
            onChange={({ selectedItem }) => setRegion(selectedItem)}
          />
          <Button kind="ghost" size="sm" onClick={() => navigate('/financial')}>
            All Prototypes
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="fin-modern__kpi-row">
        <KPICard
          icon={Finance}
          label="Total Owed (YTD)"
          value={formatCurrency(stats.totalOwed * 12)}
          change="+8.2%"
          changeType="up"
        />
        <KPICard
          icon={WarningAlt}
          label="Total Claimed (YTD)"
          value={formatCurrency(stats.totalClaimed)}
          change="+3.1%"
          changeType="up"
        />
        <KPICard
          icon={ChartLineData}
          label="Loss Ratio"
          value={`${(stats.lossRatio * 100).toFixed(1)}%`}
          change="-1.4%"
          changeType="down"
        />
        <KPICard
          icon={Portfolio}
          label="Portfolio Split"
          value={`${stats.assetCount} Assets`}
        >
          <div className="fin-modern__kpi-bar">
            <div
              className="fin-modern__kpi-bar-fill fin-modern__kpi-bar-fill--auto"
              style={{ width: `${(filteredAssets.filter(a => a.category === 'Auto').length / stats.assetCount) * 100}%` }}
            />
          </div>
          <div className="fin-modern__kpi-bar-labels">
            <span>Auto {filteredAssets.filter(a => a.category === 'Auto').length}</span>
            <span>Property {filteredAssets.filter(a => a.category === 'Property').length}</span>
          </div>
        </KPICard>
      </div>

      {/* Chart with Tabs */}
      <div className="fin-modern__chart-section">
        <Tabs selectedIndex={chartTab} onChange={({ selectedIndex }) => setChartTab(selectedIndex)}>
          <div className="fin-modern__chart-top">
            <Heading className="fin-modern__section-title">Trend Analysis</Heading>
            <TabList aria-label="Chart tabs" contained>
              <Tab>Premiums</Tab>
              <Tab>Claims</Tab>
              <Tab>Combined</Tab>
            </TabList>
          </div>
          <TabPanels>
            <TabPanel>
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={chartPremiumData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradProp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#24a148" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#24a148" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAuto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f62fe" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 8 }} labelStyle={{ color: 'var(--text-primary)' }} />
                  <Area type="monotone" dataKey="property" name="Property" stroke="#24a148" fill="url(#gradProp)" strokeWidth={2} />
                  <Area type="monotone" dataKey="auto" name="Auto" stroke="#0f62fe" fill="url(#gradAuto)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </TabPanel>
            <TabPanel>
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={chartClaimsData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPropCl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#da1e28" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#da1e28" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAutoCl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff832b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff832b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 8 }} labelStyle={{ color: 'var(--text-primary)' }} />
                  <Area type="monotone" dataKey="property" name="Property" stroke="#da1e28" fill="url(#gradPropCl)" strokeWidth={2} />
                  <Area type="monotone" dataKey="auto" name="Auto" stroke="#ff832b" fill="url(#gradAutoCl)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </TabPanel>
            <TabPanel>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={monthlyTrendData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 8 }} labelStyle={{ color: 'var(--text-primary)' }} />
                  {SERIES_CONFIG.map(s => (
                    <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* Asset Table */}
      <div className="fin-modern__table-section">
        <Heading className="fin-modern__section-title">Asset Performance Ledger</Heading>
        <div className="fin-modern__table-wrap">
          <table className="fin-modern__table">
            <thead>
              <tr>
                {[
                  { key: 'name', label: 'Asset' },
                  { key: 'category', label: 'Type' },
                  { key: 'premiumDue', label: 'Premium Due' },
                  { key: 'dueDate', label: 'Due Date' },
                  { key: 'totalClaims', label: 'Total Claims' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    {col.label} <SortIcon column={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map(asset => (
                <tr key={asset.id} className="fin-modern__table-row">
                  <td>
                    <div className="fin-modern__asset-name">{asset.name}</div>
                    <div className="fin-modern__asset-id">{asset.id}</div>
                  </td>
                  <td>
                    <span className={`fin-modern__type-badge fin-modern__type-badge--${asset.category.toLowerCase()}`}>
                      {asset.category}
                    </span>
                  </td>
                  <td className="fin-modern__cell-currency">
                    {formatCurrency(viewMode === 'gross' ? asset.grossPremium : asset.netPremium)}
                  </td>
                  <td>{formatDate(asset.dueDate)}</td>
                  <td className={`fin-modern__cell-currency ${asset.totalClaims > 50000 ? 'fin-modern__cell-warning' : ''}`}>
                    {formatCurrency(asset.totalClaims)}
                  </td>
                  <td>
                    <span className={`fin-modern__status-dot fin-modern__status-dot--${asset.status}`} />
                    {asset.status === 'current' ? 'Current' : 'Overdue'}
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
