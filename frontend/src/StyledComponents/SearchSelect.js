import { styled } from '@mui/material/styles';

import FormSelect from 'Components/FormSelect';

const SearchSelect = styled(FormSelect)({
  '& .MuiInputBase-input': {
    borderRadius: '100px',

    '&:focus': {
      borderRadius: '100px',
    },
  },
});

export default SearchSelect;
