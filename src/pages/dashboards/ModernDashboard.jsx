import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ContentSwitcher,
  Switch,
  Dropdown,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
} from '@carbon/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import DashboardVariantNav from './DashboardVariantNav';
import {
  financialAssets,
  availableRegions,
  getSummaryStats,
  getMonthlyExpenseSeries,
  formatCurrency,
} from '../../data/financialDashboardData';
import './ModernDashboard.scss';

const SERIES = [
  { key: 'Property Premiums', color: 'var(--color-success)' },
  { key: 'Property Claims', color: 'var(--interactive-primary)' },
  { key: 'Auto Premiums', color: 'var(--color-brand-blue-60)' },
  { key: 'Auto Claims', color: 'var(--color-warning)' },
];

export default function ModernDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState('gross');
  const [region, setRegion] = useState('All Regions');
  const [activeSeries, setActiveSeries] = useState(SERIES.map((s) => s.key));
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => getSummaryStats({ view, region }), [view, region]);
  const chartData = useMemo(() => getMonthlyExpenseSeries(), []);

  const filteredAssets = useMemo(() => {
    let assets =
      region === 'All Regions'
        ? financialAssets
        : financialAssets.filter((a) => a.region === region);
    if (searchTerm) {
      assets = assets.filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return assets;
  }, [region, searchTerm]);

  const headers = [
    { key: 'name', header: 'Asset ID / Name' },
    { key: 'category', header: 'Category' },
    { key: 'premiumDue', header: 'Premium Due' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'totalClaimsAmount', header: 'Total Claims' },
  ];

  const rows = filteredAssets.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    premiumDue: formatCurrency(a.premiumDue),
    dueDate: a.dueDate,
    totalClaimsAmount: formatCurrency(a.totalClaimsAmount),
  }));

  const toggleSeries = (key) => {
    setActiveSeries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="modern-dashboard">
      <DashboardVariantNav current="modern" />

      <div className="modern-dashboard__hero">
        <div>
          <p className="modern-dashboard__eyebrow">Portfolio Analytics</p>
          <h1 className="modern-dashboard__title">Financial Overview</h1>
        </div>
        <div className="modern-dashboard__hero-controls">
          <ContentSwitcher
            selectedIndex={view === 'gross' ? 0 : 1}
            onChange={({ index }) => setView(index === 0 ? 'gross' : 'net')}
            size="md"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
          <Dropdown
            id="modern-region-filter"
            titleText=""
            label="All Regions"
            items={availableRegions}
            selectedItem={region}
            onChange={({ selectedItem }) => setRegion(selectedItem)}
            size="md"
          />
        </div>
      </div>

      <div className="modern-dashboard__kpis">
        <div className="modern-dashboard__kpi-card modern-dashboard__kpi-card--primary">
          <p className="modern-dashboard__kpi-label">Total Owed (YTD)</p>
          <p className="modern-dashboard__kpi-value">{formatCurrency(stats.totalOwed)}</p>
          <div className="modern-dashboard__kpi-split">
            <span>Property {formatCurrency(stats.propertyOwed)}</span>
            <span>Auto {formatCurrency(stats.autoOwed)}</span>
          </div>
        </div>
        <div className="modern-dashboard__kpi-card">
          <p className="modern-dashboard__kpi-label">Total Claimed (YTD)</p>
          <p className="modern-dashboard__kpi-value">{formatCurrency(stats.totalClaimed)}</p>
          <div className="modern-dashboard__kpi-split">
            <span>Property {formatCurrency(stats.propertyClaimed)}</span>
            <span>Auto {formatCurrency(stats.autoClaimed)}</span>
          </div>
        </div>
        <div className="modern-dashboard__kpi-card">
          <p className="modern-dashboard__kpi-label">Property Assets</p>
          <p className="modern-dashboard__kpi-value">
            {financialAssets.filter((a) => a.category === 'Property').length}
          </p>
        </div>
        <div className="modern-dashboard__kpi-card">
          <p className="modern-dashboard__kpi-label">Auto Assets</p>
          <p className="modern-dashboard__kpi-value">
            {financialAssets.filter((a) => a.category === 'Auto').length}
          </p>
        </div>
      </div>

      <div className="modern-dashboard__chart-card">
        <div className="modern-dashboard__chart-header">
          <h2 className="modern-dashboard__section-title">Premiums &amp; Claims Trend</h2>
          <div className="modern-dashboard__series-toggles">
            {SERIES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`modern-dashboard__series-toggle ${
                  activeSeries.includes(s.key) ? 'is-active' : ''
                }`}
                style={{ '--series-color': s.color }}
                onClick={() => toggleSeries(s.key)}
              >
                <span className="modern-dashboard__series-dot" />
                {s.key}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`modern-fill-${s.key.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: 'var(--background-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-primary)',
              }}
              formatter={(value) => formatCurrency(value)}
            />
            {SERIES.filter((s) => activeSeries.includes(s.key)).map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2.5}
                fill={`url(#modern-fill-${s.key.replace(/\s/g, '')})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="modern-dashboard__table-card">
        <h2 className="modern-dashboard__section-title">Asset Performance Ledger</h2>
        <DataTable rows={rows} headers={headers} isSortable>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getToolbarProps,
            onInputChange,
          }) => (
            <TableContainer>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    placeholder="Search assets"
                    onChange={(e) => {
                      onInputChange(e);
                      setSearchTerm(e.target.value || '');
                    }}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      const { key, ...headerProps } = getHeaderProps({ header });
                      return (
                        <TableHeader key={key} {...headerProps}>
                          {header.header}
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
                        className="modern-dashboard__row"
                        onClick={() => navigate(`/dashboard-prototypes/modern/asset/${row.id}`)}
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'category' ? (
                              <Tag type={cell.value === 'Property' ? 'blue' : 'red'}>
                                {cell.value}
                              </Tag>
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
      </div>
    </div>
  );
}
