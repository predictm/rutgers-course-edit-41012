import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { toast } from 'react-toastify';

import { carryOutLogout, getUserData, userTokenExists } from 'utils/common';
import { routeUrls } from 'utils/constant';
import { injectNavigator } from 'services/request';
import { useNotificationQueries } from 'services/queries';
import { sortByDate } from 'utils/helper';

const appContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logoutMutation = () => null; //useAccountSettingMutation.useLogoutMutation();
  const { data: notificationData } =
    useNotificationQueries.useGetUnreadNotificationsQuery({
      enabled: isUserLoggedIn,
    });
  const unreadNotificationList = sortByDate(
    notificationData?.data?.results,
    -1
  );

  injectNavigator(navigate);

  useEffect(() => {
    if (userTokenExists() && (!isUserLoggedIn || !userData)) {
      const userInfo = getUserData();
      setIsUserLoggedIn(true);
      userInfo && setUserData(userInfo);

      const isLoginPath = matchPath({ path: routeUrls.login }, pathname);
      navigate(
        isLoginPath || pathname === '/' ? routeUrls.dashboard : pathname,
        { replace: true }
      );
    }
  }, [pathname, isUserLoggedIn, userData, setUserData, navigate]);

  const handleLogout = async (e, noToast = false) => {
    try {
      // await logoutMutation.mutateAsync();
      !noToast && toast.success('You have been logged out successfully.',{
        hideProgressBar: true,
      });
    } catch (e) {
      // !noToast && toast.error('An error occurred while log out.');
    }
    carryOutLogout(setIsUserLoggedIn);
    navigate(routeUrls.login);
  };

  return (
    <appContext.Provider
      value={{
        isUserLoggedIn,
        setIsUserLoggedIn,
        userData,
        handleLogout,
        unreadNotificationList,
        setUserData
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  const {
    isUserLoggedIn,
    setIsUserLoggedIn,
    userData,
    handleLogout,
    unreadNotificationList,
    setUserData
  } = useContext(appContext);

  return {
    isUserLoggedIn,
    setIsUserLoggedIn,
    userData,
    handleLogout,
    unreadNotificationList,
    setUserData
  };
};
