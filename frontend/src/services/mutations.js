import { useMutation } from '@tanstack/react-query';
import API_ENDPOINTS from './endpoints';

export const usePostLogin = () => {
  return useMutation(API_ENDPOINTS.onboarding.user_login);
};

export const useDepartmentMutations = {
  useUpdateDepartmentMutation: () => {
    return useMutation(payload =>
      API_ENDPOINTS.departments.update_department(payload)
    );
  },
};

export const useContactMutations = {
  useCreateContactMutation: () => {
    return useMutation(payload => {
      if (payload?.id) {
        return API_ENDPOINTS.contacts.update_contact(payload);
      } else {
        return API_ENDPOINTS.contacts.add_contact(payload);
      }
    });
  },
  useToggleContactActiveMutation: () => {
    return useMutation(API_ENDPOINTS.contacts.toggle_contact_active);
  },
};

export const useCoursesMutation = {
  useUpdateCourseDatesMutation: () => {
    return useMutation(API_ENDPOINTS.courses.update_course_dates);
  },
  useUpdateCourseSectionMutation: () => {
    return useMutation(API_ENDPOINTS.courses.update_course_section);
  },
  useAddCommentsMutation: () => {
    return useMutation(API_ENDPOINTS.courses.add_comments);
  },
};

export const useInstructorMutation = {
  useAddNewInstructorMutation: () => {
    return useMutation(payload => {
      return API_ENDPOINTS.courses.add_new_instructor(payload);
    });
  },

  useAssignInstructorToCourseMutation: () => {
    return useMutation(payload => {
      API_ENDPOINTS.courses.assign_new_instructor(payload);
    });
  },

  useUpdateInstructorMutation: () => {
    return useMutation(API_ENDPOINTS.appointment.update_appointment);
  },

  useAddNewAppointmentComment: ()=>{
    return useMutation(payload => {
      return API_ENDPOINTS.appointment.add_new_admin_comment(payload);
    });
  },

  useUpdateInstructorContractSFS:() => {
    return useMutation(payload => {
      return API_ENDPOINTS.appointment.update_instructor_contract_sfs(payload);
    });
  },

  useUpdateContractStatusSFS:() => {
    return useMutation(payload => {
      return API_ENDPOINTS.appointment.update_contract_status_sfs(payload);
    });
  },
};

export const useUsersMutation = {
  useAddUserMutation: () => {
    return useMutation(API_ENDPOINTS.users.add_user);
  },

  useUpdateUserMutation: () => {
    return useMutation(API_ENDPOINTS.users.update_User);
  },
};

export const useTuitionsMutation = {
  useAddTuitionMutation: () => {
    return useMutation(API_ENDPOINTS.tuitions.add_tuition);
  },

  useUpdateUserMutation: () => {
    return useMutation(API_ENDPOINTS.tuitions.update_tuition);
  },
};

export const useEmailTemplateMutations = {
  useUpdateEmailTemplateMutation: () => {
    return useMutation(API_ENDPOINTS.emailScreen.update_email_template);
  },
};

export const useAccountingMutation = {
  useAddAccountMutation: () => {
    return useMutation(API_ENDPOINTS.accounting.add_account);
  },
  useUpdateAccountMutation: () => {
    return useMutation(API_ENDPOINTS.accounting.update_account);
  },
};

export const useAnnouncementMutation = {
  useAddAnnouncementMutation: () => {
    return useMutation(API_ENDPOINTS.announcement.add_announcement);
  },
  useUpdateAnnouncementMutation: () => {
    return useMutation(API_ENDPOINTS.announcement.update_announcement);
  },
};

export const useNotificationsMutation = {
  useMarkAsReadNotificationMutation: () => {
    return useMutation(API_ENDPOINTS.notifications.mark_as_read);
  },
};


export const useUnionContractMutation = {
  useUpdateUnionContractMutation: () => {
    return useMutation(API_ENDPOINTS.contract.update_union_contract);
  },
};

export const useContractMutation = {
  useUpdateResetContractMutation: () => {
    return useMutation(payload => {
      return API_ENDPOINTS.contract.reset_contract_template(payload)
    })
    
  },

  

  
};