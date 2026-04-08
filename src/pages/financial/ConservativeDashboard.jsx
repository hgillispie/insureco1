import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Column, Tile,
  ContentSwitcher, Switch,
  Select, SelectItem,
  Tag, Button, Checkbox,
} from '@carbon/react';
import { Building, CarFront, View } from '@carbon/icons-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/businessHelpers';
import {
  ytdSummary, filterChartData, applyGrossNet,
  applyGrossNetToChartData, getAssetLedger,
} from '../../data/financialMockData';
import './ConservativeDashboard.scss';

const SERIES = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#24a148' },
  { key: 'propertyClaims',   label: 'Property Claims',   color: '#da1e28' },
  { key: 'autoPremiums',     label: 'Auto Premiums',     color: '#0f62fe' },
  { key: 'autoClaims',       label: 'Auto Claims',       color: '#f1c21b' },
];

/**
 * ConservativeDashboard — Standard IBM Carbon Design System approach.
 * Clean, structured, professional. Familiar to any enterprise user.
 */
export default function ConservativeDashboard() {
  const navigate = useNavigate();

  const [grossNet, setGrossNet]   = useState('gross');
  const [timeframe, setTimeframe] = useState('12m');
  const [region, setRegion]       = useState('all');
  const [sortField, setSortField] = useState('totalClaims');
  const [sortDir, setSortDir]     = useState('desc');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims:   true,
    autoPremiums:     true,
    autoClaims:       true,
  });

  const assetLedger = useMemo(() => getAssetLedger(), []);

  const kpis = useMemo(() => ({
    totalOwed:        applyGrossNet(ytdSummary.totalOwedGross, grossNet),
    totalClaimed:     ytdSummary.totalClaimedGross,
    propertyOwed:     applyGrossNet(ytdSummary.propertyOwedGross, grossNet),
    propertyClaimed:  ytdSummary.propertyClaimedGross,
    autoOwed:         applyGrossNet(ytdSummary.autoOwedGross, grossNet),
    autoClaimed:      ytdSummary.autoClaimedGross,
  }), [grossNet]);

  const chartData = useMemo(
    () => applyGrossNetToChartData(filterChartData(timeframe), grossNet),
    [timeframe, grossNet],
  );

  const sortedLedger = useMemo(() => {
    return [...assetLedger].sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      if (sortField === 'totalClaims') return dir * (a.totalClaims - b.totalClaims);
      if (sortField === 'dueDate')     return dir * (new Date(a.dueDate) - new Date(b.dueDate));
      if (sortField === 'premiumDue')  return dir * (a.premiumDue - b.premiumDue);
      return 0;
    });
  }, [assetLedger, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleSeries = (key) =>
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));

  const propLossRatio = kpis.propertyOwed > 0
    ? (kpis.propertyClaimed / kpis.propertyOwed) * 100 : 0;
  const autoLossRatio = kpis.autoOwed > 0
    ? (kpis.autoClaimed / kpis.autoOwed) * 100 : 0;

  return (
    <div className="conservative-dashboard">
      {/* ── Filter Bar ── */}
      <div className="con-filter-bar">
        <div className="con-filter-group">
          <span className="con-filter-label">View</span>
          <ContentSwitcher
            onChange={({ name }) => setGrossNet(name)}
            className="con-gross-net"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
        </div>

        <div className="con-filter-group">
          <Select
            id="con-timeframe"
            labelText="Timeframe"
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
            hideLabel
            className="con-select"
          >
            <SelectItem value="12m" text="Last 12 Months" />
            <SelectItem value="6m"  text="Last 6 Months" />
            <SelectItem value="ytd" text="Year to Date" />
          </Select>
        </div>

        <div className="con-filter-group">
          <Select
            id="con-region"
            labelText="Region"
            value={region}
            onChange={e => setRegion(e.target.value)}
            hideLabel
            className="con-select"
          >
            <SelectItem value="all"           text="All Regions" />
            <SelectItem value="bay-area"      text="Bay Area" />
            <SelectItem value="central-valley" text="Central Valley" />
            <SelectItem value="northern-ca"   text="Northern CA" />
          </Select>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <Grid fullWidth className="con-kpi-grid">
        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Total Owed (YTD)</p>
            <p className="con-kpi-value">{formatCurrency(kpis.totalOwed, false)}</p>
            <div className="con-kpi-split">
              <span className="con-split-item con-split-property">
                <Building size={12} /> {formatCurrency(kpis.propertyOwed, false)}
              </span>
              <span className="con-split-item con-split-auto">
                <CarFront size={12} /> {formatCurrency(kpis.autoOwed, false)}
              </span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Total Claimed (YTD)</p>
            <p className="con-kpi-value con-kpi-value--claims">
              {formatCurrency(kpis.totalClaimed, false)}
            </p>
            <div className="con-kpi-split">
              <span className="con-split-item con-split-property">
                <Building size={12} /> {formatCurrency(kpis.propertyClaimed, false)}
              </span>
              <span className="con-split-item con-split-auto">
                <CarFront size={12} /> {formatCurrency(kpis.autoClaimed, false)}
              </span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Property Portfolio</p>
            <p className="con-kpi-value">{formatCurrency(kpis.propertyOwed, false)}</p>
            <p className="con-kpi-sublabel">Premiums Owed</p>
            <div className="con-ratio-bar">
              <div
                className="con-ratio-fill con-ratio-fill--property"
                style={{ width: `${Math.min(propLossRatio, 100)}%` }}
              />
            </div>
            <p className="con-kpi-sublabel">{propLossRatio.toFixed(1)}% loss ratio</p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="con-kpi-tile">
            <p className="con-kpi-label">Auto Portfolio</p>
            <p className="con-kpi-value">{formatCurrency(kpis.autoOwed, false)}</p>
            <p className="con-kpi-sublabel">Premiums Owed</p>
            <div className="con-ratio-bar">
              <div
                className="con-ratio-fill con-ratio-fill--auto"
                style={{ width: `${Math.min(autoLossRatio, 100)}%` }}
              />
            </div>
            <p className="con-kpi-sublabel">{autoLossRatio.toFixed(1)}% loss ratio</p>
          </Tile>
        </Column>
      </Grid>

      {/* ── Chart ── */}
      <div className="con-chart-section">
        <Tile className="con-chart-tile">
          <div className="con-chart-header">
            <div>
              <h4 className="con-chart-title">Premiums vs. Claims — Historical Trend</h4>
              <p className="con-chart-subtitle">Monthly aggregates across all assets</p>
            </div>
            <div className="con-series-toggles">
              {SERIES.map(s => (
                <label key={s.key} className="con-series-toggle">
                  <Checkbox
                    id={`con-series-${s.key}`}
                    checked={activeSeries[s.key]}
                    onChange={() => toggleSeries(s.key)}
                    labelText={s.label}
                  />
                </label>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(141,141,141,0.2)" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6f6f6f', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: '#6f6f6f', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={v => [formatCurrency(v, false), '']}
                contentStyle={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              {SERIES.map(s =>
                activeSeries[s.key] ? (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={s.key.includes('Claims') ? { r: 3, fill: s.color } : false}
                    activeDot={{ r: 5 }}
                  />
                ) : null,
              )}
            </LineChart>
          </ResponsiveContainer>
        </Tile>
      </div>

      {/* ── Asset Performance Ledger ── */}
      <div className="con-ledger-section">
        <Tile className="con-ledger-tile">
          <div className="con-ledger-header">
            <div>
              <h4 className="con-ledger-title">Asset Performance Ledger</h4>
              <p className="con-ledger-subtitle">{sortedLedger.length} assets — click any row to view details</p>
            </div>
          </div>

          <div className="con-table-wrapper">
            <table className="con-table">
              <thead>
                <tr>
                  <th className="con-th">Asset Name</th>
                  <th className="con-th">Category</th>
                  <th
                    className={`con-th con-th--sortable ${sortField === 'premiumDue' ? 'con-th--active' : ''}`}
                    onClick={() => toggleSort('premiumDue')}
                  >
                    Premium Due {sortField === 'premiumDue' ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                  <th
                    className={`con-th con-th--sortable ${sortField === 'dueDate' ? 'con-th--active' : ''}`}
                    onClick={() => toggleSort('dueDate')}
                  >
                    Due Date {sortField === 'dueDate' ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                  <th
                    className={`con-th con-th--sortable ${sortField === 'totalClaims' ? 'con-th--active' : ''}`}
                    onClick={() => toggleSort('totalClaims')}
                  >
                    Total Claims {sortField === 'totalClaims' ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                  <th className="con-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedLedger.map(asset => (
                  <tr
                    key={asset.id}
                    className="con-tr"
                    onClick={() => navigate(`/financial/asset/${asset.id}`)}
                  >
                    <td className="con-td con-td--name">{asset.name}</td>
                    <td className="con-td">
                      <Tag
                        type={asset.category === 'Property' ? 'blue' : 'cyan'}
                        size="sm"
                      >
                        {asset.category}
                      </Tag>
                    </td>
                    <td className="con-td con-td--amount">{formatCurrency(asset.premiumDue)}</td>
                    <td className="con-td">Apr 01, 2024</td>
                    <td className={`con-td con-td--amount ${asset.totalClaims > 0 ? 'con-td--claims' : ''}`}>
                      {asset.totalClaims > 0 ? formatCurrency(asset.totalClaims) : '—'}
                    </td>
                    <td className="con-td">
                      <Button
                        kind="ghost"
                        size="sm"
                        renderIcon={View}
                        hasIconOnly
                        iconDescription="View details"
                        onClick={e => { e.stopPropagation(); navigate(`/financial/asset/${asset.id}`); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tile>
      </div>
    </div>
  );
}
