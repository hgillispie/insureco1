import React, { useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button, Toggle } from '@carbon/react';
import { formatCurrency } from '../../utils/businessHelpers';
import './FinancialTrendsChart.scss';

const GREEN = 'var(--color-success-60)';
const RED = 'var(--color-brand-red-60)';

const SERIES = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: GREEN, gradientId: 'fill-premiums', dashed: false },
  { key: 'propertyClaims', label: 'Property Claims', color: RED, gradientId: 'fill-claims', dashed: false },
  { key: 'autoPremiums', label: 'Auto Premiums', color: GREEN, dashed: true },
  { key: 'autoClaims', label: 'Auto Claims', color: RED, dashed: true },
];

const formatAxisCurrency = (value) => (value === 0 ? '$0' : `$${Math.round(value / 1000)}K`);

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="trends-tooltip">
      <p className="trends-tooltip__label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="trends-tooltip__row">
          <span className="trends-tooltip__swatch" style={{ background: entry.color }} />
          <span>{entry.name}</span>
          <strong>{formatCurrency(entry.value, false)}</strong>
        </p>
      ))}
    </div>
  );
}

export default function FinancialTrendsChart({ data }) {
  const [visibleKeys, setVisibleKeys] = useState(() => SERIES.map((s) => s.key));
  const [lineOnly, setLineOnly] = useState(false);

  const toggleSeries = (key) => {
    setVisibleKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const activeSeries = SERIES.filter((s) => visibleKeys.includes(s.key));

  return (
    <div className="trends-chart">
      <div className="trends-chart__controls">
        <div className="trends-chart__series-buttons" role="group" aria-label="Chart series">
          {SERIES.map((series) => {
            const isActive = visibleKeys.includes(series.key);
            return (
              <Button
                key={series.key}
                size="sm"
                kind={isActive ? 'primary' : 'tertiary'}
                aria-pressed={isActive}
                onClick={() => toggleSeries(series.key)}
              >
                {series.label}
              </Button>
            );
          })}
        </div>
        <Toggle
          id="trends-line-only"
          size="sm"
          hideLabel
          labelText="Chart style"
          labelA="Area"
          labelB="Line"
          toggled={lineOnly}
          onToggle={setLineOnly}
        />
      </div>

      <div className="trends-chart__canvas">
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="fill-premiums" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: GREEN, stopOpacity: 0.25 }} />
                <stop offset="100%" style={{ stopColor: GREEN, stopOpacity: 0.02 }} />
              </linearGradient>
              <linearGradient id="fill-claims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: RED, stopOpacity: 0.02 }} />
                <stop offset="100%" style={{ stopColor: RED, stopOpacity: 0.25 }} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: 'var(--border-strong)' }}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              domain={[0, 'auto']}
              tickFormatter={formatAxisCurrency}
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-strong)' }} />
            <Legend
              iconType="plainline"
              formatter={(value) => <span className="trends-legend-label">{value}</span>}
            />

            {activeSeries.map((series) => {
              const common = {
                key: series.key,
                dataKey: series.key,
                name: series.label,
                type: 'monotone',
                stroke: series.color,
                strokeWidth: 2,
              };

              if (series.dashed) {
                return (
                  <Line
                    {...common}
                    strokeDasharray="3 3"
                    dot={{ r: 2, fill: series.color, stroke: series.color }}
                    activeDot={{ r: 4 }}
                  />
                );
              }

              return lineOnly ? (
                <Line {...common} dot={false} activeDot={{ r: 4 }} />
              ) : (
                <Area
                  {...common}
                  fill={`url(#${series.gradientId})`}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
