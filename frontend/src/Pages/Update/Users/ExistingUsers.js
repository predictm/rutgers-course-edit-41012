import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { toast } from 'react-toastify';
import TablePagination from '@mui/material/TablePagination';

import SearchInput from 'StyledComponents/SearchInput';
import SearchButton from 'StyledComponents/SearchButton';
import SearchSelect from 'StyledComponents/SearchSelect';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import UsersTableRow from './UsersTableRow';
import { sortArray } from 'utils/helper';
import { useCoursesQueries, useUsersQueries } from 'services/queries';
import SwitchInput from 'Components/SwitchInput';
import { userTypes } from 'utils/constant';
import { useUsersMutation } from 'services/mutations';
import { getUserData } from 'utils/common';
import TablePaginationActions from 'Components/TablePaginationActions';
import SearchAutoComplete from 'StyledComponents/SearchAutoComplete';
import LightTooltip from 'StyledComponents/LightTooltip';
import StyledBadge from 'StyledComponents/StyledBadge';

const columns = [
  {
    width: '30%',
    label: 'NetID / Name',
    dataKey: 'name',
    renderColumn: (rowData, rowProps) => {
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
            data-testid={`${rowProps?.testId}-net-id`}
          >
            {rowData?.net_id}
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
            data-testid={`${rowProps?.testId}-name`}
          >
            {rowData?.first_name} {rowData?.last_name}
          </Typography>
        </>
      );
    },
  },
  {
    width: '30%',
    label: 'Subject',
    dataKey: 'subject',
    renderColumn: (rowData, rowProps) => {
      return (
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontSize: '1.25rem',
            color: '#333333',
            fontWeight: '400',
            margin: '0',
          }}
          data-testid={`${rowProps?.testId}-subject`}
        >
          {rowData?.assigned_departments?.[0]?.subj_descr}
          {rowData?.assigned_departments?.length > 1 && (
            <>
              ...&nbsp;
              <LightTooltip
                placement="right-start"
                arrow
                title={
                  <>
                    {rowData?.assigned_departments?.map(department => (
                      <p
                        key={`${rowProps?.testId}-subject-${department?.id}`}
                        style={{ margin: 0, marginBottom: '0.25rem' }}
                        data-testid={`${rowProps?.testId}-subject-${department?.id}`}
                      >
                        {department?.subj_descr}
                      </p>
                    ))}
                  </>
                }
                data-testid={`${rowProps?.testId}-assigned-subjects-tooltip`}
                sx={{ '.MuiTooltip-tooltip': { textAlign: 'left' } }}
              >
                <StyledBadge
                  data-testid={`${rowProps?.testId}-assigned-subject-count`}
                >
                  {rowData?.assigned_departments?.length}
                </StyledBadge>
              </LightTooltip>
            </>
          )}
        </Typography>
      );
    },
  },
  {
    width: '15%',
    label: 'Role',
    dataKey: 'Role',
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
          data-testid={`${rowProps?.testId}-user-role`}
        >
          {userTypes?.find(type => type?.value === rowData?.user_type)?.label ||
            ''}
        </Typography>
      );
    },
  },
  {
    width: '15%',
    label: 'Status',
    dataKey: 'is_active',
    renderColumn: (rowData, rowProps) => {
      return (
        <div style={{ width: '100%' }}>
          <SwitchInput
            label={rowData?.is_active ? 'Active' : 'Inactive'}
            checked={rowData?.is_active}
            controlSx={{ marginRight: 0, color: '#666666' }}
            onChange={rowProps?.onToggleStatus}
            testId={`${rowProps?.testId}-toggle-active`}
          />
        </div>
      );
    },
  },
];

const ExistingUsers = ({ refetchUsers }) => {
  const userData = getUserData();
  const [payload, setPayload] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchFilter, setSearchFilter] = useState({
    unit: '',
    unit_subject: '',
    subject: '',
    name: '',
    role: '',
  });

  const { data: usersListData, refetch } = useUsersQueries.useGetUsersQuery({
    payload: { ...payload, limit: rowsPerPage, offset: rowsPerPage * page },
    enabled: true,
  });

  useEffect(() => {
    refetch?.();
  }, [refetch, payload, refetchUsers]);

  useEffect(() => {
    if (usersListData?.data) {
      setTotalRows(usersListData?.data?.count);
    }
  }, [usersListData]);

  const toggleStatus = useUsersMutation.useUpdateUserMutation();

  const { data: subjectListData } = useCoursesQueries.useUnitSubjectListQuery({
    enabled: true,
  });
  const subjectList = subjectListData?.data?.map(item => ({
    value: `${item?.offering_unit}--${item?.department}--${item?.offering_unit_campus}--${item?.offering_unit_level}`,
    label: `${item?.offering_unit_cd}:${item?.subj_cd}:${item?.offering_unit_level} ${item?.offering_unit_campus} ${item?.subj_descr}`,
    info: item,
  }));

  const handleToggleStatus = async user => {
    try {
      await toggleStatus.mutateAsync({
        id: user?.id,
        is_active: !user?.is_active,
      });
      refetch?.();
      toast.success(
        `Successfully ${
          user?.is_active ? 'inactivated' : 'activated'
        } the user ${user?.first_name} ${user?.last_name}.`,{
          hideProgressBar: true,
        }
      );
    } catch (e) {
      toast.error(
        `An error occurred while ${
          user?.is_active ? 'inactivating' : 'activating'
        } the user ${user?.first_name} ${
          user?.last_name
        }. Please try again later.`,{
          hideProgressBar: true,
        }
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const userList = usersListData?.data?.results;

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

  const handleOnChange = e => {
    const { name, value } = e?.target;

    setSearchFilter({
      ...searchFilter,
      [name]: value,
    });
  };

  const handleAutoCompleteChange = (e, value) => {
    setSearchFilter({
      ...searchFilter,
      unit_subject: value,
      unit: value?.info?.offering_unit_cd,
      subject: value?.info?.subj_cd,
    });
  };

  const handleSearch = () => {
    setPayload(searchFilter);
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
        Existing Users:
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
          alignItems="flex-start"
          columns={14}
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            padding: '0 2rem 2rem',
          }}
        >
          <Grid item xs={4}>
            <SearchInput
              label="NetID / Name"
              name="name"
              value={searchFilter?.name}
              onChange={handleOnChange}
              testId="existing-user-net-id"
            />
          </Grid>
          <Grid item xs={4}>
            <SearchAutoComplete
              label="Subject"
              options={[
                { label: '--Select--', value: '', type: 'placeholder' },
                ...(subjectList || []),
              ]}
              disableClearable
              placeholder="-- Select --"
              name="unit_subject"
              value={searchFilter?.unit_subject}
              onChange={handleAutoCompleteChange}
              testId="existing-user-subject"
            />
          </Grid>
          <Grid item xs={4}>
            <SearchSelect
              label="Role"
              options={userTypes}
              placeholder="-- Select --"
              name="role"
              value={searchFilter?.role}
              onChange={handleOnChange}
              testId="existing-user-role"
            />
          </Grid>
          <Grid item xs="auto">
            <SearchButton
              startIcon={<SearchOutlinedIcon />}
              className="black-btn"
              sx={{
                marginTop: '1.6rem',

                '&.black-btn:hover': {
                  backgroundColor: '#0071E3',
                  border: 'none',
                },
              }}
              onClick={handleSearch}
              testId="existing-user-search-btn"
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
              testId: 'existing-user-pagination-top',
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
            <Table stickyHeader aria-label="sticky table">
              <TableHead>{fixedHeaderContent()}</TableHead>
              <TableBody>
                {sortArray(userList, 'id', -1)
                  ?.filter(row => row?.id !== userData?.id)
                  ?.map((row, index) => (
                    <UsersTableRow
                      row={row}
                      key={`${row.id}-${index}`}
                      columns={columns}
                      onToggleStatus={handleToggleStatus}
                      refetchUsers={refetch}
                      testId={`existing-user-row-${row?.id}`}
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
              testId: 'existing-user-pagination-bottom',
              placement: 'bottom',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ExistingUsers;
