import React, { useState, useMemo } from 'react';
import {
  Grid, Column, Tile, Heading, Stack, Tag, Button,
  DataTable, Table, TableHead, TableRow, TableHeader,
  TableBody, TableCell, TableContainer, TableToolbar,
  TableToolbarContent, TableToolbarSearch,
  Dropdown, ContentSwitcher, Switch,
} from '@carbon/react';
import { ArrowUp, ArrowDown, CaretSort } from '@carbon/icons-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  monthlyTrendData, assetLedgerData, computeSummaryStats,
  filterAssets, formatCurrency, formatDate, regions,
} from '../../data/financialDashboardData';
import { useNavigate } from 'react-router-dom';
import './FinancialDashboardConservative.scss';

const CHART_COLORS = {
  propertyPremiums: '#24a148',
  propertyClaims: '#da1e28',
  autoPremiums: '#0f62fe',
  autoClaims: '#ff832b',
};

export default function FinancialDashboardConservative() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('gross');
  const [region, setRegion] = useState('All Regions');
  const [sortKey, setSortKey] = useState('totalClaims');
  const [sortDir, setSortDir] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleSeries, setVisibleSeries] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });

  const filteredAssets = useMemo(() => {
    let assets = filterAssets(assetLedgerData, { region });
    if (searchTerm) {
      assets = assets.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return assets;
  }, [region, searchTerm]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredAssets, sortKey, sortDir]);

  const stats = useMemo(() => computeSummaryStats(filteredAssets, viewMode), [filteredAssets, viewMode]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleSeries = (key) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <CaretSort size={16} />;
    return sortDir === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  return (
    <div className="fin-conservative">
      <div className="fin-conservative__header">
        <div className="fin-conservative__header-left">
          <Heading className="fin-conservative__title">Financial Analytics Dashboard</Heading>
          <p className="fin-conservative__subtitle">Insurance Portfolio Overview — Conservative Layout</p>
        </div>
        <div className="fin-conservative__header-right">
          <Button kind="ghost" size="sm" onClick={() => navigate('/financial')}>
            View All Prototypes
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="fin-conservative__filters">
        <ContentSwitcher
          onChange={(e) => setViewMode(e.name)}
          selectedIndex={viewMode === 'gross' ? 0 : 1}
          size="sm"
        >
          <Switch name="gross" text="Gross" />
          <Switch name="net" text="Net" />
        </ContentSwitcher>
        <Dropdown
          id="region-filter"
          label="Region"
          titleText=""
          size="sm"
          items={regions}
          selectedItem={region}
          onChange={({ selectedItem }) => setRegion(selectedItem)}
        />
      </div>

      {/* KPI Cards */}
      <Grid className="fin-conservative__kpi-grid">
        <Column lg={4} md={4} sm={4}>
          <Tile className="fin-conservative__kpi-card">
            <span className="fin-conservative__kpi-label">Total Owed (YTD)</span>
            <span className="fin-conservative__kpi-value fin-conservative__kpi-value--positive">
              {formatCurrency(stats.totalOwed * 12)}
            </span>
            <div className="fin-conservative__kpi-split">
              <Tag type="blue" size="sm">Auto: {formatCurrency(stats.autoOwed * 12)}</Tag>
              <Tag type="teal" size="sm">Property: {formatCurrency(stats.propertyOwed * 12)}</Tag>
            </div>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="fin-conservative__kpi-card">
            <span className="fin-conservative__kpi-label">Total Claimed (YTD)</span>
            <span className="fin-conservative__kpi-value fin-conservative__kpi-value--negative">
              {formatCurrency(stats.totalClaimed)}
            </span>
            <div className="fin-conservative__kpi-split">
              <Tag type="blue" size="sm">Auto: {formatCurrency(stats.autoClaimed)}</Tag>
              <Tag type="teal" size="sm">Property: {formatCurrency(stats.propertyClaimed)}</Tag>
            </div>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="fin-conservative__kpi-card">
            <span className="fin-conservative__kpi-label">Loss Ratio</span>
            <span className={`fin-conservative__kpi-value ${stats.lossRatio > 0.7 ? 'fin-conservative__kpi-value--negative' : 'fin-conservative__kpi-value--positive'}`}>
              {(stats.lossRatio * 100).toFixed(1)}%
            </span>
            <span className="fin-conservative__kpi-helper">Claims / Premiums</span>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="fin-conservative__kpi-card">
            <span className="fin-conservative__kpi-label">Active Assets</span>
            <span className="fin-conservative__kpi-value">{stats.assetCount}</span>
            <div className="fin-conservative__kpi-split">
              <Tag type="blue" size="sm">Auto: {filteredAssets.filter(a => a.category === 'Auto').length}</Tag>
              <Tag type="teal" size="sm">Property: {filteredAssets.filter(a => a.category === 'Property').length}</Tag>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Chart Section */}
      <Tile className="fin-conservative__chart-tile">
        <div className="fin-conservative__chart-header">
          <Heading className="fin-conservative__section-title">Premiums vs. Claims — Monthly Trend</Heading>
          <div className="fin-conservative__chart-legend">
            {Object.entries(CHART_COLORS).map(([key, color]) => (
              <button
                key={key}
                className={`fin-conservative__legend-item ${!visibleSeries[key] ? 'fin-conservative__legend-item--hidden' : ''}`}
                onClick={() => toggleSeries(key)}
              >
                <span className="fin-conservative__legend-swatch" style={{ backgroundColor: color }} />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={monthlyTrendData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'var(--background-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: 4,
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            {visibleSeries.propertyPremiums && <Bar dataKey="propertyPremiums" name="Property Premiums" fill={CHART_COLORS.propertyPremiums} radius={[2, 2, 0, 0]} />}
            {visibleSeries.propertyClaims && <Bar dataKey="propertyClaims" name="Property Claims" fill={CHART_COLORS.propertyClaims} radius={[2, 2, 0, 0]} />}
            {visibleSeries.autoPremiums && <Bar dataKey="autoPremiums" name="Auto Premiums" fill={CHART_COLORS.autoPremiums} radius={[2, 2, 0, 0]} />}
            {visibleSeries.autoClaims && <Bar dataKey="autoClaims" name="Auto Claims" fill={CHART_COLORS.autoClaims} radius={[2, 2, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </Tile>

      {/* Asset Performance Ledger */}
      <Tile className="fin-conservative__table-tile">
        <div className="fin-conservative__table-header">
          <Heading className="fin-conservative__section-title">Asset Performance Ledger</Heading>
          <div className="fin-conservative__table-search">
            <TableToolbarSearch
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              persistent
            />
          </div>
        </div>
        <div className="fin-conservative__table-wrap">
          <table className="fin-conservative__table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  Asset ID <SortIcon column="id" />
                </th>
                <th onClick={() => handleSort('name')}>
                  Asset Name <SortIcon column="name" />
                </th>
                <th onClick={() => handleSort('category')}>
                  Category <SortIcon column="category" />
                </th>
                <th onClick={() => handleSort('premiumDue')}>
                  Premium Due <SortIcon column="premiumDue" />
                </th>
                <th onClick={() => handleSort('dueDate')}>
                  Due Date <SortIcon column="dueDate" />
                </th>
                <th onClick={() => handleSort('totalClaims')}>
                  Total Claims <SortIcon column="totalClaims" />
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map((asset) => (
                <tr key={asset.id} className="fin-conservative__table-row">
                  <td className="fin-conservative__cell-id">{asset.id}</td>
                  <td>{asset.name}</td>
                  <td>
                    <Tag type={asset.category === 'Auto' ? 'blue' : 'teal'} size="sm">
                      {asset.category}
                    </Tag>
                  </td>
                  <td>{formatCurrency(viewMode === 'gross' ? asset.grossPremium : asset.netPremium)}</td>
                  <td>{formatDate(asset.dueDate)}</td>
                  <td className={asset.totalClaims > 50000 ? 'fin-conservative__cell-high-claims' : ''}>
                    {formatCurrency(asset.totalClaims)}
                  </td>
                  <td>
                    <Tag type={asset.status === 'current' ? 'green' : 'red'} size="sm">
                      {asset.status === 'current' ? 'Current' : 'Overdue'}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tile>
    </div>
  );
}
