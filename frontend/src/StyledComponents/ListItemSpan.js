import { styled } from '@mui/material/styles';

const ListItemSpan = styled('span')(({ backgroundColor = '#DC3545' }) => ({
  color: '#383C49',
  fontSize: '1.125rem',
  fontWeight: '400',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  paddingLeft: '2rem',

  '&::before': {
    content: '""',
    position: 'absolute',
    backgroundColor,
    borderRadius: '50%',
    height: '1rem',
    width: '1rem',
    left: '0',
    display: 'inline-block',
  },
}));

export default ListItemSpan;
