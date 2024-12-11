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
import moment from 'moment-timezone';

import SearchInput from 'StyledComponents/SearchInput';
import SearchButton from 'StyledComponents/SearchButton';
import SearchSelect from 'StyledComponents/SearchSelect';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';
import { formatDateTime, sortArray } from 'utils/helper';
import { useAnnouncementQueries } from 'services/queries';
import TablePaginationActions from 'Components/TablePaginationActions';
import AnnouncementTableRow from './AnnouncementTableRow';
import CyanButton from 'StyledComponents/CyanButton';
import AnnouncementEditModal from './AnnouncementEditModal';
import { announcementTypes } from 'utils/constant';
import ListItemSpan from 'StyledComponents/ListItemSpan';
import SearchDateInput from 'StyledComponents/SearchDateInput';

const columns = [
  {
    width: '40%',
    label: 'Title',
    dataKey: 'title',
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
          data-testid={`${rowProps?.testId}-title`}
        >
          {rowData?.title}
        </Typography>
      );
    },
  },
  {
    width: '20%',
    label: 'Type',
    dataKey: 'type',
    renderColumn: (rowData, rowProps) => {
      const announcementType = announcementTypes?.find(
        type => type?.value === rowData?.type
      );
      return (
        <ListItemSpan
          sx={{
            fontSize: '1.25rem',
            color: '#333333',
            fontWeight: '400',
            margin: '0',
            '::before': {
              border: '1px solid #333333',
            },
          }}
          data-testid={`${rowProps?.testId}-type`}
          backgroundColor={announcementType?.colorCode}
        >
          {announcementType?.label}
        </ListItemSpan>
      );
    },
  },
  {
    width: '25%',
    label: 'Date',
    dataKey: 'date',
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
          data-testid={`${rowProps?.testId}-date`}
        >
          {formatDateTime(rowData?.start_date, 'MM-DD-YYYY, HH:mm A')}
          <br />
          {formatDateTime(rowData?.end_date, 'MM-DD-YYYY, HH:mm A')}
        </Typography>
      );
    },
  },
  {
    width: '15%',
    label: 'Action',
    dataKey: 'last_update',
    renderColumn: (rowData, rowProps) => {
      return (
        <CyanButton
          label="Edit"
          onClick={rowProps?.onEditClick}
          testId={`${rowProps?.testId}-edit`}
        />
      );
    },
  },
];

const ExistingAnnouncement = ({ refetchAnnouncements }) => {
  const [showEditAnnouncement, setShowEditAnnouncement] = useState(false);
  const [announcementInfo, setAnnouncementInfo] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [payload, setPayload] = useState({});
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    type: '',
    date: '',
  });

  const { data: announcementData, refetch } =
    useAnnouncementQueries.useGetAnnouncementsQuery({
      payload: { ...payload, limit: rowsPerPage, offset: rowsPerPage * page },
      enabled: true,
    });

  const announcementList = announcementData?.data?.results;

  useEffect(() => {
    refetch?.();
  }, [refetch, payload, refetchAnnouncements]);

  useEffect(() => {
    if (announcementData?.data) {
      setTotalRows(announcementData?.data?.count);
    }
  }, [announcementData]);

  const showEditAnnouncementModal = appointmentData => () => {
    setShowEditAnnouncement(true);
    setAnnouncementInfo(appointmentData);
  };

  const hideEditAnnouncementModal = () => setShowEditAnnouncement(false);

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

  const handleOnDateChange = value => {
    setSearchFilter({
      ...searchFilter,
      date: value,
    });
  };

  const handleSearch = () => {
    const [year, month] = (
      searchFilter?.date
        ? moment
            ?.tz(searchFilter.date, moment.tz.guess())
            ?.utc()
            ?.endOf('month')
            ?.format('YYYY-MM')
        : '-'
    )?.split('-');
    setPayload({
      ...searchFilter,
      year,
      month,
    });
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
        Announcement log:
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
            <SearchInput
              label="Title"
              placeholder="title"
              name="title"
              value={searchFilter?.title}
              onChange={handleOnChange}
              testId="announcement-list-search-title"
            />
          </Grid>
          <Grid item xs={3.5}>
            <SearchSelect
              label="Type"
              options={announcementTypes}
              placeholder="-- Select --"
              name="type"
              value={searchFilter?.type}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={3.5}>
            <SearchDateInput
              label="Date: Month and Year"
              placeholder="MM-YYYY"
              format="MM-YYYY"
              views={['month', 'year']}
              name="date"
              openTo="month"
              onChange={handleOnDateChange}
              testId="announcement-list-search-date"
              suppressError={true}
              labelSx={{ margin: 0 }}
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
              testId="announcement-list-search-btn"
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
              testId: 'announcement-list-pagination-top',
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
                {sortArray(announcementList, 'id', -1)?.map((row, index) => (
                  <AnnouncementTableRow
                    row={row}
                    key={`${row.id}-${index}`}
                    columns={columns}
                    refetchAnnouncements={refetch}
                    onEditClick={showEditAnnouncementModal(row)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showEditAnnouncement && (
            <AnnouncementEditModal
              open={showEditAnnouncementModal}
              onClose={hideEditAnnouncementModal}
              refetchAnnouncements={refetch}
              announcementData={announcementInfo}
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
              testId: 'announcement-list-pagination-bottom',
              placement: 'bottom',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ExistingAnnouncement;
