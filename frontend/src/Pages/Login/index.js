import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';

import CentralContentPageLayout from '../../Layouts/CentralContentPageLayout';
import styles from './index.module.scss';
import { usePostLogin } from '../../services/mutations';
import { handleLoginSuccess, redirectToRutgersLogin } from 'utils/common';
import logo from '../../assets/icons/rutgers-white.png'
import { RightImageSVG, NetIdFormInput, LoginButton } from './Styles';
import { useUsersQueries } from 'services/queries';

const Login = () => {
  const nav = useNavigate();
  const postLogin = usePostLogin();
  const [NetID, setNetID] = useState('');
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {data: userData} = useUsersQueries.useGetUserDataQuery({
    enabled:!!token,    
    config:{
      headers:{
        "Authorization": "Token "+token
      }
    }
  });      


  const loginClicked = () => {
    return redirectToRutgersLogin(nav);
    if (NetID.length > 0) {
      setError('');
      let data = {
        net_id: NetID,
      };
      postLogin.mutate(data, {
        onSuccess: response => {
          console.log(response);
          handleLoginSuccess(response?.data?.token, response?.data?.user, nav);
        },
        onError: error => {
          console.log('Error: ', error);
          setError('Sorry you do not have access to this system.  Please contact the Summer Winter Session Office for access.');
        },
      });
    } else {
      setError('Please provide Net ID');
    }
  };

  useEffect(()=>{
    if(token && userData){
      handleLoginSuccess(token, userData?.data, nav);
    }
  },[userData?.data,token])

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      loginClicked();
      event.preventDefault();
    }
  };

  return (
    <CentralContentPageLayout>
      <Stack
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'red',
          position: 'relative',
        }}
        direction="row"
      >
        <Stack
          direction="column"
          item
          alignItems="center"
          sx={{
            backgroundColor: '#CC0033',
            width: '35%',
            height: '100vh',
            paddingTop: '8%',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ width: '80%' }}>
            <img src={logo} alt="rutger-white-image" style={{width: '5.475625rem', height: '5.375rem'}}/>
          </Box>
          <Typography
            mt={6}
            sx={{ color: '#FFFFFF', fontSize: '1.75rem', width: '80%' }}
          >
            Summer Winter Instructor
            <br /> Appointment System
          </Typography>

          <Box
            container
            mt={6}
            alignContent="center"
            sx={{ position: 'relative', width: '80%' }}
          >
            <NetIdFormInput
              // sx={{ position: 'relative' }}
              placeholder="NETID"
              id="NetId"
              value={NetID}
              onChange={event => {
                setNetID(event.target.value);
              }}
              // onKeyDown={handleKeyDown}
              readOnly
              onClick={() => loginClicked()}
              fullWidth
              inputProps={{
                'data-testId': 'login-net-id',
                autoComplete: 'off',
              }}
              endAdornment={
                <InputAdornment>
                  <LoginButton
                    label="Login"
                    onClick={() => loginClicked()}
                    data-testid="login-btn"
                  />
                </InputAdornment>
              }
            />
          </Box>
          {error.length > 0 && (
            <Box sx={{ width: '80%' }} pl={2}>
              <Typography textAlign="left" className={styles.error}>
                <span>*</span> {error}
              </Typography>
            </Box>
          )}
        </Stack>
        <Stack
          alignItems="center"
          sx={{
            backgroundColor: 'white',
            width: '65%',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Typography
            textAlign="right"
            sx={{ position: 'absolute', right: '5%', top: '2rem' }}
            color="#666666"
            fontSize="1rem"
            className={styles.cursor}
          >
            Visit Rutgers.edu
          </Typography>
          <Box sx={{ paddingTop: '10%' }}>
            <RightImageSVG />
          </Box>
        </Stack>
      </Stack>
    </CentralContentPageLayout>
  );
};

export default Login;
