import React from 'react';
import { Tag, Tile } from '@carbon/react';
import { ArrowUp, ChartLine } from '@carbon/icons-react';
import FinancialTrendsChart from '../../components/business/FinancialTrendsChart';
import AssetLedger from '../../components/business/AssetLedger';
import {
  FINANCIAL_YEAR,
  PERIOD_CHANGE,
  getFinancialSummary,
  monthlyTrends,
  portfolioAssets,
} from '../../data/financialMockData';
import { formatCurrency } from '../../utils/businessHelpers';
import './FinancialDashboardPage.scss';

export default function FinancialDashboardPage() {
  const summary = getFinancialSummary();

  const secondaryStats = [
    { label: 'Loss Ratio', value: `${summary.lossRatio.toFixed(1)}%` },
    { label: 'Total Assets', value: summary.totalAssets },
    { label: 'Net Revenue', value: formatCurrency(summary.netRevenue, false) },
    { label: 'Avg Premium', value: formatCurrency(summary.avgMonthlyPremium, false) },
  ];

  return (
    <div className="financial-dashboard">
      <header className="financial-header">
        <div className="financial-header__text">
          <Tag type="blue" size="sm">Financial Analytics</Tag>
          <h1 className="financial-header__title">Insurance Portfolio Dashboard</h1>
          <p className="financial-header__subtitle">
            Real-time insights into premium collections and claim payouts across your entire portfolio
          </p>
        </div>
        <ChartLine size={48} className="financial-header__icon" aria-hidden="true" />
      </header>

      <section className="kpi-grid" aria-label="Year-to-date totals">
        <Tile className="kpi-tile kpi-tile--premiums">
          <div className="kpi-tile__top">
            <span className="kpi-tile__icon"><ArrowUp size={20} /></span>
            <Tag type="green" size="sm">+{PERIOD_CHANGE.premiums}%</Tag>
          </div>
          <p className="kpi-tile__label">Total Premiums (YTD {FINANCIAL_YEAR})</p>
          <p className="kpi-tile__value">{formatCurrency(summary.totalPremiums, false)}</p>
          <p className="kpi-tile__breakdown">
            Property: {formatCurrency(summary.propertyPremiums, false)}
            <span aria-hidden="true"> • </span>
            Auto: {formatCurrency(summary.autoPremiums, false)}
          </p>
        </Tile>

        <Tile className="kpi-tile kpi-tile--claims">
          <div className="kpi-tile__top">
            <span className="kpi-tile__icon"><ArrowUp size={20} /></span>
            <Tag type="red" size="sm">+{PERIOD_CHANGE.claims}%</Tag>
          </div>
          <p className="kpi-tile__label">Total Claims (YTD {FINANCIAL_YEAR})</p>
          <p className="kpi-tile__value">{formatCurrency(summary.totalClaims, false)}</p>
          <p className="kpi-tile__breakdown">
            Property: {formatCurrency(summary.propertyClaims, false)}
            <span aria-hidden="true"> • </span>
            Auto: {formatCurrency(summary.autoClaims, false)}
          </p>
        </Tile>
      </section>

      <section className="stat-grid" aria-label="Portfolio summary">
        {secondaryStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="stat-card__label">{stat.label}</p>
            <p className="stat-card__value">{stat.value}</p>
          </div>
        ))}
      </section>

      <Tile className="panel">
        <h2 className="panel__title">Financial Trends</h2>
        <p className="panel__subtitle">Monthly premium and claims comparison</p>
        <FinancialTrendsChart data={monthlyTrends} />
      </Tile>

      <Tile className="panel">
        <AssetLedger assets={portfolioAssets} />
      </Tile>
    </div>
  );
}
