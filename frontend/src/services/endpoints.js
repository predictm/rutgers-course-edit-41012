import { prepareQueryString } from 'utils/helper';
import { post, get, put, patch, del } from './request';
import { API_PATH } from 'utils/config';

const API_ENDPOINTS = {
  onboarding: {
    user_login: payload =>
      post(API_PATH.LOGIN, payload).then(response => response?.data),
  },
  departments: {
    get_departments: payload =>
      get(API_PATH.DEPARTMENT_USER, payload).then(response => response?.data),
    update_department: payload =>
      patch(`${API_PATH.DEPARTMENT}${payload?.id}/`, payload).then(
        response => response?.data
      ),
    search_department: payload => {
      const queryString = prepareQueryString({
        subj_cd: payload?.subject,
        offering_unit_cd: payload?.unit,
      });
      return get(`${API_PATH.DEPARTMENT_SEARCH}?${queryString}`).then(
        response => response?.data
      );
    },
    get_all_departments: payload => {
      const queryString = prepareQueryString({
        offering_unit__offering_unit_cd: payload?.unit,
        department__subj_cd: payload?.subject || payload?.subject_code,
        search: payload?.name,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });

      return get(`${API_PATH.ALL_DEPARTMENT}?${queryString}`).then(
        response => response?.data
      );
    },
  },
  contacts: {
    get_contacts: payload =>
      get(API_PATH.CONTACT, payload).then(response => response?.data),
    add_contact: payload =>
      post(API_PATH.CONTACT, payload).then(response => response?.data),
    update_contact: payload =>
      patch(`${API_PATH.CONTACT}${payload.id}/`, payload).then(
        response => response?.data
      ),
    get_contact_roles: payload =>
      get(API_PATH.CONTACT_ROLES, payload).then(response => response?.data),
    toggle_contact_active: payload =>
      post(
        `${API_PATH.CONTACT}${payload?.id}${API_PATH.TOGGLE_CONTACT_ACTIVE}`,
        payload
      ).then(response => response?.data),
  },
  courses: {
    get_semester_list: payload =>
      get(API_PATH.SEMESTER).then(response => response?.data),
    get_active_semester_list: payload =>
      get(API_PATH.ACTIVE_SEMISTER).then(response => response?.data),  
    get_files_with_rutgers_list: payload =>
      get(API_PATH.FILES_WITH_RUTGERS).then(response => response?.data),
    get_state_list: payload =>
      get(API_PATH.STATE).then(response => response?.data),
    get_1_9status_list: payload =>
      get(API_PATH.STATUSES).then(response => response?.data),
    get_visa_status_list: payload =>
      get(API_PATH.VISA_STATUS).then(response => response?.data),
    get_academic_year_titles_list: payload =>
      get(API_PATH.ACADEMIC_YEAR_TITLE).then(response => response?.data),
    get_unit_list: payload => {
      const queryString = prepareQueryString({
        year: payload?.year,
        term: payload?.term,
      });

      return get(`${API_PATH.OFFERING_UNIT}?${queryString}`).then(
        response => response?.data
      );
    },
    get_unit_subject_list: () =>
      get(API_PATH.OFFERING_UNIT_SUBJECT).then(response => response?.data),
    get_subject_list: payload => {
      const queryString = prepareQueryString({
        year: payload?.year,
        term: payload?.term,
        offering_unit_cd: payload.unit,
      });

      return get(`${API_PATH.SUBJECT}?${queryString}`).then(
        response => response?.data
      );
    },
    get_course_list: payload => {
      const queryString = prepareQueryString({
        year: payload?.year,
        term: payload?.term,
        offering_unit_cd: payload.unit,
        subj_cd: payload?.subject,
        offering_unit_level: payload?.unitLevel,
      });

      return get(`${API_PATH.COURSE}?${queryString}`).then(
        response => response?.data
      );
    },
    get_section_list: payload => {
      const queryString = prepareQueryString({
        year: payload?.year,
        term: payload?.term,
        offering_unit_cd: payload.unit,
        subj_cd: payload?.subject,
        offering_unit_level: payload?.unitLevel,
        course_no: payload.course,
      });

      return get(`${API_PATH.SECTION}?${queryString}`).then(
        response => response?.data
      );
    },
    search_courses: payload => {
      const queryString = prepareQueryString({
        year: payload?.year,
        term: payload?.term,
        offering_unit_cd: payload.unit,
        subj_cd: payload?.subject,
        offering_unit_level: payload?.unitLevel,
      });

      return get(`${API_PATH.SEARCH_COURSE}?${queryString}`).then(
        response => response?.data
      );
    },
    search_course_section: payload => {
      const queryString = prepareQueryString({
        year: payload?.year,
        term: payload?.term,
        offering_unit_cd: payload.unit,
        subj_cd: payload?.subject,
        offering_unit_level: payload?.unitLevel,
        course_no: payload.course,
      });

      return get(`${API_PATH.SEARCH_COURSE_SECTIONS}?${queryString}`).then(
        response => response?.data
      );
    },
    get_course_section_details: payload => {
      const queryString = prepareQueryString(
        Object.hasOwn(payload, 'regIndex')
          ? {
              reg_index_no: payload.regIndex,
              year: payload?.year,
              term: payload?.term,
            }
          : {
              year: payload?.year,
              term: payload?.term,
              offering_unit_cd: payload.unit,
              subj_cd: payload?.subject,
              offering_unit_level: payload?.unitLevel,
              course_no: payload.course,
              section_no: payload.section?.split("-")?.[0],
              course_suppl_cd: payload.section?.split("-")?.[1]
            }
      );

      return get(`${API_PATH.COURSE_SECTION_DETAILS}?${queryString}`).then(
        response => response?.data
      );
    },

    add_new_instructor: payload => {
      return post(API_PATH.INSTRUCTOR, payload).then(response => {
        return response?.data;
      });
    },

    assign_new_instructor: payload =>
      post(API_PATH.APPOINTMENTS, payload).then(response => response?.data),

    search_instructor: payload => {
      const queryString = prepareQueryString({
        employee_number: payload?.employee_number,
        first_name: payload?.first_name,
        last_name: payload?.last_name,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });

      return get(`${API_PATH.INSTRUCTOR}?${queryString}`).then(
        response => response?.data
      );
    },
    get_instructor_by_id: payload => {
      return get(`${API_PATH.APPOINTMENTS}${payload.instructor}/`).then(
        response => response?.data
      );
    },
    get_instructor_past_appointment: payload => {
      return get(
        `${API_PATH.INSTRUCTOR}${payload?.id}/past_appointments/`
      ).then(response => {
        return response?.data;
      });
    },
    get_course_status_types: () => {
      return get(API_PATH.COURSE_STATUS_TYPES).then(response => response?.data);
    },
    get_active_semister: () => {
      return get(API_PATH.ACTIVE_SEMISTER).then(response => response?.data);
    },
    get_course_fee_types: () => {
      return get(API_PATH.COURSE_FEE_TYPES).then(response => response?.data);
    },
    update_course_dates: payload => {
      return patch(
        `${API_PATH.COURSE_SECTION}${payload.id}${API_PATH.COURSE_SECTION_DATES}`,
        payload
      ).then(response => response?.data);
    },
    update_course_section: payload => {
      return patch(`${API_PATH.COURSE_SECTION}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
    add_comments: payload => {
      return post(API_PATH.COMMENTS, payload).then(response => response?.data);
    },
    get_all_ga_experiences_dropdown: () => {
      return get(API_PATH.GA_EXPERIENCES).then(response => response?.data);
    },
    get_all_job_class_codes_dropdown: () => {
      return get(API_PATH.JOB_CLASS_CODES).then(response => response?.data);
    },
  },
  appointment: {
    update_appointment: payload => {
      return patch(`${API_PATH.APPOINTMENTS}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
    get_appointments: payload => {
      const queryString = prepareQueryString({
        search: payload?.name,
        course_section__course_title: payload?.course_title,
        appointment_status: payload?.appointment_status,
        course_section__subj_cd: payload?.subject,
        course_section__offering_unit_cd: payload?.unit,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });

      return get(`${API_PATH.APPOINTMENTS}?${queryString}`).then(
        response => response?.data
      );
    },
    get_course_title_dropdown: () => {
      return get(API_PATH.COURSE_TITLES).then(response => response?.data);
    },
    get_employment_type_list: () => {
      return get(API_PATH.EMPLOYMENT_TYPE_LIST).then(response => response?.data);
    },
    get_all_appointment_roles_dropdown: () => {
      return get(API_PATH.APPOINTMENT_ROLES).then(response => response?.data);
    },
    get_all_background_collateral_list_dropdown: () => {
      return get(API_PATH.BACKGROUND_COLLATERAL).then(response => response?.data);
    },
    add_new_admin_comment:payload=>{
      return post(API_PATH.NEW_ADMIN_COMMENT,payload).then(response => response?.data);
    },
    
    get_all_record_numbers_list_dropdown:()=>{
      return get(API_PATH.RECORD_NUMBERS).then(response => response?.data);
    },
    get_all_instructor_course_salary_list_dropdown:()=>{
      return get(API_PATH.INSTRUCTOR_COURSE_SALARY).then(response => response?.data);
    },
    
    get_all_salary_alternative_list_dropdown:()=>{
      return get(API_PATH.SALARY_ALTERNATIVE).then(response => response?.data);
    },
    get_all_permit_type_list_dropdown:()=>{
      return get(API_PATH.PERMIT_TYPE).then(response => response?.data);
    },
    get_term_list_dropdown:()=>{
      return get(API_PATH.TERM_LIST).then(response => response?.data);
    },

    update_instructor_contract_sfs: payload => {
      // return patch(`${API_PATH.INSTRUCTOR_CONTRACT_DOCUSIGN_SFS}${payload?.contract_id}/`, payload).then(
      //   response => response?.data
      // );
      return post(API_PATH.INSTRUCTOR_CONTRACT_DOCUSIGN_SFS, payload).then(response => response?.data);
    },

    update_contract_status_sfs: payload => {
      return patch(`${API_PATH.CONTRACT_STATUS_SFS}${payload?.contract_id}/`, {"status": payload.status}).then(
        response => response?.data
      );
    },

    get_all_alt_school_acct_dropdown:payload=>{
      const queryString = prepareQueryString({
        offering_unit__offering_unit_cd: payload?.offering_unit_cd_payload,
      });
      return get(`${API_PATH.ALT_SCHOOL_ACCT}?${queryString}`).then(response => response?.data);
    },

    get_all_appointment_type_dropdown:()=>{
      return get(API_PATH.APPOINTMENT_TYPE).then(response => response?.data);
    },

  },
  users: {
    get_users: payload => {
      const queryString = prepareQueryString({
        search: payload?.name,
        department_users__dept__subj_cd: payload?.subject,
        department_users__unit__offering_unit_cd: payload?.unit,
        user_type: payload?.role,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });

      return get(`${API_PATH.USERS}?${queryString}`).then(
        response => response?.data
      );
    },
    get_user_data: (config) => {
      return get(API_PATH.USER_DATA,config).then(
        response => response?.data
      );
    },
    get_user_by_id: payload => {
      return get(`${API_PATH.USERS}${payload?.id}/`).then(
        response => response?.data
      );
    },
    add_user: payload => {
      return post(API_PATH.USERS, payload).then(response => response?.data);
    },
    update_User: payload => {
      const userId = payload?.id;
      let config;
      if (payload?.profile_image) {
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const formData = new FormData();
        Object.keys(payload).forEach(field =>
          formData.append(field, payload[field])
        );
        payload = formData;
      }
      return patch(`${API_PATH.USERS}${userId}/`, payload, config).then(
        response => response?.data
      );
    },
  },
  tuitions: {
    get_tuitions: payload => {
      const queryString = prepareQueryString({
        offering_unit__offering_unit_cd: payload?.school,
        year: payload?.year,
        term: payload?.term,
        ordering: payload?.ordering,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });

      return get(`${API_PATH.TUITION}?${queryString}`).then(
        response => response?.data
      );
    },
    add_tuition: payload => {
      return post(API_PATH.TUITION, payload).then(response => response?.data);
    },
    update_tuition: payload => {
      return patch(`${API_PATH.TUITION}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
  },
  emailScreen: {
    get_email_template: payload => {
      return get(`${API_PATH.EMAIL_TEMPLATE}`).then(response => response?.data);
    },
    update_email_template: payload => {
      return patch(`${API_PATH.EMAIL_TEMPLATE}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
  },
  accounting: {
    get_accounts: payload => {
      const queryString = prepareQueryString({
        gl_string: payload?.account_code,
        department__subj_cd: payload?.subject,
        offering_unit__offering_unit_cd: payload?.unit,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });
      return get(`${API_PATH.ACCOUNTING}?${queryString}`).then(
        response => response?.data
      );
    },
    add_account: payload => {
      return post(`${API_PATH.ACCOUNTING}`, payload).then(
        response => response?.data
      );
    },
    update_account: payload => {
      return patch(`${API_PATH.ACCOUNTING}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
  },

  announcement: {
    get_announcements: payload => {
      const queryString = prepareQueryString({
        title: payload?.title,
        type: payload?.type,
        date: payload?.date,
        year: payload?.year,
        month: payload?.month,
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });
      return get(`${API_PATH.ANNOUNCEMENT}?${queryString}`).then(
        response => response?.data
      );
    },
    add_announcement: payload => {
      return post(`${API_PATH.ANNOUNCEMENT}`, payload).then(
        response => response?.data
      );
    },
    update_announcement: payload => {
      return patch(`${API_PATH.ANNOUNCEMENT}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
  },

  notifications: {
    get_all_notifications: payload => {
      const queryString = prepareQueryString({
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });
      return get(`${API_PATH.NOTIFICATIONS}?${queryString}`).then(
        response => response?.data
      );
    },
    get_unread_notifications: payload => {
      const queryString = prepareQueryString({
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });
      return get(
        `${API_PATH.NOTIFICATIONS}unread-notifications/?${queryString}`
      ).then(response => response?.data);
    },
    get_read_notifications: payload => {
      const queryString = prepareQueryString({
        limit: payload?.limit || 1000,
        offset: payload?.offset || 0,
      });
      return get(
        `${API_PATH.NOTIFICATIONS}read-notifications/?${queryString}`
      ).then(response => response?.data);
    },
    mark_as_read: payload => {
      return post(`${API_PATH.NOTIFICATIONS}${payload?.id}/mark-as-read/`).then(
        response => response?.data
      );
    },
  },

  dashboard: {
    get_analytics: () => {
      return get(`${API_PATH.DASHBOARD_ANALYTICS}`).then(
        response => response?.data
      );
    },
    get_appointment_count_by_term: payload => {
      const queryString = prepareQueryString({
        term: payload?.term,
        year: payload?.year,
        subj_cd: payload?.subj_cd,
        offering_unit_cd: payload?.offering_unit_cd,
      });
      return get(
        `${API_PATH.APPOINTMENTS}appointment-counts-by-term/?${queryString}`
      ).then(response => response?.data);
    },
    get_appointment_count_by_status: payload => {
      const queryString = prepareQueryString({
        term: payload?.term,
        year: payload?.year,
        subj_cd: payload?.subj_cd,
        offering_unit_cd: payload?.offering_unit_cd,
      });
      return get(
        `${API_PATH.APPOINTMENTS}appointment-status-analytics/?${queryString}`
      ).then(response => response?.data);
    },
    get_enrollment_count: payload => {
      const queryString = prepareQueryString({
        term: payload?.term,
        year: payload?.year,
        subj_cd: payload?.subj_cd,
        offering_unit_cd: payload?.offering_unit_cd,
      });
      return get(
        `${API_PATH.COURSE_SECTION}total-enrollments/?${queryString}`
      ).then(response => response?.data);
    },
  },
  contract: {
    get_contract_templates: payload => { 
      
      return get(`${API_PATH.CONTRACT_TEMPLATES}`).then(
        response => response?.data
      );
    },
   
    update_union_contract: payload => {
      return put(`${API_PATH.CONTRACT_TEMPLATES}${payload?.id}/`, payload).then(
        response => response?.data
      );
    },
    get_instructor_contract_template: payload => { 
      return get(`${API_PATH.INSTRUCTOR_CONTRACT_TEMPLATE}${payload?.id}/`).then(
        response => response?.data
      //   (response) => {
      //     console.log("apidata", response?.data)
      //     return response?.data}
      // ).catch(error=> error.response?.data);
      )
    },

    reset_contract_template: payload => {
      return post(`${API_PATH.CONTRACT_TEMPLATES}${payload?.contract_id}/reset-to-default/`).then(
        response => response?.data
      );
    },
  },
};

export default API_ENDPOINTS;
