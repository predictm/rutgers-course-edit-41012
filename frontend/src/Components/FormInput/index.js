import React,{useState} from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Visibility, VisibilityOff } from "@mui/icons-material";

import './styles.scss';

const Input = styled(InputBase)(({ theme }) => ({
  height: '2.25rem',
  'label + &': {
    marginTop: '1.725rem',
  },
  '& .MuiInputBase-input': {
    borderRadius: '0.625rem',
    minHeight: '1.25rem',
    padding: '0.5rem 0.75rem',
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#ffffffff' : '#1A2027',
    border: '1px solid',
    borderColor: theme.palette.mode === 'light' ? '#C9C9C9' : '#2D3843',
    fontSize: '1rem',
    width: '100%',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
    '&::placeholder': {
      color: '#707070',
    },
    '&.Mui-disabled': {
      backgroundColor: '#f5f5f5',
    },
  },
  '&.Mui-error .MuiInputBase-input': {
    borderColor: '#d32f2f',
  },
}));

const InputWithStartAdornment = styled(Input)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #C9C9C9',
  borderRadius: '0.625rem',
  height: 'fit-content',

  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },

  '& .MuiInputBase-input': {
    border: '0',

    '&:focus': {
      border: '0',
    },
  },
  '.MuiInputAdornment-root': {
    borderBottomLeftRadius: '0.625rem',
    borderTopLeftRadius: '0.625rem',
    borderRight: '1px solid #C9C9C9',
    width: '2.5rem',
    height: '2.5rem',
    maxHeight: '100%',
    fontStyle: 'italic',
    fontSize: '1rem',
    fontWeight: '300',
    margin: 0,
    justifyContent: 'center',
  },
}));

const InputWithEndAdornment = styled(Input)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #C9C9C9',
  borderRadius: '0.625rem',
  height: 'fit-content',

  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },

  '& .MuiInputBase-input': {
    border: '0',
    borderBottomRightRadius: '0',
    borderTopRightRadius: '0',

    '&:focus': {
      border: '0',
    },
  },
  '.MuiInputAdornment-root': {
    borderBottomRightRadius: '0.625rem',
    borderTopRightRadius: '0.625rem',
    borderLeft: '0',
    width: '2.5rem',
    height: '2.5rem',
    maxHeight: '100%',
    fontStyle: 'italic',
    fontSize: '1rem',
    fontWeight: '300',
    margin: 0,
    justifyContent: 'center',
  },
}));

const FormInput = React.forwardRef(
  ({ label, error, required, testId, showInput=true , ...rest }, ref) => {
    // const [showPassword, setShowPassword] = useState(false)
    
    return (
      <FormControl
        error={Boolean(error)}
        variant="standard"
        className="app-form-input"
        fullWidth
      >
        {label && (
          <InputLabel
            shrink
            sx={{
              color: '#383C49',
              fontSize: '1rem',
              fontWeight: '400',
              transform: 'scale(1)',
              marginBottom: '3px',
            }}
          >
            {label} 
            {required ? <span style={{ color: '#d32f2f' }}>&nbsp;*</span> : ''}
            {/* {type=="password"?
              showPassword?<VisibilityOff /> :<Visibility />
              : null} */}
          </InputLabel>
        )}

        {showInput && (rest?.startAdornment ? (
          <InputWithStartAdornment
            ref={ref}
            error={Boolean(error)}
            inputProps={{
              'data-testid': `${testId}-input`,
              autoComplete: 'off',
            }}
            {...rest}
            data-testid={testId}
          />
        ) : rest?.endAdornment ? (
          <InputWithEndAdornment
            ref={ref}
            error={Boolean(error)}
            inputProps={{
              'data-testid': `${testId}-input`,
              autoComplete: 'off',
            }}
            {...rest}
            data-testid={testId}
          />
        ) : (
          <Input
            ref={ref}
            error={Boolean(error)}
            inputProps={{
              'data-testid': `${testId}-input`,
              autoComplete: 'off',
            }}
            {...rest}
            data-testid={testId}
          />
        ))}
        <FormHelperText data-testid={`${testId}-error`}>{error}</FormHelperText>
      </FormControl>
    );
  }
);

export default FormInput;
