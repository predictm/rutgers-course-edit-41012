import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: '#333333',
    fontSize: '1.25rem',
    fontWeight: '600',
    background: 'transparent',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1.125rem',
    color: '#383C49',
    background: 'transparent',
  },
}));

export default StyledTableCell;
