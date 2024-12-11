import React from 'react';

import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';

const AccountsTableRow = ({ columns, row, onToggleStatus, onEditClick }) => {
  const handleToggleStatus = () => onToggleStatus?.(row);

  return (
    <StyledTableRow hover>
      {columns.map(column => (
        <StyledTableCell key={column.dataKey} align="left">
          {column.renderColumn
            ? column.renderColumn(row, {
                onToggleStatus: handleToggleStatus,
                onEditClick: onEditClick,
                testId: `Announcement-${row?.id}`,
              })
            : row[column.dataKey]}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
};

export default AccountsTableRow;
