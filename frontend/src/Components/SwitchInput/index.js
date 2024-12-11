import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const MaterialUISwitch = styled(Switch)(({ theme, width }) => ({
  padding: 0,
  height: '2rem',
  width: width + 'rem',
  display: 'flex',
  marginRight: 10,

  '&:active': {
    '& .MuiSwitch-thumb': {
      width: '1.625rem',
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: `translateX(${width - 2}rem)`,
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: '0.1rem',
    '&.Mui-checked': {
      transform: `translateX(${width - 2}rem)`,
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#2B7D3B ',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: '1.625rem',
    height: '1.625rem',
    borderRadius: '50%',
    border: '1px solid #333333',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    height: '100%',
    width: '100%',
    border: '1px solid #333333',
    borderRadius: '1rem',
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : '#A629FF',
    boxSizing: 'border-box',
  },
}));

const SwitchInput = React.forwardRef(
  (
    { label, handleChange, checked, controlSx, width, testId, ...rest },
    ref
  ) => {
    const sx = { marginLeft: 0, ...(controlSx ? controlSx : null) };
    return (
      <FormControlLabel
        control={
          <MaterialUISwitch
            ref={ref}
            checked={checked}
            onChange={handleChange}
            width={width || '4'}
            disableRipple
            data-testid={testId}
            {...rest}
          />
        }
        label={label}
        sx={sx}
      />
    );
  }
);

export default SwitchInput;
