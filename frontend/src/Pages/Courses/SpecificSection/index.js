import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';

import HorizontalDivider from 'Components/HorizontalDivider';
import CourseDates from './CourseDates';
import SectionInfo from './SectionInfo';
import CrossListedCourses from './CrossListedCourses';
import MeetingsInfo from './MeetingsInfo';
import BeWidgetSection from './BeWidgetSection';
import InstructorSection from './InstructorSection';
import CommentsSection from './CommentsSection';
import { useCoursesMutation, useInstructorMutation } from 'services/mutations';

const StyledGridItem = styled(Grid)({
  padding: '0.75rem 0.5rem',
  alignItems: 'center',
  position: 'relative',
  display: 'flex',

  '&:not(:first-child)': {
    '::before': {
      content: '""',
      position: 'absolute',
      backgroundColor: '#333333',
      borderRadius: '8px',
      height: '4px',
      width: '4px',
      left: '0',
    },
  },
});

const SpecificSection = ({
  sectionDetails,
  refetchCourseSectionDetails,
  instructorsInfo,
  appointmentRequired,
  refetchCourseDetails,
}) => {
  const toggleAssigned = useInstructorMutation.useUpdateInstructorMutation();
  const toggleAppointmentRequired =
    useCoursesMutation.useUpdateCourseSectionMutation();

  const handleInstructorAssignToggle = async (
    instructorInfo,
    assignedStatus
  ) => {
    try {
      const name = `${instructorInfo?.instructor_info?.first_name} 
      ${
        instructorInfo?.instructor_info?.middle_name
          ? instructorInfo?.instructor_info?.middle_name + ' '
          : ''
      }
      ${instructorInfo?.instructor_info?.last_name}`;

      await toggleAssigned.mutateAsync({
        id: instructorInfo?.id,
        is_assigned: assignedStatus,
      });
      refetchCourseDetails?.();
      toast.success(
        `${assignedStatus ? 'Assigned' : 'Unassigned'} instructor "${name}.`,{
          hideProgressBar: true,
        }
      );
    } catch (e) {
      toast.error(
        `An error occurred while ${
          assignedStatus ? 'Assigning' : 'Unassigning'
        } the section. Please try again later.`,{
          hideProgressBar: true,
        }
      );
    }
  };

  const handleAppointmentRequiredToggle = async appointMentRequired => {
    try {
      await toggleAppointmentRequired.mutateAsync({
        id: sectionDetails?.id,
        appointment_required: appointMentRequired,
      });
      refetchCourseDetails?.();
      toast.success(
        `Updated section to 'Instructor ${
          appointMentRequired ? 'Required' : 'Not Required'
        }'`,{
          hideProgressBar: true,
        }
      );
    } catch (e) {
      toast.error(
        `An error occurred while updating the section. Please try again later.`,{
          hideProgressBar: true,
        }
      );
    }
  };

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid
        item
        container
        xs="9"
        flexDirection="column"
        sx={{ paddingRight: '1.5rem' }}
      >
        <Grid item container>
          <Typography
            variant="h6"
            paragraph
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1.5rem',
            }}
            data-testid="course-specific-section-title"
          >
            {sectionDetails?.department_name} -{' '}
            {sectionDetails?.semester_display}
          </Typography>
        </Grid>
        <Grid
          item
          container
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '2rem',
            padding: '1rem',
          }}
        >
          <Grid xs={12} container item>
            <SectionInfo
              sectionDetails={sectionDetails}
              StyledGridItem={StyledGridItem}
            />
          </Grid>
          <Grid item xs={12} sx={{ padding: '1rem 0.5rem' }}>
            <HorizontalDivider />
          </Grid>
          <Grid
            item
            xs={12}
            container
            sx={{ padding: '0.5rem 0.5rem', alignItems: 'center' }}
          >
            <CourseDates
              courseSectionDates={sectionDetails?.course_section_dates}
              refetchCourseSectionDetails={refetchCourseSectionDetails}
              sectionDetails={sectionDetails}
            />
          </Grid>
          <Grid item xs={12} sx={{ padding: '1rem 0.5rem' }}>
            <HorizontalDivider color="#C9C9C9" />
          </Grid>
          <Grid
            item
            xs={12}
            container
            sx={{ padding: '0.5rem 0.5rem', alignItems: 'center' }}
          >
            <CrossListedCourses sectionDetails={sectionDetails} />
          </Grid>
          <Grid item xs={12} sx={{ padding: '1rem 0.5rem' }}>
            <HorizontalDivider />
          </Grid>
          <Grid
            item
            xs={12}
            container
            sx={{ padding: '0.5rem 0.5rem', alignItems: 'center' }}
          >
            <MeetingsInfo meetings={sectionDetails?.course_meetings} />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs="3"
        sx={{ borderLeft: '1px solid #c9c9c9' }}
        flexDirection="column"
      >
        <BeWidgetSection
          sectionDetails={sectionDetails}
          instructorsInfo={instructorsInfo}
        />
        <InstructorSection
          instructorsInfo={instructorsInfo}
          appointmentRequired={appointmentRequired}
          sectionDetails={sectionDetails}
          onAppointmentRequiredToggle={handleAppointmentRequiredToggle}
          onInstructorAssignToggle={handleInstructorAssignToggle}
          refetchCourseSectionDetails={refetchCourseSectionDetails}
        />
        <CommentsSection
          commentsList={sectionDetails?.comments}
          sectionDetails={sectionDetails}
          refetchCourseSectionDetails={refetchCourseSectionDetails}
        />
      </Grid>
    </Grid>
  );
};

export default SpecificSection;
