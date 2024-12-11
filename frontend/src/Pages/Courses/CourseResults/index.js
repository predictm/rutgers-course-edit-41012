import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getComparator, sortArray } from 'utils/helper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { ReactComponent as ArrowFilledIcon } from 'assets/icons/icon-arrow-fill.svg';

const columns = [
  {
    width: '20%',
    label: 'Courses #',
    dataKey: 'course_number',
    renderColumn: rowData => {
      return `${rowData.offering_unit_cd} : ${rowData.subj_cd} : ${rowData.course_no}`;
    },
  },
  {
    width: '30%',
    label: 'Course Title / Sub-Title',
    dataKey: 'course_title',
    renderColumn: rowData => {
      return (
        <>
          {rowData.course_title}
          <br />
          <Typography
            variant="subtitle"
            paragraph
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            {rowData.subtitle}
          </Typography>
        </>
      );
    },
  },
  {
    width: '50%',
    label: (
      <span style={{ display: 'inline-block', width: '90%' }}>
        Sections w Instructor(s) /
        <br />
        Sections Per Course
      </span>
    ),
    dataKey: 'section_course_vs_instructors',
    renderColumn: rowData => {
      return `${rowData.section_with_instructors} / ${rowData.section_per_course}`;
    },
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: '#333333',
    fontSize: '1.25rem',
    fontWeight: '600',
    background: 'transparent',
    verticalAlign: 'top',

    '.MuiTableSortLabel-root': {
      alignItems: 'flex-start',

      '.MuiTableSortLabel-icon': {
        height: '0.75rem',
        width: '1.25rem',
        opacity: 1,
        marginLeft: '1rem',
        marginTop: '0.5rem',

        path: {
          fill: '#666666',
        },
        polygon: {
          fill: 'none',
        },
      },
      '&.Mui-active': {
        '.MuiTableSortLabel-icon': {
          opacity: 1,

          path: {
            fill: '#333333',
          },
          polygon: {
            fill: '#333333',
          },
        },
      },
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1.125rem',
    color: '#383C49',
    background: 'transparent',
    verticalAlign: 'top',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'transparent',
  td: {
    borderBottom: '2px solid white',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CoursesResult = ({ resultData, onCourseRowClick }) => {
  const [tableRows, setTableRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('course_number');

  useEffect(() => {
    setTableRows(
      resultData?.map(rowData => {
        return {
          ...rowData,
          section_course_vs_instructors: `${rowData.section_per_course || 0}${
            rowData.section_with_instructors || 0
          }`,
          course_number: `${rowData.offering_unit_cd || 0}${
            rowData.subj_cd || 0
          }${rowData.course_no || 0}`,
        };
      }) || []
    );
  }, [resultData]);

  const handleSort = (event, property) => {
    event?.stopPropagation();

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = field => event => {
    handleSort(event, field);
  };

  const handleCourseSelection = courseData => event => {
    event?.stopPropagation();
    onCourseRowClick?.(courseData);
  };

  const fixedHeaderContent = () => {
    return (
      <StyledTableRow>
        {columns.map(column => {
          const active = orderBy === column.dataKey;

          return (
            <StyledTableCell
              key={column.dataKey}
              variant="head"
              align="left"
              style={{ width: column.width }}
              sx={{
                backgroundColor: 'background.paper',
              }}
            >
              <TableSortLabel
                active={active}
                direction={active ? order : 'asc'}
                onClick={createSortHandler(column.dataKey)}
                IconComponent={ArrowFilledIcon}
                data-testid={`sortby-${column.dataKey}`}
              >
                {column.label}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledTableCell>
          );
        })}
        <StyledTableCell />
      </StyledTableRow>
    );
  };

  const rowContent = (row, index) => {
    return (
      <StyledTableRow
        hover
        key={`${row.display_course_number}-${index}`}
        onClick={handleCourseSelection(row)}
        data-testid={`Coursers-list-row${index}`}
      >
        {columns.map(column => (
          <StyledTableCell key={column.dataKey} align="left">
            {column.renderColumn
              ? column.renderColumn(row)
              : row[column.dataKey]}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    );
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        paragraph
        sx={{
          fontWeight: '600',
          color: '#333333',
          fontSize: '1.5rem',
        }}
      >
        Courses
      </Typography>
      <Box
        style={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '1rem',
        }}
      >
        <TableContainer sx={{ width: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>{fixedHeaderContent()}</TableHead>
            <TableBody>
              {sortArray(tableRows, orderBy, getComparator(order)).map(
                rowContent
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CoursesResult;
