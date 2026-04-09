import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import ConservativeDashboard from './ConservativeDashboard';
import ModernDashboard from './ModernDashboard';
import CreativeDashboard from './CreativeDashboard';
import './FinancialDashboard.scss';

/**
 * FinancialDashboard — Insurance Financial Analytics Dashboard (IFAD)
 *
 * Container page hosting three prototype design variants:
 *  1. Conservative — Standard IBM Carbon style, structured, professional
 *  2. Modern Sleek — Large typography, area charts, minimal aesthetic
 *  3. Wild & Creative — Hero section, bold layout, unconventional data presentation
 */
export default function FinancialDashboard() {
  return (
    <div className="financial-dashboard-page">
      <div className="financial-page-header">
        <h1 className="financial-page-title">Insurance Financial Analytics Dashboard</h1>
        <p className="financial-page-subtitle">
          Three design prototypes — select a variant below to explore
        </p>
      </div>

      <Tabs>
        <TabList aria-label="Dashboard design variants" className="variant-tab-list">
          <Tab>Conservative</Tab>
          <Tab>Modern Sleek</Tab>
          <Tab>Wild &amp; Creative</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="variant-tab-panel">
            <ConservativeDashboard />
          </TabPanel>
          <TabPanel className="variant-tab-panel">
            <ModernDashboard />
          </TabPanel>
          <TabPanel className="variant-tab-panel">
            <CreativeDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
