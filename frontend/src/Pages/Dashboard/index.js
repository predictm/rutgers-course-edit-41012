import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import { useAppContext } from 'context/AppContext';
import { routeUrls, userTypes } from 'utils/constant';
import { ReactComponent as AppointmentHCMEnterIcon } from 'assets/icons/icon-appointment-HCM-enter.svg';
import { ReactComponent as AppointmentPendingIcon } from 'assets/icons/icon-appointment-Pending.svg';
import { StyledEditIcon, StyledBox, AppointMentGraphIcon } from './styles';
import { isAdmin } from 'utils/common';
import NotificationBar from 'Components/NotificationBar';
import DepartmentOverView from './DepartmentOverview';
import EditProfileModal from './EditProfileModal';
import {
  useCoursesQueries,
  useDashboardQueries,
  useUsersQueries,
} from 'services/queries';
import { sortArray } from 'utils/helper';

const Dashboard = () => {
  const { userData, unreadNotificationList, isUserLoggedIn } = useAppContext();
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('-');
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { data: userInfo, refetch } = useUsersQueries.useGetUserByIdQuery({
    payload: { id: userData?.id },
    enabled: Boolean(isUserLoggedIn && userData?.id),
  });
  const { data: semesterListData } = useCoursesQueries.useSemesterListQuery({
    payload: {},
    enabled: true,
  });
  const semesterList = semesterListData?.data?.map(item => ({
    value: `${item?.term}:${item?.year}`,
    label: item?.semester_display,
  }));

  const { data: analyticsData } = useDashboardQueries.useGetAnalyticsQuery({
    enabled: true,
  });

  const { data: subjectListData } = useCoursesQueries.useUnitSubjectListQuery({
    enabled: true,
  });

  const subjectList = sortArray(
    subjectListData?.data?.filter(item => {
      return isAdmin(userInfo?.data?.user_type)
        ? true
        : userInfo?.data?.assigned_departments?.some(
            dept =>
              dept?.offering_unit_cd === item?.offering_unit_cd &&
              dept?.subj_cd === item?.subj_cd
          );
    }),
    'subj_descr'
  )?.map(item => ({
    value: `${item?.offering_unit_cd}--${item?.subj_cd}`,
    label: `${item?.offering_unit_cd}:${item?.subj_cd} ${item?.subj_descr}`,
  }));

  useEffect(() => {
    if (semesterList?.length && !semester) {
      setSemester(semesterList?.[0]?.value);
    }
  }, [semesterList, semester]);

  const showModal = () => setShowEditProfile(true);
  const hideModal = () => setShowEditProfile(false);

  const gotoPage = status => () => {
    navigate(routeUrls?.appointments, { state: { status } });
  };

  const handleDropdownChange = e => {
    const { name, value } = e?.target || {};
    name === 'semester' && setSemester(value);
    name === 'department' && setDepartment(value);
  };

  return (
    <div>
      {unreadNotificationList?.length > 0 && (
        <NotificationBar notificationInfo={unreadNotificationList?.[0]} />
      )}
      <Typography
        variant="h4"
        paragraph
        sx={{
          fontWeight: '300',
          color: '#333333',
          fontSize: '3.25rem',
        }}
      >
        Dashboard
      </Typography>
      <Stack
        sx={{
          background: '#FFFFFF',
          borderRadius: '2.5rem',
          padding: '1.875rem',
          height: '13.75rem',
          boxSizing: 'border-box',
        }}
        justifyContent="space-between"
        direction="row"
      >
        <StyledBox sx={{ background: '#333333' }}>
          <Avatar
            sx={{
              width: '7.5rem',
              height: '7.5rem',
              background: userInfo?.data?.profile_image
                ? 'transparent'
                : '#000000',
              border: userInfo?.data?.profile_image ? '1px solid #000000' : '',
            }}
          >
            {userInfo?.data?.profile_image ? (
              <img
                src={userInfo?.data?.profile_image}
                alt="profile-pic"
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <PersonIcon
                sx={{ width: '90%', height: '90%', color: '#333333' }}
              />
            )}
          </Avatar>
          <Stack direction="column" px={2}>
            <Typography
              paragraph
              sx={{ color: '#FFFFFF', fontWeight: '600', fontSize: '1.125rem' }}
              data-testid="user-net-id"
            >
              {userData?.net_id}
            </Typography>
            <Typography
              paragraph
              sx={{
                color: '#FFE357',
                fontWeight: '400',
                fontSize: '1rem',
                margin: 0,
              }}
              data-testid="user-name"
            >
              {userInfo?.data?.first_name} {userInfo?.data?.last_name}
            </Typography>
            <Typography
              paragraph
              sx={{
                color: '#FFFFFF',
                fontWeight: '400',
                fontSize: '1rem',
                margin: 0,
              }}
              data-testid="user-role"
            >
              {
                userTypes?.find(type => type?.value === userData?.user_type)
                  ?.label
              }
            </Typography>
          </Stack>
          <StyledEditIcon
            className="profile-edit-icon"
            data-testid="edit-user-profile"
            onClick={showModal}
          />
        </StyledBox>

        <StyledBox
          onClick={gotoPage('APPROVED')}
          sx={{ cursor: 'pointer' }}
          data-testid="stats-appointments-approved"
        >
          <Avatar
            sx={{
              width: '6.25rem',
              height: '6.25rem',
              background: '#75E3FF',
            }}
          >
            <AppointmentHCMEnterIcon
              style={{ width: '4.75rem', height: '4.375rem' }}
            />
          </Avatar>
          <Stack direction="column" px={2}>
            <Typography
              paragraph
              sx={{
                color: '#383C49',
                fontWeight: '600',
                fontSize: '4rem',
                margin: 0,
              }}
            >
              {analyticsData?.data?.appointments_approved}
            </Typography>
            <Typography
              paragraph
              sx={{
                color: '#383C49',
                fontWeight: '400',
                fontSize: '1rem',
                margin: 0,
              }}
            >
              Appointments: Approved
            </Typography>
          </Stack>
          <AppointMentGraphIcon />
        </StyledBox>
        <StyledBox
          onClick={gotoPage('PENDING')}
          sx={{ cursor: 'pointer' }}
          data-testid="stats-appointments-pending"
        >
          <Avatar
            sx={{
              width: '6.25rem',
              height: '6.25rem',
              background: '#ECD0FF',
            }}
          >
            <AppointmentPendingIcon
              style={{
                width: '4.75rem',
                height: '4.375rem',
              }}
            />
          </Avatar>
          <Stack direction="column" px={2}>
            <Typography
              paragraph
              sx={{
                color: '#383C49',
                fontWeight: '600',
                fontSize: '4rem',
                margin: 0,
              }}
            >
              {analyticsData?.data?.appointments_pending}
            </Typography>
            <Typography
              paragraph
              sx={{
                color: '#383C49',
                fontWeight: '400',
                fontSize: '1rem',
                margin: 0,
              }}
            >
              Appointments: Pending
            </Typography>
          </Stack>
          <AppointMentGraphIcon />
        </StyledBox>
      </Stack>
      <Box mt={3}>
        <DepartmentOverView
          semesterList={semesterList}
          subjectList={subjectList}
          semester={semester}
          department={department}
          handleDropdownChange={handleDropdownChange}
        />
      </Box>
      {showEditProfile && (
        <EditProfileModal
          open={showEditProfile}
          onClose={hideModal}
          userData={userInfo?.data}
          refetchUser={refetch} 
        />
      )}
    </div>
  );
};

export default Dashboard;
