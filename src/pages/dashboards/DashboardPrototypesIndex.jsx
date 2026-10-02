import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@carbon/react';
import './DashboardPrototypesIndex.scss';

const PROTOTYPES = [
  {
    key: 'conservative',
    title: 'Conservative',
    description:
      'A traditional, low-risk layout with clear tables, muted colors, and familiar Carbon components. Prioritizes readability for financial analysts.',
    tag: 'Trusted & familiar',
  },
  {
    key: 'modern',
    title: 'Modern / Sleek',
    description:
      'A refined, minimal layout with soft gradients, generous whitespace, and an area chart. Prioritizes visual clarity and polish.',
    tag: 'Clean & elegant',
  },
  {
    key: 'wild',
    title: 'Wild / Creative',
    description:
      'A bold, high-energy layout with gradient headlines, tilted KPI cards, and a combo chart. Prioritizes standout visual impact.',
    tag: 'Bold & expressive',
  },
];

export default function DashboardPrototypesIndex() {
  return (
    <div className="dashboard-prototypes-index">
      <h1 className="dashboard-prototypes-index__title">Financial Dashboard Prototypes</h1>
      <p className="dashboard-prototypes-index__subtitle">
        Three design directions for the Insurance Financial Analytics Dashboard (IFAD), built from the PRD.
      </p>
      <div className="dashboard-prototypes-index__grid">
        {PROTOTYPES.map((p) => (
          <Link key={p.key} to={`/dashboard-prototypes/${p.key}`} className="dashboard-prototypes-index__card">
            <Tag type="gray">{p.tag}</Tag>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <span className="dashboard-prototypes-index__cta">View prototype &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
