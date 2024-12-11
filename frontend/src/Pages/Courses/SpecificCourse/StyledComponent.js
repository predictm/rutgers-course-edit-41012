import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

export const StyledGridContainer = styled(Grid)({
  margin: '1rem 0',
  background: 'white',
  height: 'auto',
  width: '100%',
  padding: '0',
});

export const StyledGridItem = styled(Grid)({
  padding: '0.75rem 0.5rem',
  alignItems: 'center',
  position: 'relative',
  display: 'flex',

  '&:not(:first-child):not(:last-child)': {
    '::before': {
      content: '""',
      position: 'absolute',
      backgroundColor: '#333333',
      borderRadius: '8px',
      height: '4px',
      width: '4px',
      left: '0',
    },
  },
});
