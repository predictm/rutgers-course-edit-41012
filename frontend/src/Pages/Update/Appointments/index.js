import React from 'react';
import Typography from '@mui/material/Typography';

import AppointmentList from './AppointmentList';

const Appointments = () => {
  return (
    <div className="users-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Appointments
      </Typography>
      <AppointmentList />
    </div>
  );
};

export default Appointments;
