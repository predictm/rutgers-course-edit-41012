import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';

import SwitchInput from 'Components/SwitchInput';
import InstructorRow from './InstructorRow';
import CyanButton from 'StyledComponents/CyanButton';
import { StyledGridItem, StyledGridContainer } from './StyledComponent';

const InstructorsInfo = ({
  row,
  open,
  onEditClick,
  onAppointButtonClick,
  onInstructorAssignToggle,
  onAppointmentRequiredToggle,
  testId,
}) => {
  const [isAppointmentRequired, setIsAppointmentRequired] = useState(
    row?.appointment_required
  );

  useEffect(() => {
    setIsAppointmentRequired(row?.appointment_required);
  }, [row?.appointment_required]);

  const toggleAppointmentRequired = () => {
    setIsAppointmentRequired(!isAppointmentRequired);
    onAppointmentRequiredToggle?.(row, !isAppointmentRequired);
  };

  const handleClick = () => {
    onAppointButtonClick(row);
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <StyledGridContainer>
        <StyledGridItem item xs={12} sx={{ borderTop: '1px dotted #c9c9c9' }}>
          <SwitchInput
            checked={isAppointmentRequired}
            label="Appointment Required"
            onChange={toggleAppointmentRequired}
            testId={`${testId}-appointment-required`}
          />
        </StyledGridItem>
        {row?.appointment?.map((instructor, index) => {
          return (
            <InstructorRow
              key={instructor?.id}
              instructor={instructor}
              onEditClick={onEditClick}
              StyledGridItem={StyledGridItem}
              onInstructorAssignToggle={onInstructorAssignToggle}
              isAppointmentRequired={isAppointmentRequired}
              testId={`${testId}-${index}`}
            />
          );
        })}
        <Grid item xs={12} sx={{ padding: '0.75rem 0.5rem' }}>
          <CyanButton
            label={`Appoint Instructor to ${row.section_no}`}
            onClick={handleClick}
            disabled={!isAppointmentRequired}
            testId={`${testId}-appoint-instructor`}
          />
        </Grid>
      </StyledGridContainer>
    </Collapse>
  );
};

export default InstructorsInfo;
