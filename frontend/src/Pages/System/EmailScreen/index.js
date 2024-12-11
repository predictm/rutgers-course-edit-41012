import React from 'react';
import Typography from '@mui/material/Typography';
import EmailTemplateList from './EmailTemplateList';

const EmailScreen = () => {
  return (
    <div className="users-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Email
      </Typography>
      <EmailTemplateList />
    </div>
  );
};

export default EmailScreen;
