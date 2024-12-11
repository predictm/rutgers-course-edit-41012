import * as React from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const BpIcon = styled('span')(({ theme, radioSize, radioColor }) => ({
  borderRadius: '50%',
  width: radioSize,
  height: radioSize,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : radioColor,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : radioColor,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ radioSize, radioColor }) => ({
  backgroundColor: radioColor,
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: radioSize,
    height: radioSize,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: radioColor,
  },
}));

const FormRadio = ({
  label,
  value,
  checked,
  labelSx,
  labelPlacement,
  radioSize = '2.375rem',
  radioColor = '',
  testId,
  ...rest
}) => {
  return (
    <FormControlLabel
      value={value}
      control={
        <Radio
          disableRipple
          color="default"
          checkedIcon={
            <BpCheckedIcon radioSize={radioSize} radioColor={radioColor} />
          }
          icon={<BpIcon radioSize={radioSize} />}
          inputProps={{ 'data-testid': `${testId}-radio` }}
          data-testid={testId}
          {...rest}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      sx={labelSx}
    />
  );
};

export default FormRadio;
