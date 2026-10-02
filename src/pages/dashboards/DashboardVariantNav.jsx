import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardVariantNav.scss';

const VARIANTS = [
  { key: 'conservative', label: 'Conservative' },
  { key: 'modern', label: 'Modern' },
  { key: 'wild', label: 'Wild' },
];

export default function DashboardVariantNav({ current }) {
  return (
    <div className="dashboard-variant-nav">
      <Link to="/dashboard-prototypes" className="dashboard-variant-nav__all">
        All prototypes
      </Link>
      <div className="dashboard-variant-nav__tabs">
        {VARIANTS.map((v) => (
          <Link
            key={v.key}
            to={`/dashboard-prototypes/${v.key}`}
            className={`dashboard-variant-nav__tab ${
              v.key === current ? 'is-active' : ''
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
