import React, { useState } from 'react';
import {
  DataTable,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from '@carbon/react';
import { formatCurrency } from '../../utils/businessHelpers';
import './AssetLedger.scss';

const HEADERS = [
  { key: 'name', header: 'Asset Name' },
  { key: 'category', header: 'Category' },
  { key: 'premiumDue', header: 'Premium Due' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Total Claims' },
  { key: 'region', header: 'Region' },
];

const formatLedgerDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatCell = (key, value) => {
  if (key === 'premiumDue' || key === 'totalClaims') return formatCurrency(value, false);
  if (key === 'dueDate') return formatLedgerDate(value);
  return value;
};

export default function AssetLedger({ assets }) {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const openAsset = (rowId) => setSelectedAsset(assets.find((asset) => asset.id === rowId) || null);

  return (
    <>
      <DataTable rows={assets} headers={HEADERS} isSortable>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps, onInputChange }) => (
          <TableContainer
            title="Asset Performance Ledger"
            description="Click on any row to view detailed asset information"
            className="asset-ledger"
            {...getTableContainerProps()}
          >
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={onInputChange}
                  placeholder="Search assets"
                  persistent={false}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const { key, ...headerProps } = getHeaderProps({ header });
                    return (
                      <TableHeader key={key} {...headerProps}>
                        {header.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  return (
                    <TableRow
                      key={key}
                      {...rowProps}
                      className="asset-ledger__row"
                      tabIndex={0}
                      onClick={() => openAsset(row.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openAsset(row.id);
                        }
                      }}
                    >
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {formatCell(cell.info.header, cell.value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={HEADERS.length}>No assets match your search.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      {selectedAsset && (
        <Modal
          open
          passiveModal
          size="sm"
          modalLabel={selectedAsset.category}
          modalHeading={selectedAsset.name}
          onRequestClose={() => setSelectedAsset(null)}
        >
          <dl className="asset-detail">
            <div className="asset-detail__item">
              <dt>Asset ID</dt>
              <dd>{selectedAsset.id}</dd>
            </div>
            <div className="asset-detail__item">
              <dt>Region</dt>
              <dd>{selectedAsset.region}</dd>
            </div>
            <div className="asset-detail__item">
              <dt>Premium due</dt>
              <dd>{formatCurrency(selectedAsset.premiumDue, false)}</dd>
            </div>
            <div className="asset-detail__item">
              <dt>Due date</dt>
              <dd>{formatLedgerDate(selectedAsset.dueDate)}</dd>
            </div>
            <div className="asset-detail__item">
              <dt>Total claims</dt>
              <dd>{formatCurrency(selectedAsset.totalClaims, false)}</dd>
            </div>
          </dl>
        </Modal>
      )}
    </>
  );
}
