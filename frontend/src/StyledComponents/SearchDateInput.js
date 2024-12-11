import { styled } from '@mui/material/styles';

import DatePicker from 'Components/DatePicker';

const SearchDateInput = styled(DatePicker)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '6rem',
    },
  },
});

export default SearchDateInput;
