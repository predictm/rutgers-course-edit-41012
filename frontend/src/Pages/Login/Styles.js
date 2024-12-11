import { styled } from '@mui/material/styles';

import FormInput from 'Components/FormInput';
import { ReactComponent as RightImage } from 'assets/icons/logo-right-side.svg';
import Button from 'Components/Button';


export const RightImageSVG = styled(RightImage)({
  width: '55vw',
  height: '70vh',
});

export const NetIdFormInput = styled(FormInput)({
  backgroundColor: 'white',
  border: 'none',
  color: 'red',
  padding: '0rem',
  borderRadius: '1.875rem',
  width: '100%',
  '& .MuiInputBase-input': {
    borderRadius: '1.875rem 0rem 0rem 1.875rem',
    backgroundColor: 'white',
    color: '#CC0033',
    cursor:'pointer',
    fontSize: '1.5rem',
    height: '3rem',
    width: '50%',
    paddingLeft: '2rem',
  },
  '& .MuiInputAdornment-root': {
    border: 'none',
    width: '50%',
    height: '3rem',
    position: 'relative',

    '::before': {
      content: '""',
      width: '1rem',
      height: '1rem',
      backgroundColor: 'white',
      position: 'absolute',
      cursor:'pointer',
      zIndex: '2',
      left: '0',
      top: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)',
    },
  },
});

export const LoginButton = styled(Button)({
  width: '100%',
  height: '3.75rem',
  border: 'none',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  backgroundColor: '#CC0033',
  borderRadius: '0rem 1.875rem 1.875rem 0rem',
  marginRight: '0.1rem',
  '&:hover': {
    backgroundColor: '#333333',
  },
});
