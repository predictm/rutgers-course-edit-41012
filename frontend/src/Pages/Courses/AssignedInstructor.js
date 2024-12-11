import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

import Button from 'Components/Button';
import FormSelect from 'Components/FormSelect';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import { ReactComponent as ExpandIcon } from 'assets/icons/icon-arrow-circle-color.svg';
import { ReactComponent as CollapseIcon } from 'assets/icons/icon-arrow-circle-up.svg';
import useForm from 'hooks/Form';
import validator from 'utils/validation';
import { useAppContext } from 'context/AppContext';
import HorizontalDivider from 'Components/HorizontalDivider';
import FormInput from 'Components/FormInput';
import FormTextarea from 'Components/FormTextarea';
import SimpleModal from 'Components/SimpleModal';
import DatePicker from 'Components/DatePicker';
import { useCoursesQueries, useAppointmentsQueries } from 'services/queries';
import { useInstructorMutation } from 'services/mutations';
import FormRadio from 'Components/FormRadio';
import { genderList } from 'utils/constant';
import { isAdmin } from 'utils/common';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LightTooltip from 'StyledComponents/LightTooltip';
import { ReactComponent as InfoIcon } from 'assets/icons/icon-info.svg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, Switch, styled } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { formatCredit, formatPhoneNumber, formatSalary } from 'utils/helper';
import { ConvertToUSFormat } from 'utils/helper';

export const termListDropdown = [
  {
    value: 0,
    label: 'Winter',
  },
  {
    value: 1,
    label: 'Spring',
  },
  {
    value: 7,
    label: 'Summer',
  },
  {
    value: 9,
    label: 'Fall',
  },
  {
    value: 2,
    label: 'First Time',
  },
];

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#A629FF' : '#A629FF',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));


const AssignedInstructor = ({
  open,
  onClose,
  appointmentInfo,
  section,
  refetchCourseDetails,
}) => {
  const toggleAssigned = useInstructorMutation.useUpdateInstructorMutation();
  const updateAppointment = useInstructorMutation.useUpdateInstructorMutation();
  const adminComment = useInstructorMutation.useAddNewAppointmentComment();
  const { userData } = useAppContext();
  const isAdminUser = isAdmin(userData?.user_type);
  const [viewAll, setViewAll] = useState(false);
  const [beErrors, setBeErrors] = useState({});
  const [showGovernmentId, setShowGovernmentId] = useState(false);
  const [specialContractChecked, setSpecialContractChecked] = useState(false);
  const [doStringCheck, setDoStringCheck ] = useState(true) //for special contract text
 
  const payload = {
    instructor: appointmentInfo.id,
  };

  const { data: instructorData, refetch } =
    useCoursesQueries.useGetInstructorByIdQuery({
      enabled: true,
      payload,
    });

  const {
    data: instructorDataPastAppointment,
    refetch: refetchInstructorPastAppointment,
  } = useCoursesQueries.useGetInstructorPastAppointment({
    enabled: true,
    payload: {
      id: appointmentInfo?.instructor_info?.id,
    },
  });

  const dataToFill = instructorData?.data?.instructor_info;

  useEffect(() => {
    console.log('instructor Data', instructorData?.data);
    setValidationSchema({
      ...validationSchema,
      'approved_salary': {
        "required": instructorData?.data?.appointment_status && instructorData?.data?.appointment_status === 'APPROVED',
        "validator": validator.checkLength(25)
      },
      'role_of_appointee': {
        "required": !instructorData?.data?.primary_instructor && instructorData?.data?.instr_app_job_class_code !== 3 ? true : false
      }
    })
  }, [instructorData]);

  const handleInstructorAssignToggle = async () => {
    try {
      const name = `${dataToFill?.first_name}
      ${dataToFill?.middle_name ? dataToFill?.middle_name + ' ' : ''}
      ${dataToFill?.last_name}`;

      await toggleAssigned.mutateAsync({
        id: instructorData?.data?.id,
        is_assigned: !instructorData?.data?.is_assigned,
      });
      setTimeout(() => {
        refetch();
        refetchCourseDetails?.();
      }, 1000);
      toast.success(
        `${
          !instructorData?.data?.is_assigned ? 'Assigned' : 'Unassigned'
        } instructor ${name}.`,{
          hideProgressBar: true,
        }
      );
    } catch (error) {
      const errors = error?.response?.data?.data?.errors;
      setBeErrors({
        ...errors,
      });
      toast.error(
        `An error occurred while ${
          !instructorData?.data?.is_assigned ? 'Assigning' : 'Unassigning'
        } the section. Please try again later.`,{
          hideProgressBar: true,
        }
      );
    }
  };

  const handleClickShowGovernmentId = e => {
    setShowGovernmentId(!showGovernmentId);
    e.preventDefault();
  };

  const stateSchema = useMemo(() => {
    return {
      orig_approved_salary: {
        value: instructorData?.data?.orig_approved_salary,
        error: '',
      },
      proposed_salary: {
        value: instructorData?.data?.proposed_salary || '',
        error: '',
      },
      approved_salary: {
        value: instructorData?.data?.approved_salary || '',
        error: '',
      },

      first_name: { value: dataToFill?.first_name, error: '' },
      last_name: { value: dataToFill?.last_name, error: '' },
      middle_name: { value: dataToFill?.middle_name, error: '' },

      date_of_birth: {
        value: dataToFill?.date_of_birth
          ? moment(dataToFill?.date_of_birth)
          : null,
        error: '',
      },
      gender: { value: dataToFill?.gender, error: '' },
      employee_id: { value: dataToFill?.employee_number, error: '' },
      government_id: { value: dataToFill?.ssn, error: '' },

      city: { value: dataToFill?.city, error: '' },

      state: { value: dataToFill?.state, error: '' },
      zip_code: { value: dataToFill?.zip_code, error: '' },

      address1: { value: dataToFill?.address1, error: '' },
      address2: { value: dataToFill?.address2, error: '' },

      primary_email: { value: dataToFill?.primary_email, error: '' },
      secondary_email: { value: dataToFill?.secondary_email, error: '' },
      primary_phone: { value: dataToFill?.primary_phone, error: '' },
      work_phone: { value: dataToFill?.work_phone, error: '' },
      cell_phone: { value: dataToFill?.cell_phone, error: '' },

      visa_permit_type: { value: dataToFill?.visa_permit_type, error: '' },
      date_of_entry: {
        value: dataToFill?.date_of_entry
          ? moment(dataToFill?.date_of_entry)
          : null,
        error: '',
      },
      visa_permit_expire_date: {
        value: dataToFill?.visa_permit_expire_date
          ? moment(dataToFill?.visa_permit_expire_date)
          : null,
        error: '',
      },
      country_of_citizenship: {
        value: dataToFill?.country_of_citizenship,
        error: '',
      },
      visa_permit_status: { value: dataToFill?.visa_permit_status, error: '' },
      visa_permit_status_date: {
        value: dataToFill?.visa_permit_status_date
          ? moment(dataToFill?.visa_permit_status_date)
          : null,
        error: '',
      },

      class_during_academic_year: {
        value: dataToFill?.class_during_academic_year,
        error: '',
      },
      ga_ta_experience: {
        value: instructorData?.data?.ga_ta_experience,
        error: '',
      },
      valid_rutgers_I9: { value: dataToFill?.status, error: '' }, //incorrect api data
      primary_instructor: {
        // value: instructorData?.data?.primary_instructor,
        value: instructorData?.data?.primary_instructor ? 'yes' : 'no',
        error: '',
      },
      employment_type: {
        // value: instructorData?.data?.employment_type,
        value: instructorData?.data?.employment_type || 2,
        error: '',
      },
      instr_app_job_class_code: {
        value: instructorData?.data?.instr_app_job_class_code,
        error: '',
      },
      role_of_appointee: {
        value: instructorData?.data?.role_of_appointee,
        error: '',
      },
      default_sch_acc_code: {
        value: instructorData?.data?.default_sch_acc_code?.gl_string,
        error: '',
      },
      offering_unit_cd: {
        value: instructorData?.data?.course_section_details?.offering_unit_cd,
        error: '',
      },
      overwrite_school_acct: {
        value: instructorData?.data?.overwrite_school_acct,
        error: '',
      },
      alt_school_acct: {
        value: instructorData?.data?.alt_school_acct,
        error: '',
      },
      overwrite_contact_hours: {
        value: instructorData?.data?.overwrite_contact_hours,
        error: '',
      },
      special_contract_text: {
        value: instructorData?.data?.special_contract_text,
        error: '',
      },
      appointment_type: {
        value: instructorData?.data?.appointment_type || 2,
        error: '',
      },
      accepted_low_be_contract: {
        value: instructorData?.data?.accepted_low_be_contract,
        error: '',
      },

      background_check_received_date: {
        value: instructorData?.data?.background_check_received_date
          ? moment(instructorData?.data?.background_check_received_date)
          : null,
        error: '',
      },
      background_check_status: {
        value: instructorData?.data?.background_check_status,
        error: '',
      },
      date_signed_appointment_letter_returned: {
        value: instructorData?.data?.date_signed_appointment_letter_returned
          ? moment(
              instructorData?.data?.date_signed_appointment_letter_returned
            )
          : null,
        error: '',
      },
      record_number: { value: instructorData?.data?.record_number, error: '' },
      charging_instructions_processing_date: {
        value: instructorData?.data?.charging_instructions_processing_date
          ? moment(instructorData?.data?.charging_instructions_processing_date)
          : null,
        error: '',
      },
      instructor_course_salary: {
        value: instructorData?.data?.instructor_course_salary,
        error: '',
      },

      sch_code: {
        value: instructorData?.data?.course_section_details?.offering_unit_cd,
        error: '',
      },

      subject_code: {
        value: instructorData?.data?.course_section_details?.subj_cd,
        error: '',
      },

      past_salaries: {
        value: instructorData?.data?.past_salaries.map(({term,year,salary})=>({term,year,salary})) || [],
        // value: [
        //   {
        //     term: 7,
        //     year: '2023',
        //     salary: '$31000',
        //   },
        //   {
        //     term: 7,
        //     year: '2022',
        //     salary: '$38000',
        //   },
        // ],
        error: '',
      },

      salary_alternative: {
        value: instructorData?.data?.salary_payment_alternative,
        error: '',
      },

      admin_comments: {
        value: instructorData?.data?.admin_comments || [],
        error: '',
      },
      new_admin_comments: { value: '', error: '' },

      salary_history: {
        value: instructorData?.data?.salary_history || [],
        error: '',
      },

      approved_date: {
        value: instructorData?.data?.approved_date
          ? moment(instructorData?.data?.approved_date)
          : null,
        error: '',
      },
      approved_by: {
        value: userData?.id,
        error: '',
      },
      appointment_status: {
        value: instructorData?.data? instructorData?.data?.appointment_status : "anr",//Apidata not received
        error: '',
      },
    };
  }, [dataToFill, instructorData, userData]);

  const [validationSchema,setValidationSchema] = useState({
    appointment_status: {
      required: false,
    },
    orig_approved_salary: { required: false },
    proposed_salary: { required: true , validator: validator.numeric},
    approved_salary: { required: false,validator: validator.numeric },
    approved_date: {
      required: false,
    },
    approvedBy: {
      required: false,
    },
    first_name: {
      required: true,
      validator: validator.name,
    },
    last_name: {
      required: true,
      validator: validator.name,
    },
    middle_name: {
      required: false,
      validator: validator.name,
    },
    date_of_birth: {
      required: true,
    },
    gender: {
      required: true,
    },
    employee_id: {
      required: false,
    },
    government_id: {
      required: false,
    },
    city: {
      required: true,
    },
    state: {
      required: true,
    },
    zip_code: {
      required: true,
      validator: validator.exactLengthChars('Please enter valid zipcode',5)
    },
    primary_email: {
      required: true,
      validator: validator.email,
    },
    secondary_email: {
      required: false,
      validator: validator.email,
    },
    primary_phone: {
      required: true,
      validator:validator.checkLength("please input 10 digit number",12),
    },
    work_phone: {
      required: false,
      validator: validator.checkLength("please input 10 digit number",12),
    },
    cell_phone: {
      required: false,
      validator: validator.checkLength("please input 10 digit number",12),
    },
    address1: {
      required: true,
    },
    address2: {
      required: false,
    },
    visa_permit_type: {
      required: false,
    },
    date_of_entry: {
      required: false,
    },
    visa_permit_expire_date: {
      required: false,
    },
    country_of_citizenship: {
      required: false,
    },
    visa_permit_status: {
      required: false,
    },
    visa_permit_status_date: {
      required: false,
    },

    class_during_academic_year: {
      required: true,
    },
    ga_ta_experiences: {
      required: false,
    },
    valid_rutgers_I9: {
      required: true,
    },
    primary_instructor: {
      required: true,
    },
    employment_type: {
      required: true,
    },
    instr_app_job_class_code: {
      required: true,
    },
    role_of_appointee: {
      required: !instructorData?.data?.primary_instructor && instructorData?.data?.instr_app_job_class_code !== 3 ? true : false,
    },
    default_sch_acc_code: {
      required: false,
    },
    overwrite_school_acct: {
      required: false,
     
    },
    alt_school_acct: {
      required: false,
    },
    overwrite_contact_hours: {
      required: false,
      validator: validator.numeric
    },
    special_contract_text: {
      required: false,
    },
    appointment_type: {
      required: false,
    },
    accepted_low_be_contract: {
      required: false,
    },

    background_check_received_date: {
      required: false,
    },
    background_check_status: {
      required: false,
    },
    date_signed_appointment_letter_returned: {
      required: false,
    },
    record_number: {
      required: false,
    },
    charging_instructions_processing_date: {
      required: false,
    },
    instructor_course_salary: {
      required: false,
      
    },
    past_salaries: {
      required: false,
    },
    approved_salary:{
      required: true,
      validator: validator.checkLength(25),
    },
    proposed_salary: {
      required: true,
      validator: validator.checkLength(25),
    },
    salary_alternative: {
      required: false,
    },
    new_admin_comments: {
      required: false,
    },
  });

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  const appointmentStatusMapping = {
    pending: 'PENDING',
    approved: 'APPROVED',
  };
  // hcm_ready: 'HCM_READY',
  // hcm_enter: 'HCM_ENTER',

  const primaryInstructorMapping = {
    yes: true,
    no: false,
  };

  const booleanMapping = {
    "true": true,
    "false": false,
  };
 

  const updateAppointmentPayload = {
    id: instructorData?.data?.id,
    instructor_info: {
      first_name: state?.first_name?.value,
      middle_name: state?.middle_name?.value,
      last_name: state?.last_name?.value,
      date_of_birth: moment(state?.date_of_birth?.value).format('YYYY-MM-DD'),
      gender: state?.gender?.value,
      employee_number: state?.employee_id?.value,
      // ssn: state?.government_id?.value, //** */

      city: state?.city?.value,
      state: state?.state?.value,
      zip_code: state?.zip_code?.value,
      address1: state?.address1?.value,
      address2: state?.address2?.value,
      primary_email: state?.primary_email?.value,
      secondary_email: state?.secondary_email?.value,
      primary_phone: state?.primary_phone?.value,
      work_phone: state?.work_phone?.value,
      cell_phone: state?.cell_phone?.value,

      visa_permit_type: state?.visa_permit_type?.value,
      date_of_entry: state?.date_of_entry?.value ? moment(state?.date_of_entry?.value).format('YYYY-MM-DD') : null,
      visa_permit_expire_date: state?.visa_permit_expire_date?.value ? moment(state?.visa_permit_expire_date?.value).format('YYYY-MM-DD') : null,
      country_of_citizenship: state?.country_of_citizenship?.value,
      visa_permit_status: state?.visa_permit_status?.value,
      visa_permit_status_date: state?.visa_permit_status_date?.value? moment(state?.visa_permit_status_date?.value).format('YYYY-MM-DD') : null,

      class_during_academic_year: state?.class_during_academic_year?.value,

      status: state?.valid_rutgers_I9?.value,
    },
    appointment_status:
      appointmentStatusMapping[state.appointment_status.value],
    proposed_salary: parseFloat(state?.proposed_salary?.value?.replace(/,/g, '')),
    // orig_approved_salary: state?.orig_approved_salary?.value,//** */
    primary_instructor:
      primaryInstructorMapping[state?.primary_instructor?.value],
    employment_type: state?.employment_type?.value,
    instr_app_job_class_code: state?.instr_app_job_class_code?.value,
    ga_ta_experience: state?.ga_ta_experience?.value,
    role_of_appointee: state?.role_of_appointee?.value,
    default_sch_acc_code: state?.default_sch_acc_code?.value,
    
    overwrite_school_acct: state?.overwrite_school_acct?.value,
    alt_school_acct: state?.alt_school_acct?.value,
    overwrite_contact_hours: state?.overwrite_contact_hours?.value,
    special_contract_text: state?.special_contract_text?.value,
    appointment_type: state?.appointment_type?.value,
    accepted_low_be_contract: booleanMapping[state?.accepted_low_be_contract?.value],
    

    background_check_received_date:moment(
      state?.background_check_received_date?.value
    ).format('YYYY-MM-DD'),
    background_check_status: state?.background_check_status?.value,
    date_signed_appointment_letter_returned: state?.date_signed_appointment_letter_returned?.value ? 
    moment(
      state?.date_signed_appointment_letter_returned?.value
    ).format('YYYY-MM-DD') : null,
    record_number: state?.record_number?.value,
    charging_instructions_processing_date: state?.charging_instructions_processing_date?.value ? 
    moment(
      state?.charging_instructions_processing_date?.value
    ).format('YYYY-MM-DD') : null,
    instructor_course_salary: state?.instructor_course_salary?.value,
    past_salaries: state?.past_salaries?.value,
    approved_salary: parseFloat(state?.approved_salary?.value?.replace(/,/g, '')),

    salary_payment_alternative: state?.salary_alternative?.value,

    // admin_comments: state?.admin_comments?.value,//** */
  };

  useEffect(() => {
    console.log(
      'updated prim instructor',
      updateAppointmentPayload.primary_instructor
    );
  }, [updateAppointmentPayload]);

  const adminCommentPayload = {
    appointment: instructorData?.data?.id,
    comment: state?.new_admin_comments?.value,
  };

  const handleAddCommentClick = async () => {
    console.log('add comment button click', adminCommentPayload);
    try {
      await adminComment.mutateAsync(adminCommentPayload);

      toast.success('Admin comment added Successfully',{
        hideProgressBar: true,
      });
      setTimeout(() => {
        refetch();
        refetchCourseDetails?.();
      }, 1000);
    } catch (error) {
      const errors = error?.response?.data?.errors;
      setBeErrors({
        ...errors,
      });
      toast.success(`An error occurred while adding, Please try again later.`,{
        hideProgressBar: true,
      });
    }
  };


  const handleUpdateClick = async () => {
    //BE gives error response for invalid date
    if(updateAppointmentPayload.background_check_received_date === "Invalid date"){
      delete updateAppointmentPayload.background_check_received_date 
    }

    if(updateAppointmentPayload.date_signed_appointment_letter_returned === "Invalid date"){
      delete updateAppointmentPayload.date_signed_appointment_letter_returned 
    }

    if(updateAppointmentPayload.charging_instructions_processing_date === "Invalid date"){
      delete updateAppointmentPayload.charging_instructions_processing_date
    }

    
    if(updateAppointmentPayload.past_salaries?.length ===0){
      delete updateAppointmentPayload.past_salaries
    }

    if(specialContractChecked === false || updateAppointmentPayload.special_contract_text==="")
      updateAppointmentPayload.special_contract_text=null
    
  
    
    if (state?.appointment_status?.value === 'approved') {
      updateAppointmentPayload.approved_date = (state?.approved_date?.value).format('YYYY-MM-DD');
        
        //moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      updateAppointmentPayload.approved_by = state?.approved_by?.value;
      updateAppointmentPayload.approved = true;
    } else if (
      state?.proposed_salary?.value &&
      state?.appointment_status?.value === 'pending'
    ) {
      updateAppointmentPayload.proposed_by = userData?.id;
      updateAppointmentPayload.proposed_date = moment(new Date()).format();
    }
    updateAppointmentPayload.proposed_by =
      instructorData?.data?.proposed_by || userData?.id;

    // console.log('payload', updateAppointmentPayload);

    // commented till form development
    try {
      await updateAppointment.mutateAsync(updateAppointmentPayload);

      toast.success('Instructor info updated Successfully',{
        hideProgressBar: true,
      });
      onClose();
      setTimeout(() => {
        refetch();
        refetchCourseDetails?.();
      }, 1000);
    } catch (error) {
      const errors = error?.response?.data?.errors;
      setBeErrors({
        ...errors,
      });
      const key = Object.keys(errors || {})?.[0];
      toast.error(
        key ? `An error occurred while Updating, Please update field values in ${key.toUpperCase().split("_").join(" ")}` : `An error occurred while Updating, Please try again later.`,{
          hideProgressBar: true,
        }
      );
    }
  };

  const [profileCollapseOpen, setProfileCollapseOpen] = React.useState(false);
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [visaCollapseOpen, setVisaCollapseOpen] = React.useState(false);
  const [currentWorkCollapseOpen, setCurrentWorkCollapseOpen] =
    React.useState(true);
  const [verificationCollapseOpen, setVerificationCollapseOpen] =
    React.useState(false);
  const [salaryCollapseOpen, setSalaryCollapseOpen] = React.useState(true);
  const [adminCommentsCollapseOpen, setAdminCommentsCollapseOpen] =
    React.useState(false);
  const toggleProfileRow = () => setProfileCollapseOpen(!profileCollapseOpen);
  const toggleRow = () => setCollapseOpen(!collapseOpen);
  const toggleVisaRow = () => setVisaCollapseOpen(!visaCollapseOpen);
  const toggleCurrentWorkRow = () =>
    setCurrentWorkCollapseOpen(!currentWorkCollapseOpen);
  const toggleVerificationRow = () =>
    setVerificationCollapseOpen(!verificationCollapseOpen);
  const toggleAdminCommentsRow = () =>
    setAdminCommentsCollapseOpen(!adminCommentsCollapseOpen);
  const toggleSalaryRow = () => setSalaryCollapseOpen(!salaryCollapseOpen);

  const { data: stateListData } = useCoursesQueries.useStateListQuery({
    enabled: true,
  });

  const stateList = stateListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: permitTypeListData } = useCoursesQueries.usePermitTypeListQuery(
    {
      enabled: true,
    }
  );

  const permitTypeList = permitTypeListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: visaStatusListData } = useCoursesQueries.useVisaStatusListQuery(
    {
      enable: true,
    }
  );

  const visaStatusList = visaStatusListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: academicYearTitlesListData } =
    useCoursesQueries.useAcademciYearTitlesListQuery({
      enabled: true,
    });

  const academicYearTitlesList = academicYearTitlesListData?.data?.results?.map(
    item => ({
      value: item?.id,
      label: item?.name,
    })
  );

  useEffect(()=>{console.log("api", academicYearTitlesList)},[academicYearTitlesList])

  const { data: gaTaListData } = useCoursesQueries.useGaTaExperienceListQuery({
    enabled: true,
  });

  const gaTaList = gaTaListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.experience,
  }));

  const { data: use1_9StatusListData } =
    useCoursesQueries.use1_9StatusListQuery({
      enabled: true,
    });

  const use1_9StatusList = use1_9StatusListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: employmentTypeListData } =
    useCoursesQueries.useEmploymentTypeListQuery({
      enabled: true,
    });

  const employmentTypeList = employmentTypeListData?.data?.results?.map(
    item => ({
      value: item?.id,
      label: item?.name,
    })
  );

  
const { data: jobClassCodesListData } =
    useCoursesQueries.useJobClassCodesListQuery({
      enabled: true,
    });
  console.log(jobClassCodesListData,'jobClassCodesListData');

  const jobClassCodesList = jobClassCodesListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name + '-' + item?.code,
  }));

  const { data: appointmentRolesData } =
    useCoursesQueries.useAppointmentRolesListQuery({
      enabled: true,
    });

  const appointmentRoles = appointmentRolesData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: backgroundCollateralListData } =
    useCoursesQueries.useBackgroundCollateralListQuery({
      enabled: true,
    });

  const backgroundCollateralList =
    backgroundCollateralListData?.data?.results?.map(item => ({
      value: item?.id,
      label: item?.name,
    }));

  const { data: recordNumbersListData } =
    useCoursesQueries.useRecordNumbersListQuery({
      enabled: true,
    });

  const recordNumbersList = recordNumbersListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.number,
  }));

  const { data: instructorCourseSalaryListData } =
    useCoursesQueries.useInstructorCourseSalaryListQuery({
      enabled: true,
    });

  const instructorCourseSalaryList =
    instructorCourseSalaryListData?.data?.results?.map(item => ({
      value: item?.id,
      label: item?.salary_type,
    }));

  const { data: salaryAlternativeListData } =
    useCoursesQueries.useSalaryAlternativeListQuery({
      enabled: true,
    });

  const salaryAlternativeList = salaryAlternativeListData?.data?.results?.map(
    item => ({
      value: item?.id,
      label: item?.name,
    })
  );

  const { data: termListData } = useCoursesQueries.useTermListQuery({
    enabled: true,
  });

  const termList = termListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  

  const offering_unit_cd_payload = state?.offering_unit_cd?.value;

  const { data: altSchoolAcctListData } =
    useAppointmentsQueries.useAltSchoolAcctListQuery({
      payload: { offering_unit_cd_payload },
      enabled: true,
    });

  const altSchoolAcctList = altSchoolAcctListData?.data?.results?.map(item => ({
    value: item?.id,
    label:
      item?.offering_unit_info.offering_unit_descr + ' : ' + item?.gl_string,
  }));

  const { data: appointmentTypeListData } =
    useAppointmentsQueries.useAppointmentTypeListQuery({
      enabled: true,
    });
  


  const appointmentTypeList = appointmentTypeListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name
  }));

  

  // const [pastSalariesList, setPastSalariesList] = useState(
  //   [
  //     {
  //       term: 7,
  //       year: '2023',
  //       salary: '$30000',
  //     },
  //     {
  //       term: 7,
  //       year: '2022',
  //       salary: '$37000',
  //     },
  //   ]
  // )

  const handleDropdownPastSalaryTermChange = (index,field,parentField) => e => {
    // setBeErrors(prev => ({ ...prev, [field]: '' }));
    let localPastSalaryData = state?.past_salaries?.value;
    localPastSalaryData[index][field] = e?.target?.value
    
    console.log("past sal term update", localPastSalaryData, e?.target?.value)
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(parentField, localPastSalaryData);

    // handleOnChange(field, e?.target?.value); 
    // console.log('visaStatusChange', field, e?.target?.value, state);
  };

  const handleAddPastLecturerDetailsClick = (e,field)=>{
    e.preventDefault();
    let updatedList = [...state?.past_salaries?.value,
      {
            term: '',
            year: '',
            salary: '',
      }
      ];

    console.log("sal list", updatedList);
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, updatedList);
    
  }

  // const pastSalariesList = [
  //   {
  //     term: 7,
  //     year: '2023',
  //     salary: '$30000',
  //   },
  //   {
  //     term: 7,
  //     year: '2022',
  //     salary: '$37000',
  //   },
  // ];

  // state?.past_salaries?.value
  // useEffect(()=>{
  //   updateAppointmentPayload.past_salaries.push(...pastSalariesList)
  // },[])

  useEffect(() => {
    console.log('employment type', employmentTypeList);
  }, [employmentTypeList]);

  useEffect(()=>{
    if(doStringCheck && typeof state?.special_contract_text?.value === "string"){
      setSpecialContractChecked(true)
      setDoStringCheck(false)
    }
  },[state])

  

  useEffect(() => {
    console.log('past sal up', updateAppointmentPayload.past_salaries, updateAppointmentPayload , state?.secondary_email?.value);
    //  console.log("ouc",state?.offering_unit_cd?.value)
    console.log('alt school', altSchoolAcctList);
  }, [state]);

  const handleDropdownChange = field => e => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    if(field === 'instr_app_job_class_code'){
      setValidationSchema({...validationSchema,'role_of_appointee' : {"required": e.target.value !== 3 && state?.primary_instructor?.value === 'no'}})
    }
    handleOnChange(field, e?.target?.value);
  };
  const handleStatusChange = field => e => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    if (e.target.value === 'approved'){
      handleDateChange('approved_date')(moment(new Date()));
      setValidationSchema({ ...validationSchema, "approved_salary": {"required": true, "validator": validator.checkLength(25)}})
    }
    if(e.target.value === 'pending'){
      setValidationSchema({ ...validationSchema, "approved_salary": {"required": false, "validator": validator.checkLength(25)}})
    }
    handleOnChange(field, e.target.value);
    if(field === 'primary_instructor'){
      setValidationSchema({...validationSchema,'role_of_appointee' : {"required": e.target.value === 'no' && state?.instr_app_job_class_code?.value !== 3}})
    }
  };
  const handleDateChange = field => value => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, value);

    // if(field==="background_check_received_date"){
    //   const testingPayload = {
    //     ...updateAppointmentPayload, 
    //     background_check_received_date: {
    //   value: instructorData?.data?.background_check_received_date
    //     ? moment(instructorData?.data?.background_check_received_date)
    //     : null,
    //   error: '',
    // },
    //   }
    //    console.log("@@@@@@@@", testingPayload)
    // }
    // background_check_received_date: {
    //   value: instructorData?.data?.background_check_received_date
    //     ? moment(instructorData?.data?.background_check_received_date)
    //     : null,
    //   error: '',
    // },
  };

  const handleInputChange = field => e => {
      setBeErrors(prev => ({ ...prev, [field]: '' }));
      if(field==='primary_phone' || field==='work_phone' || field==='cell_phone'){
        
        handleOnChange(field, formatPhoneNumber(e?.target?.value));
        
      }
       else if(field==='proposed_salary' || field==='approved_salary'){
        if(/^[\d.,]+$/.test(e?.target?.value)|| e?.target?.value===''){
        handleOnChange(field,e?.target?.value);
        }
      }
      else{
        handleOnChange(field, e?.target?.value);
      }
  };

  const handleOverwrite = field =>e =>{
    console.log("overwrite", field, e.target.checked)
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, e?.target?.checked);
    if(field === 'overwrite_school_acct'){
      !e?.target?.checked && handleOnChange('alt_school_acct',null)
    }    
  }

  const handleViewMore = () => setViewAll(!viewAll);

  const pastSalaryDetailsLabel = (pastSalaryData) => {
    return (
      <Stack direction="row" alignItems="flex-start">
        Final Approved Salary&nbsp;
        <span style={{ fontStyle: 'italic' }}>(By Summer Staff)&nbsp;</span>
        <LightTooltip
          placement="left-start"
          arrow
          sx={{ '.MuiTooltip-tooltip': { maxWidth: '600px' } }}
          title={
            <Stack alignItems="flex-start">
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  lineHeight: '1.125',
                  fontWeight: '600',
                  textAlign: 'left',
                }}
                component={'div'}
              >
                Past Approved Salary:
                <HorizontalDivider />
              </Typography>
              <div>
                {pastSalaryData.length!==0? 
                pastSalaryData?.map(salaryData => {
                  let formated_approval_date = moment(
                    salaryData?.approval_date
                  ).format('YYYY-MM-DD');
                  return (
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        lineHeight: '1.125',
                        color: '#666666',
                        textAlign: 'left',
                        paddingTop: '10px',
                      }}
                      paragraph
                    >
                      {/* {pastSalaryData[1].approved_salary} */}
                      Salary : <b>$ {salaryData.approved_salary}</b> <br />
                      Approved by{' '}
                      <b>
                        {salaryData.approved_by?.username || 'unknown'}
                      </b> on {formated_approval_date}
                    </Typography>
                  );
                })
                :"No past records"
              }
              </div>
            </Stack>
          }
          data-testid="courses-prerequisite-tooltip"
        >
          <InfoIcon
            style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
          />
        </LightTooltip>
        {
          state?.appointment_status?.value?.toLowerCase() == 'approved'?
          <span style={{ color: '#d32f2f' }}>&nbsp;*</span>
          :''
        }
        
      </Stack>
    );
  };

  const specialContractTextLabel = () => {
    console.log(state?.instr_app_job_class_code?.value,'state?.instr_app_job_class_code?.value')
    return (
      <Stack direction="row" alignItems="flex-start">
        Special Contract Text &nbsp;
        <AntSwitch
        id="checkbox-special-contract-text"
        style={{padding: '1px'}}
        size="small"
        onChange={()=>{
          if(!specialContractChecked && typeof state?.special_contract_text?.value !== "string"){
            handleOnChange("special_contract_text", "The compensation for this course(s) is due to special circumstances and is not at base salary and does not establish a new base salary rate.")
          }
          setSpecialContractChecked(!specialContractChecked)
        }}
        checked = {specialContractChecked}
        />
        <Typography style={{marginLeft:'5px', marginTop:'-3px'}}>{specialContractChecked ? 'Yes' : 'No'}</Typography>
      </Stack>
    );
  };


  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="AssignedInstructor"
      titleValue="XYZ"
      leftButton={{ label: 'Unassigned' }}
      rightButton={{ label: 'Update' }}
    >
      <Grid position="sticky" top="0" zIndex="1000" backgroundColor="#fdfbf2" padding="1rem">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h4"
              sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
              data-testid="assign-instructor-modal-user-name"
            >
              Assigned Instructor: &nbsp;
              <span style={{ fontWeight: '600' }}>
                {`${dataToFill?.first_name || ''} ${
                  dataToFill?.middle_name || ''
                } ${dataToFill?.last_name || ''}`}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={onClose}
              style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
              data-testid="assign-instructor-modal-close"
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ borderBottom: '2px solid #C9C9C9' }}
        >
          <Grid item xs={2}>
            <Typography
              variant="h6"
              sx={{ fontStyle: 'italic', fontWeight: 600 }}
              data-testid="assign-instructor-modal-semester"
            >
              {section?.semester_display}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <ul
              style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <li data-testid="assign-instructor-modal-course-no">
                Course#: &nbsp;
                <span style={{ fontStyle: 'italic', fontWeight: 600 }}>
                  {`${section.offering_unit_cd}:${section.subj_cd}:${section.course_no}:${section.section_no}`}
                </span>
              </li>
              <li>
                Section:&nbsp;
                <span
                  style={{ fontStyle: 'italic', fontWeight: 600 }}
                  data-testid="assign-instructor-modal-section-no"
                >
                  {/* B1 / [Session date] */}
                  {section?.section_no}
                </span>
              </li>
              <li>
                Index:&nbsp;
                <span
                  style={{ fontStyle: 'italic', fontWeight: 600 }}
                  data-testid="assign-instructor-modal-reg-index"
                >
                  {section?.reg_index_no}
                </span>
              </li>
              <li>
                Credits:&nbsp;
                <span
                  style={{ fontStyle: 'italic', fontWeight: 600 }}
                  data-testid="assign-instructor-modal-credits"
                >
                  {formatCredit(section?.credits)}
                </span>
              </li>
            </ul>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{fontSize: '1rem',}}>
           <span style={{ fontWeight: '600'}}>Created : &nbsp;</span> 
           <span >{moment(appointmentInfo?.created_at).format('YYYY-MM-DD')} at &nbsp;</span>
           <span >{moment(appointmentInfo?.created_at).format('hh:mm A')} by &nbsp;</span>
           <span >{appointmentInfo?.modified_by?.first_name} {appointmentInfo?.modified_by?.last_name} - &nbsp;</span>
           <span >{appointmentInfo?.modified_by?.email} - {appointmentInfo?.modified_by?.phone_number} &nbsp;</span>

        </Typography>
        </Grid>
      <Grid
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '2rem',
        }}
      >
        <Grid position="relative" z-index="1" >
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
          onClick={toggleProfileRow}
          style={{cursor:'pointer'}}
        >
          <Grid item>
            <Typography variant="h5">Personal Info</Typography>
          </Grid>
          <Grid item>
            {profileCollapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleProfileRow}
                data-testid="assign-instructor-modal-collapse-profile"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleProfileRow}
                data-testid="assign-instructor-modal-expand-profile"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={profileCollapseOpen} timeout="auto" unmountOnExit>
          <Box m={3}>
            <Grid
              container
              justifyContent="space-between"
              mt={3}
              mb={3}
              spacing={2}
            >
              <Grid item xs={4}>
                <FormInput
                  label="First Name"
                  required
                  placeholder="ie: John"
                  value={state?.first_name?.value}
                  error={state?.first_name?.error || beErrors?.first_name}
                  onChange={handleInputChange('first_name')}
                  testId="assign-instructor-modal-first-name"
                />
              </Grid>
              <Grid item xs={4}>
                <FormInput
                  label="Middle Name"
                  placeholder="ie: L"
                  value={state?.middle_name?.value}
                  error={state?.middle_name?.error || beErrors?.middle_name}
                  onChange={handleInputChange('middle_name')}
                  testId="assign-instructor-modal-middle-name"
                />
              </Grid>
              <Grid item xs={4}>
                <FormInput
                  label="Last Name"
                  required
                  placeholder="ie: Smith"
                  value={state?.last_name?.value}
                  error={state?.last_name?.error || beErrors?.last_name}
                  onChange={handleInputChange('last_name')}
                  testId="assign-instructor-modal-last-name"
                />
              </Grid>
              <Grid item xs={3}>
                <DatePicker
                  label="Date of Birth"
                  value={state?.date_of_birth?.value}
                  error={state?.date_of_birth?.error || beErrors?.date_of_birth}
                  onChange={handleDateChange('date_of_birth')}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-date-of-birth"
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <FormSelect
                  label="Gender"
                  placeholder="--Select--"
                  options={genderList}
                  value={state?.gender?.value || ''}
                  error={state?.gender?.error || beErrors?.gender}
                  onChange={handleDropdownChange('gender')}
                  testId="assign-instructor-modal-gender"
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <FormInput
                  label="Employee ID"
                  placeholder="ie: 123456"
                  value={state?.employee_id?.value}
                  error={state?.employee_id?.error || beErrors?.employee_id}
                  onChange={handleInputChange('employee_id')}
                  testId="assign-instructor-modal-employee_id"
                />
              </Grid>
              <Grid item xs={3}>
                <FormInput
                  label={
                    <Typography>
                      Government Id
                      <IconButton
                        onClick={handleClickShowGovernmentId}
                        sx={{
                          padding: '0px',
                          marginX: '10px',
                        }}
                      >
                        {showGovernmentId ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Typography>
                  }
                  placeholder="ie: 123456"
                  value={state?.government_id?.value}
                  error={state?.government_id?.error || beErrors?.government_id}
                  onChange={handleInputChange('government_id')}
                  testId="assign-instructor-modal-government_id"
                  type={showGovernmentId ? 'text' : 'password'}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <HorizontalDivider />
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
          onClick={toggleRow}
          style={{cursor:'pointer'}}
        >
          <Grid item>
            <Typography variant="h5">Contact</Typography>
          </Grid>
          <Grid item>
            {collapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleRow}
                data-testid="assign-instructor-modal-collapse-contact"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleRow}
                data-testid="assign-instructor-modal-expand-contact"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <Box m={3}>
            <Grid
              container
              justifyContent="space-between"
              mt={3}
              mb={3}
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={4}>
                <FormInput
                  label="Home/Mobile Phone"
                  placeholder="ie: 123-456-7890"
                  required
                  value={state.primary_phone.value}
                  error={state?.primary_phone?.error || beErrors?.primary_phone}
                  onChange={handleInputChange('primary_phone')}
                  testId="assign-instructor-modal-primary-phone"
                />
              </Grid>
              <Grid item xs={4}>
                <FormInput
                  label="Work/Office Phone"
                  placeholder="ie: 123-456-7890"
                  value={state.work_phone.value}
                  error={state?.work_phone?.error || beErrors?.work_phone}
                  onChange={handleInputChange('work_phone')}
                  testId="assign-instructor-modal-work-phone"
                />
              </Grid>
              <Grid item xs={4}>
                <FormInput
                  label="Mobile Phone"
                  placeholder="ie: 123-456-7890"
                  value={state.cell_phone.value}
                  error={state?.cell_phone?.error || beErrors?.cell_phone}
                  onChange={handleInputChange('cell_phone')}
                  testId="assign-instructor-modal-cell-phone"
                />
              </Grid>

              <Grid item xs={6}>
                <FormInput
                  label="Personal Email"
                  required
                  value={state.primary_email.value}
                  error={state?.primary_email?.error || beErrors?.primary_email}
                  onChange={handleInputChange('primary_email')}
                  testId="assign-instructor-modal-primary-email"
                />
              </Grid>
              <Grid item xs={6}>
                <FormInput
                  label="Work Email"
                  value={state.secondary_email.value}
                  error={
                    state?.secondary_email?.error || beErrors?.secondary_email
                  }
                  onChange={handleInputChange('secondary_email')}
                  testId="assign-instructor-modal-secondary-email"
                />
              </Grid>

              <Grid item xs={6}>
                <FormInput
                  label="Address 1"
                  required
                  value={state.address1.value}
                  error={state?.address1?.error || beErrors?.address1}
                  onChange={handleInputChange('address1')}
                  testId="assign-instructor-modal-address1"
                />
              </Grid>
              <Grid item xs={6}>
                <FormInput
                  label="Address 2"
                  value={state.address2.value}
                  onChange={handleInputChange('address2')}
                  error={state?.address2?.error || beErrors?.address2}
                  testId="assign-instructor-modal-address2"
                />
              </Grid>

              <Grid item xs={4}>
                <FormInput
                  label="City"
                  error={state?.city?.error || beErrors?.city}
                  required
                  value={state.city.value}
                  onChange={handleInputChange('city')}
                  testId="assign-instructor-modal-city"
                />
              </Grid>
              <Grid item xs={4}>
                <FormSelect
                  label="State"
                  placeholder="--Select--"
                  options={stateList}
                  error={state?.state?.error || beErrors?.state}
                  value={state.state.value || ''}
                  onChange={handleDropdownChange('state')}
                  name="state"
                  disabled={!stateList?.length}
                  testId="assign-instructor-modal-state"
                  required
                />{' '}
              </Grid>
              <Grid item xs={4}>
                <FormInput
                  type='number'
                  label="ZIP"
                  error={state?.zip_code?.error || beErrors?.zip_code}
                  placeholder="###"
                  required
                  value={state.zip_code.value}
                  onChange={handleInputChange('zip_code')}
                  testId="assign-instructor-modal-zip-code"
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
        <HorizontalDivider />
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
          onClick={toggleVisaRow}
          style={{cursor:'pointer'}}
        >
          <Grid item>
            <Typography variant="h5">Visa Information</Typography>
          </Grid>
          <Grid item>
            {visaCollapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleVisaRow}
                data-testid="assign-instructor-modal-collapse-visa"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleVisaRow}
                data-testid="assign-instructor-modal-expand-visa"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={visaCollapseOpen} timeout="auto" unmountOnExit>
          <Box m={3}>
            <Grid
              container
              justifyContent="space-between"
              mt={3}
              mb={3}
              spacing={2}
            >
              <Grid item xs={4}>
                <FormSelect
                  label="Visa/Permit Type"
                  placeholder="--Select--"
                  options={permitTypeList}
                  error={
                    state?.visa_permit_type?.error || beErrors?.visa_permit_type
                  }
                  value={state.visa_permit_type.value || ''}
                  onChange={handleDropdownChange('visa_permit_type')}
                  name="visa_permit_type"
                  disabled={!permitTypeList?.length}
                  testId="assign-instructor-modal-visa-permit-type"
                />{' '}
              </Grid>

              <Grid item xs={4}>
                <DatePicker
                  label="Date of entry to the USA"
                  value={state?.date_of_entry?.value}
                  error={state?.date_of_entry?.error || beErrors?.date_of_entry}
                  onChange={handleDateChange('date_of_entry')}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-date-of-entry"
                />
              </Grid>
              <Grid item xs={4}>
                <DatePicker
                  label="Visa Permit Expire Date"
                  value={state?.visa_permit_expire_date?.value}
                  error={
                    state?.visa_permit_expire_date?.error ||
                    beErrors?.visa_permit_expire_date
                  }
                  onChange={handleDateChange('visa_permit_expire_date')}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-date-of-visa-permit-expire-date"
                />
              </Grid>
              {
                //Country of Residence
              }

              <Grid item xs={4}>
                <FormInput
                  label="Country of Citizenship"
                  value={state?.country_of_citizenship?.value}
                  error={
                    state?.country_of_citizenship?.error ||
                    beErrors?.country_of_citizenship
                  }
                  onChange={handleInputChange('country_of_citizenship')}
                  testId="assign-instructor-modal-country-of-citizenship"
                />
              </Grid>
              <Grid item xs={4}>
                <FormSelect
                  label="Visa Permit Status"
                  placeholder="--Select--"
                  options={visaStatusList}
                  error={
                    state?.visa_permit_status?.error ||
                    beErrors?.visa_permit_status
                  }
                  value={state.visa_permit_status.value || ''}
                  onChange={handleDropdownChange('visa_permit_status')}
                  name="VisaStatus"
                  disabled={!visaStatusList?.length}
                  testId="assign-instructor-modal-visa-status"
                />{' '}
              </Grid>
              <Grid item xs={4}>
                <DatePicker
                  label="Visa Permit Status Date"
                  value={state?.visa_permit_status_date?.value}
                  error={
                    state?.visa_permit_status_date?.error ||
                    beErrors?.visa_permit_status_date
                  }
                  onChange={handleDateChange('visa_permit_status_date')}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-visa-permit-status-date"
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
        <HorizontalDivider />
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
          onClick={toggleCurrentWorkRow}
          style={{cursor:'pointer'}}
        >
          <Grid item>
            <Typography variant="h5">Current Work</Typography>
          </Grid>
          <Grid item>
            {currentWorkCollapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleCurrentWorkRow}
                data-testid="assign-instructor-modal-collapse-current-work"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleCurrentWorkRow}
                data-testid="assign-instructor-modal-expand-current-work"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={currentWorkCollapseOpen} timeout="auto" unmountOnExit>
          <Box m={3}>
            <Grid
              container
              justifyContent="space-between"
              mt={3}
              mb={3}
              spacing={2}
            >
              <Grid item xs={4}>
                <FormSelect
                  label="Title During Academic Year"
                  placeholder="--Select--"
                  options={academicYearTitlesList}
                  error={
                    state?.class_during_academic_year?.error ||
                    beErrors?.class_during_academic_year
                  }
                  value={state.class_during_academic_year.value || ''}
                  onChange={handleDropdownChange('class_during_academic_year')}
                  name="class_during_academic_year"
                  disabled={!academicYearTitlesList?.length}
                  testId="assign-instructor-modal-class-during-academic-year"
                  required
                />{' '}
              </Grid>
              <Grid item xs={4}>
                <FormSelect
                  label="GA/TA Experience"
                  placeholder="--Select--"
                  options={gaTaList}
                  error={
                    state?.ga_ta_experience?.error || beErrors?.ga_ta_experience
                  }
                  value={state.ga_ta_experience.value || ''}
                  onChange={handleDropdownChange('ga_ta_experience')}
                  name="ga_ta_experience"
                  disabled={!gaTaList?.length}
                  testId="assign-instructor-modal-ga-ta-experience"
                />{' '}
              </Grid>
              <Grid item xs={4}>
                <FormSelect
                  label="Valid Rutgers I-9 on File"
                  placeholder="--Select--"
                  options={use1_9StatusList}
                  error={
                    state?.valid_rutgers_I9?.error || beErrors?.valid_rutgers_I9
                  }
                  value={state?.valid_rutgers_I9?.value || ''}
                  onChange={handleDropdownChange('valid_rutgers_I9')}
                  name="valid_rutgers_I9"
                  disabled={!use1_9StatusList?.length}
                  testId="assign-instructor-modal-valid-rutgers-I9"
                  required
                />{' '}
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel id="radio-buttons-group-instructor-label">
                    Primary Instructor
                    <span
                      className="required"
                      style={{ color: '#d32f2f', paddingTop: '4px' }}
                    >
                      &nbsp;*
                    </span>
                  </FormLabel>
                  <RadioGroup
                    row
                    value={state?.primary_instructor.value}
                    onChange={handleStatusChange('primary_instructor')}
                    error={
                      state?.primary_instructor?.error ||
                      beErrors?.primary_instructor
                    }
                    sx={{ justifyContent: 'space-around' }}
                    data-testid="assign-instructor-modal-primary-instructor"
                    required
                  >
                    <FormRadio
                      label="Yes"
                      value="yes"
                      radioColor="#dc3545"
                      testId="assign-instructor-modal-primary-instructor-yes"
                    />
                    <FormRadio
                      label="No"
                      value="no"
                      radioColor="#333333"
                      testId="assign-instructor-modal-primary-instructor-no"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel id="radio-buttons-group-label">
                    Employment Type
                    <span
                      className="required"
                      style={{ color: '#d32f2f', paddingTop: '4px' }}
                    >
                      &nbsp;*
                    </span>
                  </FormLabel>
                  {employmentTypeList && (
                    <RadioGroup
                      row
                      value={state?.employment_type.value}
                      onChange={handleStatusChange('employment_type')}
                      error={
                        state?.employment_type?.error ||
                        beErrors?.employment_type
                      }
                      sx={{ justifyContent: 'space-around' }}
                      data-testid="assign-instructor-modal-employment-type"
                    >
                      {employmentTypeList?.map((employmentData, index) => {
                        let radioColorArray = ['#dc3545', '#333333'];
                        return (
                          <FormRadio
                            label={employmentData.label}
                            value={employmentData.value}
                            radioColor={radioColorArray[index]}
                            testId={`assign-instructor-modal-employment-type-${employmentData.value}`}
                          />
                        );
                      })}
                    </RadioGroup>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {
                  //Employment Reoccurance
                }
              </Grid>

              <Grid item xs={6}>
                <FormSelect
                  label="Job Class Code"
                  placeholder="--Select--"
                  options={jobClassCodesList}
                  error={
                    state?.instr_app_job_class_code?.error ||
                    beErrors?.instr_app_job_class_code
                  }
                  value={state?.instr_app_job_class_code?.value || ''}
                  onChange={handleDropdownChange('instr_app_job_class_code')}
                  name="instr_app_job_class_code"
                  disabled={!jobClassCodesList?.length}
                  testId="assign-instructor-modal-instr-app-job-class-code"
                  required
                />{' '}
              </Grid>

              

              <Grid item xs={6}>
                <FormSelect
                  label={`Role of Appointee`}
                  placeholder="--Select--"
                  options={appointmentRoles}
                  error={
                    state?.role_of_appointee?.error ||
                    beErrors?.role_of_appointee
                  }
                  value={state.role_of_appointee.value || ''}
                  onChange={handleDropdownChange('role_of_appointee')}
                  name="role_of_appointee"
                  disabled={!appointmentRoles?.length || state?.instr_app_job_class_code?.value === 3}
                  testId="assign-instructor-modal-role-of-appointee"
                  required={state?.instr_app_job_class_code?.value != 3 && state?.primary_instructor.value === 'no' ? true: false }
                  // required
                />{' '}
              </Grid>

              </Grid>

              <HorizontalDivider color={'#C9C9C9'} borderStyle={'dashed'} />
              <Grid container justifyContent="space-between" mt={3} mb={3} spacing={2}> 
              <Grid item xs={3}>
                <FormInput  
                  label="Default School Acct."
                  placeholder="ie: 123-456-7890"
                  value={state?.default_sch_acc_code?.value || ''}
                  error={
                    state?.default_sch_acc_code?.error ||
                    beErrors?.default_sch_acc_code
                  }
                  onChange={handleInputChange('default_sch_acc_code')}
                  testId="assign-instructor-modal-default-sch-acc-code"
                  disabled
                />
              </Grid>

              
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <FormLabel id="checkbox-group-label-overwrite">
                    Overwrite School Acct.
                    
                  </FormLabel>
                  {typeof state?.overwrite_school_acct?.value!=='undefined' && (
                    <FormGroup>
                    <FormControlLabel control={
                        <Stack direction="row" spacing={1} alignItems="center" style={{marginLeft:'10px'}}>
                          <AntSwitch id="checkbox-overwrite"
                            onChange={handleOverwrite("overwrite_school_acct")}
                            checked={state?.overwrite_school_acct?.value} inputProps={{ 'aria-label': 'ant design' }} />
                          <Typography>{state?.overwrite_school_acct?.value ? 'Yes': 'No'}</Typography>
                        </Stack>
                  } />
                    </FormGroup>
                   )}  
                </FormControl>
              </Grid>
              

              <Grid item xs={6}>
                <FormSelect
                  label="Alt. School Acct"
                  placeholder="--Select--"
                  options={altSchoolAcctList}
                  error={
                    state?.alt_school_acct?.error || beErrors?.alt_school_acct
                  }
                  value={state?.alt_school_acct?.value || ''}
                  onChange={handleDropdownChange('alt_school_acct')}
                  name="alt_school_acct"
                  disabled={!altSchoolAcctList?.length || !state?.overwrite_school_acct?.value}
                  testId="assign-instructor-modal-alt-school-acct"
                />{' '}
              </Grid>
              <Grid item xs={6}>
                <FormInput
                  label="Owerwrite Contact Hours"
                  placeholder="ie: 123-456-7890"
                  value={state?.overwrite_contact_hours?.value}
                  error={
                    state?.overwrite_contact_hours?.error ||
                    beErrors?.overwrite_contact_hours
                  }
                  onChange={handleInputChange('overwrite_contact_hours')}
                  testId="assign-instructor-modal-overwrite-contact-hours"
                />
              </Grid>

              <Grid item xs={6}>
              <FormInput
                label={specialContractTextLabel()}
                  placeholder={"Enter details"}
                  // The compensation for this course(s) is due to special circumstances and is not at base salary and does not establish a new base salary rate.
                  value={state?.special_contract_text?.value}
                  error={
                    state?.special_contract_text?.error ||
                    beErrors?.special_contract_text
                  }
                  showInput={specialContractChecked}
                  onChange={handleInputChange('special_contract_text')}
                  testId="assign-instructor-modal-special-contract-text"
                />

              </Grid>

              
              <Grid item xs={4}>
                <FormSelect
                  label="Appointment Type"
                  placeholder="--Select--"
                  options={appointmentTypeList}
                  error={
                    state?.appointment_type?.error || beErrors?.appointment_type
                  }
                  value={state?.appointment_type?.value || ''}
                  onChange={handleDropdownChange('appointment_type')}
                  name="appointment_type"
                  disabled={!appointmentTypeList?.length}
                  testId="assign-instructor-modal-appointment_type"
                />{' '}
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel id="radio-buttons-group-label">
                    Accepted Low BE Contract
                  </FormLabel>
                  {typeof state?.accepted_low_be_contract?.value !=='undefined' && (
                    <RadioGroup
                      row
                      value={state?.accepted_low_be_contract?.value}
                      onChange={handleStatusChange('accepted_low_be_contract')}
                      error={
                        state?.accepted_low_be_contract?.error ||
                        beErrors?.accepted_low_be_contract
                      }
                      sx={{ justifyContent: 'space-around' }}
                      data-testid="assign-instructor-modal-accepted-low-be-contract"
                    >
                      <FormRadio
                            label="True"
                            value={true}
                            radioColor='#dc3545'
                            testId={`assign-instructor-modal-accepted-low-be-true`}
                          />
                      <FormRadio
                            label="False"
                            value={false}
                            radioColor='#333333'
                            testId={`assign-instructor-modal-accepted-low-be-true`}
                      />
                    </RadioGroup>
                   )} 
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
        <HorizontalDivider />

        <Grid container justifyContent="space-between" mt={2} mb={2}  onClick={toggleSalaryRow}
          style={{cursor:'pointer'}}>
          <Grid item>
            <Typography variant="h5">Salary / Status</Typography>
          </Grid>
          <Grid item>
            {salaryCollapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleSalaryRow}
                testId="assign-instructor-modal-collapse-salary-status"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleSalaryRow}
                testId="assign-instructor-modal-expand-salary-status"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={salaryCollapseOpen} timeout="auto" unmountOnExit>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item xs={4}>
              <FormSelect
                label="Salary Payment Alternative (aka: no salary)"
                placeholder="--Select--"
                options={salaryAlternativeList}
                error={
                  state?.salary_alternative?.error ||
                  beErrors?.salary_alternative
                }
                value={state.salary_alternative.value || ''}
                onChange={handleDropdownChange('salary_alternative')}
                name="salary_alternative"
                disabled={!salaryAlternativeList?.length}
                testId="assign-instructor-modal-salary-alternative"
              />{' '}
            </Grid>
            <Grid item xs={4}>
              <FormInput
                label={
                  <>
                    Proposed Salary&nbsp;
                    <span style={{ fontSize: 'italic' }}>(By Department)</span>
                  </>
                }
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={formatSalary(state?.proposed_salary?.value)}

                error={
                  state?.proposed_salary?.error || beErrors?.proposed_salary
                }
                onChange={handleInputChange('proposed_salary')}
                testId="assign-instructor-modal-proposed-salary"
                required
              />
            </Grid>
            <Grid item xs={4}>
              <FormInput
                label={
                  pastSalaryDetailsLabel(state?.salary_history.value)
                }
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={formatSalary(state.approved_salary.value)}
                error={
                  state?.approved_salary?.error || beErrors?.approved_salary
                }
                onChange={handleInputChange('approved_salary')}
                testId="assign-instructor-modal-approved-salary"
                disabled={!isAdminUser || !state?.proposed_salary?.value}
                required
                // = {state?.appointment_status?.value?.toLowerCase() == 'approved'}
              />
            </Grid>
          </Grid>
          <Grid container mt={1} mb={1}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel id="radio-buttons-group-label">
                  Status
                  
                  <span
                    className="required"
                    style={{ color: '#d32f2f', paddingTop: '4px' }}
                  >
                    &nbsp;*
                  </span>
                  <LightTooltip
                    placement="left-start"
                    arrow
                    sx={{ '.MuiTooltip-tooltip': { maxWidth: '600px' } }}
                    title={
                      <Stack alignItems="flex-start">
                        <Typography
                          sx={{
                            fontSize: '1.125rem',
                            lineHeight: '1.125',
                            fontWeight: '600',
                            textAlign: 'left',
                          }}
                          component={'div'}
                        >
                          Pending:
                          <HorizontalDivider />
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            lineHeight: '1.125',
                            color: '#666666',
                            textAlign: 'left',
                            paddingTop: '10px',
                          }}
                          paragraph
                        >
                          Instructor and salary has not been approved.
                          Both fields can be empty or maybe just the instructor has been added.
                          Will need an indicator of some sort identifying those whose salary needs to be approved.
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1.125rem',
                            lineHeight: '1.125',
                            fontWeight: '600',
                            textAlign: 'left',
                          }}
                          component={'div'}
                        >
                          Approved:
                          <HorizontalDivider />
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            lineHeight: '1.125',
                            color: '#666666',
                            textAlign: 'left',
                            paddingTop: '10px',
                          }}
                          paragraph
                        >
                          Admin has approved the salary. Next step after 'approved' is sending contract using DocuSign out of signature.
                          When returned signed, date needs to be recorded so we know it is ready for next step, HCM Ready.
                        </Typography>
                      </Stack>
                    }
                    data-testid="courses-prerequisite-tooltip"
                  >
                    <InfoIcon
                      style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer', marginLeft:'0.2rem', marginBottom:'-2px' }}
                    />
                  </LightTooltip>

                </FormLabel>
                {/* anr =>apidata not received */}
                {state.appointment_status?.value !== "anr" && (
                  <RadioGroup
                    row
                    value={state?.appointment_status?.value? 
                            state?.appointment_status?.value?.toLowerCase()
                            :'pending'}
                    onChange={handleStatusChange('appointment_status')}
                    error={
                      state?.appointment_status?.error ||
                      beErrors?.appointment_status
                    }
                    sx={{ justifyContent: 'space-between' }}
                    data-testid="assign-instructor-modal-salary-status"
                  >
                    <FormRadio
                      label="Pending"
                      value="pending"
                      radioColor="#dc3545"
                      testId="assign-instructor-modal-status-pending"
                    />
                    <FormRadio
                      label="Approved"
                      value="approved"
                      radioColor="#333333"
                      testId="assign-instructor-modal-status-approved"
                      disabled={!isAdminUser}
                    />
                  </RadioGroup>
                )} 
              </FormControl>
            </Grid>
          </Grid>
          <HorizontalDivider color={'#C9C9C9'} borderStyle={'dashed'} />
          <Grid container mt={3} pb={2} mb={1} justifyContent="space-between">
            <Grid item xs={5.5}>
              <FormInput
                label="Approved By"
                value={userData.username}
                disabled={true}
                error={state?.approved_by?.error || beErrors?.approved_by}
                testId="assign-instructor-modal-approved-by"
              />
            </Grid>
            <Grid item xs={5.5}>
              <DatePicker
                label="Approved Date"
                value={
                  state?.appointment_status?.value?.toLowerCase() !== 'approved'
                    ? null
                    : state?.approved_date?.value
                }
                error={state?.approved_date?.error || beErrors?.approved_date}
                onChange={handleDateChange('approved_date')}
                placeholder="MM-DD-YYYY"
                disabled={
                  !isAdminUser ||
                  state?.appointment_status?.value?.toLowerCase() !== 'approved'
                }
                testId="assign-instructor-modal-approved-date"
              />
            </Grid>
          </Grid>
        </Collapse>
        <HorizontalDivider />

        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
          onClick={toggleVerificationRow}
          style={{cursor:'pointer'}}
        >
          <Grid item>
            <Typography variant="h5">Employment Screening Req's</Typography>
          </Grid>
          <Grid item>
            {verificationCollapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleVerificationRow}
                data-testid="assign-instructor-modal-collapse-visa"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleVerificationRow}
                data-testid="assign-instructor-modal-expand-visa"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={verificationCollapseOpen} timeout="auto" unmountOnExit>
          <Box m={3}>
            <Grid
              container
              justifyContent="space-between"
              mt={3}
              mb={3}
              spacing={2}
            >
              <Grid item xs={4}>
                <DatePicker
                  label="Background Check Received"
                  value={state?.background_check_received_date?.value}
                  error={
                    state?.background_check_received_date?.error ||
                    beErrors?.background_check_received_date
                  }
                  onChange={handleDateChange('background_check_received_date')}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-background-check-received-date"
                />
              </Grid>
              <Grid item xs={4}>
                <FormSelect
                  label="Background check status"
                  placeholder="--Select--"
                  options={backgroundCollateralList}
                  error={
                    state?.background_check_status?.error ||
                    beErrors?.background_check_status
                  }
                  value={state.background_check_status.value || ''}
                  onChange={handleDropdownChange('background_check_status')}
                  name="background_check_status"
                  disabled={!backgroundCollateralList?.length}
                  testId="assign-instructor-modal-background-check-status"
                />{' '}
              </Grid>
              <Grid item xs={4}>
                {
                  // 12-Month Aprroval Form Received
                }
              </Grid>
              <Grid item xs={3}>
                <DatePicker
                  label="Date Contract Returned"
                  value={state?.date_signed_appointment_letter_returned?.value}
                  error={
                    state?.date_signed_appointment_letter_returned?.error ||
                    beErrors?.date_signed_appointment_letter_returned
                  }
                  onChange={handleDateChange(
                    'date_signed_appointment_letter_returned'
                  )}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-date-signed-appointment-letter-returned"
                />
              </Grid>

              <Grid item xs={3}>
                <FormSelect
                  label="Record Number"
                  placeholder="--Select--"
                  options={recordNumbersList}
                  error={state?.record_number?.error || beErrors?.record_number}
                  value={state.record_number.value || ''}
                  onChange={handleDropdownChange('record_number')}
                  name="record_number"
                  disabled={!recordNumbersList?.length}
                  testId="assign-instructor-modal-record-number"
                />{' '}
              </Grid>
              <Grid item xs={3}>
                <DatePicker
                  label="Charging Inst. Processing Date"
                  value={state?.charging_instructions_processing_date?.value}
                  error={
                    state?.charging_instructions_processing_date?.error ||
                    beErrors?.charging_instructions_processing_date
                  }
                  onChange={handleDateChange(
                    'charging_instructions_processing_date'
                  )}
                  placeholder="MM-DD-YYYY"
                  testId="assign-instructor-modal-charging-instructions-processing-date"
                />
              </Grid>
              <Grid item xs={3}>
                <FormSelect
                  label="Instructor Course Salary"
                  placeholder="--Select--"
                  options={instructorCourseSalaryList}
                  error={
                    state?.instructor_course_salary?.error ||
                    beErrors?.instructor_course_salary
                  }
                  value={state.instructor_course_salary.value || ''}
                  onChange={handleDropdownChange('instructor_course_salary')}
                  name="instructor_course_salary"
                  disabled={!instructorCourseSalaryList?.length}
                  testId="assign-instructor-modal-instructor-course-salary"
                />{' '}
              </Grid>

              <Grid
                item
                xs={12}
                marginX={2}
                border={1}
                borderColor={'#C9C9C9'}
                borderRadius={'20px'}
              >
                <ul
                  style={{
                    display: 'flex',
                  }}
                >
                  <li
                    style={{ fontStyle: 'italic' }}
                    data-testid="assign-instructor-verification-sch-code"
                  >
                    Sch: &nbsp;
                    <span style={{ fontStyle: 'italic', fontWeight: 600 }}>
                      {state?.sch_code?.value}
                    </span>
                  </li>
                  <li
                    style={{ fontStyle: 'italic', marginLeft: '25px' }}
                    data-testid="assign-instructor-verification-subject-code"
                  >
                    Subject: &nbsp;
                    <span style={{ fontStyle: 'italic', fontWeight: 600 }}>
                      {state?.subject_code?.value}
                    </span>
                  </li>
                  <li
                    style={{ fontStyle: 'italic', marginLeft: '25px' }}
                    data-testid="assign-instructor-verification-course-number"
                  >
                    Course: &nbsp;
                    <span style={{ fontStyle: 'italic', fontWeight: 600 }}>
                      {section?.course_no}
                    </span>
                  </li>
                </ul>
                

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      {/* {pastSalariesList?.map((row, index) => ( */}
                      {state?.past_salaries?.value.map((row, index) => {
                        return(
                        <TableRow
                          key={row}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          {/* {state?.past_salaries?.length +"hello"} */}
                          <TableCell>
                            <FormSelect
                              label={`${index == 0 ? `Term` : ``}`}
                              placeholder="--Select--"
                              options={termListDropdown}
                              // error={state?.state?.error || beErrors?.state}
                              value={row?.term}
                              onChange={handleDropdownPastSalaryTermChange(index,'term','past_salaries')}
                              name={`term-${index}`}
                              disabled={!termListDropdown?.length }
                              testId={`assign-instructor-modal-past-salary-term-${index}`}
                            />{' '}
                          </TableCell>
                          <TableCell>
                            <FormInput
                              label={`${index == 0 ? `Year` : ``}`}
                              value={row?.year}
                              // error={
                              //   state?.primary_email?.error ||
                              //   beErrors?.primary_email
                              // }
                              onChange={handleDropdownPastSalaryTermChange(index,'year','past_salaries')}
                              testId={`assign-instructor-modal-past-salary-year-${index}`}
                            />
                          </TableCell>
                          <TableCell>
                            <FormInput
                              label={`${index == 0 ? `Salary` : ``}`}
                              value={row?.salary}
                              // error={
                              //   state?.primary_email?.error ||
                              //   beErrors?.primary_email
                              // }
                              onChange={handleDropdownPastSalaryTermChange(index,'salary','past_salaries')}
                              testId={`assign-instructor-modal-past-salary-salary-${index}`}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                      )}
                      
                      <TableRow
                        key={1}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        

                        <TableCell width='30%'></TableCell>
                        <TableCell width='30%'></TableCell>
                        <TableCell width='40%'>
                          <Button
                            label="Add details"
                            className="full-width"
                            variant="contained"
                            style={{
                              root: {
                                backgroundColor: '#3c52b2',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: '#fff',
                                  color: '#3c52b2',
                                },
                              },
                            }}
                            onClick={e => handleAddPastLecturerDetailsClick(e,'past_salaries')}
                            testId="assign-instructor-modal-add-past-lecturer"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    
                  </Table>
                </TableContainer>
                <br />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
        <HorizontalDivider />

        <Grid container justifyContent="space-between" mt={2} mb={2} onClick={toggleAdminCommentsRow}
          style={{cursor:'pointer'}}>
          <Grid item>
            <Typography variant="h5">Private Admin Comments</Typography>
          </Grid>
          <Grid item>
            {adminCommentsCollapseOpen ? (
              <CollapseIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleAdminCommentsRow}
                testId="assign-instructor-modal-collapse-salary-status"
              />
            ) : (
              <ExpandIcon
                style={{ height: '1.5rem', width: '1.5rem', cursor: 'pointer' }}
                onClick={toggleAdminCommentsRow}
                testId="assign-instructor-modal-expand-salary-status"
              />
            )}
          </Grid>
        </Grid>
        <Collapse in={adminCommentsCollapseOpen} timeout="auto" unmountOnExit>
          <Grid container justifyContent="space-between" spacing={2}>
            {state?.admin_comments?.value.map(data => {
              let commentDate = moment(data?.created_at).format('YYYY-MM-DD');
              return (
                <Grid item xs={6}>
                  <b>{data.user.username}</b> - {commentDate}
                  <Box>{data.comment}</Box>
                </Grid>
              );
            })}

            <br />
            <Grid item xs={12}>
              <FormTextarea
                label=""
                placeholder="Enter new admin comment"
                value={state?.new_admin_comments?.value}
                error={
                  state?.new_admin_comments?.error ||
                  beErrors?.new_admin_comments
                }
                onChange={handleInputChange('new_admin_comments')}
                testId="assign-instructor-modal-new-admin-comments"
              />
            </Grid>
          </Grid>
          <Grid container xs={12} marginTop={1}>
            <Grid item xs={9}></Grid>
            <Grid item xs={3}>
              <Button
                label="Add Comment"
                className="full-width"
                variant="contained"
                style={{
                  root: {
                    backgroundColor: '#3c52b2',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: '#3c52b2',
                    },
                  },
                }}
                disabled={state?.new_admin_comments?.value === ''}
                onClick={handleAddCommentClick}
                testId="assign-instructor-modal-add-comment"
              />
            </Grid>
          </Grid>
        </Collapse>
        <HorizontalDivider />
        <Grid>
        <Typography variant="h5" mt={2}>
          Instructor Appointment Profile
        </Typography>

        <TableContainer sx={{ border: 'none' }}>
          <Table sx={{ width: '100%' }} size="xl" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: '700', borderBottom: 'none' }}>
                  Title / Job Class
                </TableCell>
                <TableCell style={{ fontWeight: '700', borderBottom: 'none' }}>
                  Assigned Term / Course
                </TableCell>
                <TableCell style={{ fontWeight: '700', borderBottom: 'none' }}>
                  Original / Approved Salary
                </TableCell>
                <TableCell style={{ fontWeight: '700', borderBottom: 'none' }}>
                  Sp. Case / low Enrolled{' '}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              style={{
                fontSize: '1rem',
                color: '#383C49',
                fontStyle: 'italic',
                fontWeight: '500',
              }}
            >
              {instructorDataPastAppointment?.data?.length === 0 ? (
                <TableRow
                  // key={row.name}
                  // colSpan={1}
                  sx={{
                    '&:last-child td, &:last-child th': {},
                    borderBottom: '2px dashed #C9C9C9',
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={4}
                    style={{
                      paddingTop: '2rem',
                      paddingBottom: '2rem',
                    }}
                    testId="assign-instructor-modal-no-appointment-history"
                  >
                    No data Found
                  </TableCell>
                </TableRow>
              ) : (
                instructorDataPastAppointment?.data
                  ?.slice(
                    0,
                    viewAll ? instructorDataPastAppointment?.data?.length : 5
                  )
                  .map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: '0' },
                        ':not(:last-child)': {
                          borderBottom: '2px dashed #C9C9C9',
                        },
                      }}
                      data-testid={`assign-instructor-modal-appointment-history-row-${index}`}
                    >
                      <TableCell
                        style={{ fontSize: '1rem' }}
                        data-testid={`assign-instructor-modal-appointment-history-row-${index}-title`}
                      >
                        Class 1 - Assistant
                        <br /> Summer Teaching-N-99915-990
                      </TableCell>
                      <TableCell
                        style={{ fontSize: '1rem' }}
                        data-testid={`assign-instructor-modal-appointment-history-row-${index}-course`}
                      >
                        {row?.course_section_details?.semester_display}
                        <br />
                        {row?.course_section_details?.offering_unit_cd}:
                        {row?.course_section_details?.subj_cd}:
                        {row?.course_section_details?.course_no} SEC:
                        {row?.course_section_details?.section_no} Credit(s):
                        {formatCredit(row?.course_section_details?.credits)
              }
                      </TableCell>
                      <TableCell
                        style={{ fontSize: '1rem' }}
                        data-testid={`assign-instructor-modal-appointment-history-row-${index}-salary`}
                      >
                        {row?.approved_salary
                          ? `${ConvertToUSFormat(row?.approved_salary)}`
                          : 'N/A'}
                        <br />
                        {row?.instr_approved_course_salary
                          ? `${ConvertToUSFormat(row?.instr_approved_course_salary)}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: '1rem' }}
                        data-testid={`assign-instructor-modal-appointment-history-row-${index}-low-enroll`}
                      >
                        N/A
                        <br />
                        {row?.low_enroll === false ? 'NO' : 'YES'}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid
          container
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {instructorDataPastAppointment?.data?.length > 5 ? (
            <>
              <Grid item xs={5}>
                <HorizontalDivider />
              </Grid>
              <Grid item xs={2}>
                <Button
                  label={`View ${viewAll ? 'Less' : 'More'}`}
                  variant="outlined"
                  className="black-outlined-btn full-width"
                  onClick={handleViewMore}
                  style={{ borderRadius: '1.25rem' }}
                  testId="assign-instructor-modal-appointment-history-show-more"
                />
              </Grid>
              <Grid item xs={5}>
                <HorizontalDivider />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <HorizontalDivider />
            </Grid>
          )}
        </Grid>
        <Grid container mt={4} justifyContent="space-between">
          <Grid item xs={4}>
            <Button
              label={instructorData?.data?.is_assigned ? 'Unassign' : 'Assign'}
              variant="contained"
              className="full-width"
              style={{
                backgroundColor: instructorData?.data?.is_assigned
                  ? '#A629FF'
                  : '#2B7D3B',
              }}
              onClick={handleInstructorAssignToggle}
              testId="assign-instructor-modal-toggle-assign"
            />
          </Grid>

          <Grid item xs={7}>
            <Button
              label="Update"
              className="full-width"
              variant="contained"
              style={{
                root: {
                  backgroundColor: '#3c52b2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#3c52b2',
                  },
                },
              }}
              disabled={disable}
              onClick={handleUpdateClick}
              testId="assign-instructor-modal-update"
            />
          </Grid>

        </Grid>
        </Grid>
        </Grid>
      </Grid>
    </SimpleModal>
  );
};

export default AssignedInstructor;
