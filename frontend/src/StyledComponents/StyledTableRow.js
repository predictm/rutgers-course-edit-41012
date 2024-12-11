import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ open }) => ({
  backgroundColor: 'transparent',
  td: {
    borderBottom: open ? 0 : '2px solid white',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default StyledTableRow;
