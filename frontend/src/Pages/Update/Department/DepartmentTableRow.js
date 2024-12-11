import React from 'react';

import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';

const DepartmentTableRow = ({ columns, row, onEditClick, testId }) => {
  return (
    <StyledTableRow hover>
      {columns.map(column => (
        <StyledTableCell key={column.dataKey} align="left">
          {column.renderColumn
            ? column.renderColumn(row, {
                onEditClick,
                testId,
              })
            : row[column.dataKey]}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
};

export default DepartmentTableRow;
