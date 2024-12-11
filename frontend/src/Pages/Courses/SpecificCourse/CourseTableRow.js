import React, { useState } from 'react';
import { ReactComponent as ExpandIcon } from 'assets/icons/icon-arrow-circle-color.svg';
import { ReactComponent as CollapseIcon } from 'assets/icons/icon-arrow-circle-up.svg';
import InstructorsInfo from './InstructorsInfo';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';

const CourseTableRow = ({
  columns,
  row,
  onViewClick,
  onEditClick,
  onAppointButtonClick,
  onAddNewInstructorButtonClick,
  onInstructorAssignToggle,
  onAppointmentRequiredToggle,
  testId,
}) => {
  const [open, setOpen] = useState(false);

  const toggleRow = () => setOpen(!open);

  const handleAppointButtonClick = rowData => () =>
    onAppointButtonClick(rowData);

  return (
    <>
      <StyledTableRow hover open={open} data-testid={testId}>
        {columns.map(column => (
          <StyledTableCell key={column.dataKey} align="left">
            {column.renderColumn
              ? column.renderColumn(row, {
                  onViewClick,
                  onAppointButtonClick: handleAppointButtonClick(row),
                  testId,
                })
              : row[column.dataKey]}
          </StyledTableCell>
        ))}
        <StyledTableCell>
          {open ? (
            <CollapseIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-toogle-row`}
            />
          ) : (
            <ExpandIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-toogle-row`}
            />
          )}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow
        sx={{ border: 0 }}
        open={open}
        data-testid={`collapsed-${testId}`}
      >
        <StyledTableCell sx={{ padding: 0 }} colSpan={columns?.length + 1}>
          <InstructorsInfo
            row={row}
            open={open}
            onEditClick={onEditClick}
            onAppointButtonClick={onAppointButtonClick}
            onAddNewInstructorButtonClick={onAddNewInstructorButtonClick}
            onInstructorAssignToggle={onInstructorAssignToggle}
            onAppointmentRequiredToggle={onAppointmentRequiredToggle}
            testId={`${testId}-instructor`}
          />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default CourseTableRow;
