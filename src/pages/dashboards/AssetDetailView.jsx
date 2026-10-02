import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Tag,
  Tile,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  InlineNotification,
} from '@carbon/react';
import { ArrowLeft, Image as ImageIcon } from '@carbon/icons-react';
import {
  getPropertyById,
  getVehicleById,
  getClaimsForAsset,
} from '../../data/businessMockData';
import { formatCurrency } from '../../data/financialDashboardData';
import './AssetDetailView.scss';

const VARIANT_LABELS = {
  conservative: 'Conservative',
  modern: 'Modern',
  wild: 'Wild',
};

export default function AssetDetailView() {
  const { variant, assetId } = useParams();
  const navigate = useNavigate();

  const property = getPropertyById(assetId);
  const vehicle = property ? null : getVehicleById(assetId);
  const asset = property || vehicle;
  const claims = getClaimsForAsset(assetId);

  const variantClass = VARIANT_LABELS[variant] ? variant : 'conservative';

  if (!asset) {
    return (
      <div className={`asset-detail asset-detail--${variantClass}`}>
        <InlineNotification
          kind="error"
          title="Asset not found"
          subtitle={`No asset exists with id ${assetId}.`}
          hideCloseButton
        />
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={() => navigate(`/dashboard-prototypes/${variantClass}`)}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const claimHeaders = [
    { key: 'claimType', header: 'Claim Type' },
    { key: 'incidentDate', header: 'Incident Date' },
    { key: 'status', header: 'Status' },
    { key: 'claimAmount', header: 'Claim Amount' },
    { key: 'approvedAmount', header: 'Approved Amount' },
  ];

  const claimRows = claims.map((c) => ({
    id: c.id,
    claimType: c.claimType,
    incidentDate: c.incidentDate,
    status: c.status,
    claimAmount: formatCurrency(c.claimAmount),
    approvedAmount: c.approvedAmount ? formatCurrency(c.approvedAmount) : '—',
  }));

  return (
    <div className={`asset-detail asset-detail--${variantClass}`}>
      <div className="asset-detail__header">
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          onClick={() => navigate(`/dashboard-prototypes/${variantClass}`)}
        >
          Back to Dashboard
        </Button>
        <div className="asset-detail__title-row">
          <h1 className="asset-detail__title">
            {property ? property.name : `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          </h1>
          <Tag type={property ? 'blue' : 'red'}>{property ? 'Property' : 'Auto'}</Tag>
          <Tag type="gray">{asset.status}</Tag>
        </div>
        <p className="asset-detail__subtitle">
          {property ? property.address : `VIN ${vehicle.vin} · Plate ${vehicle.licensePlate}`}
        </p>
      </div>

      <div className="asset-detail__stats">
        <Tile className="asset-detail__stat-tile">
          <p className="asset-detail__stat-label">Monthly Premium</p>
          <p className="asset-detail__stat-value">{formatCurrency(asset.monthlyPremium)}</p>
        </Tile>
        <Tile className="asset-detail__stat-tile">
          <p className="asset-detail__stat-label">Yearly Premium</p>
          <p className="asset-detail__stat-value">{formatCurrency(asset.yearlyPremium)}</p>
        </Tile>
        <Tile className="asset-detail__stat-tile">
          <p className="asset-detail__stat-label">Lifetime Claims</p>
          <p className="asset-detail__stat-value">{claims.length}</p>
        </Tile>
        <Tile className="asset-detail__stat-tile">
          <p className="asset-detail__stat-label">Total Claimed</p>
          <p className="asset-detail__stat-value">
            {formatCurrency(claims.reduce((t, c) => t + c.claimAmount, 0))}
          </p>
        </Tile>
      </div>

      <Tabs>
        <TabList aria-label="Asset detail sections">
          <Tab>Claim History</Tab>
          <Tab>Policy &amp; Coverage</Tab>
          <Tab>Media</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {claimRows.length === 0 ? (
              <p className="asset-detail__empty">No claims filed for this asset.</p>
            ) : (
              <DataTable rows={claimRows} headers={claimHeaders}>
                {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader key={header.key} {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id} {...getRowProps({ row })}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </DataTable>
            )}
          </TabPanel>

          <TabPanel>
            <div className="asset-detail__coverage-grid">
              <div>
                <p className="asset-detail__stat-label">Coverage Type</p>
                <p className="asset-detail__coverage-value">{asset.coverageType}</p>
              </div>
              <div>
                <p className="asset-detail__stat-label">Coverage Limit</p>
                <p className="asset-detail__coverage-value">{formatCurrency(asset.coverageLimit)}</p>
              </div>
              <div>
                <p className="asset-detail__stat-label">Deductible</p>
                <p className="asset-detail__coverage-value">{formatCurrency(asset.deductible)}</p>
              </div>
              {property ? (
                <>
                  <div>
                    <p className="asset-detail__stat-label">Building Class</p>
                    <p className="asset-detail__coverage-value">{property.buildingClass}</p>
                  </div>
                  <div>
                    <p className="asset-detail__stat-label">Square Feet</p>
                    <p className="asset-detail__coverage-value">{property.squareFeet.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="asset-detail__stat-label">Year Built</p>
                    <p className="asset-detail__coverage-value">{property.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="asset-detail__stat-label">Next Inspection</p>
                    <p className="asset-detail__coverage-value">{property.nextInspectionDate}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="asset-detail__stat-label">Vehicle Type</p>
                    <p className="asset-detail__coverage-value">{vehicle.vehicleType}</p>
                  </div>
                  <div>
                    <p className="asset-detail__stat-label">Assigned Driver</p>
                    <p className="asset-detail__coverage-value">{vehicle.assignedDriver}</p>
                  </div>
                  <div>
                    <p className="asset-detail__stat-label">Department</p>
                    <p className="asset-detail__coverage-value">{vehicle.department}</p>
                  </div>
                  <div>
                    <p className="asset-detail__stat-label">Current Mileage</p>
                    <p className="asset-detail__coverage-value">{vehicle.currentMileage.toLocaleString()} mi</p>
                  </div>
                </>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="asset-detail__media-placeholder">
              <ImageIcon size={32} />
              <p>No supporting photos or documentation have been uploaded for this asset yet.</p>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
