import React, { useMemo, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import FormInput from 'Components/FormInput';
import FormSelect from 'Components/FormSelect';
import Button from 'Components/Button';
import useForm from 'hooks/Form';
import validator from 'utils/validation';
import { useCoursesQueries } from 'services/queries';
import { allPropHasValue } from 'utils/helper';
import { useAccountingMutation } from 'services/mutations';
import HorizontalDivider from 'Components/HorizontalDivider';

const AccountingForm = ({
  accountingData,
  refetchAccounts,
  testId,
  background,
}) => {
  const [beErrors, setBeErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const updateAccount = useAccountingMutation?.useUpdateAccountMutation();
  const addAccount = useAccountingMutation?.useAddAccountMutation();

  const stateSchema = useMemo(() => {
    return {
      department: {
        value: accountingData?.department_info?.id
          ? accountingData?.department_info?.id +
            '##' +
            accountingData?.department_info?.subj_cd
          : '',
        error: '',
      },
      offering_unit: {
        value: accountingData?.offering_unit_info?.id
          ? accountingData?.offering_unit_info?.id +
            '##' +
            accountingData?.offering_unit_info?.offering_unit_cd
          : '',
        error: '',
      },
      unit_cd: {
        value: accountingData?.unit_cd || '',
        error: '',
      },
      division: {
        value: accountingData?.division || '',
        error: '',
      },
      organization: {
        value: accountingData?.organization || '',
        error: '',
      },
      location: {
        value: accountingData?.location || '',
        error: '',
      },
      fund_type: {
        value: accountingData?.fund_type || '',
        error: '',
      },
      business_line: {
        value: accountingData?.business_line || '',
        error: '',
      },
      account: {
        value: accountingData?.account || '',
        error: '',
      },
    };
  }, [accountingData]);

  const validationStateSchema = {
    department: {
      required: false,
    },
    offering_unit: {
      required: true,
    },
    unit_cd: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 3 character unit code',
        3
      ),
    },
    division: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 4 character division code',
        4
      ),
    },
    organization: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 4 character organization code',
        4
      ),
    },
    location: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 4 character location code',
        4
      ),
    },
    fund_type: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 3 character fund type code',
        3
      ),
    },
    business_line: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 4 character business type code',
        4
      ),
    },
    account: {
      required: true,
      validator: validator.exactLengthChars(
        'Please enter 5 character account code',
        5
      ),
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [stateSchema, setState]);

  const { data: unitListData } = useCoursesQueries.useUnitListQuery({
    enabled: true,
  });

  const unitList =
    unitListData?.data?.map(item => ({
      value: item?.offering_unit + '##' + item?.offering_unit_cd,
      label: item?.offering_unit_cd,
    })) || [];

  const subjectListPayload = {
    unit: state?.offering_unit?.value?.split('##')?.[1],
  };
  const subjectListQueryEnabled = Boolean(allPropHasValue(subjectListPayload));

  const { data: subjectListData } = useCoursesQueries.useSubjectListQuery({
    payload: subjectListPayload,
    enabled: subjectListQueryEnabled,
  });

  const subjectList =
    subjectListData?.data?.map(item => ({
      value: item?.department + '##' + item?.subj_cd,
      label: item?.subj_display,
    })) || [];

  const handleInputChange = e => {
    const { name, value } = e?.target || {};
    handleOnChange(name, value);
  };

  const clearForm = () => {
    const newState = Object.keys(state)?.reduce((acc, item) => {
      return { ...acc, [item]: { value: '', error: '' } };
    });

    setState(newState);
  };

  const handleSubmit = async () => {
    const accountCode = [
      state?.unit_cd?.value,
      state?.division?.value,
      state?.organization?.value,
      state?.fund_type?.value,
      state?.business_line?.value,
      state?.account?.value,
    ];
    setLoading(true);
    const payload = {
      id: accountingData?.id,
      gl_string: accountCode?.filter(code => code)?.join('-'),
      department: state?.department?.value?.split('##')?.[0],
      offering_unit: state?.offering_unit?.value?.split('##')?.[0],
      unit_cd: state?.unit_cd?.value,
      division: state?.division?.value,
      organization: state?.organization?.value,
      location: state?.location?.value,
      fund_type: state?.fund_type?.value,
      business_line: state?.business_line?.value,
      account: state?.account?.value,
    };
    try {
      const formAction = payload?.id ? updateAccount : addAccount;
      await formAction.mutateAsync(payload);
      setTimeout(() => refetchAccounts?.(), 500);
      !payload?.id && clearForm();
      toast.success(
        `Account ${payload?.id ? 'updated' : 'added'} successfully.`,{
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
            } account. Please try again later.`,{
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
        <Grid
          item
          container
          xs={12}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={5.5}>
            <FormSelect
              label={accountingData?.id ? 'School' : 'Unit'}
              options={unitList}
              placeholder="-- Select --"
              value={state?.offering_unit?.value || ''}
              error={state?.offering_unit?.error || beErrors?.offering_unit}
              onChange={handleInputChange}
              name="offering_unit"
              testId={`${testId}-offering_unit`}
              required
            />
          </Grid>
          <Grid item xs={5.5}>
            <FormSelect
              label={accountingData?.id ? 'Department' : 'Subject'}
              options={subjectList}
              placeholder="-- Select --"
              name="department"
              value={state?.department?.value || ''}
              error={state?.department?.error || beErrors?.department}
              onChange={handleInputChange}
              testId={`${testId}-department`}
            />
          </Grid>
        </Grid>
      </Grid>
      {!Boolean(accountingData?.id) && (
        <>
          <HorizontalDivider />
          <Grid spacing={3} pt={3}>
            <Typography
              variant="h4"
              paragraph
              sx={{ fontWeight: '200', color: '#333333', fontSize: '1.25rem' }}
            >
              Account Code
            </Typography>
          </Grid>
        </>
      )}

      <Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <FormInput
              placeholder="###"
              label="Unit[3]"
              value={state?.unit_cd?.value}
              onChange={handleInputChange}
              name="unit_cd"
              error={state?.unit_cd?.error || beErrors?.unit_cd}
              testId={`${testId}-unit-cd`}
              required
            />
          </Grid>
          <Grid item>
            <FormInput
              placeholder="####"
              label="Division[4]"
              value={state?.division?.value}
              name="division"
              onChange={handleInputChange}
              error={state?.division?.error || beErrors?.division}
              testId={`${testId}-division`}
              required
            />
          </Grid>
          <Grid item>
            <FormInput
              placeholder="####"
              label="Organization[4]"
              value={state?.organization?.value}
              name="organization"
              onChange={handleInputChange}
              error={state?.organization?.error || beErrors?.organization}
              testId={`${testId}-organization`}
              required
            />
          </Grid>
          <Grid item>
            <FormInput
              placeholder="####"
              label="Location[4]"
              value={state?.location?.value}
              name="location"
              onChange={handleInputChange}
              error={state?.location?.error || beErrors?.location}
              testId={`${testId}-location`}
              required
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          columns={15}
          pt={3}
        >
          <Grid item xs={4}>
            <FormInput
              placeholder="###"
              label="Fund Type [3]"
              value={state?.fund_type?.value}
              name="fund_type"
              onChange={handleInputChange}
              testId={`${testId}-fund-type`}
              error={state?.fund_type?.error || beErrors?.fund_type}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              placeholder="####"
              label="Business Line [4]"
              value={state?.business_line?.value}
              name="business_line"
              onChange={handleInputChange}
              error={state?.business_line?.error || beErrors?.business_line}
              testId={`${testId}-business-line`}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              placeholder="#####"
              label="Account [5]"
              value={state?.account?.value}
              name="account"
              onChange={handleInputChange}
              error={state?.account.error || beErrors?.account}
              testId={`${testId}-account`}
              required
            />
          </Grid>
        </Grid>
        {!Boolean(accountingData?.id) && (
          <Grid pt={2}>
            <Typography>
              <span style={{ fontStyle: 'italic' }}>Account Code String:</span>
              <br />
              ###-####-####-####-###-####-######-0000-000-00000-000000 <br />
              Unit [3]-Division [4]-Organization [4]-Location [4]-Fund Type
              [3]-Business Line [4]-Account [5]
            </Typography>
          </Grid>
        )}
        <Grid pt={3}>
          <Button
            label={accountingData?.id ? 'Update' : 'Add New'}
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

export default AccountingForm;
