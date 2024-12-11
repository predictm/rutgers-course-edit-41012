import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import FormCheckbox from 'Components/FormCheckbox';
import { formatTime } from 'utils/helper';

const MeetingsInfo = ({ meetings }) => {
  const meetingDays = [
    { label: 'Mon', value: 'Monday' },
    { label: 'Tue', value: 'Tuesday' },
    { label: 'Wed', value: 'Wednesday' },
    { label: 'Thu', value: 'Thursday' },
    { label: 'Fri', value: 'Friday' },
  ];
  const getMeetingInfo = () => {
    const meetingDetails = {
      days: {},
      campus: '',
      room: '',
      mode: '',
      building: '',
      timeOfDay: '',
      startTime: '',
      endTime: '',
    };

    meetings?.forEach(schedule => {
      meetingDetails.days[schedule?.day_of_week] = 1;
      meetingDetails.campus = schedule?.campus_location;
      meetingDetails.room = schedule?.room;
      meetingDetails.mode = schedule?.meeting_mode_cd;
      meetingDetails.building = schedule?.bldg_cd;
      meetingDetails.timeOfDay = schedule?.pm_code_day;
      meetingDetails.startTime = schedule.start_time;
      meetingDetails.endTime = schedule.end_time;
    });

    return meetingDetails;
  };

  const meetingInfo = getMeetingInfo();

  return (
    <>
      <Grid xs={12} item>
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#333333',
            fontSize: '1.5rem',
            margin: 0,
          }}
        >
          Meeting
        </Typography>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid xs={6} sx={{ paddingRight: '0.5rem', display: 'flex' }}>
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Day:
          </Typography>
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
              margin: 0,
              marginLeft: '1rem',
            }}
          >
            {meetingDays?.map(day => {
              return (
                <FormCheckbox
                  key={`meeting-day-${day.value}`}
                  label={day.label}
                  checked={meetingInfo?.days?.[day.value] ? true : false}
                  sx={{
                    cursor: 'initial',
                    span: { backgroundColor: '#f5f5f5' },
                  }}
                  labelSx={{ alignItems: 'center' }}
                  readOnly
                  testId={`meeting-day-${day.value}`}
                />
              );
            })}
          </Typography>
        </Grid>
        <Grid xs={6} sx={{ paddingLeft: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Campus:
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
            data-testid="meeting-campus"
          >
            {meetingInfo?.campus || '--N/A--'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid xs={6} sx={{ paddingRight: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            StatTime:
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
            data-testid="meeting-starttime"
          >
            {formatTime(meetingInfo?.startTime) || '--N/A--'}
          </Typography>
        </Grid>
        <Grid xs={6} sx={{ paddingLeft: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Building:
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
            data-testid="meeting-building"
          >
            {meetingInfo?.building || '--N/A--'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid xs={6} sx={{ paddingRight: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            EndTime:
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
            data-testid="meeting-endtime"
          >
            {formatTime(meetingInfo?.endTime) || '--N/A--'}
          </Typography>
        </Grid>
        <Grid xs={6} sx={{ paddingLeft: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Room:
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
            data-testid="meeting-room"
          >
            {' '}
            {meetingInfo?.room || '--N/A--'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid xs={6} sx={{ paddingRight: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Time of Day:
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
            data-testid="meeting-time-of-day"
          >
            {' '}
            {meetingInfo?.timeOfDay || '--N/A--'}
          </Typography>
        </Grid>
        <Grid xs={6} sx={{ paddingLeft: '0.5rem' }}>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Mode:
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
            data-testid="meeting-mode"
          >
            {' '}
            {meetingInfo?.mode || '--N/A--'}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default MeetingsInfo;
