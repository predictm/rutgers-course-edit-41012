import React, { useEffect, useMemo, useState } from 'react';
import { Grid } from '@mui/material';
import FormInput from 'Components/FormInput';
import FormSelect from 'Components/FormSelect';
import SwitchInput from 'Components/SwitchInput';
import validator from 'utils/validation';
import useForm from 'hooks/Form';
import { formatDateTime, formatPhoneNumber } from 'utils/helper';
import moment from 'moment-timezone';
import { getUserData } from 'utils/common';

const ContactForm = ({
  roles,
  contact,
  handleContactChange,
  toggleActive,
  BeErrors,
  loading,
  testId,
}) => {
  const [inactiveInfo, setInactiveInfo] = useState({});
  const [errors, setErrors] = useState(BeErrors);

  const stateSchema = useMemo(() => {
    setInactiveInfo({
      by: contact?.modified_by?.name,
      on: formatDateTime(
        contact?.modified_at || contact?.created_at,
        'MM/DD/YYYY'
      ),
    });
    return {
      first_name: {
        value: contact?.first_name,
        error: '',
      },
      last_name: {
        value: contact?.last_name,
        error: '',
      },
      title: {
        value: contact?.title,
        error: '',
      },
      is_active: {
        value: contact?.is_active ?? true,
        error: '',
      },
      email: {
        value: contact?.email,
        error: '',
      },
      phone: {
        value: contact?.phone ? formatPhoneNumber(contact?.phone) : contact?.phone,
        error: '',
      },
      address1: {
        value: contact?.address1,
        error: '',
      },
      address2: {
        value: contact?.address2,
        error: '',
      },
      role: {
        value: contact?.role,
        error: '',
      },
    };
  }, [contact]);

  const validationStateSchema = {
    first_name: {
      required: true,
    },
    last_name: {
      required: true,
    },
    title: {
      required: true,
    },
    email: {
      required: true,
      validator: validator.email,
    },
    phone: {
      required: true,
      validator:validator.checkLength("please input 10 digit number",12),
    },
    address1: {
      required: true,
    },
    address2: {
      required: false,
    },
    is_active: {
      required: false,
    },
    role: {
      required: true,
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
    const fields =
      Object.keys(state || {})?.reduce((acc, field) => {
        return { ...acc, [field]: state[field]?.value };
      }, {}) || {};

    handleContactChange(
      {
        id: contact?.id,
        contact_id: contact?.contact_id,
        dept: contact?.dept,
        ...fields,
      },
      !disable
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, disable]);

  const handleInputChange = field => e => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    if(field==='phone')
    handleOnChange(field, formatPhoneNumber(e.target.value));
  else{
    handleOnChange(field, e.target.value);
  }
  };

  const handleCheckBoxChange = field => e => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    setInactiveInfo({
      by: getUserData()?.name || '',
      on: formatDateTime(moment.utc(), 'MM/DD/YYYY'),
    });
    toggleActive?.(contact);
    handleOnChange(field, e.target.checked);
  };

  return (
    <Grid
      container
      spacing={2}
      className="contact-form"
      sx={{ paddingRight: '1rem' }}
    >
      <Grid item xs={4}>
        <FormSelect
          label="Role"
          options={roles || []}
          error={state?.role?.error || errors?.role}
          value={state?.role?.value || ''}
          placeholder="---Select a Role---"
          onChange={handleInputChange('role')}
          disabled={!state?.is_active?.value}
          testId={`${testId}-role`}
          required
        />
      </Grid>
      <Grid item xs={8}>
        <SwitchInput
          label={
            state?.is_active?.value ? (
              'Active'
            ) : (
              <span>
                Inactive{' '}
                <span style={{ fontStyle: 'italic' }}>
                  - {inactiveInfo?.on} by {inactiveInfo?.by}
                </span>
              </span>
            )
          }
          onChange={handleCheckBoxChange('is_active')}
          checked={state?.is_active?.value}
          disabled={loading}
          controlSx={{ bottom: '-40%', position: 'relative' }}
          testId={`${testId}-status`}
        />
      </Grid>
      <Grid item xs={4}>
        <FormInput
          label="First Name"
          error={state?.first_name?.error || errors?.first_name}
          value={state?.first_name?.value}
          onChange={handleInputChange('first_name')}
          required
          disabled={!state?.is_active?.value}
          testId={`${testId}-first-name`}
        />
      </Grid>
      <Grid item xs={4}>
        <FormInput
          label="Last Name"
          error={state?.last_name?.error || errors?.last_name}
          value={state?.last_name?.value}
          onChange={handleInputChange('last_name')}
          required
          disabled={!state?.is_active?.value}
          testId={`${testId}-last-name`}
        />
      </Grid>
      <Grid item xs={4}>
        <FormInput
          label="Title"
          error={state?.title?.error || errors?.title}
          value={state?.title?.value}
          onChange={handleInputChange('title')}
          required
          disabled={!state?.is_active?.value}
          testId={`${testId}-title`}
        />
      </Grid>
      <Grid item xs={6}>
        <FormInput
          label="Address 1"
          error={state?.address1?.error || errors?.address1}
          value={state?.address1?.value}
          onChange={handleInputChange('address1')}
          required
          disabled={!state?.is_active?.value}
          testId={`${testId}-address1`}
        />
      </Grid>
      <Grid item xs={6}>
        <FormInput
          label="Address 2"
          onChange={handleInputChange('address2')}
          value={state?.address2?.value}
          error={state?.address1?.error || errors?.address2}
          required={Boolean(errors?.address2)}
          disabled={!state?.is_active?.value}
          testId={`${testId}-address2`}
        />
      </Grid>
      <Grid item xs={6}>
        <FormInput
          label="Phone"
          type="text"
          error={state?.phone?.error || errors?.phone}
          value={state?.phone?.value}
          onChange={handleInputChange('phone')}
          required
          disabled={!state?.is_active?.value}
          testId={`${testId}-phone`}
        />
      </Grid>
      <Grid item xs={6}>
        <FormInput
          label="Email"
          error={state?.email?.error || errors?.email}
          value={state?.email?.value}
          onChange={handleInputChange('email')}
          required
          disabled={!state?.is_active?.value}
          testId={`${testId}-email`}
        />
      </Grid>
    </Grid>
  );
};

export default ContactForm;
