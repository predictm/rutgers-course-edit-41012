import { styled } from '@mui/material/styles';

import FormInput from 'Components/FormInput';

const SearchInputWithButton = styled(FormInput)({
  borderRadius: '100px',

  '& .MuiInputBase-input': {
    borderRadius: '100px',
    borderRight: '0',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,

    '&:focus': {
      borderRadius: '100px',
      borderRight: '0',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  '.MuiInputAdornment-root': {
    margin: 0,
  },
});

export default SearchInputWithButton;
