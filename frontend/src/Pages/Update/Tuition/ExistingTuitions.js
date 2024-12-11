import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, TableSortLabel, Typography } from '@mui/material';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchButton from 'StyledComponents/SearchButton';
import SearchSelect from 'StyledComponents/SearchSelect';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

import TablePagination from '@mui/material/TablePagination';
import useForm from 'hooks/Form';

import { ReactComponent as ArrowFilledIcon } from 'assets/icons/icon-arrow-fill.svg';
import { visuallyHidden } from '@mui/utils';
import TuitionTableRow from './TuitionsTableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePaginationActions from 'Components/TablePaginationActions';
import { ConvertToUSFormat } from 'utils/helper';

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

const columns = [
  {
    width: '40%',
    label: 'School Code/Name',
    sortFields: ['offering_unit_cd', 'offering_unit_name'],
    dataKey: 'offering_unit_cd',
    renderColumn: (rowData, rowProps) => {
      return (
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.125rem',
            color: '#333333',
            fontWeight: '400',
            fontStyle: 'italic',
            margin: '0',
          }}
          data-testid={`${rowProps.testId}-unit`}
        >
          {rowData?.offering_unit_cd} | {rowData?.offering_unit_name}
        </Typography>
      );
    },
  },
  {
    width: '20%',
    label: 'Term/Year',
    sortFields: ['term', 'year'],
    dataKey: 'term',
    renderColumn: (rowData, rowProps) => {
      return (
        <>
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
            data-testid={`${rowProps.testId}-term`}
          >
            {rowData?.term === 0 ? 'Winter' : 'Summer'} / {rowData?.year}
          </Typography>
        </>
      );
    },
  },
  {
    width: '20%',
    label: 'Tuition',
    dataKey: 'tuition_fees',
    sortFields: ['tuition_fees'],
    renderColumn: (rowData, rowProps) => {
      return (
        <>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
            }}
            data-testid={`${rowProps.testId}-tuition-fees`}
          >
            {ConvertToUSFormat(rowData?.tuition_fees)}
          </Typography>
        </>
      );
    },
  },
];

const ExistingTuitions = ({
  unitListData,
  termAndYearList,
  tuitionsListData,
  refetchTuitionList,
  handleChangePage,
  handleChangeRowsPerPage,
  setPayloadForTemplateFetch,
  setOrderForSorting,
  page,
  rowsPerPage,
}) => {
  const [orderBy, setOrderBy] = useState('offering_unit_cd');
  const [order, setOrder] = useState('asc');
  const [tuitionList, setTuitionList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const stateSchema = useMemo(() => {
    return {
      school: {
        value: '',
        error: '',
      },
      year: {
        value: '',
        error: '',
      },
    };
  }, []);

  const validationStateSchema = {
    school: {
      required: true,
    },
    year: {
      required: true,
    },
  };

  const { state, handleOnChange, setState } = useForm(
    stateSchema,
    validationStateSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  const handleDropdownChange = field => e => {
    handleOnChange(field, e?.target?.value);
  };

  const unitListOfferingUnitCD = unitListData?.data?.map(item => ({
    value: item?.offering_unit_cd,
    label: item?.offering_unit_cd,
  }));
  const unitList = unitListData?.data?.map(item => ({
    value: item?.offering_unit,
    label: item?.offering_unit_cd,
  }));

  const handleSort = (event, property, sortFields) => {
    event?.stopPropagation();

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setOrderForSorting(
      sortFields
        .map(sortField => {
          return isAsc ? '-' + sortField : sortField;
        })
        .join(',')
    );
  };

  const createSortHandler = (field, sortFields) => event => {
    handleSort(event, field, sortFields);
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
              sx={{
                width: column.width,
                backgroundColor: 'background.paper',
              }}
            >
              <TableSortLabel
                active={active}
                direction={active ? order : 'asc'}
                onClick={createSortHandler(column.dataKey, column.sortFields)}
                IconComponent={
                  column.dataKey !== 'action' ? ArrowFilledIcon : null
                }
                data-testid={`existing-appointments-sort-${column.dataKey}`}
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
        <StyledTableCell
          variant="head"
          align="center"
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          Action
        </StyledTableCell>
      </StyledTableRow>
    );
  };

  const handleSearch = async () => {
    const [year, term] = state?.year?.value.split('--');
    const searchFilter = {
      school: state?.school?.value,
      year: year,
      term: term,
    };
    setPayloadForTemplateFetch(searchFilter);
  };

  useEffect(() => {
    setTuitionList(tuitionsListData?.data?.results);

    if (tuitionsListData?.data) {
      setTotalRows(tuitionsListData?.data?.count);
    }
  }, [tuitionsListData]);

  return (
    <Box sx={{ padding: '2rem 0' }}>
      <Typography
        variant="h4"
        paragraph
        sx={{
          fontSize: '2rem',
          fontWeight: '400',
          color: '#383C49',
        }}
      >
        Existing Tuition:
      </Typography>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '2rem',
          padding: '2rem 0',
          position: 'relative',
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            padding: '0 2rem 2rem',
          }}
        >
          <Grid item xs={3}>
            <SearchSelect
              label="School"
              options={unitListOfferingUnitCD}
              placeholder="-- Select --"
              name="school"
              value={state?.school?.value || ''}
              onChange={handleDropdownChange('school')}
              testId={`existing-appointments-school`}
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item xs={4}>
                <SearchSelect
                  label="Year"
                  options={termAndYearList}
                  placeholder="-- Select --"
                  name="year"
                  value={state?.year?.value || ''}
                  onChange={handleDropdownChange('year')}
                  testId={`existing-appointments-year-term`}
                />
              </Grid>
              <Grid item ml={3}>
                <SearchButton
                  startIcon={<SearchOutlinedIcon />}
                  className="black-btn"
                  sx={{
                    '&.black-btn:hover': {
                      backgroundColor: '#0071E3',
                      border: 'none',
                    },
                  }}
                  onClick={handleSearch}
                  testId={`existing-appointments-search-btn`}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            borderRadius: '1rem',
            padding: '0 1rem',
            marginTop: '2rem',
            position: 'relative',
          }}
        >
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={totalRows || 0}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelDisplayedRows={() => null}
            backIconButtonProps={{
              testId: 'existing-appointments-pagination-top',
              placement: 'top',
            }}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '1rem',
            padding: '0rem 1rem 2rem',
            margin: '0 2rem',
            position: 'relative',
          }}
        >
          <TableContainer sx={{ width: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>{fixedHeaderContent()}</TableHead>
              <TableBody>
                {tuitionList?.map((row, index) => (
                  <TuitionTableRow
                    key={`tuitions-row-${row?.id}`}
                    columns={columns}
                    tuitionData={row}
                    unitList={unitList}
                    termAndYearList={termAndYearList}
                    refetchTuitionList={refetchTuitionList}
                    testId={`existing-appointments-${index}`}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            borderRadius: '1rem',
            padding: '0 1rem',
            position: 'relative',
          }}
        >
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={tuitionsListData?.data?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelDisplayedRows={() => null}
            backIconButtonProps={{
              testId: 'existing-appointments-pagination-bottom',
              placement: 'bottom',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ExistingTuitions;
