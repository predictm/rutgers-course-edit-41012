import React, { useMemo, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

import FormInput from 'Components/FormInput';
import FormSelect from 'Components/FormSelect';
import FormAutoComplete from 'Components/FormAutoComplete';
import Button from 'Components/Button';
import { userTypes } from 'utils/constant';
import useForm from 'hooks/Form';
import validator from 'utils/validation';
import { useCoursesQueries } from 'services/queries';
import { useUsersMutation } from 'services/mutations';

const UserForm = ({ background, userData, refetchUsers, testId }) => {
  const [loading, setLoading] = useState(false);
  const [beErrors, setBeErrors] = useState({});
  const [visible, setVisible] = useState(true);
  const [validationStateSchema, setValidationStateSchema] = useState({
    net_id: {
      required: true,
    },
    first_name: {
      required: true,
    },
    last_name: {
      required: true,
    },
    email: {
      required: true,
      validator: validator.email,
    },
    role: {
      required: true,
    },
    subject: {
      required: true,
      validator: validator.checkLength('Please select at least 1 subject', 1),
    },
  });
  const updateUser = useUsersMutation?.useUpdateUserMutation();
  const addUser = useUsersMutation?.useAddUserMutation();

  const selectedSubjects = useMemo(() => {
    return userData?.assigned_departments?.map(department => {
      return {
        value: `${department?.unit}--${department?.dept}--${department?.offering_unit_campus}--${department?.offering_unit_level}`,
        label: `${department?.offering_unit_cd}:${department?.subj_cd}:${department?.offering_unit_level} ${department?.offering_unit_campus} ${department?.subj_descr}`,
      };
    });
  }, [userData]);

  const stateSchema = useMemo(() => {
    return {
      net_id: {
        value: userData?.net_id,
        error: '',
      },
      first_name: {
        value: userData?.first_name,
        error: '',
      },
      last_name: {
        value: userData?.last_name,
        error: '',
      },
      email: {
        value: userData?.email,
        error: '',
      },
      role: {
        value: userData?.user_type,
        error: '',
      },
      subject: {
        value: selectedSubjects,
        error: '',
      },
    };
  }, [userData, selectedSubjects]);
  // const validationStateSchema = {
  //   net_id: {
  //     required: true,
  //   },
  //   first_name: {
  //     required: true,
  //   },
  //   last_name: {
  //     required: true,
  //   },
  //   email: {
  //     required: true,
  //     validator: validator.email,
  //   },
  //   role: {
  //     required: true,
  //   },
  //   subject: {
  //     required: validateData?.role?.value==='ADMIN'? false: true,
  //     validator: validator.checkLength('Please select at least 1 subject', 1),
  //   },
  // };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  );
  console.log(state, 'statr');
  useEffect(() => {
    setState(stateSchema);
  }, [stateSchema, setState]);

  const { data: subjectListData } = useCoursesQueries.useUnitSubjectListQuery({
    enabled: true,
  });
  const subjectList = subjectListData?.data?.map(item => ({
    value: `${item?.offering_unit}--${item?.department}--${item?.offering_unit_campus}--${item?.offering_unit_level}`,
    label: `${item?.offering_unit_cd}:${item?.subj_cd}:${item?.offering_unit_level} ${item?.offering_unit_campus} ${item?.subj_descr}`,
  }));

  const handleInputChange = e => {
    const { name, value } = e?.target || {};

    setBeErrors({ ...beErrors, [name]: '' });
    console.log(value, 'valueee');
    if (name === 'role') {
      if (value === 'ADMIN') {
        setValidationStateSchema({ ...validationStateSchema, subject: { required: false, validator:null } });
        setState(state => ({...state,subject:{
          value:undefined,
          error:''
        }}))
      } else {
        setValidationStateSchema({ ...validationStateSchema, subject: { required: true, validator: validator.checkLength("Please select atleast one length", 1) } })
      }
    }
 

    handleOnChange(name, value);
  };
  // subject: {
  //   required: validateData?.role?.value==='ADMIN'? false: true,
  //   validator: validator.checkLength('Please select at least 1 subject', 1),
  // },
  const handleSubjectChange = (e, value) => {
    setBeErrors({ ...beErrors, subject: '' });
    handleOnChange('subject', value);
  };

  const clearForm = () => {
    const newState = Object.keys(state)?.reduce((acc, item) => {
      return { ...acc, [item]: { value: '', error: '' } };
    });

    setState(newState);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const departments = state?.subject?.value?.map(department => {
      const [unit, dept] = department?.value?.split('--');
      return {
        dept,
        unit,
      };
    });

    const payload = {
      id: userData?.id,
      net_id: state?.net_id?.value,
      first_name: state?.first_name?.value,
      last_name: state?.last_name?.value,
      email: state?.email?.value,
      user_type: state?.role?.value,
      departments,
    };
    try {
      const formAction = payload?.id ? updateUser : addUser;
      await formAction.mutateAsync(payload);
      setTimeout(() => refetchUsers?.(), 500);
      !payload?.id && clearForm();
      toast.success(`User ${payload?.id ? 'updated' : 'added'} successfully.`, {
        hideProgressBar: true,
      });
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
            } user. Please try again later.`,
        {
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
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={4}>
            <FormInput
              label="NetID"
              placeholder="ie: john101"
              name="net_id"
              onChange={handleInputChange}
              value={state?.net_id?.value || ''}
              error={state?.net_id?.error || beErrors?.net_id}
              required
              testId={`${testId}-net_id`}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              label="First Name"
              placeholder="ie: John"
              name="first_name"
              onChange={handleInputChange}
              value={state?.first_name?.value || ''}
              error={state?.first_name?.error || beErrors?.first_name}
              required
              testId={`${testId}-first-name`}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              label="Last Name"
              placeholder="ie: K. Greenman"
              name="last_name"
              onChange={handleInputChange}
              value={state?.last_name?.value || ''}
              error={state?.last_name?.error || beErrors?.last_name}
              required
              testId={`${testId}-last-name`}
            />
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={4}>
            <FormInput
              label="Email"
              placeholder="ie: john101"
              name="email"
              onChange={handleInputChange}
              value={state?.email?.value || ''}
              error={state?.email?.error || beErrors?.email}
              required
              testId={`${testId}-email`}
            />
          </Grid>
          <Grid item xs={4}>
            <FormSelect
              label="Role"
              options={userTypes}
              placeholder="-- Select --"
              name="role"
              value={state?.role?.value || ''}
              error={state?.role?.error || beErrors?.user_type}
              onChange={handleInputChange}
              required
              testId={`${testId}-role`}
            />
          </Grid>
          <Grid item xs={4}>
            <FormAutoComplete
              label="Subject"
              multiple={true}
              options={subjectList}
              placeholder="-- Select --"
              name="subject"
              value={state?.subject?.value || []}
              error={state?.role?.value !== 'ADMIN' && state?.subject?.error}
              onChange={handleSubjectChange}
              required={visible}
              disabled={state?.role?.value === 'ADMIN'}
              testId={`${testId}-subject`}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            label={userData?.id ? 'Update' : 'Add New'}
            className="full-width"
            disabled={disable}
            loading={loading}
            onClick={handleSubmit}
            testId={`${testId}-submit-btn`}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
