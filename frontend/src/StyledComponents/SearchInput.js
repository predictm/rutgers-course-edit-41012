import { styled } from '@mui/material/styles';

import FormInput from 'Components/FormInput';

const SearchInput = styled(FormInput)({
  '& .MuiInputBase-input': {
    borderRadius: '6rem',
  },
});

export default SearchInput;
