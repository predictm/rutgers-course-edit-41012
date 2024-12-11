import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { ReactComponent as EditIcon } from 'assets/icons/icon-edit.svg';
import SwitchInput from 'Components/SwitchInput';
import { formatSalary } from 'utils/helper';

const InstructorBlock = ({
  instructor,
  isAppointmentRequired,
  onInstructorAssignToggle,
  onEditClick,
  testId,
}) => {
  const [isAssigned, setIsAssigned] = useState(instructor?.is_assigned);

  useEffect(() => {
    setIsAssigned(instructor?.is_assigned);
  }, [instructor?.is_assigned]);

  const toggleAssigned = () => {
    setIsAssigned(!isAssigned);
    onInstructorAssignToggle(instructor, !isAssigned);
  };

  return (
    <Grid
      container
      sx={{
        '&:not(:first-child)': {
          borderTop: '1px dashed #707070',
          paddingTop: '1rem',
          marginTop: '1rem',
        },
      }}
    >
      <Grid xs="12" item>
        <Typography
          variant="subtitle"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#666666',
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
            opacity: isAppointmentRequired ? 1 : '0.8',
          }}
          data-testid={`${testId}-instructor-name`}
        >
          {instructor?.instructor_info?.first_name}{' '}
          {instructor?.instructor_info?.middle_name
            ? `${instructor?.instructor_info?.middle_name} `
            : ''}
          {instructor?.instructor_info?.last_name}
          <EditIcon
            style={{
              width: '1.5rem',
              height: '1.5rem',
              opacity: isAppointmentRequired ? 1 : '0.5',
              cursor: isAppointmentRequired ? 'pointer' : 'not-allowed',
            }}
            onClick={isAppointmentRequired ? onEditClick : null}
            data-testid={`${testId}-edit-instructor`}
          />
        </Typography>
        <Typography
          variant="subtitle"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#666666',
            fontSize: '1rem',
            margin: 0,
            opacity: isAppointmentRequired ? 1 : '0.8',
          }}
        >
          Approved Salary * Fringe
        </Typography>
        <Typography
          variant="subtitle"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#666666',
            fontSize: '1rem',
            opacity: isAppointmentRequired ? 1 : '0.8',
          }}
          data-testid={`${testId}-approved-salary`}
        >
          {instructor?.appointment_status?.toLowerCase() !== 'pending'
        ? `$${formatSalary(parseFloat(instructor?.approved_salary || 0).toFixed(2))} x $1.0765 = $${formatSalary(parseFloat(instructor?.approved_salary || 0) * 1.0765)}`
        : '-----'}
        </Typography>
      </Grid>
      <Grid xs="12" item container>
        <Grid
          xs="auto"
          item
          sx={{
            alignItems: 'center',
            display: 'flex',
            paddingRight: '0.75rem',
          }}
        >
          <SwitchInput
            label={isAssigned ? 'Assigned' : 'Unassigned'}
            checked={isAssigned}
            controlSx={{ margin: 0, fontSize: '1rem' }}
            onChange={toggleAssigned}
            testId={`${testId}-toggle-assigned`}
          />
        </Grid>
        <Grid
          xs
          item
          sx={{
            alignItems: 'center',
            display: 'flex',
            paddingLeft: '0.75rem',
            borderLeft: '1px solid #707070',
            fontSize: '1rem',
          }}
        >
          <span data-testid={`${testId}-salary-status`}>
            Salary&nbsp;
            {!instructor?.appointment_status ||
            instructor?.appointment_status?.toLowerCase() === 'pending' ? (
              <strong>Pending</strong>
            ) : (
              <strong style={{ color: '#2B7D3B', textTransform: 'capitalize' }}>
                {instructor?.appointment_status_detail?.toLowerCase()}
              </strong>
            )}
          </span>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InstructorBlock;
