import React from 'react';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Input = styled(InputBase)(({ theme }) => ({
  height: '2.325rem',
  position: 'relative',

  'label + &': {
    marginTop: '1.725rem',
  },
  '& .MuiInputBase-input': {
    borderRadius: '0.625rem',
    minHeight: '1.25rem',
    padding: '0.5rem 0.75rem',
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1A2027',
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
      borderRadius: '0.625rem',
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
  '& .expand-icon-container': {
    height: '100%',
    borderLeft: '1px solid #C9C9C9',
    top: '0',
    width: 'fit-content',
    paddingLeft: '0.25rem',
    transform: 'none',

    '.MuiSelect-icon': {
      position: 'relative',
      right: 0,
    },
  },
}));

const FormSelect = React.forwardRef(
  (
    {
      label,
      required,
      options,
      error,
      placeholder,
      defaultValue,
      testId,
      ...rest
    },
    ref
  ) => {
    const menuProps = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      PaperProps: {
        style: {
          maxHeight: '150px',
        },
      },
    };

    const iconComponent = props => {
      return (
        <div
          className={`${props.className} expand-icon-container`}
          data-testid={`${testId}-select-icon`}
        >
          <ExpandMoreIcon className={props.className} />
        </div>
      );
    };

    return (
      <FormControl error={Boolean(error)} fullWidth>
        {label && (
          <InputLabel
            shrink
            variant="standard"
            sx={{
              transform: 'scale(1)',
              marginBottom: '3px',
              color: '#383C49',
              fontSize: '1rem',
              fontWeight: '400',
            }}
          >
            {label}
            {required ? <span style={{ color: '#d32f2f' }}>&nbsp;*</span> : ''}
          </InputLabel>
        )}
        <Select
          ref={ref}
          label={label}
          input={
            <Input
              error={Boolean(error)}
              inputProps={{ 'data-testid': `${testId}-input` }}
            />
          }
          IconComponent={iconComponent}
          MenuProps={menuProps}
          defaultValue={defaultValue}
          renderValue={selected => {
            if (selected?.length === 0) {
              return (
                <em style={{ color: 'rgba(0, 0, 0, 0.87)', opacity: '0.47' }}>
                  {placeholder}
                </em>
              );
            }

            return options?.find(
              option => option?.value?.toString() === selected?.toString()
            )?.label;
          }}
          data-testid={testId}
          displayEmpty
          {...rest}
        >
          {placeholder && (
            <MenuItem
              value=""
              sx={{ color: 'rgba(0, 0, 0, 0.87)', opacity: '0.47' }}
              data-testid={`${testId}-placeholder`}
            >
              {placeholder}
            </MenuItem>
          )}

          {options?.map(item => (
            <MenuItem
              key={`${item?.value}`}
              value={item?.value}
              disabled={item?.disabled}
              data-testid={`${testId}-item-${item?.value}`}
            >
              {item?.label}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText data-testid={`${testId}-error`}>{error}</FormHelperText>
      </FormControl>
    );
  }
);

export default FormSelect;
