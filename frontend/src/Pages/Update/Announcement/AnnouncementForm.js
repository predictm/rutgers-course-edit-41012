import React, { useMemo, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

import FormInput from 'Components/FormInput';
import FormSelect from 'Components/FormSelect';
import Button from 'Components/Button';
import useForm from 'hooks/Form';
import { convertDraftToHtml, convertHtmlToDraft } from 'utils/common';
import { validateStartEndDate } from 'utils/helper';
import { useAnnouncementMutation } from 'services/mutations';
import { announcementTypes } from 'utils/constant';
import DatePicker from 'Components/DatePicker';
import RichTextEditor from 'Components/RichTextEditor';

const AnnouncementForm = ({
  announcementData,
  refetchAnnouncements,
  testId,
  background,
}) => {
  const [editorKey, setEditorKey] = useState(new Date()?.valueOf());
  const [beErrors, setBeErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const updateAnnouncement =
    useAnnouncementMutation?.useUpdateAnnouncementMutation();
  const addAnnouncement = useAnnouncementMutation?.useAddAnnouncementMutation();

  const stateSchema = useMemo(() => {
    return {
      title: {
        value: announcementData?.title || '',
        error: '',
      },
      message: {
        value: convertHtmlToDraft(announcementData?.message) || '',
        error: '',
      },
      type: {
        value: announcementData?.type || '',
        error: '',
      },
      start_date: {
        value: announcementData?.start_date
          ? moment.utc(announcementData?.start_date).tz(moment.tz.guess())
          : null,
        error: '',
      },
      end_date: {
        value: announcementData?.end_date
          ? moment.utc(announcementData?.end_date).tz(moment.tz.guess())
          : null,
        error: '',
      },
    };
  }, [announcementData]);

  const validationStateSchema = {
    title: {
      required: false,
    },
    message: {
      required: true,
    },
    type: {
      required: true,
    },
    start_date: {
      required: true,
    },
    end_date: {
      required: true,
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [stateSchema, setState]);

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

  const handleInputChange = e => {
    const { name, value } = e?.target || {};
    setBeErrors({
      ...beErrors,
      [name]: '',
    });
    handleOnChange(name, value);
  };

  const handleDateChange = field => value => {
    setBeErrors({
      ...beErrors,
      [field]: '',
    });
    validateStartEndDate(state.start_date.value);
    handleOnChange(field, value);
  };

  const handleRichTextChange = value => {
    setBeErrors({
      ...beErrors,
      message: '',
    });

    if (!state?.message?.value && !value.getCurrentContent().hasText()) {
      return;
    }

    handleOnChange('message', value.getCurrentContent().hasText() ? value : '');
  };

  const clearForm = () => {
    const newState = Object.keys(state)?.reduce((acc, item) => {
      return { ...acc, [item]: { value: null, error: '' } };
    });

    setState(newState);
    setEditorKey(new Date()?.valueOf());
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      id: announcementData?.id,
      title: state?.title?.value,
      type: state?.type?.value,
      message: convertDraftToHtml(state?.message?.value),
      start_date: state?.start_date?.value
        ? moment.tz(state?.start_date.value, moment.tz.guess()).utc().format()
        : null,
      end_date: state?.start_date?.value
        ? moment.tz(state?.end_date.value, moment.tz.guess()).utc().format()
        : null,
    };
    try {
      const formAction = payload?.id ? updateAnnouncement : addAnnouncement;
      await formAction.mutateAsync(payload);
      setTimeout(() => refetchAnnouncements?.(), 500);
      !payload?.id && clearForm();
      toast.success(
        `Announcement ${payload?.id ? 'updated' : 'added'} successfully.`,{
          hideProgressBar: true,
        }
      );
    } catch (error) {
      const errors = error?.response?.data?.errors;
      const nonFieldError = error?.response?.data?.errors?.non_field_errors;
      setBeErrors({
        ...errors,
      });
      toast.error(
        nonFieldError
          ? nonFieldError?.join('')
          : `An error occurred while ${
              payload?.id ? 'updating' : 'adding'
            } announcement. Please try again later.`,{
              hideProgressBar: true,
            }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: background || '#f5f5f5',
        borderRadius: '1rem',
        padding: '2rem',
        position: 'relative',
      }}
    >
      <Grid container spacing={3} pb={3}>
        <Grid item xs={8}>
          <FormInput
            label="Title"
            placeholder="Title"
            value={state?.title?.value || ''}
            error={state?.title?.error || beErrors?.title}
            onChange={handleInputChange}
            name="title"
            testId={`${testId}-title`}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <FormSelect
            label="Type"
            options={announcementTypes}
            placeholder="-- Select --"
            name="type"
            value={state?.type?.value || ''}
            error={state?.type?.error || beErrors?.type}
            onChange={handleInputChange}
            testId={`${testId}-type`}
            required
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <DatePicker
            label="Start Date and Time"
            placeholder="MM/DD/YYYY, __:__ __"
            views={['month', 'day', 'year', 'hours', 'minutes']}
            value={state?.start_date?.value}
            onChange={handleDateChange('start_date')}
            name="start_date"
            error={state?.start_date?.error || beErrors?.start_date}
            testId={`${testId}-start-date`}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="End Date and Time"
            placeholder="MM/DD/YYYY, __:__ __"
            views={['month', 'day', 'year', 'hours', 'minutes']}
            value={state?.end_date?.value}
            onChange={handleDateChange('end_date')}
            name="start_date"
            error={state?.end_date?.error || beErrors?.end_date}
            testId={`${testId}-end-date`}
            required
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RichTextEditor
            key={`Rich-text-editor-${editorKey}`}
            className="rich-text-editor"
            onChange={handleRichTextChange}
            placeholder="Description"
            defaultEditorState={state?.message?.value}
            error={state?.message?.error || beErrors?.message}
            label="Message"
            wrapperId={`${testId}-editor`}
            required
          />
        </Grid>
      </Grid>
      <Grid container pt={3}>
        <Grid item xs={12}>
          <Button
            label={announcementData?.id ? 'Update' : 'Add New'}
            className="full-width"
            disabled={disable}
            loading={loading}
            onClick={handleSubmit}
            testId={`${testId}-submit`}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnnouncementForm;
