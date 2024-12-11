import React from 'react';
import { styled } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker as MUIDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { InputLabel } from '@mui/material';

const StyledDateTimePicker = styled(props =>
  props.includeTime ? (
    <MUIDateTimePicker {...props} />
  ) : (
    <MUIDatePicker {...props} />
  )
)({
  width: '100%',
  margin: 0,
  backgroundColor: 'transparent',
  '& .MuiInputBase-root': {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.625rem',
  },

  '& .MuiInputBase-input': {
    minHeight: '1.25rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.625rem',
    fontSize: '1rem',
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '0.625rem',
    },
    '&:hover fieldset': {
      outline: 'none',
      borderColor: '#C9C9C9',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #1976d2',
    },
  },
});

const DatePicker = ({
  value,
  onChange,
  placeholder,
  label,
  labelSx = {},
  required,
  views,
  error,
  testId,
  suppressError,
  timezone = 'system',
  ...rest
}) => {
  const includeTime = views?.some(
    view => view === 'hours' || view === 'minutes' || view === 'seconds'
  );
  const viewRenderers = includeTime
    ? {
        hours: renderTimeViewClock,
        minutes: renderTimeViewClock,
        seconds: renderTimeViewClock,
      }
    : undefined;

  return (
    <>
      {label && (
        <InputLabel
          shrink
          sx={{
            color: '#383C49',
            fontSize: '1rem',
            fontWeight: '400',
            transform: 'scale(1)',
            marginBottom: '4px',
            ...(labelSx || {}),
          }}
        >
          {label}
          {required ? <span style={{ color: '#d32f2f' }}>&nbsp;*</span> : ''}
        </InputLabel>
      )}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StyledDateTimePicker
          value={value}
          views={views || ['year', 'month', 'day']}
          includeTime={includeTime}
          viewRenderers={viewRenderers}
          onChange={onChange}
          timezone={timezone}
          slotProps={{
            field: { clearable: true },
            textField: {
              placeholder: placeholder,
              error: Boolean(error),
              helperText: suppressError ? '' : error || ' ',
              'data-testid': `${testId}-calender-input-field`,
            },
            openPickerButton: {
              'data-testid': `${testId}-calender-input-icon`,
            },
          }}
          data-testid={`${testId}-calender-input`}
          {...rest}
        />
      </LocalizationProvider>
    </>
  );
};

export default DatePicker;
