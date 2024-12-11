import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const filter = createFilterOptions({ matchFrom: 'any' });

const Input = styled(TextField)(({ theme }) => ({
  position: 'relative',

  '.MuiInputLabel-root': {
    transform: 'scale(1)',
    color: '#383C49',
    fontSize: '1rem',
    fontWeight: '400',
  },

  'label + .MuiInputBase-root': {
    marginTop: '1.6rem',
  },

  '& > .MuiInputBase-root.MuiOutlinedInput-root': {
    minHeight: '2.5rem',
    padding: '0',
    border: '1px solid',
    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1A2027',
    borderColor: theme.palette.mode === 'light' ? '#C9C9C9' : '#2D3843',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),

    '&.MuiOutlinedInput-root': {
      paddingRight: '2.5rem',
    },

    '&:focus-within': {
      borderColor: theme.palette.primary.main,
      borderRadius: '0.625rem',
    },

    '& .MuiInputBase-input': {
      borderRadius: '0.625rem',
      minHeight: '1.25rem',
      padding: '0.5rem 0.75rem',
      position: 'relative',
      backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1A2027',
      fontSize: '1rem',
      width: '100%',

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

    '& .MuiAutocomplete-endAdornment': {
      height: '100%',
      borderLeft: '1px solid #C9C9C9',
      top: '0',
      right: '0.25rem',
      width: 'fit-content',
      paddingLeft: '0.25rem',
      transform: 'none',
      display: 'flex',
      alignItems: 'center',

      '.MuiButtonBase-root': {
        height: '100%',
        maxHeight: '2.25rem',
      },
    },
  },

  '&.Mui-error .MuiInputBase-root': {
    borderColor: '#d32f2f',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: '0',
    padding: 0,
  },
}));

const FormAutoComplete = ({
  placeholder,
  multiple,
  label,
  required,
  options,
  onChange,
  value,
  limitTags = 2,
  freeSolo = false,
  inputProps = {},
  testId,
  error,
  ...restProps
}) => {
  const isOptionEqualToValue = (option, value) => {
    return typeof value === 'string'
      ? option?.value === value || option?.label === value
      : option?.value === value?.value || option?.label === value?.label;
  };

  const getOptionLabel = option => {
    if (option?.type === 'placeholder') return '';

    return typeof option === 'string' ? option : option.label;
  };

  const filterOptions = (options, params) => {
    const filtered = filter(options || [], params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options?.some(option => inputValue === option.label);
    if (freeSolo && inputValue !== '' && !isExisting) {
      /* filtered.push({
        inputValue,
        key: inputValue,
        label: inputValue
      })*/
    }

    return filtered;
  };

  const renderOption = (props, option) => {
    if (freeSolo) {
      if (typeof option === 'string') {
        return (
          <li {...props} data-testid={`${testId}-${option}`}>
            {option}
          </li>
        );
      }

      // Add "xxx" option created dynamically
      /*if (option?.inputValue) {
        return (
          <li {...props}>
            <strong>Add</strong>&nbsp;
            {option.inputValue}
          </li>
        )
      }*/
    }

    return option?.type === 'placeholder' ? (
      <li
        {...props}
        style={{ color: 'rgba(0, 0, 0, 0.87)', opacity: '0.47' }}
        data-testid={`${testId}-placeholder`}
      >
        {option?.label}
      </li>
    ) : (
      <li {...props} data-testid={`${testId}-${option?.value}`}>
        {option?.label}
      </li>
    );
  };

  const renderInput = params => {
    return (
      <Input
        {...params}
        error={Boolean(error)}
        inputProps={{
          ...(params?.inputProps || {}),
          'data-testid': `${testId}-input`,
          placeholder,
        }}
        InputLabelProps={{
          ...(params?.InputLabelProps || {}),
          shrink: true,
          variant: 'standard',
        }}
        placeholder={placeholder}
        helperText={error}
        FormHelperTextProps={{ 'data-testid': `${testId}-error` }}
        label={
          <>
            {label}
            {required ? <span style={{ color: '#d32f2f' }}>&nbsp;*</span> : ''}
          </>
        }
      />
    );
  };

  const handleOnChange = (e, value) => {
    onChange(e, value);
  };

  return (
    <Autocomplete
      multiple={multiple}
      limitTags={limitTags}
      freeSolo={freeSolo}
      options={options || []}
      renderInput={renderInput}
      onChange={handleOnChange}
      renderOption={renderOption}
      value={value}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={filterOptions}
      getOptionLabel={getOptionLabel}
      popupIcon={<ExpandMoreIcon />}
      clearOnBlur
      disableCloseOnSelect
      sx={{
        '& .MuiOutlinedInput-root': {
          padding: 0,
        },
      }}
      {...restProps}
    />
  );
};

export default FormAutoComplete;
