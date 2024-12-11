import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pluralize from 'pluralize';
import { toast } from 'react-toastify';

import { sortArray } from 'utils/helper';
import CourseTableRow from './CourseTableRow';
import AssignedInstructor from '../AssignedInstructor';
import AppointInstructor from '../AppointInstructor';
import AddNewInstructor from '../AddNewInstructor';
import { useCoursesMutation, useInstructorMutation } from 'services/mutations';
import TransparentOutlinedButton from 'StyledComponents/TransparentOutlinedButton';
import CyanButton from 'StyledComponents/CyanButton';
import ListItemSpan from 'StyledComponents/ListItemSpan';
import StyledTableCell from 'StyledComponents/StyledTableCell';
import StyledTableRow from 'StyledComponents/StyledTableRow';

const columns = [
  {
    width: '30%',
    label: 'Section # / Sub-title',
    dataKey: 'section_no',
    renderColumn: rowData => {
      return `${rowData.section_no}${
        rowData.subtitle ? ':' + rowData.subtitle : ''
      }`;
    },
  },
  {
    width: '50%',
    label: 'Appointment',
    dataKey: 'appointment',
    renderColumn: (rowData, rowProps) => {
      return (
        <div style={{ display: 'flex' }}>
          {rowData.appointment_required ? (
            rowData.appointment?.length ? (
              `${rowData.appointment?.length} ${pluralize(
                'instructor',
                rowData.appointment?.length
              )}`
            ) : (
              <ListItemSpan>
                Required
                <CyanButton
                  label={`Appoint Instructor to ${rowData.section_no}`}
                  sx={{ minWidth: '250px' }}
                  disabled={!rowData?.appointment_required}
                  onClick={rowProps?.onAppointButtonClick}
                  testId={`${rowProps.testId}-appoint-btn`}
                />
              </ListItemSpan>
            )
          ) : (
            'Not Required'
          )}
        </div>
      );
    },
  },
  {
    width: '10%',
    label: 'Action',
    dataKey: 'section_course_vs_instructors',
    renderColumn: (rowData, rowProps) => {
      return (
        <TransparentOutlinedButton
          label="View"
          className="black-outlined-btn"
          onClick={rowProps?.onViewClick}
          testId={`${rowProps.testId}-view-btn`}
        />
      );
    },
  },
];

const SpecificCourse = ({
  resultData,
  courseInfo,
  onViewClick,
  refetchCourseDetails,
}) => {
  const [showAssignedInstructor, setShowAssignedInstructor] = useState(false);
  const [showAppointInstructor, setShowAppointInstructor] = useState(false);
  const [showAddNewInstructorModal, setShowAddNewInstructorModal] =
    useState(false);
  const [courseSection, setCourseSection] = useState('');
  const [tableRows, setTableRows] = useState([]);
  const toggleAssigned = useInstructorMutation.useUpdateInstructorMutation();
  const toggleAppointmentRequired =
    useCoursesMutation.useUpdateCourseSectionMutation();
  const [appointmentInfo, setAppointMentInfo] = useState({});

  useEffect(() => {
    setTableRows(
      resultData?.map(rowData => {
        return {
          ...rowData,
          section_no:rowData.section_no + (rowData?.course_suppl_cd ? '-'+ rowData?.course_suppl_cd : ''),
          section_course_vs_instructors: `${rowData.section_per_course || 0}${
            rowData.section_with_instructors || 0
          }`,
          course_number: `${rowData.offering_unit_cd || 0}${
            rowData.subj_cd || 0
          }${rowData.course_no || 0}`,
        };
      }) || []
    );
  }, [resultData]);

  const fixedHeaderContent = () => {
    return (
      <StyledTableRow>
        {columns.map(column => {
          return (
            <StyledTableCell
              key={column.dataKey}
              variant="head"
              align="left"
              sx={{ width: column.width, backgroundColor: 'background.paper' }}
            >
              {column.label}
            </StyledTableCell>
          );
        })}
        <StyledTableCell />
      </StyledTableRow>
    );
  };

  const hideAddInstructorModal = () => setShowAddNewInstructorModal(false);

  const hideAppointInstructorModal = () => setShowAppointInstructor(false);

  const hideAssignedInstructorModal = () => setShowAssignedInstructor(false);

  const handleOnViewClick = row => () => {
    onViewClick?.(row);
  };

  const handleEditInstructor = row => appointmentInfo => {
    setShowAssignedInstructor(true);
    setAppointMentInfo(appointmentInfo);
    setCourseSection(row);
  };

  const handleAppointInstructorButton = section => {
    setShowAppointInstructor(true);
    setCourseSection(section);
  };
  const handleAddNewInstructorButton = () => {
    setShowAddNewInstructorModal(true);
    hideAppointInstructorModal();
  };

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

  const handleAppointmentRequiredToggle = async (
    sectionDetails,
    appointMentRequired
  ) => {
    try {
      await toggleAppointmentRequired.mutateAsync({
        id: sectionDetails?.id,
        appointment_required: appointMentRequired,
      });
      refetchCourseDetails?.();
      toast.success(
        `Updated section to 'Appointment ${
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        paragraph
        sx={{
          fontWeight: '600',
          color: '#333333',
          fontSize: '1.5rem',
        }}
      >
        Course: {courseInfo?.course_title} (
        {`${courseInfo.offering_unit_cd || 0} : ${courseInfo.subj_cd || 0} : ${
          courseInfo.course_no || 0
        }`}
        )
      </Typography>
      <Box
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '1rem',
        }}
      >
        <TableContainer sx={{ width: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>{fixedHeaderContent()}</TableHead>
            <TableBody>
              {sortArray(tableRows, 'id', 1).map((row, index) => (
                <CourseTableRow
                  row={row}
                  key={`${row.id}-${row.section_no}-${index}`}
                  columns={columns}
                  onViewClick={handleOnViewClick(row)}
                  onEditClick={handleEditInstructor(row)}
                  onAppointButtonClick={handleAppointInstructorButton}
                  onInstructorAssignToggle={handleInstructorAssignToggle}
                  onAppointmentRequiredToggle={handleAppointmentRequiredToggle}
                  testId={`course-list-row-${index}`}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {showAssignedInstructor && (
        <AssignedInstructor
          open={showAssignedInstructor}
          onClose={hideAssignedInstructorModal}
          refetchCourseDetails={refetchCourseDetails}
          appointmentInfo={appointmentInfo}
          section={courseSection}
        />
      )}
      {showAppointInstructor && (
        <AppointInstructor
          open={showAppointInstructor}
          onClose={hideAppointInstructorModal}
          onAddNewInstructorButtonClick={handleAddNewInstructorButton}
          refetchCourseDetails={refetchCourseDetails}
          sectionId={courseSection?.id}
          instructorsInfo={courseSection?.appointment}
        />
      )}

      {showAddNewInstructorModal && (
        <AddNewInstructor
          open={showAddNewInstructorModal}
          onClose={hideAddInstructorModal}
          section={courseSection}
          refetchCourseDetails={refetchCourseDetails}
        />
      )}
    </Box>
  );
};

export default SpecificCourse;
