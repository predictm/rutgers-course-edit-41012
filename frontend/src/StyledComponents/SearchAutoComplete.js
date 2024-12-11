import { styled } from '@mui/material/styles';

import FormAutoComplete from 'Components/FormAutoComplete';

const SearchAutoComplete = styled(FormAutoComplete)({
  '& .MuiInputBase-root': {
    borderRadius: '6rem',

    '&:focus-within': {
      borderRadius: '6rem !important',
    },

    '& .MuiInputBase-input': {
      borderRadius: '6rem !important',

      '&:focus': {
        borderRadius: '6rem !important',
      },
    },
  },
});

export default SearchAutoComplete;
