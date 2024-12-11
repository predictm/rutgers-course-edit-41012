import React, { useMemo, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

import { formatDateTime, formatSalary, validateStartEndDate } from 'utils/helper';
import Button from 'Components/Button';
import HorizontalDivider from 'Components/HorizontalDivider';
import FormInput from 'Components/FormInput';
import FormSelect from 'Components/FormSelect';
import DatePicker from 'Components/DatePicker';
import useForm from 'hooks/Form';
import FormCheckbox from 'Components/FormCheckbox';
import { useCoursesQueries } from 'services/queries';
import { useCoursesMutation } from 'services/mutations';

const CourseDates = ({
  courseSectionDates,
  refetchCourseSectionDetails,
  sectionDetails,
}) => {
  const { data: courseStatusTypeData } =
    useCoursesQueries.useCourseStatusTypeQuery({ enabled: true });

  const courseStatusTypes =
    courseStatusTypeData?.data?.results?.map(item => ({
      label: item?.name,
      value: item?.id,
    })) || [];

  const { data: courseFeeTypeData } = useCoursesQueries.useCourseFeeTypeQuery({
    enabled: true,
  });
  const courseFeeTypes =
    courseFeeTypeData?.data?.results?.map(item => ({
      label: item?.name,
      value: item?.id,
    })) || [];

  const courseDateMutation = useCoursesMutation.useUpdateCourseDatesMutation();

  const modifiedDate =
    courseSectionDates?.modified_at || courseSectionDates?.created_at;
  const modifiedBy = courseSectionDates?.modified_by?.name;
  const [errors, setErrors] = useState();
  const stateSchema = useMemo(() => {
    return {
      start_date: {
        value: courseSectionDates?.start_date
          ? moment.utc(courseSectionDates?.start_date).tz(moment.tz.guess())
          : sectionDetails?.session_date?.start_date
          ? moment.utc(sectionDetails?.session_date?.start_date).tz(moment.tz.guess())
          : null,
        error: '',
      },
      end_date: {
        value: courseSectionDates?.end_date
          ? moment.utc(courseSectionDates?.end_date).tz(moment.tz.guess())
          : sectionDetails?.session_date?.end_date
          ? moment.utc(sectionDetails?.session_date?.end_date).tz(moment.tz.guess())
          : null,
        error: '',
      },
      course_fee: {
        value: courseSectionDates?.course_fee,
        error: '',
      },
      course_fee_type: {
        value: courseSectionDates?.course_fee_type,
        error: '',
      },
      is_highschool_course: {
        value: courseSectionDates?.is_highschool_course,
        error: '',
      },
      course_status: {
        value: courseSectionDates?.course_status,
        error: '',
      },
    };
  }, [courseSectionDates]);

  const validationStateSchema = {
    start_date: {
      required: false,
    },
    end_date: {
      required: false,
    },
    course_fee: {
      required: false,
    },
    course_fee_type: {
      required: false,
    },
    is_highschool_course: {
      required: false,
    },
    course_status: {
      required: false,
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    if (state.start_date?.value && !state.end_date.value) {
      setState(prevState => ({
        ...prevState,
        start_date: {
          value: state?.start_date.value,
          error: 'End date is required',
        },
      }));
    } else if (!state.start_date?.value && state.end_date.value) {
      setState(prevState => ({
        ...prevState,
        start_date: {
          value: state?.start_date.value,
          error: 'Start date is required',
        },
      }));
    } else if (
      !validateStartEndDate(state.start_date?.value, state.end_date.value)
    ) {
      setState(prevState => ({
        ...prevState,
        start_date: {
          value: state?.start_date.value,
          error: 'Start date must be earlier than end date',
        },
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        start_date: {
          value: state?.start_date.value,
          error: '',
        },
        end_date: {
          value: state?.end_date.value,
          error: '',
        },
      }));
    }
  }, [state?.start_date.value, state.end_date.value, setState]);

  const handleInputChange = field => e => {
    let value = '';
    if (field === 'is_highschool_course') {
      value = e.target.checked;
    } else if (field === 'start_date' || field === 'end_date') {
      value = e;
      validateStartEndDate(state.start_date.value);
    } else if (field === 'course_fee') {
      if (/^[\d.,]+$/.test(e?.target?.value) || e?.target?.value === '') {
        handleOnChange(field, e?.target?.value);
      }
      return;
    }
    else {
      value = e.target.value;
    }
    handleOnChange(field, value);
  };

  const handleUpdate = async () => {
    try {
      const response = await courseDateMutation.mutateAsync({
        id: sectionDetails?.id,
        start_date: state?.start_date.value
          ? formatDateTime(state?.start_date.value, 'YYYY-MM-DD')
          : null,
        end_date: state?.end_date.value
          ? formatDateTime(state?.end_date.value, 'YYYY-MM-DD')
          : null,
        is_highschool_course: state?.is_highschool_course?.value,
        course_fee_type: state?.course_fee_type?.value,
        course_fee: parseInt(state?.course_fee?.value.replaceAll(',','')),
        course_status: state?.course_status?.value,
      });
      refetchCourseSectionDetails?.();
      toast.success('Course dates updated successfully',{
        hideProgressBar: true,
      });
    } catch (e) {
      const errors = e?.response?.data?.data?.errors;
      setErrors(errors);
      toast.error('An error occurred while updating the course dates',{
        hideProgressBar: true,
      });
    }
  };
  return (
    <Grid container>
      <Grid xs={12} item>
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#333333',
            fontSize: '1.5rem',
            margin: 0,
          }}
        >
          Course Date
        </Typography>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid item xs={6} sx={{ paddingRight: '0.5rem' }}>
          <DatePicker
            label="Start Date"
            placeholder="MM/DD/YYYY"
            value={state?.start_date?.value}
            error={errors?.start_date || state?.start_date?.error}
            onChange={handleInputChange('start_date')}
            testId="course-start-date"
          />
        </Grid>
        <Grid item xs={6} sx={{ paddingLeft: '0.5rem' }}>
          <DatePicker
            label="End Date"
            placeholder="MM/DD/YYYY"
            value={state?.end_date?.value}
            error={errors?.end_date || state?.end_date?.error}
            onChange={handleInputChange('end_date')}
            testId="course-end-date"
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <HorizontalDivider />
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid xs={6} item sx={{ paddingRight: '0.5rem' }}>
          <FormSelect
            label="Course Status"
            options={courseStatusTypes}
            placeholder="--select--"
            value={state?.course_status?.value || ''}
            error={errors?.course_status || state?.course_status?.error}
            onChange={handleInputChange('course_status')}
            testId="course-status"
          />
        </Grid>
        <Grid xs={6} item sx={{ paddingLeft: '0.5rem' }}>
          <FormCheckbox
            label="High School Course"
            checked={state?.is_highschool_course?.value ? true : false}
            onChange={handleInputChange('is_highschool_course')}
            labelSx={{ '.MuiFormControlLabel-label': { marginBottom: '4px' } }}
            testId="is-highschool-course"
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0.5rem 0 0.75rem' }}>
        <Grid xs={6} item sx={{ paddingRight: '0.5rem' }}>
          <FormSelect
            label="Course Fee Type"
            placeholder="--select--"
            options={courseFeeTypes}
            value={state?.course_fee_type?.value || ''}
            error={errors?.course_fee_type || state?.course_fee_type?.error}
            onChange={handleInputChange('course_fee_type')}
            testId="course-fee-type"
          />
        </Grid>
        <Grid xs={6} item sx={{ paddingLeft: '0.5rem' }}>
          <FormInput
            label="Fee"
            value={formatSalary(state?.course_fee?.value)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            error={errors?.course_fee || state?.course_fee?.error}
            onChange={handleInputChange('course_fee')}
            testId="course-fee"
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ padding: '0.75rem 0 0.5rem' }}>
        <Button
          label="Update"
          className="full-width"
          disabled={disable || courseDateMutation?.isLoading}
          loading={courseDateMutation?.isLoading}
          onClick={handleUpdate}
          testId="course-dates-update-btn"
        />
      </Grid>
      <Grid item xs={12} sx={{ padding: '0.5rem 0 0' }}>
        <Typography
          paragraph
          variant="subtitle"
          sx={{
            color: '#707070',
            fontSize: '1rem',
            fontStyle: 'italic',
            margin: 0,
          }}
          data-testid="course-date-last-modified"
        >
          {modifiedDate &&
            `Last updated on
          ${formatDateTime(modifiedDate, ' MM/DD/YYYY - hh:mm a')} `}
          {modifiedBy && `by ${modifiedBy}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CourseDates;
