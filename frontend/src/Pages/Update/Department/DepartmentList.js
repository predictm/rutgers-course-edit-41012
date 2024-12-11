import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';

import SearchInput from 'StyledComponents/SearchInput';
import SearchButton from 'StyledComponents/SearchButton';
import SearchSelect from 'StyledComponents/SearchSelect';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import DepartmentTableRow from './DepartmentTableRow';
import { allPropHasValue, formatDateTime, sortArray } from 'utils/helper';
import { useDepartmentQueries, useCoursesQueries } from 'services/queries';
import CyanButton from 'StyledComponents/CyanButton';
import TablePaginationActions from 'Components/TablePaginationActions';
import DepartmentEditModal from './DepartmentEditModal';

const columns = [
  {
    width: '20%',
    label: 'Department',
    dataKey: 'name',
    align: 'left',
    renderColumn: rowData => {
      return (
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            color: '#333333',
            fontWeight: '400',
            fontStyle: 'italic',
            margin: '0',
          }}
        >
          {rowData?.department?.subj_descr}
        </Typography>
      );
    },
  },
  {
    width: '20%',
    label: 'Phone / Website',
    dataKey: 'subject',
    align: 'left',
    renderColumn: rowData => {
      const department = rowData?.department;
      return (
        <>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
            }}
          >
            P: {department?.phone || '--'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
              wordBreak: 'break-all',
            }}
          >
            W: {department?.url || '--'}
          </Typography>
        </>
      );
    },
  },
  {
    width: '20%',
    label: 'Lvl / Sub. / Sch.#',
    dataKey: 'appointment_status_detail',
    align: 'left',
    renderColumn: rowData => {
      const offeringUnit = rowData?.offering_unit;
      const department = rowData?.department;
      return (
        <>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
            }}
          >
            Lvl: {offeringUnit?.offering_unit_level || '--'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
            }}
          >
            Sub. Code: {department?.subj_cd || '--'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '600',
              fontStyle: 'italic',
              margin: '0',
            }}
          >
            Sch.#: {offeringUnit?.offering_unit_cd || '--'}
          </Typography>
        </>
      );
    },
  },
  {
    width: '30%',
    label: 'Action / Last update',
    dataKey: 'last_update',
    align: 'right',
    renderColumn: (rowData, rowProps) => {
      const department = rowData?.department;
      const modifiedDate = department?.modified_at || department?.created_at;
      return (
        <Stack spacing={1}>
          <CyanButton
            label="Edit / View"
            sx={{
              height: 'auto',
              minHeight: '2.625rem',
              width: 'fit-content',
              alignSelf: 'flex-end',
            }}
            onClick={rowProps?.onEditClick}
            testId={`${rowProps?.testId}-edit-view`}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
              textAlign: 'right',
              width: '100%',
            }}
            data-testid={`${rowProps?.testId}-last-modified`}
          >
            {department?.modified_by?.name || '--'} @{' '}
            {formatDateTime(modifiedDate, 'MM/DD/YYYY - hh:mm a')}
          </Typography>
        </Stack>
      );
    },
  },
];

const DepartmentList = ({ refetchUsers }) => {
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [departmentInfo, setDepartmentInfo] = useState({});
  const [payload, setPayload] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchFilter, setSearchFilter] = useState({
    subject_code: '',
    subject: '',
    name: '',
    unit: '',
  });

  const { data: departmentListData, refetch } =
    useDepartmentQueries.useAllDepartmentQuery({
      payload: {
        ...payload,
        limit: rowsPerPage,
        offset: rowsPerPage * page,
      },
      enabled: false,
    });

  useEffect(() => {
    refetch?.();
  }, [refetch, payload, page, rowsPerPage, refetchUsers]);

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

  const departments = departmentListData?.data?.results;

  useEffect(() => {
    if (departmentListData?.data) {
      setTotalRows(departmentListData?.data?.count);
    }
  }, [departmentListData]);

  const fixedHeaderContent = () => {
    return (
      <StyledTableRow>
        {columns.map(column => {
          return (
            <StyledTableCell
              key={column.dataKey}
              variant="head"
              align={column?.align || 'left'}
              sx={{
                width: column.width,
                backgroundColor: 'background.paper',
              }}
            >
              {column.label}
            </StyledTableCell>
          );
        })}
      </StyledTableRow>
    );
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
    setPage(0);
    setPayload(searchFilter);
  };

  const showEditDepartmentModal = appointmentData => () => {
    setShowEditDepartment(true);
    setDepartmentInfo(appointmentData);
  };

  const hideEditDepartmentModal = () => setShowEditDepartment(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
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
        columns={18}
      >
        <Grid item xs={4}>
          <SearchInput
            label="Department Name"
            name="name"
            value={searchFilter?.name}
            placeholder="ie: john"
            onChange={handleOnChange}
            testId="search-department-name"
          />
        </Grid>
        <Grid item xs={4}>
          <SearchSelect
            label="Unit"
            options={unitList}
            placeholder="-- Select --"
            name="unit"
            value={searchFilter?.unit}
            onChange={handleOnChange}
            testId="search-unit"
          />
        </Grid>
        <Grid item xs={4}>
          <SearchSelect
            label="Subject"
            options={subjectList}
            placeholder="-- Select --"
            name="subject"
            value={searchFilter?.subject}
            onChange={handleOnChange}
            testId="search-subject"
          />
        </Grid>
        <Grid item xs={4}>
          <SearchInput
            label="Subject Code"
            placeholder="###"
            name="subject_code"
            value={searchFilter?.subject_code}
            onChange={handleOnChange}
            testId="search-subject-code"
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
            testId="search-department-btn"
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
            testId: 'departments-pagination-top',
            placement: 'top',
          }}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '1rem',
          padding: '0 1rem 2rem',
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
              {sortArray(departments, 'id', -1).map((row, index) => (
                <DepartmentTableRow
                  row={row}
                  key={`${row.id}-${index}`}
                  columns={columns}
                  refetchUsers={refetch}
                  onEditClick={showEditDepartmentModal(row)}
                  testId={`department-row-${index}`}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {showEditDepartment && (
          <DepartmentEditModal
            departmentInfo={departmentInfo}
            open={showEditDepartment}
            onClose={hideEditDepartmentModal}
            refetchDepartment={refetch}
          />
        )}
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
            testId: 'departments-pagination-bottom',
            placement: 'bottom',
          }}
        />
      </Box>
    </Box>
  );
};

export default DepartmentList;
