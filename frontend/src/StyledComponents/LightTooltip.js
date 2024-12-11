import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, placement }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    transform: 'unset !important',
    height: 'max-content !important',
    [placement === 'top-start' ? 'bottom' : 'top']: '-1px !important',
    color: 'transparent',
    overflow: 'visible',

    '&::before': {
      [placement === 'top-start' ? 'bottom' : 'top']: '0',
      left:
        placement === 'right-start'
          ? '100%'
          : placement === 'bottom-start' || placement === 'top-start'
          ? '-1px'
          : '0',
      height: '0.5rem',
      backgroundColor: 'white',
      position: 'relative',
      transform:
        placement === 'right-start'
          ? 'skewX(45deg)'
          : placement === 'left-start'
          ? 'skewX(-45deg)'
          : placement === 'bottom-start'
          ? 'skewY(35deg)'
          : 'skewY(-35deg) translate(0, -100%)',
      borderColor: '#c9c9c9',
      borderStyle: 'solid',
      borderWidth:
        placement === 'right-start'
          ? '1px 0 0 1px'
          : placement === 'left-start'
          ? '1px 1px 0 0'
          : placement === 'bottom-start'
          ? '1px 0 0 1px'
          : '0 0 1px 1px',
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: '#383c49',
    boxShadow: 'none',
    border: '1px solid #c9c9c9',
    fontSize: '0.75rem',
    [placement === 'right-start' || placement === 'bottom-start'
      ? 'borderTopLeftRadius'
      : placement === 'top-start'
      ? 'borderBottomLeftRadius'
      : 'borderTopRightRadius']: '0',
    padding: '1rem',
    fontWeight: '600',
    textAlign: 'center',
    [placement === 'top-start' || placement === 'bottom-start'
      ? 'marginLeft'
      : 'marginTop']: '0.5rem',
  },
}));

export default LightTooltip;
