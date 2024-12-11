import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import AddNewUser from './AddNewUser';
import ExistingUsers from './ExistingUsers';

const Users = () => {
  const [refetchUsers, setRefetchUsers] = useState(new Date()?.valueOf());
  return (
    <div className="users-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Users
      </Typography>
      <AddNewUser setRefetchUsers={setRefetchUsers} />
      <ExistingUsers refetchUsers={refetchUsers} />
    </div>
  );
};

export default Users;
