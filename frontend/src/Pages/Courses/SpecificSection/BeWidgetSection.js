import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { ReactComponent as CourseEnrollmentIcon } from 'assets/icons/icon-course-enrollment.svg';
import { ConvertToNumber, ConvertToUSFormat, formatCredit } from 'utils/helper';
import { calculateBreakEvenStudents, calculateNetRevenue, calculateProjRevenue, isAdmin } from 'utils/common';
import { useAppContext } from 'context/AppContext';

const BeWidgetSection = ({ sectionDetails, instructorsInfo }) => {
  const breakEvenLevelColors = {
    Above: '#2B7D3B',
    Below: '#DC3545',
    Even: '#0071E3',
    '--': '#333333',
  };

  const { userData } = useAppContext();
  const isAdminUser = isAdmin(userData?.user_type);

  const [breakEvenLevel, minNumberOfStudents, projRevenue, netRevenue] = useMemo(() => {
    const salary = instructorsInfo?.filter(instructor => instructor.is_assigned)
    ?.reduce((total, instructor) => {
      return total + parseFloat(instructor?.approved_salary || 0);
    }, 0);
    const inStateTuition = sectionDetails?.in_state_tuition_fees;
    const credits = formatCredit(sectionDetails?.credits);
    const projectedEnrollment = ConvertToNumber(
      sectionDetails?.proj_enrollment
    );

    const projRev = calculateProjRevenue({
      credits, inStateTuition, projectedEnrollment
    })

    const netRev = calculateNetRevenue({
      salary,
      projRev
    });

    const minStudentsForBE =
      salary > 0
        ? calculateBreakEvenStudents({ credits, inStateTuition, salary })
        : 0;

    let level = '--';
    if(parseFloat(credits) == 0){
      level = 'Below';
      return [level, salary, projRev,netRev];
    }

    if (!salary) {
      level = 'N/A';
    } else if (projectedEnrollment < minStudentsForBE) {
      level = 'Below';
    } else if (projectedEnrollment > minStudentsForBE) {
      level = 'Above';
    } else if (projectedEnrollment === minStudentsForBE) {
      level = 'Even';
    }

    return [level, minStudentsForBE, projRev, netRev];
  }, [sectionDetails, instructorsInfo]);

  return (
    <Grid container spacing={1} sx={{ borderBottom: '1px solid #c9c9c9' }}>
      <Grid item xs="12">
        <Typography
          variant="h3"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1.5rem',
            alignItems: 'center',
            display: 'flex',
            gap: '1.5rem',
          }}
        >
          <CourseEnrollmentIcon
            style={{ height: '3.5rem', width: '3.25rem' }}
          />
          Course Snapshot
        </Typography>
      </Grid>
      <Grid item container xs="12">
        <Grid
          item
          xs="auto"
          sx={{ borderRight: '1px solid #c9c9c9', paddingRight: '0.3rem' }}
        >
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#333333',
              fontSize: '1.25rem',
              marginBottom: '0',
            }}
          >
            Projected Enr.:
          </Typography>
          <Typography
            variant="h1"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '4.5rem',
            }}
            data-testid="be-widget-proj-enrollment"
          >
            {ConvertToNumber(sectionDetails?.proj_enrollment)}
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#333333',
              fontSize: '1rem',
              marginBottom: '0',
            }}
          >
            Stop Point:
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
            }}
            data-testid="be-widget-storp-point"
          >
            {ConvertToNumber(sectionDetails?.stop_point)}
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Break-even Level:
          </Typography>
          <Typography
            variant="subheader"
            paragraph
            sx={{
              fontWeight: 600,
              color: breakEvenLevelColors[breakEvenLevel],
              fontSize: '1.5rem',
            }}
            data-testid="be-widget-break-even-level"
          >
            {breakEvenLevel}
          </Typography>
        </Grid>
        <Grid item xs sx={{ paddingLeft: '0.75rem' }}>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#333333',
              fontSize: '1rem',
              marginBottom: '0',
            }}
          >
            Min. # of Students for BE:
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
            }}
            data-testid="be-widget-break-even-status"
          >
            {minNumberOfStudents || 'N/A'}
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#333333',
              fontSize: '1rem',
              marginBottom: '0',
            }}
          >
            Est. In-State Tuit:
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
            }}
            data-testid="be-widget-in-state-tuition-fees"
          >
            {ConvertToUSFormat(sectionDetails?.in_state_tuition_fees)}
          </Typography>
          { isAdminUser && <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#333333',
              fontSize: '1rem',
              marginBottom: '0',
            }}
          >
            Projected Revenue:
          </Typography>}
          {isAdminUser && <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
            }}
            data-testid="be-widget-in-projected-rev"
          >
            {ConvertToUSFormat(projRevenue)}
          </Typography>}
          {isAdminUser && <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#333333',
              fontSize: '1rem',
              marginBottom: '0',
            }}
          >
            Est. Net Revenue:
          </Typography>}
          {isAdminUser && <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
            }}
            data-testid="be-widget-in-net-rev"
          >
            {ConvertToUSFormat(netRevenue)}
          </Typography>}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BeWidgetSection;
