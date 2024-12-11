import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';

import { ReactComponent as ExpandIcon } from 'assets/icons/icon-arrow-circle-color.svg';
import { ReactComponent as CollapseIcon } from 'assets/icons/icon-arrow-circle-up.svg';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import TuitionForm from './TuitionForm';

const TuitionTableRow = ({
  columns,
  tuitionData,
  refetchTuitionList,
  unitList,
  termAndYearList,
  testId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleRow = () => setOpen(!open);

  return (
    <>
      <StyledTableRow hover open={open}>
        {columns.map(column => (
          <StyledTableCell key={column.dataKey} align="left">
            {column.renderColumn(tuitionData, { testId })}
          </StyledTableCell>
        ))}
        <StyledTableCell align="center">
          {open ? (
            <CollapseIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-collapse`}
            />
          ) : (
            <ExpandIcon
              style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
              onClick={toggleRow}
              data-testid={`${testId}-expand`}
            />
          )}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow sx={{ border: 0 }}>
        <StyledTableCell sx={{ padding: 0 }} colSpan={columns?.length + 1}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ background: 'white' }}
          >
            <TuitionForm
              refetchTuitionList={refetchTuitionList}
              tuitionData={tuitionData}
              unitList={unitList}
              termAndYearList={termAndYearList}
              background="#FFFFFF"
              testId={`${testId}-edit-form`}
            />
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default TuitionTableRow;
