import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '0.675rem',
  width: '2.375rem',
  height: '2.375rem',
  border: '1px solid #c9c9c9',
  backgroundColor: 'white',

  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#f5f5f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : '#f5f5f5',
  },
  'input[readonly] ~ &': {
    cursor: 'initial',
    background: theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : '#f5f5f5',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: 'white',
  '&:after': {
    display: 'block',
    position: 'absolute',
    left: '37%',
    top: '10%',
    width: '0.5rem',
    height: '1.5rem',
    border: 'solid #333333',
    borderWidth: '0 0.25rem 0.25rem 0',
    transform: 'rotate(45deg)',
    content: '""',
  },
});

const StyledFormControlLabel = styled(FormControlLabel)({
  alignItems: 'flex-start',
  marginLeft: 0,

  '.MuiCheckbox-root': {
    padding: 0,
  },

  '.MuiFormControlLabel-label': {
    color: '#383C49',
    fontSize: '1rem',
    fontWeight: '400',
  },
});

const FormCheckbox = ({
  onChange,
  label,
  value,
  checked,
  labelPlacement,
  labelSx,
  testId,
  ...rest
}) => {
  return (
    <StyledFormControlLabel
      value={value}
      control={
        <Checkbox
          disableRipple
          checked={checked}
          value={value}
          onChange={onChange}
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          inputProps={{ 'data-testid': `${testId}-checkbox` }}
          data-testid={testId}
          {...rest}
        />
      }
      sx={labelSx}
      label={label}
      labelPlacement={labelPlacement || 'top'}
    />
  );
};

export default FormCheckbox;
