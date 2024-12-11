import React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const TextareaAutosize = styled(BaseTextareaAutosize)(({ theme }) => ({
  padding: '0.875rem',
  borderRadius: '0.875rem',
  background: theme.palette.mode === 'dark' ? '#24292f' : '#fff',
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? '#424a53' : '#d0d7de',
  boxShadow: 'none',

  'label + &': {
    marginTop: '1.725rem',
  },

  '&:hover': {
    borderColor: '#3399FF',
  },

  '&:focus': {
    borderColor: '#3399FF',
    boxShadow: 'none',
  },

  '&:focus-visible': {
    outline: 0,
  },
}));

export default function FormTextarea({
  placeholder,
  required,
  label,
  error,
  value,
  minRows = 4,
  maxRows = 6,
  testId,
  ...rest
}) {
  return (
    <FormControl error={Boolean(error)} fullWidth>
      {label && (
        <InputLabel
          shrink
          variant="standard"
          sx={{ transform: 'scale(1)', marginBottom: '3px' }}
        >
          {label}
          {required ? <span style={{ color: '#d32f2f' }}>&nbsp;*</span> : ''}
        </InputLabel>
      )}
      <TextareaAutosize
        placeholder={placeholder}
        value={value}
        minRows={minRows}
        maxRows={maxRows}
        data-testid={testId}
        inputProps={{ 'data-testid': `${testId}-textarea` }}
        {...rest}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}
