import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormSelect from 'Components/FormSelect';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

import Button from 'Components/Button';
import { ReactComponent as CloseIcon } from '../../assets/icons/icon-close.svg';
import { ReactComponent as NotificationIcon } from '../../assets/icons/icon-notification-fill.svg';
import FormInput from 'Components/FormInput';
import SimpleModal from 'Components/SimpleModal';
import DatePicker from 'Components/DatePicker';
import HorizontalDivider from 'Components/HorizontalDivider';
import useForm from 'hooks/Form';
import validator from 'utils/validation';
import { useCoursesQueries } from 'services/queries';
import { useInstructorMutation } from 'services/mutations';
import FormCheckbox from 'Components/FormCheckbox';
import { genderList } from 'utils/constant';
import CyanButton from 'StyledComponents/CyanButton';
import { formatPhoneNumber } from 'utils/helper';

const AddNewInstructor = ({ open, onClose, section, refetchCourseDetails }) => {
  const sectionId = section?.id;
  const sectionCode = `${section.offering_unit_cd} : ${section.subj_cd} : ${section.course_no} : ${section.section_no}`;
  const [saveLoading, setSaveLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [beErrors, setBeErrors] = useState({});

  const addNewInstructorMutateAsync =
    useInstructorMutation.useAddNewInstructorMutation();

  const assignInstructorToCourseMutation =
    useInstructorMutation.useAssignInstructorToCourseMutation();

  const { data: stateListData } = useCoursesQueries.useStateListQuery({
    enabled: true,
  });

  const stateList = stateListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: statusListData } = useCoursesQueries.use1_9StatusListQuery({
    enabled: true,
  });

  const statusList = statusListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: visaStatusListData } = useCoursesQueries.useVisaStatusListQuery(
    {
      enabled: true,
    }
  );

  const visaStatusList = visaStatusListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  const { data: filesWithRutgersListData } =
    useCoursesQueries.useFilesWithRutgersQuery({
      enabled: true,
    });

  const filesWithRutgersList = filesWithRutgersListData?.data?.results?.map(
    item => ({
      value: item?.id,
      label: item?.name,
    })
  );

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

  const stateSchema = useMemo(() => {
    return {
      ssn1: { value: '', error: '' },
      ssn2: { value: '', error: '' },
      ssn3: { value: '', error: '' },

      foreign_national: { value: false, error: '' },

      employee_number: { value: '', error: '' },

      first_name: { value: '', error: '' },
      last_name: { value: '', error: '' },
      middle_name: { value: '', error: '' },

      date_of_birth: { value: null, error: '' },
      gender: { value: '', error: '' },
      city: { value: '', error: '' },
      state: { value: '', error: '' },
      zip_code: { value: '', error: '' },

      address1: { value: '', error: '' },
      address2: { value: '', error: '' },

      primary_email: { value: '', error: '' },
      secondary_email: { value: '', error: '' },
      primary_phone: { value: '', error: '' },
      work_phone: { value: '', error: '' },
      cell_phone: { value: '', error: '' },

      visa_type: { value: '', error: '' },
      class_during_academic_year: { value: '', error: '' },
      country_of_citizenship: { value: '', error: '' },
      on_file_with_rutgers: { value: '', error: '' },
      date_of_entry: { value: null, error: '' },

      status: { value: '', error: '' },
      visa_permit_status: { value: '', error: '' },
      visa_permit_status_date: { value: null, error: '' },
      visa_permit_expire_date: { value: null, error: '' },
    };
  }, []);

  const [validationSchema, setValidationSchema] = useState({
    ssn1: {
      required: true,
      validator: validator.exactLengthChars("please input 3 digit number",3)
    },
    ssn2: {
      required: true,
      validator: validator.exactLengthChars("please input 2 digit number",2)
    },
    ssn3: {
      required: true,
      validator: validator.exactLengthChars("please input 4 digit number",4)
    },

    foreign_national: { required: false },

    employee_number: {
      required: false,
    },
    first_name: {
      required: true,
    },
    last_name: {
      required: true,
    },
    middle_name: {
      required: false,
    },
    date_of_birth: {
      required: true,
    },
    gender: {
      required: true,
    },
    city: {
      required: true,
    },
    state: {
      required: true,
    },
    zip_code: {
      required: true,
      validator: validator.exactLengthChars('Please enter valid zipcode',5),
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
      validator: validator.checkLength("please input 10 digit number",12),
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
    class_during_academic_year: {
      required: true,
    },
    on_file_with_rutgers: {
      required: false,
    },
    status: {
      required: true,
    },
    visa_type: {
      required: false,
    },
    country_of_citizenship: {
      required: false,
    },
    date_of_entry: {
      required: false,
    },
    visa_permit_status: {
      required: false,
    },
    visa_permit_status_date: {
      required: false,
    },
    visa_permit_expire_date: {
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

  const handleInputChange = field => e => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    if(field==='primary_phone' || field==='work_phone' || field==='cell_phone'){
      handleOnChange(field, formatPhoneNumber(e?.target?.value))
    }
    else{
      handleOnChange(field, e?.target?.value);
    }
   
  };

  const handleCheckboxChange = field => e => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, e.target.checked);
    if(field == 'foreign_national'){
      const required = !e.target.checked;
      setState(prev => ({
        ...prev,
        ssn1:{...prev.ssn1,error:''},
        ssn2:{...prev.ssn2,error:''},
        ssn3:{...prev.ssn3,error:''},
      }))
      setValidationSchema({
        ...validationSchema,
        ssn1: required ? {required,validator: validator.exactLengthChars("please input 3 digit number",3)} : {required},
        ssn2: required ? {required,validator: validator.exactLengthChars("please input 2 digit number",2)} : {required},
        ssn3: required ? {required,validator: validator.exactLengthChars("please input 4 digit number",4)} : {required},
      })
    }
  };
  const handleDateChange = field => value => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, value);
  };

  const handleDropdownChange = field => e => {
    setBeErrors(prev => ({ ...prev, [field]: '' }));
    handleOnChange(field, e?.target?.value);
  };

  const preparePayload = () => {
    return {
      ssn: state?.ssn1?.value + state?.ssn2?.value + state?.ssn3?.value,
      foreign_national: state?.foreign_national?.value,
      employee_number: state?.employee_number?.value || null,
      first_name: state?.first_name?.value,
      middle_name: state?.middle_name?.value,
      last_name: state?.last_name?.value,
      date_of_birth: moment(state?.date_of_birth?.value).format('YYYY-MM-DD'),
      gender: state?.gender?.value,
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
      visa_type: state?.visa_type?.value,
      class_during_academic_year: state?.class_during_academic_year?.value,
      country_of_citizenship: state?.country_of_citizenship?.value,
      on_file_with_rutgers: state?.on_file_with_rutgers?.value,
      date_of_entry: state?.date_of_entry?.value
        ? moment(state?.date_of_entry?.value).format('YYYY-MM-DD')
        : null,
      visa_permit_status_date: state?.visa_permit_status_date?.value
        ? moment(state?.visa_permit_status_date?.value).format('YYYY-MM-DD')
        : null,
      visa_permit_expire_date: state?.visa_permit_expire_date?.value
        ? moment(state?.visa_permit_expire_date?.value).format('YYYY-MM-DD')
        : null,
      visa_permit_status: state?.visa_permit_status?.value,
      status: state?.status?.value,
    };
  };

  const handleSave = async () => {
    const payload = preparePayload();

    try {
      setSaveLoading(true);
      await addNewInstructorMutateAsync.mutateAsync(payload);
      toast.success('Instructor added successfully',{
        hideProgressBar: true,
      });
      setTimeout(() => refetchCourseDetails?.(), 1000);
      onClose();
    } catch (error) {
      const errors = error?.response?.data?.errors;
      setBeErrors({
        ...errors,
      });
      toast.error(
        'An error occurred while adding new instructor. Please try again later.',{
          hideProgressBar: true,
        }
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveAndAssign = async () => {
    try {
      setAssignLoading(true);
      const payload = preparePayload();
      const response = await addNewInstructorMutateAsync.mutateAsync(payload);

      await assignInstructorToCourseMutation.mutateAsync({
        is_assigned: true,
        course_section: sectionId,
        instructor: response?.data?.id,
      });
      setTimeout(() => refetchCourseDetails?.(), 1000);
      toast.success('Instructor added and assigned successfully',{
        hideProgressBar: true,
      });
      onClose();
    } catch (error) {
      const errors = error?.response?.data?.errors;
      setBeErrors({
        ...errors,
      });
      toast.error(
        'An error occurred while adding new instructor. Please try again later.',{
          hideProgressBar: true,
        }
      );
    } finally {
      setAssignLoading(false);
    }
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
      <Grid
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '2rem',
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h4"
              sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
            >
              New Instructor
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={onClose}
              style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
              data-testid="close-add-instructor-modal"
            />
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="left"
          alignItems="center"
          sx={{
            border: '2px solid #707070',
            borderRadius: '2.5rem',
            padding: 'auto',
            height: '4rem',
            backgroundColor: '#FFE357',
          }}
        >
          <Grid item>
            <NotificationIcon
              onClick={onClose}
              style={{
                width: '2rem',
                height: '2rem',
                marginLeft: '1rem',
              }}
            />
          </Grid>
          <Grid
            item
            sx={{ color: '#383C49', fontSize: '1rem', marginLeft: '1rem' }}
          >
            <Typography>
              <span
                style={{
                  color: '#383C49',
                  fontWeight: 'bold',
                }}
              >
                Caution:
              </span>{' '}
              This form is to create a new instructor. It is your responsibility
              to ensure the instructor is not on our system.
            </Typography>
          </Grid>
        </Grid>
        <HorizontalDivider />
        <Grid className="id-wrapper" mt={4}>
          <Grid item xs="12">
            <Typography variant="h5">ID</Typography>
          </Grid>
          <Grid item xs="12" mt={2} mb={1}>
            <Typography
              sx={{
                color: '#383C49',
                fontSize: '1rem',
                fontWeight: '400',
                margin: 0,
              }}
            >
              Social Security Number
              <span style={{ color: '#d32f2f' }}>&nbsp;*</span>
            </Typography>
          </Grid>
          <Grid container justifyContent="space-between" mb={3} spacing={1}>
            <Grid item xs>
              <FormCheckbox
                checked={state.foreign_national.value}
                defaultChecked
                onChange={handleCheckboxChange('foreign_national')}
                labelPlacement="right"
                error={
                  state.foreign_national.error || beErrors?.foreign_national
                }
                labelSx={{
                  '.MuiFormControlLabel-label': {
                    marginLeft: '1rem',
                    fontStyle: ' italic',
                  },
                }}
                label="This instructor is a foreign national, and does not have a Social Security number."
                testId="new-instructor-modal-foreign-national"
              />
            </Grid>
            <Grid item xs={2}>
              <FormInput
                placeholder="###"
                type="number"
                value={state.ssn1.value}
                onChange={handleInputChange('ssn1')}
                error={state.ssn1.error || beErrors?.ssn}
                disabled={state.foreign_national.value}
                testId="new-instructor-modal-ssn1"
              />
            </Grid>
            <Grid item xs={2}>
              <FormInput
                placeholder="##"
                value={state.ssn2.value}
                error={state.ssn2.error}
                onChange={handleInputChange('ssn2')}
                disabled={state.foreign_national.value}
                testId="new-instructor-modal-ssn2"
              />
            </Grid>
            <Grid item xs={2}>
              <FormInput
                placeholder="####"
                value={state.ssn3.value}
                error={state.ssn3.error}
                onChange={handleInputChange('ssn3')}
                disabled={state.foreign_national.value}
                testId="new-instructor-modal-ssn3"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <FormInput
              placeholder="######"
              label="Employee Number"
              value={state.employee_number.value}
              onChange={handleInputChange('employee_number')}
              error={state.employee_number.error || beErrors?.employee_number}
              testId="new-instructor-modal-employee-number"
            />
          </Grid>
        </Grid>
        <HorizontalDivider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />
        <Grid className="name-wrapper">
          <Typography variant="h5">Name</Typography>
          <Grid container justifyContent="space-between" mt={2} mb={3}>
            <Grid item xs={2}>
              <FormInput
                label="First Name"
                required
                placeholder="ie: John"
                value={state.first_name.value}
                onChange={handleInputChange('first_name')}
                error={state.first_name.error || beErrors?.first_name}
                testId="new-instructor-modal-first-name"
              />
            </Grid>
            <Grid item xs={2}>
              <FormInput
                label="Middle Name"
                placeholder="ie: L"
                value={state.middle_name.value}
                onChange={handleInputChange('middle_name')}
                error={state.middle_name.error || beErrors?.middle_name}
                testId="new-instructor-modal-middle-name"
              />
            </Grid>
            <Grid item xs={2}>
              <FormInput
                label="Last Name"
                required
                placeholder="ie: Smith"
                value={state.last_name.value}
                onChange={handleInputChange('last_name')}
                error={state.last_name.error || beErrors?.last_name}
                testId="new-instructor-modal-last-name"
              />
            </Grid>
            <Grid item xs={2.5}>
              <DatePicker
                label="Date of Birth"
                value={state.date_of_birth.value}
                onChange={handleDateChange('date_of_birth')}
                placeholder="MM-DD-YYYY"
                error={state.date_of_birth.error || beErrors?.date_of_birth}
                testId="new-instructor-modal-date-of-birth"
                required
              />
            </Grid>
            <Grid item xs={2.5}>
              <FormSelect
                label="Gender"
                placeholder="--Select--"
                options={genderList}
                value={state.gender.value || ''}
                error={state.gender.error || beErrors?.gender}
                onChange={handleDropdownChange('gender')}
                testId="new-instructor-modal-gender"
                required
              />
            </Grid>
          </Grid>
        </Grid>
        <HorizontalDivider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />
        <Grid>
          <Typography variant="h4">Contact</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
        >
          <Grid item xs={5.5}>
            <FormInput
              label="Address 1"
              required
              value={state.address1.value}
              error={state.address1.error || beErrors?.address1}
              onChange={handleInputChange('address1')}
              testId="new-instructor-modal-address1"
            />
          </Grid>
          <Grid item xs={5.5}>
            <FormInput
              label="Address 2"
              value={state.address2.value}
              error={state.address2.error || beErrors?.address2}
              onChange={handleInputChange('address2')}
              testId="new-instructor-modal-address2"
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
        >
          <Grid item xs={3.5}>
            <FormInput
              label="City"
              required
              value={state.city.value}
              error={state.city.error || beErrors?.city}
              onChange={handleInputChange('city')}
              testId="new-instructor-modal-city"
            />
          </Grid>
          <Grid item xs={3.5}>
            <FormSelect
              label="State"
              placeholder="--Select--"
              options={stateList}
              value={state.state.value || ''}
              error={state.state.error || beErrors?.state}
              onChange={handleDropdownChange('state')}
              name="state"
              disabled={!stateList?.length}
              required
              testId="new-instructor-modal-state"
            />{' '}
          </Grid>
          <Grid item xs={3.5}>
            <FormInput
              label="ZIP"
              type="number"
              placeholder="###"
              required
              value={state.zip_code.value}
              error={state.zip_code.error || beErrors?.zip_code}
              onChange={handleInputChange('zip_code')}
              testId="new-instructor-modal-zip-code"
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
        >
          <Grid item xs={5.5}>
            <FormInput
              label="Primary Email"
              required
              value={state.primary_email.value}
              error={state.primary_email.error || beErrors?.primary_email}
              onChange={handleInputChange('primary_email')}
              testId="new-instructor-modal-primary-email"
            />
          </Grid>
          <Grid item xs={5.5}>
            <FormInput
              label="Secondary Email"
              value={state.secondary_email.value}
              error={state.secondary_email.error || beErrors?.secondary_email}
              onChange={handleInputChange('secondary_email')}
              testId="new-instructor-modal-secondary-email"
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
        >
          <Grid item xs={3.5}>
            <FormInput
              type="text"
              label="Primary Phone #"
              placeholder="###"
              required
              value={state.primary_phone.value}
              error={state.primary_phone.error || beErrors?.primary_phone}
              onChange={handleInputChange('primary_phone')}
              testId="new-instructor-modal-primary-phone"
            />
          </Grid>
          <Grid item xs={3.5}>
            <FormInput
              label="Work #"
              type="text"
              placeholder="###"
              value={state.work_phone.value}
              error={state.work_phone.error || beErrors?.work_phone}
              onChange={handleInputChange('work_phone')}
              testId="new-instructor-modal-work-phone"
            />
          </Grid>
          <Grid item xs={3.5}>
            <FormInput
              label="Cell #"
              type="text"
              placeholder="###"
              value={state.cell_phone.value}
              error={state.cell_phone.error || beErrors?.cell_phone}
              onChange={handleInputChange('cell_phone')}
              testId="new-instructor-modal-cell-phone"
            />
          </Grid>
        </Grid>
        <HorizontalDivider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />
        <Grid>
          <Typography variant="h4">Status</Typography>
        </Grid>
        <Grid container justifyContent="space-between" mt={2} mb={2}>
          <Grid item xs={3.5}>
            <FormSelect
              label="Title/Class During Academic Year"
              placeholder="--Select--"
              options={academicYearTitlesList}
              value={state.class_during_academic_year.value || ''}
              error={
                state.class_during_academic_year.error ||
                beErrors?.class_during_academic_year
              }
              onChange={handleDropdownChange('class_during_academic_year')}
              disabled={!academicYearTitlesList?.length}
              required
              testId="new-instructor-modal-class-during-academic-year"
            />
          </Grid>
          <Grid item xs={3.5}>
            <FormSelect
              label="On File With Rutgers"
              placeholder="--Select--"
              options={filesWithRutgersList}
              error={
                state.on_file_with_rutgers.error ||
                beErrors?.on_file_with_rutgers
              }
              value={state.on_file_with_rutgers.value || ''}
              onChange={handleDropdownChange('on_file_with_rutgers')}
              disabled={!filesWithRutgersList?.length}
              testId="new-instructor-modal-on-file-with-rutgers"
            />
          </Grid>
          <Grid item xs={3.5}>
            <FormSelect
              label="I-9 Status"
              placeholder="--Select--"
              options={statusList}
              value={state.status.value || ''}
              error={state.status.error || beErrors?.status}
              onChange={handleDropdownChange('status')}
              disabled={!statusList?.length}
              testId="new-instructor-modal-i-9-status"
              required
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
        >
          <Grid item xs={5.5}>
            <FormInput
              label="Visa Type"
              value={state?.visa_type?.value}
              error={state?.visa_type?.error || beErrors?.visa_type}
              onChange={handleInputChange('visa_type')}
              testId="new-instructor-modal-visa-type"
            />
          </Grid>
          <Grid item xs={5.5}>
            <FormInput
              label="Country of Citizenship"
              value={state?.country_of_citizenship?.value}
              error={
                state?.country_of_citizenship?.error ||
                beErrors?.country_of_citizenship
              }
              onChange={handleInputChange('country_of_citizenship')}
              testId="new-instructor-modal-country-of-citizenship"
            />
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="space-between"
          mt={3}
          mb={3}
          alignItems="center"
        >
          <Grid item xs={2.5}>
            <DatePicker
              label="Date of Entry in The USA"
              value={state.date_of_entry.value}
              error={state.date_of_entry.error || beErrors?.date_of_entry}
              onChange={handleDateChange('date_of_entry')}
              placeholder="MM-DD-YYYY"
              testId="new-instructor-modal-date-of-entry"
            />
          </Grid>
          <Grid item xs={2.5}>
            <FormSelect
              label="Visa/Permit Status"
              placeholder="--Select--"
              options={visaStatusList}
              value={state.visa_permit_status.value || ''}
              error={
                state.visa_permit_status.error || beErrors?.visa_permit_status
              }
              onChange={handleDropdownChange('visa_permit_status')}
              disabled={!visaStatusList?.length}
              testId="new-instructor-modal-visa-permit-status"
            />
          </Grid>
          <Grid item xs={2.5}>
            <DatePicker
              label="Visa/Permit Status Date"
              value={state.visa_permit_status_date.value}
              error={
                state.visa_permit_status_date.error ||
                beErrors?.visa_permit_status_date
              }
              onChange={handleDateChange('visa_permit_status_date')}
              placeholder="MM-DD-YYYY"
              testId="new-instructor-modal-visa-permit-status-date"
            />
          </Grid>
          <Grid item xs={2.5}>
            <DatePicker
              label="Visa/Permit Expire Date"
              placeholder="MM-DD-YYYY"
              value={state.visa_permit_expire_date.value}
              error={
                state.visa_permit_expire_date.error ||
                beErrors?.visa_permit_expire_date
              }
              onChange={handleDateChange('visa_permit_expire_date')}
              testId="new-instructor-modal-visa-permit-expire-date"
            />
          </Grid>
        </Grid>

        <Grid container mt={4} justifyContent="space-between">
          <Grid item xs={5.5}>
            <Button
              label="Save"
              variant="contained"
              className="black-btn full-width"
              onClick={handleSave}
              disabled={disable}
              loading={saveLoading}
              testId="new-instructor-modal-save-btn"
            />
          </Grid>
          <Grid item xs={5.5}>
            <CyanButton
              label="Save and Assign to Course"
              className="full-width"
              variant="outlined"
              onClick={handleSaveAndAssign}
              loading={assignLoading}
              disabled={disable}
              testId="new-instructor-modal-save-and-assign-btn"
            />
            <Typography
              variant="subtitle1"
              paragraph
              sx={{
                fontSize: '1rem',
                margin: 0,
                textAlign: 'center',
                color: '#333333',
                fontStyle: 'italic',
              }}
              data-testid="new-instructor-modal-course"
            >
              Course {sectionCode}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </SimpleModal>
  );
};

export default AddNewInstructor;
