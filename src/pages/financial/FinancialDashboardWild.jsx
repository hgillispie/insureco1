import React, { useState, useMemo } from 'react';
import {
  Heading, Tag, Button, ContentSwitcher, Switch, Dropdown,
} from '@carbon/react';
import {
  ArrowUp, ArrowDown, CaretSort, Flame, Trophy, WarningHex,
  CircleFilled,
} from '@carbon/icons-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar,
} from 'recharts';
import {
  monthlyTrendData, assetLedgerData, computeSummaryStats,
  filterAssets, formatCurrency, formatDate, regions,
} from '../../data/financialDashboardData';
import { useNavigate } from 'react-router-dom';
import './FinancialDashboardWild.scss';

const PIE_COLORS = ['#0f62fe', '#da1e28', '#24a148', '#ff832b', '#8a3ffc', '#009d9a'];

function MiniSparkline({ data, dataKey, color }) {
  return (
    <ResponsiveContainer width={80} height={28}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function FinancialDashboardWild() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('gross');
  const [region, setRegion] = useState('All Regions');
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

  // Donut data
  const categoryPieData = [
    { name: 'Auto Premiums', value: stats.autoOwed * 12 },
    { name: 'Auto Claims', value: stats.autoClaimed },
    { name: 'Property Premiums', value: stats.propertyOwed * 12 },
    { name: 'Property Claims', value: stats.propertyClaimed },
  ];

  // Top claimants for bar ranking
  const topClaimants = [...filteredAssets]
    .sort((a, b) => b.totalClaims - a.totalClaims)
    .slice(0, 5);
  const maxClaim = topClaimants[0]?.totalClaims || 1;

  // Gauge data for loss ratio
  const lossPercent = Math.min(stats.lossRatio * 100, 100);
  const gaugeData = [
    { name: 'Loss', value: lossPercent, fill: lossPercent > 70 ? '#da1e28' : lossPercent > 50 ? '#ff832b' : '#24a148' },
  ];

  // Combined sparkline data per asset
  const sparklineByAsset = (assetCategory) => {
    if (assetCategory === 'Auto') {
      return monthlyTrendData.map(d => ({ v: d.autoClaims }));
    }
    return monthlyTrendData.map(d => ({ v: d.propertyClaims }));
  };

  return (
    <div className="fin-wild">
      {/* Header */}
      <div className="fin-wild__header">
        <div className="fin-wild__header-left">
          <Heading className="fin-wild__title">IFAD</Heading>
          <p className="fin-wild__subtitle">Insurance Financial Analytics — Creative Layout</p>
        </div>
        <div className="fin-wild__header-right">
          <ContentSwitcher
            onChange={(e) => setViewMode(e.name)}
            selectedIndex={viewMode === 'gross' ? 0 : 1}
            size="sm"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
          <Dropdown
            id="region-wild"
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

      {/* Top row: Big numbers + gauge + donut */}
      <div className="fin-wild__hero-grid">
        {/* Big KPIs */}
        <div className="fin-wild__hero-kpi">
          <div className="fin-wild__big-stat">
            <span className="fin-wild__big-label">Total Owed</span>
            <span className="fin-wild__big-value fin-wild__big-value--green">
              {formatCurrency(stats.totalOwed * 12)}
            </span>
            <div className="fin-wild__big-breakdown">
              <span><CircleFilled size={10} style={{ color: '#0f62fe' }} /> Auto {formatCurrency(stats.autoOwed * 12)}</span>
              <span><CircleFilled size={10} style={{ color: '#009d9a' }} /> Property {formatCurrency(stats.propertyOwed * 12)}</span>
            </div>
          </div>
          <div className="fin-wild__big-stat">
            <span className="fin-wild__big-label">Total Claimed</span>
            <span className="fin-wild__big-value fin-wild__big-value--red">
              {formatCurrency(stats.totalClaimed)}
            </span>
            <div className="fin-wild__big-breakdown">
              <span><CircleFilled size={10} style={{ color: '#ff832b' }} /> Auto {formatCurrency(stats.autoClaimed)}</span>
              <span><CircleFilled size={10} style={{ color: '#da1e28' }} /> Property {formatCurrency(stats.propertyClaimed)}</span>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div className="fin-wild__gauge-card">
          <span className="fin-wild__gauge-label">Loss Ratio</span>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              barSize={14}
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'var(--background-secondary)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <span className="fin-wild__gauge-value">{lossPercent.toFixed(1)}%</span>
        </div>

        {/* Donut */}
        <div className="fin-wild__donut-card">
          <span className="fin-wild__donut-label">Portfolio Mix</span>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryPieData}
                cx="50%" cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="fin-wild__donut-legend">
            {categoryPieData.map((d, i) => (
              <span key={d.name} className="fin-wild__donut-legend-item">
                <CircleFilled size={8} style={{ color: PIE_COLORS[i] }} /> {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main chart — full width stacked area */}
      <div className="fin-wild__chart-section">
        <Heading className="fin-wild__section-title">Revenue & Claims Flow</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrendData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="wGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#24a148" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#24a148" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="wGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f62fe" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#0f62fe" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="wGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#da1e28" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#da1e28" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="wGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff832b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ff832b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 8 }} labelStyle={{ color: 'var(--text-primary)' }} />
            <Area type="monotone" dataKey="propertyPremiums" name="Property Premiums" stroke="#24a148" fill="url(#wGrad1)" strokeWidth={2} />
            <Area type="monotone" dataKey="autoPremiums" name="Auto Premiums" stroke="#0f62fe" fill="url(#wGrad2)" strokeWidth={2} />
            <Area type="monotone" dataKey="propertyClaims" name="Property Claims" stroke="#da1e28" fill="url(#wGrad3)" strokeWidth={2} />
            <Area type="monotone" dataKey="autoClaims" name="Auto Claims" stroke="#ff832b" fill="url(#wGrad4)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Top Claimants + Table */}
      <div className="fin-wild__bottom-grid">
        {/* Top Claimants sidebar */}
        <div className="fin-wild__top-claimants">
          <Heading className="fin-wild__section-title">Highest Claims</Heading>
          <div className="fin-wild__claimant-list">
            {topClaimants.map((asset, i) => (
              <div key={asset.id} className="fin-wild__claimant-item">
                <div className="fin-wild__claimant-rank">
                  {i === 0 ? <Flame size={16} style={{ color: '#da1e28' }} /> : <span className="fin-wild__rank-num">{i + 1}</span>}
                </div>
                <div className="fin-wild__claimant-info">
                  <span className="fin-wild__claimant-name">{asset.name}</span>
                  <span className="fin-wild__claimant-amount">{formatCurrency(asset.totalClaims)}</span>
                </div>
                <div className="fin-wild__claimant-bar">
                  <div
                    className="fin-wild__claimant-bar-fill"
                    style={{ width: `${(asset.totalClaims / maxClaim) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset table with sparklines */}
        <div className="fin-wild__table-section">
          <Heading className="fin-wild__section-title">Asset Ledger</Heading>
          <div className="fin-wild__table-wrap">
            <table className="fin-wild__table">
              <thead>
                <tr>
                  {[
                    { key: 'name', label: 'Asset' },
                    { key: 'category', label: 'Type' },
                    { key: 'premiumDue', label: 'Premium' },
                    { key: 'dueDate', label: 'Due' },
                    { key: 'totalClaims', label: 'Claims' },
                  ].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)}>
                      {col.label} <SortIcon column={col.key} />
                    </th>
                  ))}
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map(asset => (
                  <tr key={asset.id} className="fin-wild__table-row">
                    <td>
                      <span className="fin-wild__asset-name">{asset.name}</span>
                    </td>
                    <td>
                      <Tag type={asset.category === 'Auto' ? 'blue' : 'teal'} size="sm">
                        {asset.category}
                      </Tag>
                    </td>
                    <td className="fin-wild__cell-mono">
                      {formatCurrency(viewMode === 'gross' ? asset.grossPremium : asset.netPremium)}
                    </td>
                    <td>{formatDate(asset.dueDate)}</td>
                    <td className={`fin-wild__cell-mono ${asset.totalClaims > 50000 ? 'fin-wild__cell-danger' : ''}`}>
                      {formatCurrency(asset.totalClaims)}
                    </td>
                    <td>
                      <MiniSparkline
                        data={sparklineByAsset(asset.category)}
                        dataKey="v"
                        color={asset.category === 'Auto' ? '#0f62fe' : '#009d9a'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
