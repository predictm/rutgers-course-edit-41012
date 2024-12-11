import { styled } from '@mui/material/styles';

import Button from 'Components/Button';

const SearchButton = styled(Button)({
  width: 'auto',
  borderRadius: '6rem',
  marginTop: '1.25rem',
  span: {
    margin: 0,
  },
  '&:hover': {
    backgroundColor: '#0071E3',
  },
});

export default SearchButton;
