import React from 'react';
import Typography from '@mui/material/Typography';

import DepartmentList from './DepartmentList';

const Departments = () => {
  return (
    <div className="users-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Department Profiles
      </Typography>
      <DepartmentList />
    </div>
  );
};

export default Departments;
