import React from 'react';
import { Heading, Tile, Button } from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import './FinancialPrototypes.scss';

const prototypes = [
  {
    id: 'conservative',
    title: 'Conservative',
    description: 'Traditional financial dashboard with grouped bar charts, standard KPI tiles, and a familiar data table. Clean, no-frills layout that prioritizes readability and data density.',
    tags: ['Bar Chart', 'Carbon Tiles', 'Sortable Table', 'Toggle Legend'],
    path: '/financial/conservative',
  },
  {
    id: 'modern',
    title: 'Modern Sleek',
    description: 'Polished card-based layout with smooth area charts, tabbed chart navigation (Premiums / Claims / Combined), floating KPI cards with change indicators, and a clean table with inline badges.',
    tags: ['Area Chart', 'Tabs', 'Animated Cards', 'Gradient Fills'],
    path: '/financial/modern',
  },
  {
    id: 'wild',
    title: 'Wild / Creative',
    description: 'Bold layout with a radial gauge for loss ratio, donut chart for portfolio mix, stacked area flow chart, a "Highest Claims" ranking sidebar with progress bars, and inline sparklines in every table row.',
    tags: ['Radial Gauge', 'Donut', 'Sparklines', 'Ranking Sidebar'],
    path: '/financial/wild',
  },
];

export default function FinancialPrototypes() {
  const navigate = useNavigate();

  return (
    <div className="fin-prototypes">
      <Heading className="fin-prototypes__title">Financial Dashboard Prototypes</Heading>
      <p className="fin-prototypes__subtitle">
        Three layout variations based on the Insurance Financial Analytics Dashboard PRD.
        Each uses the same mock data with functional Gross/Net and Region filters.
      </p>

      <div className="fin-prototypes__grid">
        {prototypes.map((proto) => (
          <Tile
            key={proto.id}
            className={`fin-prototypes__card fin-prototypes__card--${proto.id}`}
            onClick={() => navigate(proto.path)}
          >
            <div className="fin-prototypes__card-content">
              <Heading className="fin-prototypes__card-title">{proto.title}</Heading>
              <p className="fin-prototypes__card-desc">{proto.description}</p>
              <div className="fin-prototypes__card-tags">
                {proto.tags.map(tag => (
                  <span key={tag} className="fin-prototypes__tag">{tag}</span>
                ))}
              </div>
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={ArrowRight}
                onClick={(e) => { e.stopPropagation(); navigate(proto.path); }}
              >
                View Prototype
              </Button>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  );
}
