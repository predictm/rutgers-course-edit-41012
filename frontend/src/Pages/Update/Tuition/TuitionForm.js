import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

import Button from 'Components/Button';
import FormInput from 'Components/FormInput';
import FormSelect from 'Components/FormSelect';
import useForm from 'hooks/Form';
import { useTuitionsMutation } from 'services/mutations';
import { formatSalary } from 'utils/helper';

const TuitionForm = ({
  tuitionData,
  unitList,
  termAndYearList,
  refetchTuitionList,
  background,
  testId,
}) => {
  const updateTuitionMutation = useTuitionsMutation.useUpdateUserMutation();
  const addTuitionMutation = useTuitionsMutation.useAddTuitionMutation();
  const [beErrors, setBeErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stateSchema = useMemo(() => {
    return {
      unit: {
        value: tuitionData?.offering_unit || '',
        error: '',
      },
      termAndYear: {
        value: tuitionData?.year
          ? `${tuitionData?.year}--${tuitionData?.term}`
          : '',
        error: '',
      },

      tuition: {
        value: tuitionData?.tuition_fees || '',
        error: '',
      },
    };
  }, [tuitionData]);

  const validationStateSchema = {
    unit: {
      required: true,
    },
    termAndYear: {
      required: true,
    },
    tuition: {
      required: true,
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  const handleInputChange = field => e => {
    setBeErrors({ ...beErrors, [field]: '' });
    if (field === 'tuition') {
      if (/^[\d.,]+$/.test(e?.target?.value) || e?.target?.value === '') {
        handleOnChange(field, e?.target?.value);
      }
      return;
    }
    handleOnChange(field, e?.target?.value);
  };
  const handleDropdownChange = field => e => {
    setBeErrors({ ...beErrors, [field]: '' });

    handleOnChange(field, e?.target?.value);
  };
  const clearForm = () => {
    const newState = Object.keys(state)?.reduce((acc, item) => {
      return { ...acc, [item]: { value: '', error: '' } };
    });

    setState(newState);
  };

  const handleUpdate = async () => {
    setLoading(true);

    const [year, term] = state?.termAndYear?.value.split('--') || [];
    const payload = {
      id: tuitionData?.id,

      year: year,
      term: term,
      tuition_fees: parseInt(state?.tuition?.value.replaceAll(',','')),
      offering_unit: state?.unit?.value,
    };

    try {
      const mutateMethod = tuitionData?.id
        ? updateTuitionMutation
        : addTuitionMutation;
      await mutateMethod.mutateAsync(payload);
      clearForm();
      toast.success(
        `Tuition ${tuitionData?.id ? 'updated' : 'added'} successfully`, {
          hideProgressBar: true,
        }
      );
      refetchTuitionList?.();
    } catch (error) {
      const errors = error?.response?.data?.errors;
      const nonFieldError = error?.response?.data?.errors?.non_field_errors;

      setBeErrors({
        ...errors,
      });
      toast.error(
        nonFieldError
          ? nonFieldError?.join(' ')
          : `An error occurred while ${
              tuitionData?.id ? 'updating' : 'adding'
            } Tuition. Please try again later.`,{
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
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <FormSelect
            label="Unit"
            placeholder="--Select--"
            options={unitList}
            name="unit"
            value={state?.unit?.value || ''}
            onChange={handleDropdownChange('unit')}
            error={state?.unit?.error || beErrors?.unit}
            disabled={!unitList?.length}
            required
            testId={`${testId}-unit`}
          />
        </Grid>
        <Grid item xs={4}>
          <FormSelect
            label="Term/Year"
            placeholder="--Select--"
            options={termAndYearList}
            value={state?.termAndYear?.value || ''}
            onChange={handleDropdownChange('termAndYear')}
            error={state?.termAndYear?.error || beErrors?.termAndYear}
            disabled={!termAndYearList?.length}
            required
            testId={`${testId}-term-year`}
          />
        </Grid>
        <Grid item xs={4}>
          <FormInput
            placeholder="ie:10,000"
            label="Tuition"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={formatSalary(state?.tuition?.value) || ''}
            onChange={handleInputChange('tuition')}
            error={state?.tuition?.error || beErrors?.tuition}
            required
            testId={`${testId}-tuition-fee`}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            label={tuitionData?.id ? `Update` : 'Add New'}
            variant="contained"
            className=" full-width"
            loading={loading}
            disabled={disable}
            onClick={handleUpdate}
            testId={`${testId}-submit-btn`}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TuitionForm;
