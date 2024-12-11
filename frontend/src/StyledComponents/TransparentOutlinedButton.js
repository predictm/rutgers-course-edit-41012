import { styled } from '@mui/material/styles';

import Button from 'Components/Button';

const TransparentOutlinedButton = styled(Button)({
  width: 'auto',
  minWidth: 0,

  '&.black-outlined-btn': {
    backgroundColor: 'transparent',
  },

  '&:hover': {
    backgroundColor: '#707070',
    color: '#FFFFFF',
  },

  span: {
    margin: 0,
  },
});

export default TransparentOutlinedButton;
