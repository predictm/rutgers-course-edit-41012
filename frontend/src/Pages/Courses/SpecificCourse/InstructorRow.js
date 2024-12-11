import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ReactComponent as EditIcon } from 'assets/icons/icon-edit.svg';
import SwitchInput from 'Components/SwitchInput';
import { StyledGridItem } from './StyledComponent';
import { appointmentStatusList } from 'utils/constant';
import { ConvertToUSFormat } from 'utils/helper';

const InstructorRow = ({
  instructor,
  onEditClick,
  onInstructorAssignToggle,
  isAppointmentRequired,
}) => {
  const [isAssigned, setIsAssigned] = useState(instructor?.is_assigned);

  useEffect(() => {
    setIsAssigned(instructor?.is_assigned);
  }, [instructor?.is_assigned]);

  const toggleAssigned = () => {
    setIsAssigned(!isAssigned);
    onInstructorAssignToggle?.(instructor, !isAssigned);
  };

  const handleEditInstructor = () => {
    onEditClick(instructor);
  };

  return (
    <Grid
      key={instructor?.id}
      item
      xs={12}
      container
      sx={{ borderTop: '1px dotted #c9c9c9' }}
    >
      <StyledGridItem item xs={3}>
        <Typography
          variant="subtitle"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#666666',
            fontSize: '1rem',
            margin: 0,
          }}
        >
          {instructor?.instructor_info?.first_name}{' '}
          {instructor?.instructor_info?.middle_name
            ? `${instructor?.instructor_info?.middle_name} `
            : ''}
          {instructor?.instructor_info?.last_name}
        </Typography>
      </StyledGridItem>
      <StyledGridItem item xs={3} sx={{ justifyContent: 'center' }}>
        <div style={{ width: '60%' }}>
          <SwitchInput
            label={isAssigned ? 'Assigned' : 'Unassigned'}
            checked={isAssigned}
            controlSx={{ marginRight: 0, color: '#666666' }}
            onChange={toggleAssigned}
          />
        </div>
      </StyledGridItem>
      <StyledGridItem item xs={2} sx={{ justifyContent: 'center' }}>
        <Typography
          variant="subtitle"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#666666',
            fontSize: '1rem',
            margin: 0,
            textTransform: 'capitalize',
            width: '80%',
          }}
        >
          Payroll{' '}
          {!instructor?.appointment_status ||
          instructor?.appointment_status?.toLowerCase() === 'pending' ? (
            <strong>Pending</strong>
          ) : (
            appointmentStatusList?.find(
              status => status?.value === instructor?.appointment_status
            )?.label
          )}
        </Typography>
      </StyledGridItem>
      <StyledGridItem item xs={3} sx={{ justifyContent: 'center' }}>
        <Typography
          variant="subtitle"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#666666',
            fontSize: '1rem',
            margin: 0,
            width: '80%',
          }}
        >
          {instructor?.appointment_status?.toLowerCase() === 'pending'
            ? `Proposed Salary ${ConvertToUSFormat(instructor?.proposed_salary) || ''}`
            : `Approved Salary ${ConvertToUSFormat(instructor?.approved_salary) || ''}`}
        </Typography>
      </StyledGridItem>
      <StyledGridItem
        item
        xs={true}
        sx={{ justifyContent: 'flex-end', paddingRight: '1rem' }}
      >
        <EditIcon
          style={{
            height: '1.5rem',
            width: '1.5rem',
            opacity: isAppointmentRequired ? 1 : 0.5,
            cursor: isAppointmentRequired ? 'pointer' : 'not-allowed',
          }}
          onClick={isAppointmentRequired ? handleEditInstructor : null}
        />
      </StyledGridItem>
    </Grid>
  );
};

export default InstructorRow;
