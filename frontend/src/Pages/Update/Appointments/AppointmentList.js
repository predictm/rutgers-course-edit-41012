import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import AppointmentTableRow from './AppointmentTableRow';
import { allPropHasValue, formatDateTime } from 'utils/helper';
import { useAppointmentsQueries, useCoursesQueries } from 'services/queries';
import CyanButton from 'StyledComponents/CyanButton';
import { SEND_FOR_SIGNATURE, appointmentStatusList } from 'utils/constant';
import Button from 'Components/Button';
import AssignedInstructor from 'Pages/Courses/AssignedInstructor';
import TablePaginationActions from 'Components/TablePaginationActions';
import LightTooltip from 'StyledComponents/LightTooltip';
import { ReactComponent as InfoIcon } from 'assets/icons/icon-info.svg';
import AssignedContract from 'Pages/Courses/AssignedContract';
import { ConvertToUSFormat } from 'utils/helper';

const columns = [
  {
    width: '25%',
    label: 'Course # / Instructor',
    dataKey: 'name',
    renderColumn: (rowData, rowProps, appointments) => {
      const section = rowData?.course_section_details;
      const instructor = rowData?.instructor_info;
      const idExist = {};
      appointments.forEach(data=>{
        if(!idExist[data.instructor_info.id]){
          idExist[data.instructor_info.id] = data.id
        };  
      })
      const showName = idExist[rowData.instructor_info.id] === rowData.id;
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
            {section?.offering_unit_cd}:{section?.subj_cd}:{section?.course_no}:
            {section?.section_no} {section?.reg_index_no}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              color: '#333333',
              fontWeight: '400',
              margin: '0',
            }}
          >
            {showName && instructor?.first_name || ''} {showName && instructor?.middle_name || ''}{' '}
            {showName && instructor?.last_name || ''}
          </Typography>
        </>
      );
    },
  },
  {
    width: '30%',
    label: 'Title / Date & time',
    dataKey: 'subject',
    renderColumn: (rowData, rowProps) => {
      const section = rowData?.course_section_details;
      const courseDates = section?.course_section_dates?.start_date 
      ? section?.course_section_dates 
      : section?.session_date;
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
            data-testid={`${rowProps.testId}-course-title`}
          >
            {section?.course_title}
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
            data-testid={`${rowProps.testId}-course-date`}
          >
            {formatDateTime(courseDates?.start_date, 'MM/DD/YYYY')} {courseDates?.start_date ? ' to ' : ''}
            {formatDateTime(courseDates?.end_date, 'MM/DD/YYYY')}
          </Typography>
        </>
      );
    },
  },
  {
    width: '15%',
    label: 'Salary / Status',
    dataKey: 'appointment_status_detail',
    renderColumn: (rowData, rowProps) => {
      const contractStatus = rowData?.contract_details?.contract_status;
      const currentStatus = contractStatus && contractStatus !== 'Draft' 
      ? contractStatus
      : rowData?.appointment_status || 'PENDING' ;
      const status = appointmentStatusList?.find(
        status => status?.value === currentStatus
      );
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
            data-testid={`${rowProps.testId}-proposed-salary`}
          >
            Prop:{' '}
            {rowData?.proposed_salary ? `${ConvertToUSFormat(rowData?.proposed_salary)}` : '--'}
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
            data-testid={`${rowProps.testId}-approved-salary`}
          >
            App:{' '}
            {rowData?.approved_salary
              ? `${ConvertToUSFormat(rowData?.approved_salary)}`
              : '--'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: status?.colorCode || '#333333',
              fontWeight: '600',
              fontStyle: 'italic',
              margin: '0',
            }}
            data-testid={`${rowProps.testId}-status`}
          >
            {status?.label}
          </Typography>
        </>
      );
    },
  },
  {
    width: '30%',
    label: 'Action / Last update',
    dataKey: 'last_update',
    renderColumn: (rowData, rowProps, appointments) => {
      const contractStatus = rowData?.contract_details?.contract_status;
      const currentStatus = contractStatus && contractStatus !== 'Draft' 
      ? contractStatus
      : rowData?.appointment_status || 'PENDING' ;
      let modifiedDate = rowData?.modified_at || rowData?.created_at;
      let modifiedBy = rowData?.modified_by?.name;
      let isTimeMissing = false;
      switch (currentStatus) {
        case SEND_FOR_SIGNATURE:
          modifiedDate = rowData?.contract_details?.date_send_for_signature;
          modifiedBy = rowData?.contract_details?.send_for_signature_by;
          break;
        case 'APPROVED':
          modifiedDate = rowData?.modified_at;
          modifiedBy = rowData?.approved_by_info?.name;
          break;  
        case 'HCM_READY':
          modifiedDate = rowData?.contract_details?.date_hcm_ready;
          modifiedBy = rowData?.contract_details?.hcm_entered_by;
          break;
        case 'HCM_ENTER':
          modifiedDate = rowData?.contract_details?.date_hcm_entered;
          modifiedBy = rowData?.contract_details?.hcm_entered_by;
          break;
      }
      const idExist = {};
      appointments.forEach(data=>{
        if(!idExist[data.instructor_info.id] && data.appointment_status === "APPROVED"){
          idExist[data.instructor_info.id] = data.id
        };  
      })
      const showContract = idExist[rowData.instructor_info.id] === rowData.id;

      return (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2}>
            <CyanButton
              label={`Edit / View`}
              sx={{
                height: 'auto',
                minHeight: '2.625rem',
                width: 'fit-content',
              }}
              onClick={rowProps?.onEditClick}
              testId={`${rowProps.testId}-edit-view`}
            />
            {showContract?
              <Button
              label="Contract"
              className="black-btn"
              sx={{
                height: 'auto',
                minHeight: '2.625rem',
                width: 'fit-content',
              }}
              onClick={rowProps?.onContractClick}
              testId={`${rowProps.testId}-contract`}
            />
            :null}
          </Stack>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#333333',
              fontWeight: '400',
              fontStyle: 'italic',
              margin: '0',
            }}
            data-testid={`${rowProps.testId}-last-modified`}
          >
            {rowData?.modified_by?.name}
            <br />
            {modifiedDate ?
            isTimeMissing? 
              formatDateTime(modifiedDate, 'MM/DD/YYYY') //used for approved date as time is not stored
              : formatDateTime(modifiedDate, 'MM/DD/YYYY - hh:mm a') //mainly this will be used
            : null}
          </Typography>
        </Stack>
      );
    },
  },
];

const AppointmentList = ({ refetchUsers }) => {
  const location = useLocation();
  const [showAssignedInstructor, setShowAssignedInstructor] = useState(false);
  const [showAssignedContract, setShowAssignedContract] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState({});
  const [payload, setPayload] = useState({
    appointment_status: location?.state?.status || 'all',
  });
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchFilter, setSearchFilter] = useState({
    course_title: '',
    unit: 'all',
    subject: 'all',
    name: '',
    appointment_status: location?.state?.status || 'all',
  });
  const [stateListMapper, setStateListMapper] = useState({})
  const [jobClassCodeMapper, setJobClassCodeMapper] = useState({})

  const allOption = { label: 'All', value: 'all' };

  const { data: appointmentListData, refetch } =
    useAppointmentsQueries.useGetAppointmentsQuery({
      payload: {
        ...payload,
        limit: rowsPerPage,
        offset: rowsPerPage * page,
      },
      enabled: false,
    });
  
    const { data: activeSemister } = useCoursesQueries.useActiveSemisterQuery({
      enabled: true,
    });

  useEffect(() => {
    refetch?.();
  }, [refetch, payload, page, rowsPerPage, refetchUsers]);

  const { data: courseTitleData } =
    useAppointmentsQueries.useCourseTitleListQuery({
      enabled: true,
    });
  const courseTitleList =
    courseTitleData?.data?.map(item => ({
      value: item?.course_title,
      label: item?.course_title,
    })) || [];

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

  const getSorttedDataByStatus = (appointments) =>{
    const map = new Map();
    appointments?.forEach(data=>{
      const id =data.instructor_info.id;
      const firstName =data.instructor_info.first_name;
      const lastName =data.instructor_info.last_name;
      const key = id+firstName+lastName;
      if(map.has(key)){
        const existingData = map.get(key);
        existingData.push(data);
        map.set(key,existingData)
      }else{
        map.set(key,[data])
      }
    })
    const sortedAppointmentList = [];
    map?.forEach((values,_)=>{
      const pendingStatus = values?.filter(data => data.appointment_status === 'PENDING' || data.appointment_status === null )
      const otherStatus = values?.filter(data => data.appointment_status !== 'PENDING' && data.appointment_status !== null )
      sortedAppointmentList.push(...otherStatus)
      sortedAppointmentList.push(...pendingStatus)
    })
    return sortedAppointmentList;
  }

  const appointments = getSorttedDataByStatus(appointmentListData?.data?.results);

  useEffect(() => {
    if (appointmentListData?.data) {
      setTotalRows(appointmentListData?.data?.count);
    }
  }, [appointmentListData]);

  const { data: stateListData } = useCoursesQueries.useStateListQuery({
    enabled: true,
  });

  const stateList = stateListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name,
  }));

  useEffect(()=>{ 
  setStateListMapper(
    stateList?.reduce((acc,obj)=>{
      acc[obj.value]=obj.label;
  
      return  acc;
     },{})
     )
  },[stateListData])


  const { data: jobClassCodesListData } =
    useCoursesQueries.useJobClassCodesListQuery({
      enabled: true,
    });
  

  const jobClassCodesList = jobClassCodesListData?.data?.results?.map(item => ({
    value: item?.id,
    label: item?.name + '-' + item?.code,
  }));

  useEffect(()=>{ 
    console.log("hello")
    setJobClassCodeMapper(
        jobClassCodesList?.reduce((acc,obj)=>{
          acc[obj.value]=obj.label;
      
          return  acc;
         },{})
       )
    },[jobClassCodesListData])

  

  const appointmentStatusInputLabel = () => {
    return (
      <Stack direction="row" alignItems="flex-start">
        Appointment Status&nbsp;
        <LightTooltip
          placement="left-start"
          arrow
          sx={{ '.MuiTooltip-tooltip': { maxWidth: '600px' } }}
          title={
            <Stack alignItems="flex-start">
              <div>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: '1.125',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                  component={'div'}
                >
                  Pending:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    lineHeight: '1.125',
                    color: '#666666',
                    textAlign: 'left',
                  }}
                  paragraph
                >
                  Instructor and salary has not been approved. Both fields can
                  be empty or maybe just the instructor has been added. Will
                  need an indicator of some sort identifying those whose salary
                  needs to be approved.
                </Typography>
              </div>

              <div>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: '1.125',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                  component={'div'}
                >
                  Approved:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    lineHeight: '1.125',
                    color: '#666666',
                    textAlign: 'left',
                  }}
                  paragraph
                >
                  Admin user has approved the salary. Next step after ‘approved’
                  is sending contract via DocuSign out for signature. When
                  returned signed, date needs to be recorded so that we know it
                  is ready for next step, HCM Ready
                </Typography>
              </div>

              <div>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: '1.125',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                  component={'div'}
                >
                  Send for Signature:
                </Typography>{' '}
                <Typography
                  sx={{
                    fontSize: '1rem',
                    lineHeight: '1.125',
                    color: '#666666',
                    textAlign: 'left',
                  }}
                  paragraph
                >
                  A contract form is ready for signature request.
                </Typography>
              </div>

              <div>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: '1.125',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                  component={'div'}
                >
                  HCM Ready:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    lineHeight: '1.125',
                    color: '#666666',
                    textAlign: 'left',
                  }}
                  paragraph
                >
                  Tells admin user that it is ready to submit to HCM for payroll
                  processing
                </Typography>
              </div>

              <div>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: '1.125',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                  component={'div'}
                >
                  HCM Submitted:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    lineHeight: '1.125',
                    color: '#666666',
                    textAlign: 'left',
                  }}
                  component={'div'}
                >
                  Becomes the status after ‘c’ from above. This date needs to be
                  recorded.
                </Typography>
              </div>
            </Stack>
          }
          data-testid="courses-prerequisite-tooltip"
        >
          <InfoIcon
            style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
          />
        </LightTooltip>
      </Stack>
    );
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

  const handleOnChange = e => {
    const { name, value } = e?.target;

    setSearchFilter({
      ...searchFilter,
      [name]: value,
      ...(name === 'unit' ? { subject: 'all' } : {}),
    });
  };

  const handleSearch = () => {
    setPage(0);
    setPayload(searchFilter);
  };

  const showAssignedInstructorModal = appointmentData => () => {
    setShowAssignedInstructor(true);
    setAppointmentInfo(appointmentData);
  };

  const hideAssignedInstructorModal = () => setShowAssignedInstructor(false);

  const showAssignedContractModal = appointmentData => () => {
    setShowAssignedContract(true);
    setAppointmentInfo(appointmentData);
  };

  const hideAssignedContractModal = () => setShowAssignedContract(false);

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
      >
        <Grid item xs={2}>
          <SearchInput
            label="Instructor Name"
            name="name"
            value={searchFilter?.name}
            placeholder="ie: john"
            onChange={handleOnChange}
            testId="appointment-list-name"
          />
        </Grid>
        <Grid item xs={2}>
          <SearchSelect
            label="Course Title"
            options={courseTitleList}
            placeholder="-- Select --"
            name="course_title"
            value={searchFilter?.course_title}
            onChange={handleOnChange}
            testId="appointment-list-course-title"
          />
        </Grid>
        <Grid item xs={2}>
          <SearchSelect
            label="Unit"
            options={[allOption, ...unitList]}
            placeholder="-- Select --"
            name="unit"
            value={searchFilter?.unit}
            onChange={handleOnChange}
            testId="appointment-list-unit"
          />
        </Grid>
        <Grid item xs={2}>
          <SearchSelect
            label="Subject"
            options={[allOption, ...subjectList]}
            placeholder="-- Select --"
            name="subject"
            value={searchFilter?.subject}
            onChange={handleOnChange}
            testId="appointment-list-subject"
          />
        </Grid>
        <Grid item xs={2}>
          <SearchSelect
            label={appointmentStatusInputLabel()}
            options={[allOption, ...appointmentStatusList]}
            placeholder="-- Select --"
            name="appointment_status"
            value={searchFilter?.appointment_status}
            onChange={handleOnChange}
            testId="appointment-list-appointment-status"
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
            testId="appointment-list-search-btn"
          />
        </Grid>
      </Grid>
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
            testId: 'appointment-list-pagination-top',
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
          <Table stickyHeader aria-label="sticky table">
            <TableHead>{fixedHeaderContent()}</TableHead>
            <TableBody>
              {appointments?.map((row, index) => (
                <AppointmentTableRow
                  row={row}
                  appointments={appointments}
                  key={`${row.id}-${index}`}
                  columns={columns}
                  refetchUsers={refetch}
                  onEditClick={showAssignedInstructorModal(row)}
                  onContractClick={showAssignedContractModal(row)}
                  testId={`appointment-list-${index}`}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {showAssignedInstructor && (
          <AssignedInstructor
            open={showAssignedInstructor}
            onClose={hideAssignedInstructorModal}
            refetchCourseDetails={refetch}
            appointmentInfo={appointmentInfo}
            section={appointmentInfo?.course_section_details}
          />
        )}
        {showAssignedContract && (
          <AssignedContract
            open={showAssignedContract}
            onClose={hideAssignedContractModal}
            refetchCourseDetails={refetch}
            term={activeSemister?.data?.results?.[0]?.term}
            offeringUnit={appointmentInfo?.course_section_details?.offering_unit_descr}
            year={activeSemister?.data?.results?.[0]?.year}
            appointmentInfo={appointmentInfo}
            // section={appointmentInfo?.course_section_details}
            stateListMapper={stateListMapper}
            jobClassCodeMapper={jobClassCodeMapper}
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
            testId: 'appointment-list-pagination-bottom',
            placement: 'bottom',
          }}
        />
      </Box>
    </Box>
  );
};

export default AppointmentList;
