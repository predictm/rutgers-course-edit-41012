import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Header from '../../Components/Header';
import SidebarNav from '../../Components/SidebarNav';
import { routeAccessRoles } from 'utils/constant';
import { useAppContext } from 'context/AppContext';

import styles from './index.module.scss';
import logo from '../../assets/icons/rutgers-white.png';

const drawerWidth = 0;

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: '4rem',
  [theme.breakpoints.up('sm')]: {
    width: '6.875rem',
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: '#f5f5f5',
  boxShadow: 'none',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: 'calc(100% - 4rem)',
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 6.875rem)',
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const PageLayout = ({ children, selectedLeftMenu, onLeftMenuClicked }) => {
  const location = useLocation();
  const { userData, isUserLoggedIn } = useAppContext();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" open={true} className={styles.appbarHeader}>
        {/* call header */}
        <Header />
      </AppBar>
      <Drawer variant="permanent" open={false}>
        <Divider sx={{backgroundColor :'#383C49', height:'5px'}} />
        <DrawerHeader sx={{ backgroundColor: '#cc0033',  padding: "10px 0 10px 0" }}>
            <img src={logo} alt="rutger-white-image" style={{width: '3.125rem', height: '3.938rem'}}/>
        </DrawerHeader>
        {/* call left panel */}
        <SidebarNav
          selectedLeftMenu={selectedLeftMenu}
          onLeftMenuClicked={onLeftMenuClicked}
        />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f5f5f5',
          padding: '2.5rem',
        }}
      >
        <DrawerHeader />
        {routeAccessRoles[location?.pathname]?.includes(userData?.user_type)
          ? children
          : isUserLoggedIn &&
            userData && (
              <Typography
                component={'h1'}
                sx={{ color: '#FE0000', textAlign: 'center', fontSize: '2rem' }}
              >
                Access denied
              </Typography>
            )}
      </Box>
    </Box>
  );
};

export default PageLayout;
