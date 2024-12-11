import { createBrowserRouter, Outlet, Navigate, useLocation } from 'react-router-dom';

import { routeUrls } from '../../utils/constant';
import Login from '../../Pages/Login';
import Home from '../../Pages/Home';
import { AppContextProvider } from 'context/AppContext';
import ErrorPage from 'Components/ErrorScreens';
import Dashboard from 'Pages/Dashboard';
import DepartmentProfile from 'Pages/DepartmentProfile';
import DepartmentSearch from 'Pages/DepartmentSearch';
import Courses from 'Pages/Courses';
import Users from 'Pages/Update/Users';

import Tuitions from 'Pages/Update/Tuition';
import Appointments from 'Pages/Update/Appointments';
import EmailScreen from 'Pages/System/EmailScreen';
import Accounting from 'Pages/Update/Accounting';
import Departments from 'Pages/Update/Department';
import Announcement from 'Pages/Update/Announcement';
import Notification from 'Pages/Notifications';
import ContractTemplatesScreen from 'Pages/System/ContractTemplatesScreen';
import LoginFailed from 'Pages/LoginFailed';

function RedirectWithQueryParams() {
  const location = useLocation();
  const queryParams = location.search; 
  const newPath = queryParams ? `${routeUrls.login}${queryParams}` :`${routeUrls.login}`;
  return <Navigate to={newPath} replace />;
}

const routes = [
  {
    path: '/',
    element: (
      <AppContextProvider>
        <Outlet />
      </AppContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RedirectWithQueryParams />,
      },
      {
        path: routeUrls.login,
        element: <Login />,
      },
      {
        path: routeUrls.notAuthorized,
        element: <LoginFailed />,
      },
      {
        path: routeUrls.home,
        element: <Home />,
        children: [
          {
            index: true,
            element: <Navigate to={routeUrls.dashboard} replace={true} />,
          },
          {
            path: routeUrls.dashboard,
            element: <Dashboard />,
          },
          {
            path: routeUrls.profile,
            element: <DepartmentProfile />,
          },
          {
            path: routeUrls.courses,
            element: <Courses />,
          },
          {
            path: routeUrls.search,
            element: <DepartmentSearch />,
          },
          {
            path: routeUrls.appointments,
            element: <Appointments />,
          },
          {
            path: routeUrls.update,
            element: <Outlet />,
            children: [
              {
                path: routeUrls.department,
                element: <Departments />,
              },
              {
                path: routeUrls.announcement,
                element: <Announcement />,
              },
              {
                path: routeUrls.accounting,
                element: <Accounting />,
              },
              {
                path: routeUrls.tuition,
                element: <Tuitions />,
              },
            ],
          },
          {
            path: routeUrls.system,
            element: <Outlet />,
            children: [
              {
                path: routeUrls.email,
                element: <EmailScreen />,
              },
              {
                path: routeUrls.users,
                element: <Users />,
              },
              {
                path: routeUrls.data_migration_profile,
                element: <>Data Migration Profile</>,
              },
              {
                path: routeUrls.term_import,
                element: <>Term Import</>,
              },
              {
                path: routeUrls.audit_log,
                element: <>Audit Log</>,
              },
              {
                path: routeUrls.contract_templates,
                element: <ContractTemplatesScreen />,
              },
            ],
          },
          {
            path: routeUrls.help,
            element: <>Help</>,
          },
          {
            path: routeUrls.notifications,
            element: <Notification />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
