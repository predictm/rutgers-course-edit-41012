export const API_BASE_PATH = window.location.origin;
export const ADMIN_URL = /^(http:\/\/)?localhost:30\d{2}/.test(
  window.location.origin
)
  ? 'https://rutgers-course-edit-41-staging.botics.co'
  : '';
// export const API_BASE_PATH = 'https://dcd4-103-108-5-14.ngrok-free.app'

export const API_PATH = {
  LOGIN: '/api/v1/login/',
  CONTACT_ROLES: '/department/api/v1/contact-roles/',
  CONTACT: '/department/api/v1/contact/',
  DEPARTMENT_USER: '/department/api/v1/departmentuser/',
  DEPARTMENT: '/department/api/v1/department/',
  ALL_DEPARTMENT: '/department/api/v1/all-departments/',
  TOGGLE_CONTACT_ACTIVE: '/toggle_active/',
  DEPARTMENT_SEARCH: '/department/api/v1/department/search/',
  COURSE_SECTION: '/course/api/v1/course-section/',
  SEMESTER: `/course/api/v1/course-section/semester/`,
  OFFERING_UNIT: '/course/api/v1/course-section/offering-unit/',
  SUBJECT: '/course/api/v1/course-section/subject/',
  OFFERING_UNIT_SUBJECT: '/course/api/v1/course-section/offering-unit-subject/',
  COURSE: '/course/api/v1/course-section/course/',
  SECTION: '/course/api/v1/course-section/section/',
  SEARCH_COURSE: '/course/api/v1/course-section/search-course/',
  SEARCH_COURSE_SECTIONS:
    '/course/api/v1/course-section/search-course-section/',
  COURSE_SECTION_DETAILS:
    '/course/api/v1/course-section/specific-course-section/',
  INSTRUCTOR: '/appointment/api/v1/instructors/',
  STATE: '/appointment/api/v1/states/?limit=100',
  COURSE_STATUS_TYPES: '/course/api/v1/course-status-types/',
  COURSE_FEE_TYPES: '/course/api/v1/course-fee-types/',
  COURSE_SECTION_DATES: '/update-course-section-dates/',
  STATUSES: '/appointment/api/v1/statuses/',
  VISA_STATUS: '/appointment/api/v1/visa-statuses/',
  ACADEMIC_YEAR_TITLE: '/appointment/api/v1/academic-year-titles/',
  FILES_WITH_RUTGERS: '/appointment/api/v1/files-with-rutgers/',
  APPOINTMENTS: '/appointment/api/v1/appointments/',
  COURSE_TITLES: '/appointment/api/v1/appointments/appointment-course-title/',
  COMMENTS: '/course/api/v1/course-section-comment/',
  USERS: '/api/v1/users/',
  USER_DATA: '/api/v1/user-data/',
  TUITION: '/course/api/v1/tuition/',
  ACTIVE_SEMISTER:'/course/api/v1/active-semester/',
  EMAIL_TEMPLATE: '/api/v1/email-template/',
  ACCOUNTING: '/accounting/api/v1/accounting/',
  ANNOUNCEMENT: '/api/v1/announcement/',
  NOTIFICATIONS: '/notification/api/v1/notifications/',
  DASHBOARD_ANALYTICS: '/api/v1/dashboard-analytics/',
  CONTRACT_TEMPLATES: '/contract/api/v1/contract-templates/',
  GA_EXPERIENCES: '/appointment/api/v1/ga-experiences/',
  JOB_CLASS_CODES:'/appointment/api/v1/job-class-codes/',
  APPOINTMENT_ROLES:'/appointment/api/v1/appointee-roles/',
  BACKGROUND_COLLATERAL: '/appointment/api/v1/background-collateral-types/',
  NEW_ADMIN_COMMENT:'/appointment/api/v1/admin-appointment-comments/',
  RECORD_NUMBERS:'/appointment/api/v1/record-numbers/?limit=50',
  INSTRUCTOR_COURSE_SALARY:'/appointment/api/v1/instructor-course-salaries/',
  SALARY_ALTERNATIVE:'/appointment/api/v1/salary-payment-alternatives/',
  PERMIT_TYPE:'/appointment/api/v1/visa-permit-types/',
  EMPLOYMENT_TYPE_LIST:'/appointment/api/v1/employment-types/',
  TERM_LIST:'/appointment/api/v1/appointee-roles/',

  INSTRUCTOR_CONTRACT_TEMPLATE:'/contract/api/v1/instructor/',
  INSTRUCTOR_CONTRACT_DOCUSIGN_SFS:'/contract/api/v1/docusign/send-for-signature/',
  CONTRACT_STATUS_SFS:'/contract/api/v1/contracts/',

  ALT_SCHOOL_ACCT:'/accounting/api/v1/accounting/',
  APPOINTMENT_TYPE:'/appointment/api/v1/appointment-types/'

};

export const localStorageKeys = {
  accessToken: 'accessToken',
  NetID: 'NetID',
  user: 'user',
};
