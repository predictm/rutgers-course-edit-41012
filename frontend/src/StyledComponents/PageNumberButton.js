import { styled } from '@mui/material/styles';

const PageNumberButton = styled('span')(props => ({
  width: 'auto',
  padding: '0.5rem',
  [props?.placement === 'top' ? 'paddingBottom' : 'paddingTop']: '0',
  lineHeight: props?.active ? '1' : '1.5',
  fontSize: props?.active ? '3.5rem' : '1.5rem',
  color: props?.active ? '#666666' : '#383C49',
  [props?.placement === 'top' ? 'borderBottom' : 'borderTop']:
    '1px solid #C9C9C9',
  textAlign: 'center',
  position: 'relative',
  cursor: props?.active ? 'default' : 'pointer',

  ':hover': {
    background: 'rgba(0, 0, 0, 0.04)',
  },

  '&:not(:last-of-type)::after': {
    borderRight: '1px solid #C9C9C9',
    height: '2rem',
    right: '0',
    [props?.placement === 'top' ? 'bottom' : 'top']: '0',
    position: 'absolute',
    content: '""',
  },
}));

export default PageNumberButton;
