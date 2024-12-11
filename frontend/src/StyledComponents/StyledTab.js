import { styled } from '@mui/material/styles';
import MuiTab from '@mui/material/Tab';

const StyledTab = styled(MuiTab)({
  padding: '0.5rem 0.5rem 1rem',
  fontSize: '1.5rem',
  fontWeight: '600',
  minHeight: 0,
  textTransform: 'none',
  color: '#707070',

  '&.Mui-selected': {
    color: '#333333',
  },
});

export default StyledTab;
