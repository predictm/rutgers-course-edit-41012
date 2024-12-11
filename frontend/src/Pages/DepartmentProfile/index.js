import React, { useCallback, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

import { sortArray } from 'utils/helper';
import { useHomeContext } from 'Pages/Home/context/HomeContext';
import ProfileView from './ProfileView';
import { useAppContext } from 'context/AppContext';

import './styles.scss';
import NotificationBar from 'Components/NotificationBar';

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    marginBottom: '0.625rem',
  },
  '&:before': {
    display: 'none',
  },
  '& .MuiCollapse-wrapper': {
    backgroundColor: '#f5f5f5',
  },
  '& .MuiAccordionSummary-root': {
    minHeight: '1.875rem',
    padding: '0 0.5rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    '&.Mui-expanded': {
      minHeight: '1.875rem',
    },
    '& .MuiAccordionSummary-content': {
      margin: '0.675rem 0',
      minHeight: '1.875rem',
      '& .MuiTypography-root': {
        marginBottom: 0,
      },
    },
  },
}));

const DepartmentProfile = () => {
  const { unreadNotificationList } = useAppContext();
  const { rolesData, departmentData, refetchDepartment } = useHomeContext();
  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    refetchDepartment?.();
  }, [refetchDepartment]);

  const userRoles =
    rolesData?.map(role => ({
      value: role.id,
      label: role.name,
    })) || [];

  const handleToggleDepartment = useCallback(
    panel => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  return (
    <div className="department-profile">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Department Profile
      </Typography>
      {/* {unreadNotificationList?.length > 0 && (
        <NotificationBar notificationInfo={unreadNotificationList?.[0]} />
      )} */}
      {departmentData?.length === 1 ? (
        <>
          {' '}
          <Typography
            variant="h6"
            paragraph
            sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
            data-testid="department-profile-title-0"
          >
            {departmentData[0]?.dept?.subj_descr}{' '}
            {departmentData[0]?.unit?.offering_unit_cd}:
            {departmentData[0]?.dept?.subj_cd}
          </Typography>
          <ProfileView
            departmentInfo={departmentData[0]?.dept}
            unitInfo={departmentData[0]?.unit}
            userRoles={userRoles}
            testId={`Departments-0`}
            refetchDepartment={refetchDepartment}
          />
        </>
      ) : (
        sortArray(departmentData, 'id')?.map((departmentInfo, index) => {
          const accordionId = `department-${departmentInfo?.id}`;

          return (
            <Accordion
              key={accordionId}
              elevation={0}
              expanded={expanded === accordionId}
              onChange={handleToggleDepartment(accordionId)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  variant="h6"
                  paragraph
                  sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
                  data-testid={`department-title-${index}`}
                >
                  {departmentInfo?.dept?.subj_descr}{' '}
                  {departmentInfo?.unit?.offering_unit_cd}:
                  {departmentInfo?.dept?.subj_cd}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ProfileView
                  departmentInfo={departmentInfo?.dept}
                  unitInfo={departmentInfo?.unit}
                  userRoles={userRoles}
                  refetchDepartment={refetchDepartment}
                  testId={`department-${index}`}
                />
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </div>
  );
};

export default DepartmentProfile;
