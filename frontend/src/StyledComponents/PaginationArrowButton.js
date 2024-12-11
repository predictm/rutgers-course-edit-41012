import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

const PaginationArrowButton = styled(IconButton)(
  ({ rotation, iconHeight, iconWidth }) => ({
    height: '2.5rem',
    width: '1.5rem',
    padding: '0.25rem',
    borderRadius: '4px',

    '&:hover': {
      svg: { 'path.pagination-arrow': { fill: '#75E3FF' } },
    },

    svg: {
      width: iconWidth,
      height: iconHeight,
      transform: `rotate(${rotation})`,
      '&:hover': { 'path.pagination-arrow': { fill: '#75E3FF' } },
    },
  })
);

export default PaginationArrowButton;
