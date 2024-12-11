import React, { useEffect, useMemo, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { toast } from 'react-toastify';

import InstructorsList from './InstructorsList';
import Button from 'Components/Button';
import SimpleModal from 'Components/SimpleModal';
import { ReactComponent as CloseIcon } from '../../assets/icons/icon-close.svg';
import { ReactComponent as NotificationIcon } from '../../assets/icons/icon-notification-fill.svg';
import { useCoursesQueries } from 'services/queries';
import useForm from 'hooks/Form';
import { useInstructorMutation } from 'services/mutations';
import SearchInput from 'StyledComponents/SearchInput';
import SearchButton from 'StyledComponents/SearchButton';

const AppointInstructor = ({
  open,
  onClose,
  onAddNewInstructorButtonClick,
  sectionId,
  refetchCourseDetails,
  instructorsInfo,
}) => {
  const [payload, setPayload] = useState();
  const [filteredInstructors, setFilteredInstructor] = useState([]);
  const searchFormRef = useRef();
  const assignInstructorToCourseMutation =
    useInstructorMutation.useAssignInstructorToCourseMutation();
  const [searchFormHeight, setSearchFormHeight] = useState(0);

  useEffect(() => {
    setSearchFormHeight(searchFormRef?.current?.clientHeight);
  }, [searchFormRef?.current?.clientHeight]);

  const stateSchema = useMemo(() => {
    return {
      employee_number: { value: '', error: '' },
      first_name: { value: '', error: '' },
      last_name: { value: '', error: '' },
      net_id: { value: '', error: '' },
    };
  }, []);

  const validationSchema = {
    employee_number: {
      required: false,
    },
    first_name: {
      required: false,
    },
    last_name: {
      required: false,
    },
    net_id: {
      required: false,
    },
  };

  const { state, handleOnChange, setState } = useForm(
    stateSchema,
    validationSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [setState, stateSchema]);

  const { data: instructorsData, isFetching } =
    useCoursesQueries.useSearchInstructorsQuery({
      enabled: Boolean(payload),
      payload,
    });

  useEffect(() => {
    // if (instructorsData?.data?.results?.length) {
      setFilteredInstructor(filterInstructors(instructorsData?.data?.results));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorsData]);

  const handleInputChange = field => e => {
    handleOnChange(field, e?.target?.value);
  };

  const handleClick = () => {
    setPayload({
      employee_number: state.employee_number.value,
      first_name: state.first_name.value,
      last_name: state.last_name.value,
    });
  };

  const handleAssignInstructor = async instructorId => {
    try {
      await assignInstructorToCourseMutation.mutateAsync({
        is_assigned: true,
        course_section: sectionId,
        instructor: instructorId,
      });
      setTimeout(() => refetchCourseDetails?.(), 1000);
      toast.success('Instructor assigned successfully',{
        hideProgressBar: true,
      });
      onClose?.();
    } catch (e) {
      toast.error(
        'An error occurred while adding new instructor. Please try again later.',{
          hideProgressBar: true,
        }
      );
    }
  };

  const filterInstructors = instructorList => {
    return (
      instructorList?.filter(
        row =>
          !instructorsInfo?.find(
            instructor => instructor?.instructor_info?.id === row?.id
          )
      ) || []
    );
  };

  return (
    <SimpleModal open={open} onClose={onClose}>
      <Grid
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '2rem',
        }}
        ref={searchFormRef}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h4"
              sx={{
                color: '#383C49',
                fontSize: '2rem',
                fontWeight: '500',
              }}
            >
              Search Instructor
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={onClose}
              style={{
                width: '5rem',
                height: '5rem',
                fill: '#666666',
                cursor: 'pointer',
              }}
              data-testid="appoint-instructor-modal-close"
            />
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="left"
          alignItems="center"
          sx={{
            border: '2px solid #707070',
            borderRadius: '2.5rem',
            // height: '3rem',
            padding: '1.5rem',
          }}
        >
          <Grid item>
            <NotificationIcon
              onClick={onClose}
              style={{
                width: '2rem',
                height: '2rem',
                marginLeft: '1rem',
                // fill: 'red',
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              sx={{
                color: '#383C49',
                fontSize: '1rem',
                marginLeft: '1rem',
              }}
            >
              This form allows you to assign instructors to the course. Please
              use it with caution.
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          <Grid item>
            <SearchInput
              label="NetID"
              value={state.net_id.value}
              onChange={handleInputChange('net_id')}
              name="unit"
              testId="appoint-instructor-modal-new-id"
            />
          </Grid>
          <Grid item>
            <SearchInput
              label="Employee#"
              value={state.employee_number.value}
              onChange={handleInputChange('employee_number')}
              testId="appoint-instructor-modal-employee-number"
            />
          </Grid>
          <Grid item>
            <SearchInput
              label="First Name"
              placeholder="ie: John"
              value={state.first_name.value}
              onChange={handleInputChange('first_name')}
              testId="appoint-instructor-modal-first-name"
            />
          </Grid>
          <Grid item>
            <SearchInput
              label="Last Name"
              placeholder="ie: Mac"
              value={state.last_name.value}
              onChange={handleInputChange('last_name')}
              testId="appoint-instructor-modal-last-name"
            />
          </Grid>
          <Grid item>
            <SearchButton
              startIcon={<SearchOutlinedIcon />}
              className="black-btn"
              onClick={handleClick}
              sx={{
                '&.black-btn:hover': {
                  backgroundColor: '#0071E3',
                  border: 'none',
                },
              }}
              testId="appoint-instructor-modal-search-btn"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          boxShadow: '0px 0px 5px #00000029',
          padding: '2rem',
        }}
      >
        <Grid>
          <Grid>
            {!isFetching && payload && !filteredInstructors?.length ? (
              <>
                <Typography
                  sx={{
                    color: '#333333',
                    fontSize: '2.25rem',
                    fontWeight: '300',
                    margin: 0,
                  }}
                >
                  No results found
                </Typography>
                <Typography
                  sx={{
                    color: '#333333',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '2rem',
                  }}
                >
                  Try a new search from above or add a new instructor.
                </Typography>
              </>
            ) : (
              !payload && (
                <Typography
                  sx={{
                    color: '#333333',
                    fontSize: '2.25rem',
                    fontWeight: '300',
                    marginBottom: '2rem',
                  }}
                >
                  Try a new search from above.
                </Typography>
              )
            )}
          </Grid>
          <Grid>
            {payload && !isFetching ? (
              <>
                <div
                  style={{
                    maxHeight: `calc(80vh - ${searchFormHeight + 32}px)`,
                    overflowY: 'auto',
                  }}
                >
                  <InstructorsList
                    searchInstructorsData={filteredInstructors}
                    onAssignInstructor={handleAssignInstructor}
                  />
                </div>
                <Button
                  label="Add New Instructor"
                  variant="contained"
                  className="black-btn full-width"
                  onClick={onAddNewInstructorButtonClick}
                  testId="appoint-instructor-modal-add-new-btn"
                />
              </>
            ) : (
              isFetching && 'Loading...'
            )}
          </Grid>
        </Grid>
      </Grid>
    </SimpleModal>
  );
};

export default AppointInstructor;
