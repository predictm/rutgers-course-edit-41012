import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';

import { ReactComponent as ExpandIcon } from 'assets/icons/icon-arrow-circle-color.svg';
import { ReactComponent as CollapseIcon } from 'assets/icons/icon-arrow-circle-up.svg';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import UserForm from './UserForm';

const UsersTableRow = ({
  columns,
  row,
  onToggleStatus,
  refetchUsers,
  testId,
}) => {
  const [open, setOpen] = useState(false);

  const toggleRow = () => setOpen(!open);

  const handleToggleStatus = () => onToggleStatus?.(row);

  return (
    <>
      <StyledTableRow hover open={open}>
        {columns.map(column => (
          <StyledTableCell key={column.dataKey} align="left">
            {column.renderColumn
              ? column.renderColumn(row, {
                  onToggleStatus: handleToggleStatus,
                  testId,
                })
              : row[column.dataKey]}
          </StyledTableCell>
        ))}
        <StyledTableCell align="center">
          {open ? (
            <CollapseIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-collapse-row`}
            />
          ) : (
            <ExpandIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-expand-row`}
            />
          )}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow
        sx={{ border: 0 }}
        data-testid={`${testId}-collapsed-row-data`}
      >
        <StyledTableCell sx={{ padding: 0 }} colSpan={columns?.length + 1}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ background: 'white' }}
          >
            <UserForm
              userData={row}
              refetchUsers={refetchUsers}
              background="white"
              open={open}
              testId={`${testId}-form`}
            />
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default UsersTableRow;
