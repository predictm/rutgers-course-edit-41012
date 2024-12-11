import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';

import UserForm from './UserForm';

const AddNewUser = ({ setRefetchUsers }) => {
  const [openAddUser, setOpenAddUser] = useState(true);
  const toggleRowForAddUser = () => setOpenAddUser(!openAddUser);

  const refetchUsers = () => setRefetchUsers(new Date()?.valueOf());

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '2rem',
        padding: '1rem 0',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          paddingBottom: '0.5rem',
          paddingRight: '2rem',
          paddingLeft: '2rem',
          borderBottom: openAddUser ? '1px solid rgba(0, 0, 0, 0.2)' : '0',
          display: 'flex',
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="div"
          sx={{
            fontWeight: '400',
            color: '#383C49',
            fontSize: '2rem',
          }}
        >
          Add New User
        </Typography>
        {openAddUser ? (
          <ExpandLess
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddUser}
            data-testid="add-new-user-collapse"
          />
        ) : (
          <ExpandMore
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddUser}
            data-testid="add-new-user-expand"
          />
        )}
      </Box>
      <Collapse in={openAddUser}>
        <Box sx={{ padding: '2rem 2rem 1rem' }}>
          <Typography
            variant="subtitle"
            paragraph
            sx={{
              fontSize: '1rem',
              fontStyle: 'italic',
              fontWeight: '300',
              color: '#666666',
            }}
          >
            User's email addresses and usernames must be unique.
          </Typography>
          <UserForm refetchUsers={refetchUsers} testId="add-new-user-form" />
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddNewUser;
