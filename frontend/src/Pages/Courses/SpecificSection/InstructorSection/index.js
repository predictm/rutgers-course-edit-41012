import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { ReactComponent as InstructorsIcon } from 'assets/icons/icon-instructors.svg';
import InstructorBlock from './InstructorBlock';
import SwitchInput from 'Components/SwitchInput';
import AssignedInstructor from '../../AssignedInstructor';
import AppointInstructor from '../../AppointInstructor';
import AddNewInstructor from '../../AddNewInstructor';
import CyanButton from 'StyledComponents/CyanButton';

const InstructorSection = ({
  instructorsInfo,
  appointmentRequired,
  onAppointmentRequiredToggle,
  onInstructorAssignToggle,
  sectionDetails,
  refetchCourseSectionDetails,
}) => {
  const [isAppointmentRequired, setIsAppointmentRequired] =
    useState(appointmentRequired);
  const [showAssignedInstructor, setShowAssignedInstructor] = useState(false);
  const [showAppointInstructor, setShowAppointInstructor] = useState(false);
  const [showAddNewInstructorModal, setShowAddNewInstructorModal] =
    useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState({});

  useEffect(() => {
    setIsAppointmentRequired(appointmentRequired);
  }, [appointmentRequired]);

  const toggleAppointmentRequired = () => {
    setIsAppointmentRequired(!isAppointmentRequired);
    onAppointmentRequiredToggle?.(!isAppointmentRequired);
  };

  const handleAppointInstructorButton = () => {
    setShowAppointInstructor(true);
  };

  const showAssignedInstructorModal = appointmentData => () => {
    setShowAssignedInstructor(true);
    setAppointmentInfo(appointmentData);
  };

  const hideAssignedInstructorModal = () => setShowAssignedInstructor(false);

  const hideAppointInstructorModal = () => setShowAppointInstructor(false);

  const hideAddNewInstructorModal = () => setShowAddNewInstructorModal(false);

  const handleAddNewInstructorButton = () => {
    hideAppointInstructorModal();
    setShowAddNewInstructorModal(true);
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: '1rem' }}>
      <Grid item xs="12">
        <Typography
          variant="h3"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1.5rem',
            alignItems: 'center',
            display: 'flex',
            gap: '1.5rem',
          }}
        >
          <InstructorsIcon style={{ height: '2.625rem', width: '3.5rem' }} />
          Instructors
        </Typography>
      </Grid>
      <Grid item container xs="12">
        {instructorsInfo?.map((instructor, index) => (
          <InstructorBlock
            key={instructor?.id}
            instructor={instructor}
            isAppointmentRequired={isAppointmentRequired}
            onInstructorAssignToggle={onInstructorAssignToggle}
            onEditClick={showAssignedInstructorModal(instructor)}
            testId={`instructor-${index}`}
          />
        ))}
      </Grid>
      <Grid
        item
        xs="12"
        sx={{
          marginTop: '1rem',
          marginBottom: '2rem',
        }}
      >
        <CyanButton
          label="Appoint Instructor"
          className="full-width"
          disabled={!isAppointmentRequired}
          onClick={handleAppointInstructorButton}
          testId="section-appoint-instructor"
        />
      </Grid>
      <Grid item xs="12" sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            height: '4rem',
            alignItems: 'center',
            display: 'flex',
            zIndex: 10,
          }}
        >
          <SwitchInput
            label={
              isAppointmentRequired ? 'Instructor Required' : 'No Instructor'
            }
            controlSx={{
              margin: 0,
              '.MuiTypography-root': { fontWeight: '600' },
            }}
            width={'5.625'}
            checked={isAppointmentRequired}
            onChange={toggleAppointmentRequired}
            testId="section-is-appointment-required"
          />
        </Box>
        <Box
          sx={{
            width: '115%',
            height: '100%',
            left: '-8px',
            top: 0,
            background: '#f5f5f5',
            zIndex: '1',
            position: 'absolute',
          }}
        ></Box>
      </Grid>
      {showAssignedInstructor && (
        <AssignedInstructor
          open={showAssignedInstructor}
          onClose={hideAssignedInstructorModal}
          refetchCourseDetails={refetchCourseSectionDetails}
          appointmentInfo={appointmentInfo}
          section={sectionDetails}
        />
      )}
      {showAppointInstructor && (
        <AppointInstructor
          open={showAppointInstructor}
          onClose={hideAppointInstructorModal}
          onAddNewInstructorButtonClick={handleAddNewInstructorButton}
          refetchCourseDetails={refetchCourseSectionDetails}
          sectionId={sectionDetails?.id}
          instructorsInfo={instructorsInfo}
        />
      )}
      {showAddNewInstructorModal && (
        <AddNewInstructor
          open={showAddNewInstructorModal}
          onClose={hideAddNewInstructorModal}
          section={sectionDetails}
          refetchCourseDetails={refetchCourseSectionDetails}
        />
      )}
    </Grid>
  );
};

export default InstructorSection;
