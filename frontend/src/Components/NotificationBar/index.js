import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactComponent as NotificationIcon } from '../../assets/icons/icon-notification-fill.svg';
import { routeUrls } from 'utils/constant';

const NotificationBar = ({ notificationInfo }) => {
  const navigate = useNavigate();

  const gotoNotification = () => {
    navigate(routeUrls.notifications);
  };

  return (
    <Stack
      direction="row"
      justifyContent="left"
      alignItems="center"
      spacing={2}
      mb={2}
      sx={{
        border: '2px solid #707070',
        borderRadius: '2.5rem',
        backgroundColor: '#FFE357',
        padding: '1rem',
        cursor: 'pointer',

        svg: {
          path: {
            fill: '#333333',
          },
        },
      }}
      onClick={gotoNotification}
      data-testid="app-notification-bar"
    >
      <NotificationIcon
        style={{
          width: '2rem',
          height: '2rem',
        }}
      />
      <Typography
        sx={{
          color: '#383C49',
          fontSize: '1rem',
        }}
      >
        {Boolean(notificationInfo?.title) && (
          <>
            <strong>{notificationInfo?.title}</strong>
            <br />
          </>
        )}
        <p dangerouslySetInnerHTML={{ __html: notificationInfo?.message }}></p>
      </Typography>
    </Stack>
  );
};

export default NotificationBar;
