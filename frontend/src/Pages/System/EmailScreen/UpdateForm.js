import { Grid, Box, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import useForm from 'hooks/Form';
import { toast } from 'react-toastify';

import { useEmailTemplateMutations } from 'services/mutations';
import Button from 'Components/Button';
import FormInput from 'Components/FormInput';
import FormTextarea from 'Components/FormTextarea';
import RichTextEditor from 'Components/RichTextEditor';
import { convertDraftToHtml, convertHtmlToDraft } from 'utils/common';

const UpdateForm = ({ emailTemplate, refetchEmailTemplateList, testId }) => {
  const [beErrors, setBeErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(new Date()?.valueOf());

  const updateEmailTemplateMutation =
    useEmailTemplateMutations.useUpdateEmailTemplateMutation();

  const stateSchema = useMemo(() => {
    return {
      message: {
        value: convertHtmlToDraft(emailTemplate?.message),
        error: '',
      },
      subject: {
        value: emailTemplate?.subject,
        error: '',
      },

      to: {
        value: emailTemplate?.to,
        error: '',
      },
      is_active: {
        value: emailTemplate?.is_active,
        error: '',
      },
    };
  }, []);

  const validationStateSchema = {
    message: {
      required: true,
    },
    subject: {
      required: true,
    },

    to: {
      required: true,
    },
    is_active: {
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
    handleOnChange(field, e?.target?.value);
  };

  const handleUpdate = async () => {
    setLoading(true);

    const payload = {
      email_type: emailTemplate?.email_type,
      subject: state?.subject?.value,
      message: convertDraftToHtml(state?.message?.value),
      is_active: state?.is_active?.value,
      to: state?.to?.value,
    };
    try {
      await updateEmailTemplateMutation.mutateAsync({
        id: emailTemplate?.id,
        ...payload,
      });
      toast.success('Email Template Updated successfully',{
        hideProgressBar: true,
      });
      refetchEmailTemplateList?.();
    } catch (error) {
      const errors = error?.response?.data?.errors;

      setBeErrors({
        ...errors,
      });
      toast.error(
        `An error occurred while Updating Email Template. Please try again later.`,{
          hideProgressBar: true,
        }
      );
    } finally {
      setLoading(false);
    }
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
  }

  return (
    <Box sx={{ borderTop: '1px dashed #383C49' }}>
      <Grid p={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={5.5}>
            <FormInput
              placeholder="Welcome New User"
              label="Subject"
              value={state?.subject?.value}
              onChange={handleInputChange('subject')}
              error={state?.subject?.error || beErrors?.subject}
              required
              testId={`${testId}-subject`}
            />
          </Grid>
          <Grid item xs={5.5}>
            <FormInput
              placeholder="[user_email]"
              label="To"
              value={state?.to?.value}
              onChange={handleInputChange('to')}
              error={state?.to?.error || beErrors?.to}
              required
              testId={`${testId}-to-email`}
            />
          </Grid>
        </Grid>

        <Grid sx={{ width: '100%' }} pt>
        <RichTextEditor
            key={`Rich-text-editor-${editorKey}`}
            className="rich-text-editor"
            onChange={handleRichTextChange}
            sx={{ height: '20rem' }}
            defaultEditorState={state?.message?.value}
            placeholder="Message"
            error={state?.message?.error || beErrors?.message}
            label="Message"
            wrapperId={`${testId}-editor`}
            required
          />
        </Grid>

        <Grid pt={2}>
          <Button
            label={`Update`}
            variant="contained"
            className="full-width"
            loading={loading}
            disabled={disable}
            onClick={handleUpdate}
            testId={`${testId}-update-btn`}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateForm;
