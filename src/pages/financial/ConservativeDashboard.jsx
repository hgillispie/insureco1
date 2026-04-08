/**
 * @file ConservativeDashboard.jsx
 * @description Design Prototype 1 of 3 — "Conservative"
 *
 * Philosophy:
 *   Follows standard IBM Carbon Design System patterns. Every element maps
 *   directly to a Carbon component. Layout uses the Carbon 16-column Grid.
 *   Interactions use ContentSwitcher, Select, and DataTable conventions that
 *   enterprise users already know. No custom UI chrome — maximum familiarity.
 *
 * Sections:
 *   1. Filter Bar  — Gross/Net toggle (ContentSwitcher), Timeframe + Region selects
 *   2. KPI Cards   — 4 tiles: Total Owed, Total Claimed, Property split, Auto split
 *   3. Chart       — Multi-series LineChart (Recharts); individual series togglable
 *   4. Ledger      — Sortable asset table; rows link to the drill-down detail page
 *
 * State:
 *   grossNet      — 'gross' | 'net'  (net applies a 0.85× reinsurance multiplier)
 *   timeframe     — '12m' | '6m' | 'ytd'  (slices chart data)
 *   region        — filter tag; not yet wired to data (prototype placeholder)
 *   sortField     — which column drives table ordering
 *   sortDir       — 'asc' | 'desc'
 *   activeSeries  — map of { seriesKey: boolean } controlling chart line visibility
 *
 * Data dependencies:
 *   financialMockData.js — ytdSummary, filterChartData, applyGrossNet,
 *                          applyGrossNetToChartData, getAssetLedger
 *   businessHelpers.js   — formatCurrency
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Column, Tile,
  ContentSwitcher, Switch,   // Gross / Net toggle
  Select, SelectItem,        // Timeframe and Region dropdowns
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

/**
 * SERIES — chart data series configuration.
 *
 * Each entry drives both the Recharts <Line> element and the corresponding
 * Checkbox toggle in the chart header. Colors use the design system's
 * semantic palette:
 *   - Green (#24a148)  → premium / revenue (positive signal)
 *   - Red   (#da1e28)  → claims / expense  (negative signal)
 *   - Blue  (#0f62fe)  → auto premiums     (secondary revenue)
 *   - Amber (#f1c21b)  → auto claims       (secondary expense)
 *
 * NOTE: Recharts renders SVG so CSS custom properties cannot be used as stroke
 * values. Static hex codes are used here intentionally.
 */
const SERIES = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#24a148' },
  { key: 'propertyClaims',   label: 'Property Claims',   color: '#da1e28' },
  { key: 'autoPremiums',     label: 'Auto Premiums',     color: '#0f62fe' },
  { key: 'autoClaims',       label: 'Auto Claims',       color: '#f1c21b' },
];

/**
 * ConservativeDashboard
 *
 * Standard IBM Carbon Design System approach to the IFAD layout.
 * Clean, structured, and immediately familiar to enterprise users.
 * Prioritises legibility and pattern consistency over visual novelty.
 */
export default function ConservativeDashboard() {
  const navigate = useNavigate();

  // ── Filter state ───────────────────────────────────────────────────────────
  // grossNet:  Controls whether dollar values are shown pre- or post-reinsurance.
  //            'net' applies a 0.85× multiplier to premium figures.
  const [grossNet, setGrossNet]   = useState('gross');

  // timeframe: Slices the monthly chart data array for the Recharts LineChart.
  //            '12m' = full year, '6m' = half year, 'ytd' = Q1 2024 only.
  const [timeframe, setTimeframe] = useState('12m');

  // region:    UI-only filter placeholder. In production this would filter the
  //            asset ledger by geographic region (state/city).
  const [region, setRegion]       = useState('all');

  // ── Table sort state ───────────────────────────────────────────────────────
  // sortField: Column key used for ordering the asset ledger rows.
  // sortDir:   'desc' puts the highest value first (e.g. largest claims at top).
  const [sortField, setSortField] = useState('totalClaims');
  const [sortDir, setSortDir]     = useState('desc');

  // ── Chart series visibility ────────────────────────────────────────────────
  // activeSeries: Boolean map keyed by SERIES[].key. When false, the
  //               corresponding <Line> element is omitted from the chart,
  //               letting users isolate specific trends (e.g. Auto Claims only).
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims:   true,
    autoPremiums:     true,
    autoClaims:       true,
  });

  // ── Derived data ───────────────────────────────────────────────────────────
  // assetLedger: Combined property + vehicle list with lifecycle claim totals.
  //              Memoised with [] deps because the source data is static mock data.
  const assetLedger = useMemo(() => getAssetLedger(), []);

  // kpis: Dollar values shown on the four KPI tiles.
  //   - totalClaimed is NOT multiplied — claims are a fixed obligation regardless
  //     of whether the view is gross or net. Only premiums are affected.
  //   - applyGrossNet multiplies by 0.85 when grossNet === 'net', representing
  //     the net retained premium after reinsurance cession.
  //   - Recalculates whenever grossNet changes.
  const kpis = useMemo(() => ({
    totalOwed:        applyGrossNet(ytdSummary.totalOwedGross, grossNet),
    totalClaimed:     ytdSummary.totalClaimedGross,
    propertyOwed:     applyGrossNet(ytdSummary.propertyOwedGross, grossNet),
    propertyClaimed:  ytdSummary.propertyClaimedGross,
    autoOwed:         applyGrossNet(ytdSummary.autoOwedGross, grossNet),
    autoClaimed:      ytdSummary.autoClaimedGross,
  }), [grossNet]);

  // chartData: Monthly data array fed to the Recharts LineChart.
  //   1. filterChartData(timeframe) slices the 12-month array to the selected window.
  //   2. applyGrossNetToChartData then scales premium columns by 0.85 if net is active.
  //      Claim columns are left unchanged for the same reason as the KPI tiles above.
  //   Recalculates when either timeframe or grossNet changes.
  const chartData = useMemo(
    () => applyGrossNetToChartData(filterChartData(timeframe), grossNet),
    [timeframe, grossNet],
  );

  // sortedLedger: A sorted copy of the asset ledger for the table.
  //   A copy is made (spread) to avoid mutating the memoised assetLedger reference.
  //   Sorting supports three fields:
  //     totalClaims — identifies highest-exposure assets (PRD requirement: "Highest Claims")
  //     dueDate     — upcoming payment management (PRD requirement: "Due Date")
  //     premiumDue  — largest premium contributors first
  //   The dir multiplier inverts the comparator for descending order.
  const sortedLedger = useMemo(() => {
    return [...assetLedger].sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      if (sortField === 'totalClaims') return dir * (a.totalClaims - b.totalClaims);
      if (sortField === 'dueDate')     return dir * (new Date(a.dueDate) - new Date(b.dueDate));
      if (sortField === 'premiumDue')  return dir * (a.premiumDue - b.premiumDue);
      return 0;
    });
  }, [assetLedger, sortField, sortDir]);

  /**
   * toggleSort — handles column header clicks in the asset ledger.
   * Clicking the active sort column reverses direction (asc ↔ desc).
   * Clicking a new column sets it as active with 'desc' as default
   * (most useful direction first for financial data).
   */
  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  /**
   * toggleSeries — flips the visibility of a single chart data series.
   * Uses functional state update to avoid stale closure over activeSeries.
   * Spreading `prev` preserves the state of all other series.
   */
  const toggleSeries = (key) =>
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));

  // Loss ratio per portfolio segment = (claims paid) / (premiums owed).
  // Guarded against division by zero for empty portfolios.
  // Used to fill the progress bar indicator on the split KPI tiles.
  const propLossRatio = kpis.propertyOwed > 0
    ? (kpis.propertyClaimed / kpis.propertyOwed) * 100 : 0;
  const autoLossRatio = kpis.autoOwed > 0
    ? (kpis.autoClaimed / kpis.autoOwed) * 100 : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="conservative-dashboard">
      {/*
       * ── Section 1: Filter Bar ────────────────────────────────────────────
       * Controls three independent filter states:
       *   grossNet  — Carbon ContentSwitcher (two-position toggle)
       *   timeframe — Carbon Select (12m / 6m / YTD)
       *   region    — Carbon Select (prototype-level, UI only)
       *
       * All three are uncontrolled selections that cascade into memoised
       * derived data (kpis, chartData) via the state variables above.
       */}
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

      {/*
       * ── Section 2: KPI Cards ─────────────────────────────────────────────
       * Four Carbon Tiles in a 4-column Grid layout (lg=4 each).
       *
       * Card 1: Total Owed (YTD)   — top-line premium aggregate with auto/property split
       * Card 2: Total Claimed (YTD) — top-line claims aggregate with auto/property split
       * Card 3: Property Portfolio — owed amount + inline loss-ratio progress bar
       * Card 4: Auto Portfolio     — owed amount + inline loss-ratio progress bar
       *
       * The progress bars clamp at 100% (Math.min) to prevent visual overflow
       * in edge cases where claims temporarily exceed premiums in a single period.
       */}
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

      {/*
       * ── Section 3: Expense Visualization ────────────────────────────────
       * Recharts LineChart rendering up to 4 time series simultaneously.
       *
       * Series are conditionally rendered (null when hidden) rather than
       * using opacity/display:none so Recharts excludes them from the tooltip
       * and legend entirely — cleaner UX when toggling.
       *
       * dot prop: Claims lines show data-point dots (r=3) to highlight the
       * volatility of individual claim events; premium lines omit dots (false)
       * since they are smooth steady-growth curves.
       *
       * Tooltip contentStyle: Reads CSS custom properties at runtime so the
       * tooltip background adapts to light/dark theme switching.
       * (Recharts tooltip uses inline styles, so CSS variables work here.)
       */}
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

      {/*
       * ── Section 4: Asset Performance Ledger ─────────────────────────────
       * Custom sortable table rather than Carbon DataTable, keeping full
       * control over row-click navigation to the drill-down detail page.
       *
       * Sortable columns: Premium Due, Due Date, Total Claims.
       * Non-sortable columns: Asset Name, Category, Action.
       *
       * Click behaviour:
       *   Whole row  → navigate to /financial/asset/:id (drill-down)
       *   Action btn → same navigation, stopPropagation prevents double-fire
       *
       * Zero-claim assets show "—" in the Total Claims cell rather than $0.00
       * to visually distinguish "no history" from "claimed $0".
       *
       * Category tags use Carbon's built-in Tag component:
       *   'blue' for Property assets, 'cyan' for Auto assets.
       */}
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
