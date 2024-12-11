import React from 'react';

import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';

const AppointmentTableRow = ({ columns, row, onEditClick,onContractClick, testId, appointments }) => {
  return (
    <StyledTableRow hover>
      {columns.map(column => (
        <StyledTableCell key={column.dataKey} align="left">
          {column.renderColumn
            ? column.renderColumn(row, {
                onEditClick,
                onContractClick,
                testId,
              },appointments)
            : row[column.dataKey]}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
};

export default AppointmentTableRow;
