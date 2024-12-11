import React from 'react';
import Stack from '@mui/material/Stack';
import { Box, Typography } from '@mui/material';
import logo from '../../assets/icons/rutgers-white.png'
import { useSearchParams } from 'react-router-dom';

const LoginFailed = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get('errorMessage');

  return (
    <Stack alignItems={"center"} sx={{
      backgroundColor: 'rgb(204, 0, 51)',
      padding: '40px',
      width: '50%',
      margin: "auto",
      marginTop: '20px',
      borderRadius: '10px'
    }}>
      <Box>
        <img src={logo} alt="rutger-white-image" style={{ width: '5.475625rem', height: '5.375rem' }} />
      </Box>
      <Typography sx={{ fontSize: '24px', fontWeight: '600', color: 'white', marginTop: '20px' }}>
        Login Failed
      </Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'white', marginTop: '5px' }}>
        {message}
      </Typography>
    </Stack>
  );
};

export default LoginFailed;
