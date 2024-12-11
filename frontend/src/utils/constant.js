import { ReactComponent as HomeIcon } from 'assets/icons/icon-home-grey.svg';
import { ReactComponent as HomeIconActive } from 'assets/icons/icon-home-color.svg';
import { ReactComponent as CoursesIcon } from 'assets/icons/icon-courses-grey.svg';
import { ReactComponent as CoursesIconActive } from 'assets/icons/icon-courses-color.svg';
import { ReactComponent as AppointmentIcon } from 'assets/icons/icon-appointment-grey.svg';
import { ReactComponent as AppointmentIconActive } from 'assets/icons/icon-appointment-color.svg';
import { ReactComponent as ProfileIcon } from 'assets/icons/icon-department-profile-grey.svg';
import { ReactComponent as ProfileIconActive } from 'assets/icons/icon-department-profile-color.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/icon-department-search-grey.svg';
import { ReactComponent as SearchIconActive } from 'assets/icons/icon-department-search-color.svg';
import { ReactComponent as UpdateIcon } from 'assets/icons/icon-update-grey.svg';
import { ReactComponent as UpdateIconActive } from 'assets/icons/icon-update-color.svg';
import { ReactComponent as SystemIcon } from 'assets/icons/icon-system-grey.svg';
import { ReactComponent as SystemIconActive } from 'assets/icons/icon-system-color.svg';
import { ReactComponent as HelpIcon } from 'assets/icons/icon-help-grey.svg';
import { ReactComponent as HelpIconActive } from 'assets/icons/icon-help-color.svg';
import { ReactComponent as NotificationsIcon } from 'assets/icons/icon-notification-grey.svg';
import { ReactComponent as NotificationsIconActive } from 'assets/icons/icon-notification-color.svg';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { ADMIN_URL } from './config';

export const PENDING = 'Pending';
export const APPROVED = 'Approved';
export const HCM_READY = 'HCM Ready';
export const HCM_ENTER = 'HCM Enter';
export const SEND_FOR_SIGNATURE = 'Send for signature';
export const SIGNED = 'Signed';

export const routeUrls = {
  about_us: '/about-us',
  faq: '/faq',
  contact_us: '/contact-us',
  terms_and_conditions: '/terms-and-conditions',
  privacy: '/privacy-policy',
  login: '/auth/login',
  notAuthorized:'/auth/login-failed',
  ruterLogin:'/api/v1/account/cas/login/',
  home: '/home',
  dashboard: '/home/dashboard',
  profile: '/home/profile',
  courses: '/home/courses',
  search: '/home/search',
  notifications: '/home/notifications',
  help: '/home/help',
  system: '/home/system',
  update: '/home/update',
  department: '/home/update/department',
  announcement: '/home/update/announcement',
  accounting: '/home/update/accounting',
  tuition: '/home/update/tuition',
  users: '/home/system/users',
  appointments: '/home/appointments',
  email: '/home/system/email',
  data_migration_profile: '/home/system/data-migration-profile',
  term_import: '/home/system/term-import',
  audit_log: '/home/system/audit-log',
  contract_templates: '/home/system/contract_templates',
  semesters:'/home/system/semesters',
};

export const routeAccessRoles = {
  [routeUrls.about_us]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.faq]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.contact_us]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.terms_and_conditions]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.privacy]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.login]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.routerLogin]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.notAuthorized]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.home]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.dashboard]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.profile]: ['DEPARTMENT'],
  [routeUrls.courses]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.search]: ['DEPARTMENT'],
  [routeUrls.notifications]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.help]: ['ADMIN', 'DEPARTMENT'],
  [routeUrls.system]: ['ADMIN'],
  [routeUrls.update]: ['ADMIN'],
  [routeUrls.department]: ['ADMIN'],
  [routeUrls.announcement]: ['ADMIN'],
  [routeUrls.accounting]: ['ADMIN'],
  [routeUrls.tuition]: ['ADMIN'],
  [routeUrls.users]: ['ADMIN'],
  [routeUrls.appointments]: ['ADMIN'],
  [routeUrls.email]: ['ADMIN'],
  [routeUrls.data_migration_profile]: ['ADMIN'],
  [routeUrls.term_import]: ['ADMIN'],
  [routeUrls.audit_log]: ['ADMIN'],
  [routeUrls.contract_templates]: ['ADMIN'],
  [routeUrls.semesters]:['ADMIN'],
};

export const LeftMenuSelection = {
  dashboard: 1,
  profile: 2,
};

export const sideBarNavMenu = [
  {
    name: 'Home',
    key: 'home',
    path: routeUrls.dashboard,
    iconSrc: <HomeIcon />,
    activeIconSrc: <HomeIconActive />,
    isShow: true,
    subMenu: [],
    iconStyle: {
      maxWidth: '2.063rem',
      maxHeight: '2.188rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.dashboard],
  },
  {
    name: 'Courses',
    key: 'courses',
    path: routeUrls.courses,
    iconSrc: <CoursesIcon />,
    activeIconSrc: <CoursesIconActive />,
    isShow: true,
    subMenu: [],
    iconStyle: {
      maxWidth: '2.625rem',
      maxHeight: '2.625rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.courses],
  },
  {
    name: 'Appointments',
    key: 'appointments',
    path: routeUrls.appointments,
    iconSrc: <AppointmentIcon />,
    activeIconSrc: <AppointmentIconActive />,
    isShow: true,
    subMenu: [],
    iconStyle: {
      maxWidth: '2.625rem',
      maxHeight: '2.625rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.appointments],
  },
  {
    name: 'Profile',
    key: 'profile',
    path: routeUrls.profile,
    iconSrc: <ProfileIcon />,
    activeIconSrc: <ProfileIconActive />,
    isShow: true,
    subMenu: [],
    iconStyle: {
      maxWidth: '2.313rem',
      maxHeight: '2.563rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.profile],
  },
  {
    name: 'Search',
    key: 'search',
    path: routeUrls.search,
    iconSrc: <SearchIcon />,
    activeIconSrc: <SearchIconActive />,
    isShow: true,
    subMenu: [],
    iconStyle: {
      maxWidth: '2.375rem',
      maxHeight: '2.563rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.search],
  },
  {
    name: 'Update',
    key: 'update',
    path: routeUrls.update,
    iconSrc: <UpdateIcon />,
    activeIconSrc: <UpdateIconActive />,
    isShow: true,
    allowedUserTypes: routeAccessRoles[routeUrls.update],
    subMenu: [
      {
        name: 'Department',
        key: 'department',
        path: routeUrls.department,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.department],
      },
      {
        name: 'Accounting',
        key: 'accounting',
        path: routeUrls.accounting,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.accounting],
      },
      {
        name: 'Tuition',
        key: 'tuition',
        path: routeUrls.tuition,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.tuition],
      },
      {
        name: 'Announcement',
        key: 'announcement',
        path: routeUrls.announcement,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.announcement],
      },
    ],
    iconStyle: {
      maxWidth: '2.625rem',
      maxHeight: '2.563rem',
    },
  },
  {
    name: 'System',
    key: 'system',
    path: routeUrls.system,
    iconSrc: <SystemIcon />,
    activeIconSrc: <SystemIconActive />,
    isShow: true,
    allowedUserTypes: routeAccessRoles[routeUrls.system],
    subMenu: [
      {
        name: 'Users',
        key: 'users',
        path: routeUrls.users,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.users],
      },
      {
        name: 'Email',
        key: 'email',
        path: routeUrls.email,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.email],
      },
      {
        name: 'Semesters',
        key: 'semesters',
        path: ADMIN_URL+ '/admin/course/semester/',
        type: 'admin-link',
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.semesters],
      },
      {
        name: 'Audit Log',
        key: 'audit-log',
        path: ADMIN_URL + '/admin/auditlog/logentry/',
        type: 'admin-link',
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.audit_log],
      },
      {
        name: 'Contract Templates',
        key: 'contract-templates',
        path: routeUrls.contract_templates,
        isShow: true,
        allowedUserTypes: routeAccessRoles[routeUrls.contract_templates],
      },
    ],
    iconStyle: {
      maxWidth: '2.625rem',
      maxHeight: '2.625rem',
    },
  },
  {
    name: 'Help',
    key: 'help',
    path: routeUrls.help,
    iconSrc: <HelpIcon />,
    activeIconSrc: <HelpIconActive />,
    isShow: true,
    subMenu: [],
    iconStyle: {
      maxWidth: '2rem',
      maxHeight: '2rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.help],
  },
  {
    name: 'Notifications',
    key: 'notifications',
    path: routeUrls.notifications,
    iconSrc: <NotificationsIcon />,
    activeIconSrc: <NotificationsIconActive />,
    isShow: true,
    iconStyle: {
      maxWidth: '2.375rem',
      maxHeight: '2.25rem',
    },
    allowedUserTypes: routeAccessRoles[routeUrls.notifications],
  },
];

export const genderList = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHERS', label: 'Other' },
];

export const userTypes = [
  { value: 'ADMIN', label: 'Admin User' },
  { value: 'DEPARTMENT', label: 'Department User' },
];

export const appointmentStatusList = [
  { label: PENDING, value: 'PENDING', colorCode: '#DC3545' },
  { label: APPROVED, value: 'APPROVED', colorCode: '#333333' },
  { label: HCM_READY, value: 'HCM_READY', colorCode: '#333333' },
  { label: HCM_ENTER, value: 'HCM_ENTER', colorCode: '#2B7D3B' },
  {label: SEND_FOR_SIGNATURE,value:'Send for signature', colorCode: '#333333'},
];

export const announcementTypes = [
  {
    label: 'Alert',
    value: 'ALERT',
    colorCode: '#DC3545',
    icon: <NewReleasesIcon sx={{ width: '80%', height: '80%' }} />,
  },
  {
    label: 'Maintenance',
    value: 'MAINTENANCE',
    colorCode: '#C9C9C9',
    icon: <EngineeringIcon sx={{ width: '80%', height: '80%' }} />,
  },
  {
    label: 'Notice',
    value: 'NOTICE',
    colorCode: '#FFE357',
    icon: <NotificationsActiveIcon sx={{ width: '80%', height: '80%' }} />,
  },
];

export const systemNotificationTypes = [
  {
    label: 'User Created',
    value: 'USER_CREATE',
    icon: <PersonAddIcon sx={{ width: '80%', height: '80%' }} />,
  },
  {
    label: 'Instructor Approved',
    value: 'INSTRUCTOR_APPROVED',
    icon: <HowToRegIcon sx={{ width: '80%', height: '80%' }} />,
  },
];
