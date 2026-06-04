import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Column, Tile, ContentSwitcher, Switch,
  DataTable, TableContainer, Table, TableHead, TableRow,
  TableHeader, TableBody, TableCell, Tag, Button,
} from '@carbon/react';
import { ArrowLeft, ArrowUp, ArrowDown } from '@carbon/icons-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  chartData, assets, kpiData, formatCurrency, formatCurrencyShort,
  CHART_COLORS, SERIES_LABELS,
} from '../../data/financialData';
import './FinancialDashboardConservative.scss';

const TABLE_HEADERS = [
  { key: 'name', header: 'Asset Name' },
  { key: 'category', header: 'Category' },
  { key: 'premiumDue', header: 'Premium Due' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Total Claims' },
];

export default function FinancialDashboardConservative() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('gross');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });

  const kpi = kpiData[mode];

  const toggleSeries = (key) =>
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));

  const tableRows = assets.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    premiumDue: formatCurrency(a.premiumDue),
    dueDate: a.dueDate,
    totalClaims: formatCurrency(a.totalClaims),
  }));

  const lossRatioPct = (kpi.lossRatio * 100).toFixed(1);
  const isHealthy = kpi.lossRatio < 0.6;

  return (
    <div className="conservative-dashboard">
      <div className="cons-header">
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          size="sm"
          onClick={() => navigate('/business/financial-dashboard')}
        >
          All Dashboards
        </Button>
        <div className="cons-header__center">
          <h1 className="cons-header__title">Financial Analytics Dashboard</h1>
          <p className="cons-header__subtitle">Insurance Portfolio Overview — 2025 Year-to-Date</p>
        </div>
        <ContentSwitcher
          className="cons-mode-switcher"
          onChange={(e) => setMode(e.name)}
          selectedIndex={mode === 'gross' ? 0 : 1}
          size="sm"
        >
          <Switch name="gross" text="Gross" />
          <Switch name="net" text="Net" />
        </ContentSwitcher>
      </div>

      <Grid fullWidth className="cons-grid">
        {/* KPI Cards */}
        <Column lg={4} md={4} sm={4}>
          <Tile className="cons-kpi-tile cons-kpi-tile--primary">
            <p className="cons-kpi-tile__label">Total Owed (YTD)</p>
            <p className="cons-kpi-tile__value">{formatCurrencyShort(kpi.totalOwedYTD)}</p>
            <p className="cons-kpi-tile__detail">{formatCurrency(kpi.totalOwedYTD)}</p>
            <p className="cons-kpi-tile__meta">All premiums due</p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="cons-kpi-tile cons-kpi-tile--claims">
            <p className="cons-kpi-tile__label">Total Claimed (YTD)</p>
            <p className="cons-kpi-tile__value">{formatCurrencyShort(kpi.totalClaimedYTD)}</p>
            <p className="cons-kpi-tile__detail">{formatCurrency(kpi.totalClaimedYTD)}</p>
            <span className={`cons-loss-ratio ${isHealthy ? 'healthy' : 'at-risk'}`}>
              {isHealthy ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
              Loss ratio: {lossRatioPct}%
            </span>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="cons-kpi-tile cons-kpi-tile--auto">
            <p className="cons-kpi-tile__label">Auto Portfolio</p>
            <p className="cons-kpi-tile__value">{formatCurrencyShort(kpi.autoOwedYTD)}</p>
            <p className="cons-kpi-tile__detail">Premiums due</p>
            <p className="cons-kpi-tile__meta cons-kpi-tile__meta--claims">
              Claims: {formatCurrency(kpi.autoClaimedYTD)}
            </p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="cons-kpi-tile cons-kpi-tile--property">
            <p className="cons-kpi-tile__label">Property Portfolio</p>
            <p className="cons-kpi-tile__value">{formatCurrencyShort(kpi.propertyOwedYTD)}</p>
            <p className="cons-kpi-tile__detail">Premiums due</p>
            <p className="cons-kpi-tile__meta cons-kpi-tile__meta--claims">
              Claims: {formatCurrency(kpi.propertyClaimedYTD)}
            </p>
          </Tile>
        </Column>

        {/* Chart */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="cons-chart-tile">
            <div className="cons-chart-header">
              <div>
                <h2 className="cons-chart-header__title">Premium & Claims Trends</h2>
                <p className="cons-chart-header__subtitle">Monthly breakdown, Jan–Dec 2025</p>
              </div>
              <div className="cons-series-toggles">
                {Object.entries(SERIES_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`cons-series-btn ${activeSeries[key] ? 'cons-series-btn--active' : 'cons-series-btn--inactive'}`}
                    style={{ '--s-color': CHART_COLORS[key] }}
                    onClick={() => toggleSeries(key)}
                    aria-pressed={activeSeries[key]}
                  >
                    <span className="cons-series-btn__dot" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), SERIES_LABELS[name] || name]}
                  contentStyle={{
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                {activeSeries.propertyPremiums && (
                  <Bar dataKey="propertyPremiums" name="propertyPremiums" fill={CHART_COLORS.propertyPremiums} radius={[2, 2, 0, 0]} maxBarSize={14} />
                )}
                {activeSeries.propertyClaims && (
                  <Bar dataKey="propertyClaims" name="propertyClaims" fill={CHART_COLORS.propertyClaims} radius={[2, 2, 0, 0]} maxBarSize={14} />
                )}
                {activeSeries.autoPremiums && (
                  <Bar dataKey="autoPremiums" name="autoPremiums" fill={CHART_COLORS.autoPremiums} radius={[2, 2, 0, 0]} maxBarSize={14} />
                )}
                {activeSeries.autoClaims && (
                  <Bar dataKey="autoClaims" name="autoClaims" fill={CHART_COLORS.autoClaims} radius={[2, 2, 0, 0]} maxBarSize={14} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </Tile>
        </Column>

        {/* Asset Performance Ledger */}
        <Column lg={16} md={8} sm={4}>
          <DataTable rows={tableRows} headers={TABLE_HEADERS} isSortable>
            {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
              <TableContainer
                title="Asset Performance Ledger"
                description="Sortable by any column. Click a row to view full asset details and claim history."
              >
                <Table {...getTableProps()} size="lg">
                  <TableHead>
                    <TableRow>
                      {headers.map((h) => {
                        const { key, ...headerProps } = getHeaderProps({ header: h });
                        return (
                          <TableHeader key={key} {...headerProps}>
                            {h.header}
                          </TableHeader>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const { key, ...rowProps } = getRowProps({ row });
                      return (
                      <TableRow
                        key={key}
                        {...rowProps}
                        onClick={() => navigate(`/business/financial-dashboard/asset/${row.id}`)}
                        className="cons-clickable-row"
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'category' ? (
                              <Tag type={cell.value === 'Auto' ? 'blue' : 'green'} size="sm">
                                {cell.value}
                              </Tag>
                            ) : cell.info.header === 'totalClaims' && cell.value === '$0' ? (
                              <span className="cons-no-claims">No claims</span>
                            ) : (
                              cell.value
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Column>
      </Grid>
    </div>
  );
}
