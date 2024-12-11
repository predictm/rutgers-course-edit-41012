import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SearchSelect from 'StyledComponents/SearchSelect';
import { StyledStack } from './styles';
import AppointmentRadialChart from './AppointmentRadialChart';
import AppointmentBarChart from './AppointmentBarChart';
import EnrollmentLineChart from './EnrollmentLinChart';
import { useDashboardQueries } from 'services/queries';

const DepartmentOverView = ({
  semesterList,
  subjectList,
  semester,
  department,
  handleDropdownChange,
}) => {
  const [term, year] = semester?.split(':') || [];
  const [offeringUnitCd, subjectCd] = department?.split('--') || [];

  const { data: appointmentCountByTerm } =
    useDashboardQueries.useAppointmentCountByTermQuery({
      enabled: Boolean(term && year),
      payload: {
        term,
        year,
        offering_unit_cd: offeringUnitCd,
        subj_cd: subjectCd,
      },
    });

  const { data: appointmentCountByStatus } =
    useDashboardQueries.useAppointmentCountByStatusQuery({
      enabled: Boolean(term && year),
      payload: {
        term,
        year,
        offering_unit_cd: offeringUnitCd,
        subj_cd: subjectCd,
      },
    });

  const { data: enrollmentCount } = useDashboardQueries.useEnrollmentCountQuery(
    {
      enabled: Boolean(term && year),
      payload: {
        term,
        year,
        offering_unit_cd: offeringUnitCd,
        subj_cd: subjectCd,
      },
    }
  );

  return (
    <>
      <Typography
        variant="h4"
        paragraph
        sx={{
          fontWeight: '300',
          color: '#383C49',
          fontSize: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>Department Overview:</span>
        <span
          style={{
            width: '12rem',
            height: '2.5rem',
          }}
        >
          <SearchSelect
            options={semesterList}
            value={semester || ''}
            onChange={handleDropdownChange}
            name="semester"
            disabled={!semesterList?.length}
            required
            testId="dashboard-semester-select"
          />
        </span>
        <span
          style={{
            width: '14rem',
            height: '2.5rem',
          }}
        >
          <SearchSelect
            options={[{ value: '-', label: 'All Department' }, ...subjectList]}
            value={department || '-'}
            name="department"
            required
            testId="dashboard-semester-select"
            onChange={handleDropdownChange}
          />
        </span>
      </Typography>

      <Grid pt={3} container spacing={2}>
        <Grid item xs={4} container>
          <StyledStack>
            <Typography sx={{ fontSize: '1.5rem', color: '#666666' }}>
              Appointments
            </Typography>
            <Box
              sx={{
                backgroundColor: '',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',

                '.apexcharts-legend': {
                  justifyContent: 'center !important',
                },
              }}
            >
              <AppointmentRadialChart data={appointmentCountByStatus?.data} />
            </Box>
          </StyledStack>
        </Grid>

        <Grid item xs={4} container>
          <StyledStack>
            <Typography sx={{ fontSize: '1.5rem', color: '#666666' }}>
              Appointments
            </Typography>
            <Box
              sx={{
                backgroundColor: '',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <AppointmentBarChart data={appointmentCountByTerm?.data} />
            </Box>
          </StyledStack>
        </Grid>
        <Grid item xs={4} container>
          <StyledStack>
            <Typography sx={{ fontSize: '1.5rem', color: '#666666' }}>
              Enrollment
            </Typography>
            <Box
              sx={{
                backgroundColor: '',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <EnrollmentLineChart data={enrollmentCount?.data} />
            </Box>
          </StyledStack>
        </Grid>
      </Grid>
    </>
  );
};

export default DepartmentOverView;
