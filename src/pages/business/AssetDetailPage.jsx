import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Tag,
  DataTable, TableContainer, Table, TableHead, TableRow,
  TableHeader, TableBody, TableCell,
} from '@carbon/react';
import { ArrowLeft, Document, Image, Car, Building } from '@carbon/icons-react';
import { assets, formatCurrency } from '../../data/financialData';
import './AssetDetailPage.scss';

const CLAIM_HEADERS = [
  { key: 'id', header: 'Claim ID' },
  { key: 'date', header: 'Date' },
  { key: 'type', header: 'Type' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
];

const STATUS_TYPE = { Settled: 'green', 'In Review': 'yellow', Denied: 'red' };

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const asset = assets.find((a) => a.id === assetId);

  if (!asset) {
    return (
      <div className="asset-detail asset-detail--not-found">
        <p>Asset not found.</p>
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  const isAuto = asset.category === 'Auto';

  const claimRows = asset.claims.map((c) => ({
    id: c.id,
    date: c.date,
    type: c.type,
    amount: formatCurrency(c.amount),
    status: c.status,
  }));

  return (
    <div className="asset-detail">
      {/* Back */}
      <div className="asset-detail__back-row">
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          size="sm"
          onClick={() => navigate(-1)}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Asset header */}
      <div className="asset-detail__hero">
        <div className="asset-detail__icon">
          {isAuto ? <Car size={32} /> : <Building size={32} />}
        </div>
        <div className="asset-detail__hero-info">
          <div className="asset-detail__hero-top">
            <Tag type={isAuto ? 'blue' : 'green'} size="sm">{asset.category}</Tag>
            <span className="asset-detail__id">{asset.id}</span>
          </div>
          <h1 className="asset-detail__name">{asset.name}</h1>
          {isAuto ? (
            <p className="asset-detail__meta">Driver: {asset.driver} &middot; VIN: {asset.vin}</p>
          ) : (
            <p className="asset-detail__meta">{asset.address} &middot; {asset.sqft?.toLocaleString()} sq ft</p>
          )}
        </div>
      </div>

      {/* Policy info */}
      <div className="asset-detail__policy-grid">
        <div className="asset-detail__policy-card">
          <p className="asset-detail__policy-label">Coverage Limit</p>
          <p className="asset-detail__policy-value">{formatCurrency(asset.coverageLimit)}</p>
        </div>
        <div className="asset-detail__policy-card">
          <p className="asset-detail__policy-label">Policy Effective</p>
          <p className="asset-detail__policy-value">{asset.policyStart}</p>
        </div>
        <div className="asset-detail__policy-card">
          <p className="asset-detail__policy-label">Next Premium Due</p>
          <p className="asset-detail__policy-value">{formatCurrency(asset.premiumDue)}</p>
        </div>
        <div className="asset-detail__policy-card">
          <p className="asset-detail__policy-label">Due Date</p>
          <p className="asset-detail__policy-value">{asset.dueDate}</p>
        </div>
        <div className="asset-detail__policy-card">
          <p className="asset-detail__policy-label">Total Claims (Lifecycle)</p>
          <p className="asset-detail__policy-value asset-detail__policy-value--claims">
            {asset.totalClaims === 0 ? 'No claims' : formatCurrency(asset.totalClaims)}
          </p>
        </div>
        <div className="asset-detail__policy-card">
          <p className="asset-detail__policy-label">Number of Claims</p>
          <p className="asset-detail__policy-value">{asset.claims.length}</p>
        </div>
      </div>

      {/* Claims history */}
      <section className="asset-detail__section">
        <h2 className="asset-detail__section-title">Claim History</h2>
        {asset.claims.length === 0 ? (
          <div className="asset-detail__no-claims">
            <p>No claims have been filed for this asset.</p>
          </div>
        ) : (
          <DataTable rows={claimRows} headers={CLAIM_HEADERS} isSortable>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((h) => (
                        <TableHeader key={h.key} {...getHeaderProps({ header: h })}>
                          {h.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'status' ? (
                              <Tag type={STATUS_TYPE[cell.value] || 'gray'} size="sm">
                                {cell.value}
                              </Tag>
                            ) : cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        )}
      </section>

      {/* Policy documents */}
      <section className="asset-detail__section">
        <h2 className="asset-detail__section-title">Policy Documents</h2>
        <div className="asset-detail__doc-list">
          {[
            'Underwriting Policy — Full Coverage',
            'Coverage Limits & Exclusions',
            'Endorsements & Riders',
          ].map((doc) => (
            <div key={doc} className="asset-detail__doc-item">
              <Document size={20} className="asset-detail__doc-icon" />
              <span className="asset-detail__doc-name">{doc}</span>
              <span className="asset-detail__doc-badge">PDF</span>
            </div>
          ))}
        </div>
      </section>

      {/* Supporting media */}
      <section className="asset-detail__section">
        <h2 className="asset-detail__section-title">Supporting Media</h2>
        <div className="asset-detail__media-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="asset-detail__media-card">
              <div className="asset-detail__media-placeholder">
                <Image size={24} />
              </div>
              <p className="asset-detail__media-label">
                {isAuto ? `Vehicle Photo ${n}` : `Property Photo ${n}`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
