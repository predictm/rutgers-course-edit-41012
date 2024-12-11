import { styled } from '@mui/material/styles';
import MuiTabs from '@mui/material/Tabs';

const StyledTabs = styled(MuiTabs)({
  minHeight: 0,
  borderBottom: '1px solid #333333',
  '.MuiTabs-indicator': {
    backgroundColor: '#333333',
    height: '0.3rem',
  },
});

export default StyledTabs;
