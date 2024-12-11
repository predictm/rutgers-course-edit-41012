import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';

import { ReactComponent as ExpandIcon } from 'assets/icons/icon-arrow-circle-color.svg';
import { ReactComponent as CollapseIcon } from 'assets/icons/icon-arrow-circle-up.svg';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import AccountingForm from './AccountingForm';

const AccountsTableRow = ({
  columns,
  row,
  onToggleStatus,
  refetchAccounts,
}) => {
  const [open, setOpen] = useState(false);

  const toggleRow = () => setOpen(!open);

  const handleToggleStatus = () => onToggleStatus?.(row);

  return (
    <>
      <StyledTableRow
        hover
        open={open}
        data-test-id={`account-list-row-${row?.id}`}
      >
        {columns.map(column => (
          <StyledTableCell key={column.dataKey} align="left">
            {column.renderColumn
              ? column.renderColumn(row, {
                  onToggleStatus: handleToggleStatus,
                  testId: `account-list-${row?.id}`,
                })
              : row[column.dataKey]}
          </StyledTableCell>
        ))}
        <StyledTableCell align="center">
          {open ? (
            <CollapseIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-test-id={`account-list-row-${row?.id}-collapse`}
            />
          ) : (
            <ExpandIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-test-id={`account-list-row-${row?.id}-expand`}
            />
          )}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow
        sx={{ border: 0 }}
        data-test-id={`account-list-row-${row?.id}-collapsed`}
      >
        <StyledTableCell sx={{ padding: 0 }} colSpan={columns?.length + 1}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ background: 'white' }}
          >
            <AccountingForm
              accountingData={row}
              refetchAccounts={refetchAccounts}
              background="white"
              open={open}
              testId={`account-list-edit-form-${row?.id}`}
            />
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default AccountsTableRow;
