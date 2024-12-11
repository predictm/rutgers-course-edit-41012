import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import FormInput from 'Components/FormInput';
import useForm from 'hooks/Form';
import validator from 'utils/validation';
import { formatPhoneNumber } from 'utils/helper';

const DepartmentForm = ({
  department,
  unitInfo,
  handleDepartmentChange,
  BeErrors,
  hideTitle,
  testId,
}) => {
  const [errors, setErrors] = useState(BeErrors);
  const stateSchema = useMemo(() => {
    return {
      phone: {
        value: department?.phone ?  formatPhoneNumber(department?.phone): department?.phone,
        error: '',
      },
      url: {
        value: department?.url,
        error: '',
      },
      campus: {
        value: department?.campus,
        error: '',
      },
    };
  }, [department, unitInfo]);

  const validationStateSchema = {
    phone: {
      required: false,
      validator:validator.checkLength("please input 10 digit number",12),
    },
    url: {
      required: false,
      validator: validator.url(),
    },
    campus: {
      required: false,
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    setErrors(BeErrors);
  }, [BeErrors]);

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  useEffect(() => {
    if (department?.id) {
      const fields =
        Object.keys(state || {})?.reduce((acc, field) => {
          return { ...acc, [field]: state[field]?.value };
        }, {}) || {};

      handleDepartmentChange({ id: department?.id, ...fields }, !disable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, disable]);

  const handleInputChange = field => e => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    if(field==='phone'){
      handleOnChange(field, formatPhoneNumber(e.target.value));
    }
    else{
      handleOnChange(field,e.target.value);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      className="department-form"
      sx={{ paddingRight: '1rem' }}
    >
      {!hideTitle && (
        <Grid item xs={12}>
          <Typography
            m={0}
            paragraph
            sx={{ fontWeight: 400, color: '#333333', fontSize: '1.5rem' }}
          >
            Department Profile
          </Typography>
        </Grid>
      )}
      <Grid item xs={4}>
        <FormInput
          label="Unit"
          disabled
          value={unitInfo?.offering_unit_cd}
          testId={`${testId}-department-unit`}
        />
      </Grid>
      <Grid item xs={4}>
        <FormInput
          label="Subject"
          disabled
          value={department?.subj_cd}
          testId={`${testId}-department-subject`}
        />
      </Grid>
      <Grid item xs={4}>
        <FormInput
          label="Phone"
          type="text"
          value={state?.phone?.value}
          error={errors?.phone}
          required={Boolean(errors?.phone)}
          onChange={handleInputChange('phone')}
          testId={`${testId}-department-phone`}
        />
      </Grid>
      <Grid item xs={6}>
        <FormInput
          label="Website"
          value={state?.url?.value}
          onChange={handleInputChange('url')}
          error={errors?.phone || state?.url?.error}
          required={Boolean(errors?.phone || state?.url?.error)}
          testId={`${testId}-department-website`}
        />
      </Grid>
      <Grid item xs={6}>
        <FormInput
          label="School"
          value={state?.campus?.value}
          onChange={handleInputChange('campus')}
          error={errors?.campus}
          required={Boolean(errors?.campus)}
          testId={`${testId}-department-school`}
        />
      </Grid>
    </Grid>
  );
};

export default DepartmentForm;
