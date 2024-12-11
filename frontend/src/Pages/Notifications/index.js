import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Grid } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { toast } from 'react-toastify';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import StyledTab from 'StyledComponents/StyledTab';
import StyledTabs from 'StyledComponents/StyledTabs';
import { useNotificationQueries } from 'services/queries';
import { sortByDate } from 'utils/helper';
import { getNotificationColor, getNotificationIcon } from 'utils/common';
import { useNotificationsMutation } from 'services/mutations';
import TablePaginationActions from 'Components/TablePaginationActions';

const Notification = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedTab, setSelectedTab] = useState(0);
  const [todayNotifications, setTodayNotifications] = useState([]);
  const [yesterdaysNotifications, setYesterdaysNotifications] = useState([]);
  const [olderNotifications, setOlderNotifications] = useState([]);

  const markAsReadMutation =
    useNotificationsMutation.useMarkAsReadNotificationMutation();

  const query = selectedTab === 1
    ? useNotificationQueries.useGetUnreadNotificationsQuery({
        enabled: true,
        payload: { limit: rowsPerPage, offset: rowsPerPage * page },
      })
    : selectedTab === 2 ? useNotificationQueries.useGetAllNotificationsQuery({
        enabled: true,
        payload: { limit: rowsPerPage, offset: rowsPerPage * page },
      }): useNotificationQueries.useGetReadNotificationsQuery({
        enabled: true,
        payload: { limit: rowsPerPage, offset: rowsPerPage * page },
      });

const { data: notificationsData, isFetching, refetch } = query;

  useEffect(() => {
    if (notificationsData?.data) {
      setTotalRows(notificationsData?.data?.count);
    }
  }, [notificationsData]);

  useEffect(() => {
    const notificationList = notificationsData?.data;
    const now = moment.utc(new Date()).tz(moment.tz.guess());

    const filteredNotifications = notificationList?.results
      ?.filter(item => (selectedTab === 0 ? item?.is_read : true))
      ?.map(item => {
        const notificationDate = item?.created_at;
        return {
          ...item,
          fromNow: moment.utc(notificationDate).tz(moment.tz.guess()).fromNow(),
          days: now.diff(
            moment.utc(notificationDate).tz(moment.tz.guess()),
            'days'
          ),
        };
      });

    setYesterdaysNotifications(
      filteredNotifications?.filter(item => item?.days == 1) || []
    );
    setOlderNotifications(
      filteredNotifications?.filter(item => item?.days > 1) || []
    );
    setTodayNotifications(
      filteredNotifications?.filter(item => item?.days == 0) || []
    )
  }, [notificationsData, selectedTab]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTabChange = (e, tabIndex) => {
    setSelectedTab(tabIndex);
  };

  const handleMarkAsRead = item => async () => {
    try {
      await markAsReadMutation?.mutateAsync({ id: item?.id });
      toast.success('Notification marked as read.',{
        hideProgressBar: true,
      });
      refetch?.();
    } catch {
      toast.error('An error occurred while marking the notification as read.',{
        hideProgressBar: true,
      });
    }
  };

  const notificationBody = item => {
    return (
      <Grid
        container
        my={1}
        mx={0}
        px={1}
        pb={1.25}
        sx={{
          borderRadius: '1rem',
          width: '100%',
          backgroundColor: item?.is_read ? 'transparent' : '#F9F9F9',

          '&:hover': {
            backgroundColor: '#F9F9F9',
          },
        }}
        alignItems="flex-start"
        spacing={1.25}
        data-testid={`notification-${item?.id}`}
      >
        <Grid item xs="auto">
          <Avatar
            sx={{
              width: '5rem',
              height: '5rem',
              border: '2px solid #707070',
              color: '#383C49',
              fontSize: '2.5rem',
              fontWeight: '900',
              backgroundColor: getNotificationColor(item),
            }}
          >
            {getNotificationIcon(item)}
          </Avatar>
        </Grid>
        <Grid item xs container>
          <Grid item xs={12} container justifyContent="space-between">
            <Grid item xs={11}>
              <Typography
                sx={{
                  fontSize: '1.125',
                  color: '#383C49',
                  fontWeight: '600',
                }}
              >
                {item?.title}
                <span
                  style={{
                    paddingLeft: '1rem',
                    fontWeight: '400',
                    color: '#383C49',
                    fontSize: '1.125',
                  }}
                >
                  {item?.fromNow}
                </span>
                {!item?.is_read && (
                  <span
                    title="Mark as Read"
                    onClick={handleMarkAsRead(item)}
                    data-testid={`notification-${item?.id}-mark-as-read`}
                  >
                    <MarkEmailReadIcon
                      sx={{
                        marginLeft: '1rem',
                        cursor: 'pointer',
                        alignSelf: 'flex-end',
                      }}
                    />
                  </span>
                )}
              </Typography>
            </Grid>
            <Grid item xs="auto">
              {!item?.is_read && (
                <Box
                  sx={{
                    backgroundColor: '#75E3FF',
                    borderRadius: '1rem',
                    width: '1rem',
                    height: '1rem',
                  }}
                ></Box>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} mt={0.25}>
             <Typography sx={{ color: '#707070', fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: item?.message }} />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderUnreadNotificationsTabContent = () => {
    return (
      selectedTab === 1 && (
        <>
          {[...todayNotifications,...yesterdaysNotifications, ...olderNotifications]?.map(item => {
            return notificationBody(item);
          })}
        </>
      )
    );
  };
  const renderReadNotificationsTabContent = () => {
    console.log([...todayNotifications,...yesterdaysNotifications, ...olderNotifications],'readdddd');
    return (
      selectedTab === 0 && (
        <>
          {[...todayNotifications,...yesterdaysNotifications, ...olderNotifications]?.map(item => {
            return notificationBody(item);
          })}
        </>
      )
    );
  };

  const renderAllNotificationsTabContent = () => {
    return (
      selectedTab === 2 && (
        <>
          {todayNotifications?.length > 0 && (
            <>
              <Typography sx={{ fontSize: '2rem', color: '#383C49' }}>
                Today
              </Typography>
              {todayNotifications?.map(item => {
                return notificationBody(item);
              })}
            </>
          )}
          {yesterdaysNotifications?.length > 0 && (
            <>
              <Typography sx={{ fontSize: '2rem', color: '#383C49' }}>
                Yesterday
              </Typography>
              {yesterdaysNotifications?.map(item => {
                return notificationBody(item);
              })}
            </>
          )}

          {olderNotifications?.length > 0 && (
            <>
              <Typography sx={{ fontSize: '2rem', color: '#383C49' }}>
                Older Notifications
              </Typography>
              {olderNotifications?.map(item => {
                return notificationBody(item);
              })}
            </>
          )}
        </>
      )
    );
  };

  return (
    <div className="notification-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Notifications
      </Typography>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '2rem',
          borderColor: 'red',
          padding: '1rem 0',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            display: 'flex',
          }}
        >
          <StyledTabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{ width: 'fit-content', paddingLeft: '1rem' }}
          >
            <StyledTab label="Read" data-testid="tab-read-notifications" />
            <StyledTab label="Unread" data-testid="tab-unread-notifications" />
            <StyledTab label="All" data-testid="tab-all-notifications" />
          </StyledTabs>
        </Box>
        {totalRows > rowsPerPage && (
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
              testId: 'notification-list-pagination-bottom',
              placement: 'top',
            }}
          />
        )}
        {notificationsData?.data?.results && !totalRows ? (
          <Typography
            paragraph
            sx={{
              color: '#333333',
              fontWeight: '600',
              fontSize: '2rem',
              padding: '2rem',
              margin: 0,
            }}
          >
            No {selectedTab === 0 ? 'unread' : ''} messages
          </Typography>
        ) : (
          <Box p={2}>
            {isFetching && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}
            {renderReadNotificationsTabContent()}
            {renderUnreadNotificationsTabContent()}
            {renderAllNotificationsTabContent()}
          </Box>
        )}
        {totalRows > rowsPerPage && (
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
              testId: 'notification-list-pagination-bottom',
              placement: 'bottom',
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default Notification;
