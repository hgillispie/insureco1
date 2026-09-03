import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dropdown,
  ContentSwitcher,
  Switch,
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
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import DashboardVariantNav from './DashboardVariantNav';
import {
  financialAssets,
  availableRegions,
  getSummaryStats,
  getMonthlyExpenseSeries,
  formatCurrency,
} from '../../data/financialDashboardData';
import './WildDashboard.scss';

const SERIES = [
  { key: 'Property Premiums', color: 'var(--color-success)', type: 'bar' },
  { key: 'Property Claims', color: 'var(--interactive-primary)', type: 'line' },
  { key: 'Auto Premiums', color: 'var(--color-brand-blue-60)', type: 'bar' },
  { key: 'Auto Claims', color: 'var(--color-warning)', type: 'line' },
];

export default function WildDashboard() {
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
    <div className="wild-dashboard">
      <DashboardVariantNav current="wild" />

      <div className="wild-dashboard__hero">
        <div className="wild-dashboard__hero-blob" />
        <p className="wild-dashboard__kicker">⚡ Live Portfolio Pulse</p>
        <h1 className="wild-dashboard__title">
          Money<span>Moves</span>
        </h1>
        <div className="wild-dashboard__controls">
          <ContentSwitcher
            selectedIndex={view === 'gross' ? 0 : 1}
            onChange={({ index }) => setView(index === 0 ? 'gross' : 'net')}
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
          <Dropdown
            id="wild-region-filter"
            titleText=""
            label="All Regions"
            items={availableRegions}
            selectedItem={region}
            onChange={({ selectedItem }) => setRegion(selectedItem)}
          />
        </div>
      </div>

      <div className="wild-dashboard__kpis">
        <div className="wild-dashboard__kpi wild-dashboard__kpi--owed">
          <p className="wild-dashboard__kpi-label">Total Owed YTD</p>
          <p className="wild-dashboard__kpi-value">{formatCurrency(stats.totalOwed)}</p>
          <div className="wild-dashboard__kpi-split">
            <Tag type="blue">Property {formatCurrency(stats.propertyOwed)}</Tag>
            <Tag type="red">Auto {formatCurrency(stats.autoOwed)}</Tag>
          </div>
        </div>
        <div className="wild-dashboard__kpi wild-dashboard__kpi--claimed">
          <p className="wild-dashboard__kpi-label">Total Claimed YTD</p>
          <p className="wild-dashboard__kpi-value">{formatCurrency(stats.totalClaimed)}</p>
          <div className="wild-dashboard__kpi-split">
            <Tag type="blue">Property {formatCurrency(stats.propertyClaimed)}</Tag>
            <Tag type="red">Auto {formatCurrency(stats.autoClaimed)}</Tag>
          </div>
        </div>
        <div className="wild-dashboard__kpi wild-dashboard__kpi--count">
          <p className="wild-dashboard__kpi-label">Assets Tracked</p>
          <p className="wild-dashboard__kpi-value">{financialAssets.length}</p>
          <div className="wild-dashboard__kpi-split">
            <Tag type="blue">{financialAssets.filter((a) => a.category === 'Property').length} Property</Tag>
            <Tag type="red">{financialAssets.filter((a) => a.category === 'Auto').length} Auto</Tag>
          </div>
        </div>
      </div>

      <div className="wild-dashboard__chart-card">
        <h2 className="wild-dashboard__section-title">The Money Motion Chart</h2>
        <div className="wild-dashboard__series-toggles">
          {SERIES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`wild-dashboard__series-toggle ${
                activeSeries.includes(s.key) ? 'is-active' : ''
              }`}
              style={{ '--series-color': s.color }}
              onClick={() => toggleSeries(s.key)}
            >
              {s.key}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" />
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: 'var(--background-primary)',
                border: '2px solid var(--interactive-primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-primary)',
              }}
              formatter={(value) => formatCurrency(value)}
            />
            {SERIES.filter((s) => activeSeries.includes(s.key)).map((s) =>
              s.type === 'bar' ? (
                <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[8, 8, 0, 0]} />
              ) : (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              )
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="wild-dashboard__table-card">
        <h2 className="wild-dashboard__section-title">Asset Leaderboard</h2>
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
                        className="wild-dashboard__row"
                        onClick={() => navigate(`/dashboard-prototypes/wild/asset/${row.id}`)}
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
