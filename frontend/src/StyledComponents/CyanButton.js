import { styled } from '@mui/material/styles';

import Button from 'Components/Button';

const CyanButton = styled(Button)({
  width: '100%',
  minWidth: 0,
  backgroundColor: '#75E3FF ',
  border: '1px solid #333333',
  fontWeight: '500',
  color: '#333333',
  fontSize: '1.25rem',

  '.title-text': {
    color: '#333333',
  },

  '&:hover': {
    backgroundColor: '#75E3FF',
    fontWeight: '500',

    '.title-text': {
      color: '#333333',
    },
  },

  span: {
    margin: 0,
  },
});

export default CyanButton;
