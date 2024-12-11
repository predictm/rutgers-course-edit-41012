import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';

import SearchInput from 'StyledComponents/SearchInput';
import SearchButton from 'StyledComponents/SearchButton';
import SearchSelect from 'StyledComponents/SearchSelect';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import { allPropHasValue, sortArray } from 'utils/helper';
import { useAccountingQueries, useCoursesQueries } from 'services/queries';
import TablePaginationActions from 'Components/TablePaginationActions';
import AccountsTableRow from './AccountsTableRow';

const columns = [
  {
    width: '20%',
    label: 'School Code / Name',
    dataKey: 'offering_unit',
    renderColumn: (rowData, rowProps) => {
      const offeringUnit = rowData?.offering_unit_info;
      return (
        <>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.25rem',
              color: '#333333',
              fontWeight: '400',
              margin: '0',
            }}
            data-testid={`${rowProps?.testId}-offering_unit_cd`}
          >
            {offeringUnit?.offering_unit_cd}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
            }}
            data-testid={`${rowProps?.testId}-offering_unit_descr`}
          >
            {offeringUnit?.offering_unit_descr}
          </Typography>
        </>
      );
    },
  },
  {
    width: '20%',
    label: 'Department',
    dataKey: 'subject',
    renderColumn: (rowData, rowProps) => {
      return (
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: '#333333',
            fontWeight: '400',
            margin: '0',
          }}
          data-testid={`${rowProps?.testId}-subject`}
        >
          {rowData?.department_info?.subj_descr || '--'}
        </Typography>
      );
    },
  },
  {
    width: '35%',
    label: 'Account Code',
    dataKey: 'account_code',
    renderColumn: (rowData, rowProps) => {
      return (
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: '#333333',
            fontWeight: '400',
            margin: '0',
            wordBreak: 'break-all',
          }}
          data-testid={`${rowProps?.testId}-account-code`}
        >
          {rowData?.gl_string}
        </Typography>
      );
    },
  },
];

const ExistingAccounting = ({ refetchAccounts }) => {
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [payload, setPayload] = useState({});
  const [searchFilter, setSearchFilter] = useState({
    unit: '',
    subject: '',
    account_code: '',
  });

  const { data: accountingData, refetch } =
    useAccountingQueries.useGetAccountsQuery({
      payload: { ...payload, limit: rowsPerPage, offset: rowsPerPage * page },
      enabled: true,
    });

  const accountingList = accountingData?.data?.results;

  useEffect(() => {
    refetch?.();
  }, [refetch, payload, refetchAccounts]);

  useEffect(() => {
    if (accountingData?.data) {
      setTotalRows(accountingData?.data?.count);
    }
  }, [accountingData]);

  const { data: unitListData } = useCoursesQueries.useUnitListQuery({
    enabled: true,
  });

  const unitList =
    unitListData?.data?.map(item => ({
      value: item?.offering_unit_cd,
      label: item?.offering_unit_cd,
    })) || [];

  const subjectListPayload = { unit: searchFilter?.unit };
  const subjectListQueryEnabled = Boolean(allPropHasValue(subjectListPayload));
  const { data: subjectListData } = useCoursesQueries.useSubjectListQuery({
    payload: subjectListPayload,
    enabled: subjectListQueryEnabled,
  });

  const subjectList =
    subjectListData?.data?.map(item => ({
      value: item?.subj_cd,
      label: item?.subj_display,
    })) || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOnChange = e => {
    const { name, value } = e?.target;

    setSearchFilter({
      ...searchFilter,
      [name]: value,
      ...(name === 'unit' ? { subject: '' } : {}),
    });
  };

  const handleSearch = () => {
    setPayload(searchFilter);
  };

  const fixedHeaderContent = () => {
    return (
      <StyledTableRow>
        {columns.map(column => {
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
              {column.label}
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
        Existing Accounting:
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
          alignItems="center"
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            padding: '0 2rem 2rem',
          }}
        >
          <Grid item xs={3.5}>
            <SearchSelect
              label="Unit"
              options={unitList}
              placeholder="-- Select --"
              name="unit"
              value={searchFilter?.unit}
              onChange={handleOnChange}
              testId="account-list-search-unit"
            />
          </Grid>
          <Grid item xs={3.5}>
            <SearchSelect
              label="Subject"
              options={subjectList}
              placeholder="-- Select --"
              name="subject"
              value={searchFilter?.subject}
              onChange={handleOnChange}
              testId="account-list-search-subject"
            />
          </Grid>
          <Grid item xs={4}>
            <SearchInput
              label="Account Code"
              placeholder="XXX-XXXX-XXXX-XXXX-XXX-XXXX-XXXXX"
              name="account_code"
              value={searchFilter?.account_code}
              onChange={handleOnChange}
              testId="account-list-search-account-code"
            />
          </Grid>
          <Grid item xs="auto">
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
              testId="account-list-search-btn"
            />
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
            component="div"
            rowsPerPageOptions={[rowsPerPage]}
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelDisplayedRows={() => null}
            backIconButtonProps={{
              testId: 'accounting-list-pagination-top',
              placement: 'top',
            }}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '1rem',
            padding: '2rem 1rem',
            margin: '0 2rem',
            position: 'relative',
          }}
        >
          <TableContainer sx={{ width: '100%' }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{ tableLayout: 'fixed' }}
            >
              <TableHead>{fixedHeaderContent()}</TableHead>
              <TableBody>
                {sortArray(accountingList, 'id', -1)?.map((row, index) => (
                  <AccountsTableRow
                    row={row}
                    key={`${row.id}-${index}`}
                    columns={columns}
                    refetchAccounts={refetch}
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
            component="div"
            rowsPerPageOptions={[rowsPerPage]}
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelDisplayedRows={() => null}
            backIconButtonProps={{
              testId: 'accounting-list-pagination-bottom',
              placement: 'bottom',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ExistingAccounting;
