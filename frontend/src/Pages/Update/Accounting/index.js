import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import AddNewAccounting from './AddNewAccounting';
import ExistingAccounting from './ExistingAccounting';

const Accounting = () => {
  const [refetchAccounts, setRefetchAccounts] = useState(new Date()?.valueOf());
  return (
    <div className="accounting-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Accounting
      </Typography>
      <AddNewAccounting setRefetchAccounts={setRefetchAccounts} />
      <ExistingAccounting refetchAccounts={refetchAccounts} />
    </div>
  );
};

export default Accounting;
