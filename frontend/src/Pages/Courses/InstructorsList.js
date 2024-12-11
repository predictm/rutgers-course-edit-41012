import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CyanButton from 'StyledComponents/CyanButton';

export default function InstructorsList({
  searchInstructorsData,
  onAssignInstructor,
}) {
  const handleAssignClick = instructorId => () => {
    onAssignInstructor?.(instructorId);
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {searchInstructorsData?.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                borderBottom: '2px solid white',
              }}
            >
              <TableCell
                align="left"
                sx={{
                  borderBottom: 'none',
                  fontSize: '1.5rem',
                  color: '#383C49',
                }}
                data-testid={`appoint-instructor-modal-${index}-name`}
              >
                {row.first_name + ' ' + (row.middle_name ? row.middle_name + ' ' : '')  + row.last_name}
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  borderBottom: 'none',
                  fontSize: '1.5rem',
                  color: '#383C49',
                }}
                data-testid={`appoint-instructor-modal-${index}-phone`}
              >
                {row.primary_phone}
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 'none' }}>
                <CyanButton
                  label="Assign"
                  sx={{
                    maxWidth: '12rem',
                    float: 'right',
                  }}
                  onClick={handleAssignClick(row.id)}
                  testId={`appoint-instructor-modal-assign-btn-${index}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
