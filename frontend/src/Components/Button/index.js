import React from 'react';
import MUIButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const CustomButton = styled(MUIButton)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#FFFFFF',
  height: '2.625rem',
  fontSize: '1.25rem',
  textTransform: 'none',
  backgroundColor: '#0071E3',
  padding: '0.5rem 1rem',
  borderRadius: '0.625rem',

  '&.full-width': {
    width: '100%',
  },

  '.title-text': {
    color: '#FFFFFF',
  },

  '&.black-btn': {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    border: '1px solid #707070',
  },

  '&.red-btn': {
    backgroundColor: '#DC3545',
    color: '#FFFFFF',
    border: '1px solid #DC3545',
  },

  '&.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.26)',
    boxShadow: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderColor: 'rgba(0, 0, 0, 0.12)',

    '.title-text': {
      color: 'rgba(0, 0, 0, 0.26)',
    },
  },

  '&.black-outlined-btn': {
    border: '1px solid #333333',
    color: '#333333',
    backgroundColor: '#FFFFFF',
    '.title-text': {
      color: '#333333',
    },
    '.Mui-disabled': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
      '.title-text': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
    },
  },

  '&> .MuiButton-startIcon': {
    maxHeight: '100%',

    svg: {
      height: '1.25rem',
      width: '1.25rem',
    },
  },
});

const Button = ({
  label = '',
  className = '',
  showIcon,
  loading,
  src,
  onClick,
  type,
  variant = 'contained',
  disabled,
  testId,
  ...props
}) => {
  return (
    <CustomButton
      className={`app-btn ${className}`}
      onClick={onClick}
      disableRipple
      disabled={disabled || loading}
      type={type}
      variant={variant}
      disableElevation
      data-testid={testId}
      {...props}
    >
      <span className="title-text" title={label}>
        {label}
      </span>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </CustomButton>
  );
};
export default Button;
