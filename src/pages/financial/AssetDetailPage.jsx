import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Column, Tile, Button, Tag,
  Tabs, Tab, TabList, TabPanels, TabPanel,
  StructuredList, StructuredListHead, StructuredListRow,
  StructuredListCell, StructuredListBody,
} from '@carbon/react';
import {
  ArrowLeft, Building, CarFront, DocumentMultiple_01,
  Image, Warning,
} from '@carbon/icons-react';
import {
  getPropertyById, getVehicleById, mockBusinessClaims,
} from '../../data/businessMockData';
import { formatCurrency, formatDate, getStatusTagType } from '../../utils/businessHelpers';
import './AssetDetailPage.scss';

function NotFound({ assetId, onBack }) {
  return (
    <div className="asset-detail-not-found">
      <Warning size={48} />
      <h2>Asset Not Found</h2>
      <p>No asset with ID <code>{assetId}</code> could be located.</p>
      <Button kind="secondary" renderIcon={ArrowLeft} onClick={onBack}>
        Back to Dashboard
      </Button>
    </div>
  );
}

/**
 * AssetDetailPage — Drill-down view for a single asset.
 *
 * Reached by clicking any row in the Asset Performance Ledger.
 * Supports both Property (PROP-*) and Vehicle (VEH-*) asset types.
 *
 * Sections:
 *  1. Header — asset name, type badge, status, back navigation
 *  2. KPI tiles — premium, total claims, coverage limit
 *  3. Tabs:
 *       - Claims History: full claim record for this asset
 *       - Policy Details: coverage info from the underwriting record
 *       - Supporting Media: placeholder for photos/documents
 */
export default function AssetDetailPage() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const isProperty = assetId?.startsWith('PROP-');
  const asset = useMemo(
    () => isProperty ? getPropertyById(assetId) : getVehicleById(assetId),
    [assetId, isProperty],
  );

  const claims = useMemo(
    () => mockBusinessClaims.filter(c => c.assetId === assetId),
    [assetId],
  );

  const totalClaimsAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);

  const handleBack = () => navigate('/financial/dashboard');

  if (!asset) return <NotFound assetId={assetId} onBack={handleBack} />;

  const assetName = isProperty
    ? asset.name
    : `${asset.year} ${asset.make} ${asset.model}`;

  return (
    <div className="asset-detail-page">
      {/* ── Back Navigation ── */}
      <div className="asset-detail-nav">
        <Button kind="ghost" size="sm" renderIcon={ArrowLeft} onClick={handleBack}>
          Back to Dashboard
        </Button>
        <span className="asset-detail-breadcrumb">
          Financial Dashboard &rsaquo; Asset Detail
        </span>
      </div>

      {/* ── Asset Header ── */}
      <div className="asset-detail-header">
        <div className="asset-header-meta">
          <div className="asset-header-badges">
            <Tag type={isProperty ? 'blue' : 'cyan'} size="md">
              {isProperty ? <Building size={14} /> : <CarFront size={14} />}
              {' '}{isProperty ? 'Property' : 'Auto'}
            </Tag>
            <Tag type={getStatusTagType(asset.status, 'asset')} size="md">
              {asset.status}
            </Tag>
          </div>
          <h1 className="asset-detail-title">{assetName}</h1>
          <p className="asset-detail-subtitle">
            {isProperty ? asset.address : `${asset.vehicleType} · ${asset.licensePlate}`}
          </p>
          <p className="asset-detail-id">{asset.id}</p>
        </div>
      </div>

      {/* ── KPI Tiles ── */}
      <Grid fullWidth className="asset-kpi-grid">
        <Column lg={5} md={4} sm={4}>
          <Tile className="asset-kpi-tile">
            <p className="asset-kpi-label">Monthly Premium</p>
            <p className="asset-kpi-value">{formatCurrency(asset.monthlyPremium)}</p>
            <p className="asset-kpi-sub">{formatCurrency(asset.yearlyPremium)} / year</p>
          </Tile>
        </Column>

        <Column lg={5} md={4} sm={4}>
          <Tile className="asset-kpi-tile">
            <p className="asset-kpi-label">Total Claims (Lifecycle)</p>
            <p className={`asset-kpi-value ${totalClaimsAmount > 0 ? 'asset-kpi-value--claims' : ''}`}>
              {formatCurrency(totalClaimsAmount)}
            </p>
            <p className="asset-kpi-sub">
              {claims.length} claim{claims.length !== 1 ? 's' : ''} on record
            </p>
          </Tile>
        </Column>

        <Column lg={6} md={8} sm={4}>
          <Tile className="asset-kpi-tile">
            <p className="asset-kpi-label">Coverage Limit</p>
            <p className="asset-kpi-value">{formatCurrency(asset.coverageLimit)}</p>
            <p className="asset-kpi-sub">Deductible: {formatCurrency(asset.deductible)}</p>
          </Tile>
        </Column>
      </Grid>

      {/* ── Detail Tabs ── */}
      <div className="asset-detail-tabs">
        <Tabs>
          <TabList aria-label="Asset detail sections">
            <Tab>Claims History ({claims.length})</Tab>
            <Tab>Policy Details</Tab>
            <Tab>Supporting Media</Tab>
          </TabList>

          <TabPanels>
            {/* Claims History */}
            <TabPanel>
              <div className="asset-tab-panel">
                {claims.length === 0 ? (
                  <div className="asset-no-claims">
                    <p className="asset-no-claims-title">No claims on record</p>
                    <p className="asset-no-claims-sub">
                      This asset has not had any claims filed.
                    </p>
                  </div>
                ) : (
                  <div className="claims-table-wrapper">
                    <table className="claims-table">
                      <thead>
                        <tr>
                          <th className="claims-th">Claim ID</th>
                          <th className="claims-th">Type</th>
                          <th className="claims-th">Incident Date</th>
                          <th className="claims-th">Filed Date</th>
                          <th className="claims-th claims-th--right">Amount</th>
                          <th className="claims-th claims-th--right">Approved</th>
                          <th className="claims-th">Status</th>
                          <th className="claims-th">Adjuster</th>
                        </tr>
                      </thead>
                      <tbody>
                        {claims.map(claim => (
                          <tr key={claim.id} className="claims-tr">
                            <td className="claims-td claims-td--id">{claim.id}</td>
                            <td className="claims-td">{claim.claimType}</td>
                            <td className="claims-td">{formatDate(claim.incidentDate)}</td>
                            <td className="claims-td">{formatDate(claim.filedDate)}</td>
                            <td className="claims-td claims-td--right claims-td--amount">
                              {formatCurrency(claim.claimAmount)}
                            </td>
                            <td className="claims-td claims-td--right">
                              {claim.approvedAmount != null
                                ? formatCurrency(claim.approvedAmount)
                                : <span className="claims-pending">Pending</span>}
                            </td>
                            <td className="claims-td">
                              <Tag
                                type={getStatusTagType(claim.status, 'claim')}
                                size="sm"
                              >
                                {claim.status}
                              </Tag>
                            </td>
                            <td className="claims-td claims-td--muted">{claim.adjuster}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Claim Descriptions */}
                    <div className="claim-descriptions">
                      <h4 className="claim-descriptions-heading">Incident Notes</h4>
                      {claims.map(claim => (
                        <div key={`desc-${claim.id}`} className="claim-desc-row">
                          <span className="claim-desc-id">{claim.id}</span>
                          <span className="claim-desc-type">{claim.claimType}</span>
                          <p className="claim-desc-text">{claim.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* Policy Details */}
            <TabPanel>
              <div className="asset-tab-panel">
                <StructuredList className="policy-list">
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>Field</StructuredListCell>
                      <StructuredListCell head>Value</StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    <StructuredListRow>
                      <StructuredListCell>Coverage Type</StructuredListCell>
                      <StructuredListCell>{asset.coverageType}</StructuredListCell>
                    </StructuredListRow>
                    <StructuredListRow>
                      <StructuredListCell>Coverage Limit</StructuredListCell>
                      <StructuredListCell>{formatCurrency(asset.coverageLimit)}</StructuredListCell>
                    </StructuredListRow>
                    <StructuredListRow>
                      <StructuredListCell>Deductible</StructuredListCell>
                      <StructuredListCell>{formatCurrency(asset.deductible)}</StructuredListCell>
                    </StructuredListRow>
                    <StructuredListRow>
                      <StructuredListCell>Monthly Premium</StructuredListCell>
                      <StructuredListCell>{formatCurrency(asset.monthlyPremium)}</StructuredListCell>
                    </StructuredListRow>
                    <StructuredListRow>
                      <StructuredListCell>Annual Premium</StructuredListCell>
                      <StructuredListCell>{formatCurrency(asset.yearlyPremium)}</StructuredListCell>
                    </StructuredListRow>

                    {/* Property-specific fields */}
                    {isProperty && (
                      <>
                        <StructuredListRow>
                          <StructuredListCell>Property Type</StructuredListCell>
                          <StructuredListCell>{asset.propertyType}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Building Class</StructuredListCell>
                          <StructuredListCell>{asset.buildingClass}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Year Built</StructuredListCell>
                          <StructuredListCell>{asset.yearBuilt}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Square Footage</StructuredListCell>
                          <StructuredListCell>
                            {asset.squareFeet?.toLocaleString()} sq ft
                          </StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Stories</StructuredListCell>
                          <StructuredListCell>{asset.stories}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Occupancy</StructuredListCell>
                          <StructuredListCell>{asset.occupancy}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Last Inspection</StructuredListCell>
                          <StructuredListCell>
                            {formatDate(asset.lastInspectionDate, 'long')}
                          </StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Next Inspection</StructuredListCell>
                          <StructuredListCell>
                            {formatDate(asset.nextInspectionDate, 'long')}
                          </StructuredListCell>
                        </StructuredListRow>
                      </>
                    )}

                    {/* Vehicle-specific fields */}
                    {!isProperty && (
                      <>
                        <StructuredListRow>
                          <StructuredListCell>Vehicle Type</StructuredListCell>
                          <StructuredListCell>{asset.vehicleType}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>VIN</StructuredListCell>
                          <StructuredListCell>
                            <code>{asset.vin}</code>
                          </StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>License Plate</StructuredListCell>
                          <StructuredListCell>{asset.licensePlate}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Current Mileage</StructuredListCell>
                          <StructuredListCell>
                            {asset.currentMileage?.toLocaleString()} mi
                          </StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Assigned Driver</StructuredListCell>
                          <StructuredListCell>{asset.assignedDriver}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Department</StructuredListCell>
                          <StructuredListCell>{asset.department}</StructuredListCell>
                        </StructuredListRow>
                      </>
                    )}
                  </StructuredListBody>
                </StructuredList>
              </div>
            </TabPanel>

            {/* Supporting Media — placeholder */}
            <TabPanel>
              <div className="asset-tab-panel">
                <div className="media-placeholder-grid">
                  {[
                    { icon: <Image size={32} />, label: 'Asset Photo 1', note: 'Last updated Feb 2024' },
                    { icon: <Image size={32} />, label: 'Asset Photo 2', note: 'Last updated Feb 2024' },
                    { icon: <DocumentMultiple_01 size={32} />, label: 'Policy Document', note: 'PDF · 2.4 MB' },
                    { icon: <DocumentMultiple_01 size={32} />, label: 'Inspection Report', note: 'PDF · 1.1 MB' },
                  ].map((item, i) => (
                    <div key={i} className="media-placeholder-item">
                      <div className="media-placeholder-icon">{item.icon}</div>
                      <p className="media-placeholder-label">{item.label}</p>
                      <p className="media-placeholder-note">{item.note}</p>
                      <Button kind="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
                <p className="media-disclaimer">
                  Supporting media is stored in the document management system.
                  Connect your DMS in Settings to enable direct uploads and previews.
                </p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
