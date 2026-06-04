import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@carbon/react';
import { ArrowRight, ChartBar, Sprout, ColorPalette } from '@carbon/icons-react';
import './FinancialDashboardPicker.scss';

const STYLES = [
  {
    id: 'conservative',
    label: 'Conservative',
    eyebrow: 'Option 01',
    description:
      'A structured, enterprise-grade dashboard built on Carbon Design System primitives. Grouped bar charts, sortable data tables, and clear visual hierarchy — everything where you expect it.',
    icon: ChartBar,
    accent: '#0f62fe',
    preview: [
      { w: '100%', h: 8, bg: '#0f62fe', mb: 4 },
      { w: '100%', h: 56, bg: 'rgba(255,255,255,0.06)', mb: 4, row: true },
      { w: '100%', h: 80, bg: 'rgba(255,255,255,0.04)', mb: 4 },
      { w: '100%', h: 100, bg: 'rgba(255,255,255,0.04)' },
    ],
    tags: ['Carbon DataTable', 'Grouped BarChart', 'Gross/Net Toggle'],
  },
  {
    id: 'modern',
    label: 'Modern & Sleek',
    eyebrow: 'Option 02',
    description:
      'Minimal whitespace, smooth area charts with gradient fills, and a custom table with subtle hover effects. Inspired by modern SaaS dashboards — clean and confident.',
    icon: Sprout,
    accent: '#24a148',
    preview: [],
    tags: ['AreaChart + Gradients', 'Pill Badges', 'Custom Table'],
  },
  {
    id: 'creative',
    label: 'Wild & Creative',
    eyebrow: 'Option 03',
    description:
      'Bold colored hero section with giant KPI numbers, a mixed composed chart, and card-style asset rows. High visual energy — built for presentations and executive reviews.',
    icon: ColorPalette,
    accent: '#da1e28',
    preview: [],
    tags: ['Hero Banner', 'ComposedChart', 'Card Rows'],
  },
];

export default function FinancialDashboardPicker() {
  const navigate = useNavigate();

  return (
    <div className="picker-page">
      <div className="picker-hero">
        <p className="picker-hero__eyebrow">Insurance Financial Analytics Dashboard</p>
        <h1 className="picker-hero__title">Choose Your Dashboard Style</h1>
        <p className="picker-hero__subtitle">
          Three distinct layouts, all powered by the same live portfolio data. Pick the one that fits your workflow.
        </p>
      </div>

      <div className="picker-grid">
        {STYLES.map((style) => {
          const Icon = style.icon;
          return (
            <div
              key={style.id}
              className="picker-card"
              style={{ '--accent': style.accent }}
              onClick={() => navigate(`/business/financial-dashboard/${style.id}`)}
            >
              <div className="picker-card__accent-bar" />
              <div className="picker-card__body">
                <div className="picker-card__icon-row">
                  <span className="picker-card__eyebrow">{style.eyebrow}</span>
                  <span className="picker-card__icon">
                    <Icon size={20} />
                  </span>
                </div>
                <h2 className="picker-card__label">{style.label}</h2>
                <p className="picker-card__description">{style.description}</p>
                <div className="picker-card__tags">
                  {style.tags.map((tag) => (
                    <span key={tag} className="picker-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="picker-card__footer">
                <Button
                  kind="ghost"
                  renderIcon={ArrowRight}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/business/financial-dashboard/${style.id}`);
                  }}
                >
                  Launch Dashboard
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
