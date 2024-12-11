import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as NotificationIcon } from 'assets/icons/icon-notification-fill.svg';
import styles from './index.module.scss';
import { useAppContext } from 'context/AppContext';
import { routeUrls } from 'utils/constant';
import { carryOutLogout } from 'utils/common';

const Header = () => {
  const { userData, handleLogout } = useAppContext();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(routeUrls.dashboard);
  };

  const goToNotifications = () => {
    navigate(routeUrls.notifications);
  };

  return (
    <>
      <Typography
        noWrap
        component="span"
        className={styles.header}
        sx={{ fontSize: '1.313rem' }}
      >
        Summer Winter Instructor Appointment System
      </Typography>
      <span className={styles.headerRightSection}>
        <span
          className={styles.headerNotificationIcon}
          onClick={goToNotifications}
        >
          <NotificationIcon />
        </span>
        <Typography
          noWrap
          component="span"
          className={styles.headerUserName}
          onClick={goToProfile}
        >
          Welcome: {userData?.name}
        </Typography>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: '#666666' }}
        />
        <Typography
          noWrap
          component="span"
          className={styles.headerLogoutLink}
          onClick={handleLogout}
          data-testid="menu-item-logout"
        >
          Logout
        </Typography>
      </span>
    </>
  );
};

export default Header;
