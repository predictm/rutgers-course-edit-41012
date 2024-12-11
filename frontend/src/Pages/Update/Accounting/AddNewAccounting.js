import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';

import AccountingForm from './AccountingForm';

const AddNewAccounting = ({ setRefetchAccounts }) => {
  const [openAddAccounting, setOpenAddAccounting] = useState(true);
  const refetchAccounts = () => setRefetchAccounts(new Date()?.valueOf());
  const toggleRowForAddAccounting = () =>
    setOpenAddAccounting(!openAddAccounting);

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
          borderBottom: openAddAccounting
            ? '1px solid rgba(0, 0, 0, 0.2)'
            : '0',
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
          Add New Accounting
        </Typography>
        {openAddAccounting ? (
          <ExpandLess
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddAccounting}
            data-testid="add-new-account-collapse"
          />
        ) : (
          <ExpandMore
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddAccounting}
            data-testid="add-new-account-expand"
          />
        )}
      </Box>
      <Collapse in={openAddAccounting}>
        <Box sx={{ padding: '2rem 2rem 1rem' }}>
          <AccountingForm
            refetchAccounts={refetchAccounts}
            data-testid="add-new-account"
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddNewAccounting;
