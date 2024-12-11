import { useQuery } from '@tanstack/react-query';
import API_ENDPOINTS from './endpoints';

export const useDepartmentQueries = {
  useDepartmentQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get-departments'],
      API_ENDPOINTS.departments.get_departments,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAllDepartmentQuery: ({ config = {}, enabled, payload = {} }) => {
    return useQuery(
      ['get-all-departments', { ...payload }],
      () => API_ENDPOINTS.departments.get_all_departments(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useDepartmentSearchQuery: ({ config = {}, payload }) => {
    return useQuery(
      ['search-departments', { ...payload }],
      () => API_ENDPOINTS.departments.search_department(payload),
      {
        retry: false,
        enabled: false,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useContactQueries = {
  useContactQuery: ({ config = {}, enabled }) => {
    return useQuery(['get-contacts'], API_ENDPOINTS.contacts.get_contacts, {
      retry: false,
      enabled,
      refetchOnMount: false,
      ...config,
    });
  },
  useContactRolesQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get-contacts-roles'],
      API_ENDPOINTS.contacts.get_contact_roles,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useCoursesQueries = {
  useSemesterListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-semester-list', { ...payload }],
      API_ENDPOINTS.courses.get_semester_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useActiveSemesterQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-active-semester-list', { ...payload }],
      API_ENDPOINTS.courses.get_active_semester_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },

  useUnitListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-unit-list', { ...payload }],
      () => API_ENDPOINTS.courses.get_unit_list(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useUnitSubjectListQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get-unit-subject-list'],
      () => API_ENDPOINTS.courses.get_unit_subject_list(),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useSubjectListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-subject-list', { ...payload }],
      () => API_ENDPOINTS.courses.get_subject_list(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useCourseListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-course-list', { ...payload }],
      () => API_ENDPOINTS.courses.get_course_list(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useStateListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(['get-state-list'], API_ENDPOINTS.courses.get_state_list, {
      retry: false,
      enabled,
      refetchOnMount: false,
      ...config,
    });
  },
  useFilesWithRutgersQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-files-with-rutgers'],
      API_ENDPOINTS.courses.get_files_with_rutgers_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  use1_9StatusListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-1_9status-list'],
      API_ENDPOINTS.courses.get_1_9status_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useEmploymentTypeListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-employment-type-list'],
      API_ENDPOINTS.appointment.get_employment_type_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useVisaStatusListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_visa_status_list'],
      API_ENDPOINTS.courses.get_visa_status_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAcademciYearTitlesListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_academic_year_titles_list'],
      API_ENDPOINTS.courses.get_academic_year_titles_list,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useSectionListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-section-list', { ...payload }],
      () => API_ENDPOINTS.courses.get_section_list(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useSearchCoursesQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-search-courses', { ...payload }],
      () => API_ENDPOINTS.courses.search_courses(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },

  useSearchCoursesSectionQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-search-courses-sections', { ...payload }],
      () => API_ENDPOINTS.courses.search_course_section(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useCourseSectionDetailsQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get-search-courses-section-details', { ...payload }],
      () => API_ENDPOINTS.courses.get_course_section_details(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useCourseStatusTypeQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get-courses-status-types'],
      () => API_ENDPOINTS.courses.get_course_status_types(),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useActiveSemisterQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get_active_semister'],
      () => API_ENDPOINTS.courses.get_active_semister(),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useCourseFeeTypeQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get-course-fee-types'],
      () => API_ENDPOINTS.courses.get_course_fee_types(),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useSearchInstructorsQuery: ({ config = {}, enabled = false, payload }) => {
    return useQuery(
      ['get-search-instructors', { ...payload }],
      () => API_ENDPOINTS.courses.search_instructor(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetInstructorByIdQuery: ({ config = {}, enabled = false, payload }) => {
    return useQuery(
      ['get-instructor-by-id', { ...payload }],
      () => API_ENDPOINTS.courses.get_instructor_by_id(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetInstructorPastAppointment: ({
    config = {},
    enabled = false,
    payload,
  }) => {
    return useQuery(
      ['get-instructor-past-appointment', { ...payload }],
      () => API_ENDPOINTS.courses.get_instructor_past_appointment(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },

  useGaTaExperienceListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_ga_experiences_dropdown'],
      API_ENDPOINTS.courses.get_all_ga_experiences_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useJobClassCodesListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_job_class_codes_dropdown'],
      API_ENDPOINTS.courses.get_all_job_class_codes_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAppointmentRolesListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_appointment_roles_dropdown'],
      API_ENDPOINTS.appointment.get_all_appointment_roles_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useBackgroundCollateralListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_background_collateral_list_dropdown'],
      API_ENDPOINTS.appointment.get_all_background_collateral_list_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useRecordNumbersListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_record_numbers_list_dropdown'],
      API_ENDPOINTS.appointment.get_all_record_numbers_list_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useInstructorCourseSalaryListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_instructor_course_salary_list_dropdown'],
      API_ENDPOINTS.appointment.get_all_instructor_course_salary_list_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useSalaryAlternativeListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_salary_alternative_list_dropdown'],
      API_ENDPOINTS.appointment.get_all_salary_alternative_list_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  usePermitTypeListQuery: ({ config = {}, enabled, payload }) => {
    return useQuery(
      ['get_all_permit_type_list_dropdown'],
      API_ENDPOINTS.appointment.get_all_permit_type_list_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useTermListQuery: ({ config = {}, enabled = false }) => {
    return useQuery(
      ['get_term_list_dropdown'],
      API_ENDPOINTS.appointment.get_term_list_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
    
  },
  

  
};

export const useUsersQueries = {
  useGetUsersQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-users-list', { ...payload }],
      () => API_ENDPOINTS.users.get_users(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetUserByIdQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-users-by-id-list', { ...payload }],
      () => API_ENDPOINTS.users.get_user_by_id(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetUserDataQuery: ({ config = {}, enabled = false }) => {
    return useQuery(
      ['get-users-data'],
      () => API_ENDPOINTS.users.get_user_data(config),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useTuitionsQueries = {
  useGetTuitionsQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-tuitions-list', { ...payload }],
      () => {
        return API_ENDPOINTS.tuitions.get_tuitions(payload);
      },
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useAppointmentsQueries = {
  useGetAppointmentsQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-appointment-list', { ...payload }],
      () => API_ENDPOINTS.appointment.get_appointments(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useCourseTitleListQuery: ({ config = {}, enabled = false }) => {
    return useQuery(
      ['get-course-title-list'],
      API_ENDPOINTS.appointment.get_course_title_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAltSchoolAcctListQuery: ({ config = {}, enabled, payload = {} }) => {
    return useQuery(
      ['get_all_alt_school_acct_dropdown', { ...payload }],
      () => API_ENDPOINTS.appointment.get_all_alt_school_acct_dropdown(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAppointmentTypeListQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get_all_appointment_type_dropdown'],
      API_ENDPOINTS.appointment.get_all_appointment_type_dropdown,
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  
};

export const useEmailScreenQueries = {
  useGetEmailTemplateListQuery: ({ config = {}, enabled }) => {
    return useQuery(
      ['get-email-template-list'],
      () => API_ENDPOINTS.emailScreen.get_email_template(),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useAccountingQueries = {
  useGetAccountsQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-accounts-list', { ...payload }],
      () => API_ENDPOINTS.accounting.get_accounts(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useAnnouncementQueries = {
  useGetAnnouncementsQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-announcement-list', { ...payload }],
      () => API_ENDPOINTS.announcement.get_announcements(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useNotificationQueries = {
  useGetAllNotificationsQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-notification-list', { ...payload }],
      () => API_ENDPOINTS.notifications.get_all_notifications(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetUnreadNotificationsQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-unread-notification-list', { ...payload }],
      () => API_ENDPOINTS.notifications.get_unread_notifications(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetReadNotificationsQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-read-notification-list', { ...payload }],
      () => API_ENDPOINTS.notifications.get_read_notifications(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useDashboardQueries = {
  useGetAnalyticsQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-announcement-list', { ...payload }],
      () => API_ENDPOINTS.dashboard.get_analytics(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAppointmentCountByTermQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-appointment-count-by-term', { ...payload }],
      () => API_ENDPOINTS.dashboard.get_appointment_count_by_term(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useAppointmentCountByStatusQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-appointment-count-by-status', { ...payload }],
      () => API_ENDPOINTS.dashboard.get_appointment_count_by_status(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useEnrollmentCountQuery: ({ config = {}, enabled = false, payload = {} }) => {
    return useQuery(
      ['get-enrollment-count', { ...payload }],
      () => API_ENDPOINTS.dashboard.get_enrollment_count(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
};

export const useContractQueries = { 
  useGetContractTemplatesQuery: ({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-contract-templates', { ...payload }],
      () => API_ENDPOINTS.contract.get_contract_templates(payload),
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  },
  useGetInstructorContract:({
    config = {},
    enabled = false,
    payload = {},
  }) => {
    return useQuery(
      ['get-instructor-contract', { ...payload }],
      () => API_ENDPOINTS.contract.get_instructor_contract_template(payload),
      // async() => {
      //   let apiResp = await API_ENDPOINTS.contract.get_instructor_contract_template(payload)
      //   if(await apiResp.status_code === 400){
      //     const error = new Error('Error occured while fetching contract.')
      //     error.code = apiResp.status_code
      //     error.message = apiResp.message;
      //     throw error;
      //   }
      //   console.log("apiResp",apiResp)
      //   return apiResp
      // },
      {
        retry: false,
        enabled,
        refetchOnMount: false,
        ...config,
      }
    );
  }
};