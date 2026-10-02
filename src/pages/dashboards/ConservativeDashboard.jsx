import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tile,
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
  Button,
} from '@carbon/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import './ConservativeDashboard.scss';

const VIEW_OPTIONS = ['Gross', 'Net'];
const SERIES = [
  { key: 'Property Premiums', color: 'var(--color-success)' },
  { key: 'Property Claims', color: 'var(--interactive-primary)' },
  { key: 'Auto Premiums', color: 'var(--color-brand-blue-60)' },
  { key: 'Auto Claims', color: 'var(--color-warning)' },
];

export default function ConservativeDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState('Gross');
  const [region, setRegion] = useState('All Regions');
  const [activeSeries, setActiveSeries] = useState(SERIES.map((s) => s.key));
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(
    () => getSummaryStats({ view: view.toLowerCase(), region }),
    [view, region]
  );
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
    <div className="conservative-dashboard">
      <DashboardVariantNav current="conservative" />

      <div className="conservative-dashboard__header">
        <h1 className="conservative-dashboard__title">Financial Overview</h1>
        <p className="conservative-dashboard__subtitle">
          Year-to-date premium and claims summary across the Auto and Property portfolio.
        </p>
      </div>

      <div className="conservative-dashboard__filters">
        <Dropdown
          id="view-toggle"
          titleText="View"
          label="Gross"
          items={VIEW_OPTIONS}
          selectedItem={view}
          onChange={({ selectedItem }) => setView(selectedItem)}
        />
        <Dropdown
          id="region-filter"
          titleText="Region"
          label="All Regions"
          items={availableRegions}
          selectedItem={region}
          onChange={({ selectedItem }) => setRegion(selectedItem)}
        />
      </div>

      <div className="conservative-dashboard__kpis">
        <Tile className="conservative-dashboard__kpi-tile">
          <p className="conservative-dashboard__kpi-label">Total Owed (YTD)</p>
          <p className="conservative-dashboard__kpi-value">{formatCurrency(stats.totalOwed)}</p>
          <div className="conservative-dashboard__kpi-split">
            <span>Property: {formatCurrency(stats.propertyOwed)}</span>
            <span>Auto: {formatCurrency(stats.autoOwed)}</span>
          </div>
        </Tile>
        <Tile className="conservative-dashboard__kpi-tile">
          <p className="conservative-dashboard__kpi-label">Total Claimed (YTD)</p>
          <p className="conservative-dashboard__kpi-value conservative-dashboard__kpi-value--claim">
            {formatCurrency(stats.totalClaimed)}
          </p>
          <div className="conservative-dashboard__kpi-split">
            <span>Property: {formatCurrency(stats.propertyClaimed)}</span>
            <span>Auto: {formatCurrency(stats.autoClaimed)}</span>
          </div>
        </Tile>
        <Tile className="conservative-dashboard__kpi-tile">
          <p className="conservative-dashboard__kpi-label">Property Assets</p>
          <p className="conservative-dashboard__kpi-value">
            {financialAssets.filter((a) => a.category === 'Property').length}
          </p>
        </Tile>
        <Tile className="conservative-dashboard__kpi-tile">
          <p className="conservative-dashboard__kpi-label">Auto Assets</p>
          <p className="conservative-dashboard__kpi-value">
            {financialAssets.filter((a) => a.category === 'Auto').length}
          </p>
        </Tile>
      </div>

      <Tile className="conservative-dashboard__chart-tile">
        <h2 className="conservative-dashboard__section-title">Premiums &amp; Claims by Month</h2>
        <div className="conservative-dashboard__series-toggles">
          {SERIES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`conservative-dashboard__series-toggle ${
                activeSeries.includes(s.key) ? 'is-active' : ''
              }`}
              style={{ '--series-color': s.color }}
              onClick={() => toggleSeries(s.key)}
            >
              <span className="conservative-dashboard__series-dot" />
              {s.key}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: 'var(--background-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              formatter={(value) => formatCurrency(value)}
            />
            {SERIES.filter((s) => activeSeries.includes(s.key)).map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Tile>

      <Tile className="conservative-dashboard__table-tile">
        <h2 className="conservative-dashboard__section-title">Asset Performance Ledger</h2>
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
                        className="conservative-dashboard__row"
                        onClick={() => navigate(`/dashboard-prototypes/conservative/asset/${row.id}`)}
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
      </Tile>
    </div>
  );
}
