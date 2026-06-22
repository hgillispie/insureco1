import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Dropdown,
  ContentSwitcher,
  Switch,
  Tag,
  Heading,
} from '@carbon/react';
import { ChevronUp, ChevronDown } from '@carbon/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  monthlyChartData,
  assetLedger,
  summaryStats,
  regions,
  formatCurrency,
  formatCurrencyFull,
  formatDate,
} from '../../../data/financialMockData';
import './FinancialDashboardConservative.scss';

const SERIES = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#198038' },
  { key: 'propertyClaims',   label: 'Property Claims',   color: '#da1e28' },
  { key: 'autoPremiums',     label: 'Auto Premiums',     color: '#0f62fe' },
  { key: 'autoClaims',       label: 'Auto Claims',       color: '#ff832b' },
];

const NET_FACTOR = 0.87;

export default function FinancialDashboardConservative() {
  const navigate = useNavigate();
  const [grossNetIdx, setGrossNetIdx] = useState(0);
  const [region, setRegion] = useState('All Regions');
  const [sortKey, setSortKey] = useState('dueDate');
  const [sortDir, setSortDir] = useState('asc');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });

  const factor = grossNetIdx === 1 ? NET_FACTOR : 1;

  const kpis = {
    totalOwed: summaryStats.totalOwedYTD * factor,
    totalClaimed: summaryStats.totalClaimedYTD * factor,
    propertyOwed: summaryStats.propertyOwedYTD * factor,
    autoOwed: summaryStats.autoOwedYTD * factor,
    propertyClaimed: summaryStats.propertyClaimedYTD * factor,
    autoClaimed: summaryStats.autoClaimedYTD * factor,
  };

  const sortedAssets = useMemo(() => {
    return [...assetLedger].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="con-sort-inactive">↕</span>;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const toggleSeries = (key) => setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="con-dashboard">
      {/* Page header */}
      <div className="con-page-header">
        <div>
          <Heading className="con-page-title">Insurance Financial Analytics Dashboard</Heading>
          <p className="con-page-subtitle">Fiscal Year 2024 · Portfolio Overview · {region}</p>
        </div>
        <div className="con-header-controls">
          <Dropdown
            id="con-region"
            label="Region"
            items={regions}
            selectedItem={region}
            onChange={({ selectedItem }) => setRegion(selectedItem)}
            size="sm"
          />
          <ContentSwitcher
            selectedIndex={grossNetIdx}
            onChange={({ index }) => setGrossNetIdx(index)}
            size="sm"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
        </div>
      </div>

      {/* KPI tiles */}
      <Grid fullWidth className="con-kpi-row">
        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Total Premiums Owed (YTD)</p>
            <h2 className="con-kpi-value con-kpi-green">{formatCurrency(kpis.totalOwed)}</h2>
            <div className="con-kpi-split">
              <span><span className="con-dot con-dot-green" />Property: {formatCurrency(kpis.propertyOwed)}</span>
              <span><span className="con-dot con-dot-blue" />Auto: {formatCurrency(kpis.autoOwed)}</span>
            </div>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Total Claims Paid (YTD)</p>
            <h2 className="con-kpi-value con-kpi-red">{formatCurrency(kpis.totalClaimed)}</h2>
            <div className="con-kpi-split">
              <span><span className="con-dot con-dot-green" />Property: {formatCurrency(kpis.propertyClaimed)}</span>
              <span><span className="con-dot con-dot-blue" />Auto: {formatCurrency(kpis.autoClaimed)}</span>
            </div>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Loss Ratio</p>
            <h2 className="con-kpi-value con-kpi-warn">{(summaryStats.lossRatio * 100).toFixed(1)}%</h2>
            <p className="con-kpi-note">Claims ÷ Premiums · Industry avg: 62%</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Active Assets</p>
            <h2 className="con-kpi-value">{summaryStats.activeAssets}</h2>
            <div className="con-kpi-split">
              <span>6 Properties</span>
              <span>6 Vehicles</span>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Trend chart */}
      <div className="con-section">
        <div className="con-section-header">
          <Heading className="con-section-title">Premium &amp; Claims Trends — Monthly 2024</Heading>
          <div className="con-series-toggles">
            {SERIES.map(s => (
              <button
                key={s.key}
                className={`con-series-btn ${activeSeries[s.key] ? 'con-series-btn-on' : ''}`}
                onClick={() => toggleSeries(s.key)}
              >
                <span className="con-series-swatch" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="con-chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `$${v}K`}
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v, name) => [`$${v}K`, name]}
                contentStyle={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              {SERIES.filter(s => activeSeries[s.key]).map(s => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset ledger */}
      <div className="con-section">
        <div className="con-section-header">
          <div>
            <Heading className="con-section-title">Asset Performance Ledger</Heading>
            <p className="con-section-sub">Click any row to view full asset detail</p>
          </div>
        </div>
        <div className="con-table-wrap">
          <table className="con-table">
            <thead>
              <tr>
                <th className="con-th-sortable" onClick={() => handleSort('name')}>
                  Asset <SortIcon col="name" />
                </th>
                <th className="con-th-sortable" onClick={() => handleSort('category')}>
                  Category <SortIcon col="category" />
                </th>
                <th className="con-th-sortable" onClick={() => handleSort('premiumDue')}>
                  Premium Due <SortIcon col="premiumDue" />
                </th>
                <th className="con-th-sortable" onClick={() => handleSort('dueDate')}>
                  Due Date <SortIcon col="dueDate" />
                </th>
                <th className="con-th-sortable" onClick={() => handleSort('totalClaims')}>
                  Total Claims <SortIcon col="totalClaims" />
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map(asset => (
                <tr
                  key={asset.id}
                  className="con-table-row"
                  onClick={() => navigate(`/business/${asset.category === 'Auto' ? 'fleet' : 'properties'}`)}
                >
                  <td>
                    <div className="con-asset-name">{asset.name}</div>
                    <div className="con-asset-id">{asset.id}</div>
                  </td>
                  <td>
                    <Tag type={asset.category === 'Auto' ? 'blue' : 'purple'} size="sm">
                      {asset.category}
                    </Tag>
                  </td>
                  <td className="con-cell-mono">{formatCurrencyFull(asset.premiumDue)}</td>
                  <td>{formatDate(asset.dueDate)}</td>
                  <td className="con-cell-mono con-cell-claims">{formatCurrencyFull(asset.totalClaims)}</td>
                  <td>
                    <Tag type={asset.status === 'Active' ? 'green' : 'red'} size="sm">
                      {asset.status}
                    </Tag>
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
