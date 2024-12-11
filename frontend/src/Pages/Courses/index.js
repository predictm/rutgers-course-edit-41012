import React, { useEffect, useReducer, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';

import { ReactComponent as InfoIcon } from 'assets/icons/icon-info.svg';
import { ReactComponent as ResetIcon } from 'assets/icons/icon-reset.svg';
import Button from 'Components/Button';
import { useCoursesQueries } from 'services/queries';
import coursesReducer, { initialState } from './reducer';
import CoursesResult from './CourseResults';
import SpecificCourse from './SpecificCourse';
import SpecificSection from './SpecificSection';
import { allPropHasValue } from 'utils/helper';
import SearchSelect from 'StyledComponents/SearchSelect';
import StyledTabs from 'StyledComponents/StyledTabs';
import StyledTab from 'StyledComponents/StyledTab';
import SearchInputWithButton from 'StyledComponents/SearchInputWithButton';
import LightTooltip from 'StyledComponents/LightTooltip';

import './styles.scss';

const SearchButton = styled(Button)({
  width: 'auto',
  borderRadius: '100px',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  minWidth: 0,

  span: {
    margin: 0,
  },
});

const Courses = () => {
  const [coursesState, dispatch] = useReducer(coursesReducer, initialState);
  const {
    courseFilters,
    indexFilter,
    regIndex,
    indexSemester,
    indexTerm,
    indexYear,
  } = coursesState;
  const {
    semester,
    unit,
    subjectDisplay,
    course,
    section,
    term,
    year,
    subject,
    unitLevel,
  } = courseFilters;
  const {
    index,
    semester: indexFilterSemester,
    term: indexFilterTerm,
    year: indexFilterYear,
  } = indexFilter;
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: semesterListData } = useCoursesQueries.useSemesterListQuery({
    payload: {},
    enabled: true,
  });

  const { data: activeSemesterListData } = useCoursesQueries.useActiveSemesterQuery({
    payload: {},
    enabled: true,
  });
  const currentSemesters = activeSemesterListData?.data?.results?.filter(item => item.is_current_semester).map(({ term, year }) => ({ term, year }));

  const filteredData = semesterListData?.data?.filter(item => {
    return currentSemesters?.some(({ term, year }) => item.term === term && item.year === year);
});

const semesterList = semesterListData?.data?.map(item => ({
    value: `${item?.term}:${item?.year}`,
    label: item?.semester_display,
  }));

  const unitListPayload = { term, year, semester };
  const unitListQueryEnabled = Boolean(allPropHasValue(unitListPayload));

  const { data: unitListData } = useCoursesQueries.useUnitListQuery({
    payload: unitListPayload,
    enabled: unitListQueryEnabled,
  });
  const unitList = unitListData?.data?.map(item => ({
    value: item?.offering_unit_cd,
    label: item?.offering_unit_cd,
  }));

  const subjectListPayload = { ...unitListPayload, unit };
  const subjectListQueryEnabled = Boolean(allPropHasValue(subjectListPayload));
  const { data: subjectListData } = useCoursesQueries.useSubjectListQuery({
    payload: subjectListPayload,
    enabled: subjectListQueryEnabled,
  });
  const subjectList = subjectListData?.data?.map(item => ({
    value: item?.subj_display,
    label: item?.subj_display,
  }));

  const courseListPayload = { ...subjectListPayload, subject, unitLevel };
  const courseListQueryEnabled = Boolean(allPropHasValue(courseListPayload));
  const { data: coursesListData } = useCoursesQueries.useCourseListQuery({
    payload: courseListPayload,
    enabled: courseListQueryEnabled,
  });
  const coursesList = coursesListData?.data?.map(item => ({
    value: item?.course_no,
    label: item?.course_no,
  }));

  const sectionListPayload = { ...courseListPayload, course };
  const sectionListQueryEnabled = Boolean(allPropHasValue(sectionListPayload));
  const { data: sectionListData } = useCoursesQueries.useSectionListQuery({
    payload: sectionListPayload,
    enabled: sectionListQueryEnabled,
  });
  const sectionList = sectionListData?.data?.map(item => ({
    value: item?.section_no + (item?.course_suppl_cd ? '-'+ item?.course_suppl_cd : ''),
    label: item?.section_no + (item?.course_suppl_cd ? '-'+ item?.course_suppl_cd : ''),
  }));

  const { data: coursesSearchResult, isLoading: coursesSearchLoading } =
    useCoursesQueries.useSearchCoursesQuery({
      payload: courseListPayload,
      enabled: courseListQueryEnabled,
    });
  const coursesInfo = coursesSearchResult?.data;

  const {
    data: courseSectionSearchResult,
    isLoading: coursesSectionSearchLoading,
    refetch: refetchCourseDetails,
  } = useCoursesQueries.useSearchCoursesSectionQuery({
    payload: sectionListPayload,
    enabled: sectionListQueryEnabled,
  });
  const courseSectionInfo = courseSectionSearchResult?.data;

  const sectionDetailsPayload = index
    ? {
        regIndex: index,
        term: indexFilterTerm,
        year: indexFilterYear,
        semester: indexFilterSemester,
      }
    : { ...sectionListPayload, section };
  const sectionDetailsQueryEnabled = Boolean(
    allPropHasValue(sectionDetailsPayload)
  );

  const {
    data: courseSectionDetailsResult,
    isLoading: coursesSectionDetailsLoading,
    refetch: refetchCourseSectionDetails,
  } = useCoursesQueries.useCourseSectionDetailsQuery({
    payload: sectionDetailsPayload,
    enabled: sectionDetailsQueryEnabled,
  });

  const sectionDetails = courseSectionDetailsResult?.data;

  const handleDropdownChange = e => {
    const { name, value } = e.target;
    dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
  };
useEffect(()=>{
  console.log(filteredData);
  filteredData && filteredData?.length >0 && filteredData[0]?.term !== undefined 
  && filteredData[0]?.term !== null && filteredData[0]?.term !== ""  
  && filteredData[0]?.year && 
  dispatch({ type: `SET_SEMESTER`, payload:  `${filteredData[0]?.term}:${filteredData[0]?.year}`});
},[filteredData?.length >0 && filteredData[0]?.term ])
  const handleIndexInputChange = e => {
    dispatch({ type: 'SET_REG_INDEX', payload: e?.target?.value });
  };

  const handleIndexSearch = () => {
    dispatch({
      type: 'SET_INDEX_FILTER',
      payload: {
        regIndex,
        semester: indexSemester,
        term: indexTerm,
        year: indexYear,
      },
    });
  };

  const handleTabChange = (e, tabIndex) => {
    handleReset();
    setSelectedTab(tabIndex);
    if(tabIndex === 1){
      filteredData && filteredData?.length >0 && filteredData[0]?.term !== undefined 
      && filteredData[0]?.term !== null && filteredData[0]?.term !== ""  
      && filteredData[0]?.year && 
      dispatch({ type: `SET_INDEX_SEMESTER`, payload:  `${filteredData[0]?.term}:${filteredData[0]?.year}`});    
    }else{
      filteredData && filteredData?.length >0 && filteredData[0]?.term !== undefined 
      && filteredData[0]?.term !== null && filteredData[0]?.term !== ""  
      && filteredData[0]?.year && 
      dispatch({ type: `SET_SEMESTER`, payload:  `${filteredData[0]?.term}:${filteredData[0]?.year}`});    
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_FILTER' });
  };

  const handleCourseClick = courseData => {
    dispatch({ type: 'SET_COURSE', payload: courseData?.course_no });
  };

  const handleViewSection = sectionData => {
    dispatch({ type: 'SET_SECTION', payload: sectionData?.section_no });
  };

  const renderResults = () => {
    if (
      (coursesSearchLoading && courseListQueryEnabled) ||
      (coursesSectionSearchLoading && sectionListQueryEnabled) ||
      (coursesSectionDetailsLoading && sectionDetailsQueryEnabled)
    ) {
      return <CircularProgress />;
    }

    if (sectionDetailsQueryEnabled && sectionDetails) {
      return (
        <SpecificSection
          sectionDetails={sectionDetails}
          instructorsInfo={sectionDetails?.appointment}
          appointmentRequired={sectionDetails?.appointment_required}
          refetchCourseSectionDetails={refetchCourseSectionDetails}
        />
      );
    } else if (sectionListQueryEnabled && courseSectionInfo?.length > 0) {
      const selectedCourseInfo = coursesInfo?.find(
        courseInfo =>
          courseInfo?.course_no === course &&
          courseInfo?.offering_unit_cd === unit &&
          courseInfo.subj_cd === subject
      );
      return (
        <SpecificCourse
          courseInfo={selectedCourseInfo}
          resultData={courseSectionInfo}
          onViewClick={handleViewSection}
          refetchCourseDetails={refetchCourseDetails}
        />
      );
    } else if (courseListQueryEnabled && coursesInfo?.length > 0) {
      return (
        <CoursesResult
          resultData={coursesInfo}
          onCourseRowClick={handleCourseClick}
        />
      );
    }

    return (
      <>
        <Typography
          variant="h6"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#333333',
            fontSize: '2.25rem',
            margin: 0,
          }}
        >
          No Results Found
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1.5rem',
            margin: 0,
          }}
        >
          Try a new Search by Sections or Index # from above.
        </Typography>
      </>
    );
  };
  const renderSectionsTabContent = () => {
    return (
      selectedTab === 0 && (
        <div className="courses-list-form__grid">
          <div className="courses-list-form__grid__item">
            <SearchSelect
              label="Semester"
              placeholder="-- Select --"
              options={semesterList}
              value={semester || (filteredData?.length>0 && `${filteredData[0]?.term}:${filteredData[0]?.year}`) || ''}
              onChange={handleDropdownChange}
              name="semester"
              disabled={!semesterList?.length}
              required
              testId="section-semester-select"
            />
          </div>
          <div className="courses-list-form__grid__item">
            <SearchSelect
              label="Unit"
              placeholder="-- Select --"
              options={unitList}
              value={unit || ''}
              onChange={handleDropdownChange}
              name="unit"
              disabled={!unitList?.length}
              required
              testId="section-unit-select"
            />
          </div>
          <div className="courses-list-form__grid__item">
            <SearchSelect
              label="Subject"
              placeholder="-- Select --"
              options={subjectList}
              value={subjectDisplay || ''}
              onChange={handleDropdownChange}
              name="subject"
              disabled={!subjectList?.length}
              testId="section-subject-select"
              required
            />
          </div>
          <div className="courses-list-form__grid__item">
            <SearchSelect
              label="Course"
              placeholder="-- Select --"
              options={coursesList}
              value={course || ''}
              onChange={handleDropdownChange}
              name="course"
              disabled={!coursesList?.length}
              testId="section-course-select"
              required
            />
          </div>
          <div className="courses-list-form__grid__item">
            <SearchSelect
              label="Section - Course Supplement"
              placeholder="-- Select --"
              value={section || ''}
              options={sectionList}
              onChange={handleDropdownChange}
              name="section"
              testId="section-course-section-select"
              disabled={!sectionList?.length}
              required
            />
          </div>
        </div>
      )
    );
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleIndexSearch();
      event.preventDefault();
    }
  };

  const renderIndexTabContent = () => {
    return (
      selectedTab === 1 && (
        <div className="courses-list-form__grid">
          <div className="courses-list-form__grid__item">
            <SearchSelect
              label="Semester"
              placeholder="-- Select --"
              options={semesterList}
              value={indexSemester || (filteredData?.length>0 && `${filteredData[0]?.term}:${filteredData[0]?.year}`) || ''}
              onChange={handleDropdownChange}
              name="index_semester"
              disabled={!semesterList?.length}
              required
              testId="index-semester-select"
              sx={{ 'label + &': { marginTop: '1.875rem' } }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <SearchInputWithButton
              endAdornment={
                <InputAdornment position="end">
                  <SearchButton
                    className="black-btn"
                    startIcon={<SearchOutlinedIcon />}
                    onClick={handleIndexSearch}
                    testId="index-search-btn"
                    disabled={!(indexSemester && regIndex)}
                  />
                </InputAdornment>
              }
              onChange={handleIndexInputChange}
              onKeyDown={handleKeyDown}
              value={regIndex}
              label="Reg. Index"
              testId="index-reg-index-search"
              required
            />
          </div>
        </div>
      )
    );
  };

  return (
    <div className="courses-list">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Courses
      </Typography>
      <div className="courses-list-form">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 1.5rem',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              paddingBottom: '0.5rem',
              paddingRight: '1rem',
            }}
          >
            Search by:
          </Typography>
          <StyledTabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{ width: 'fit-content' }}
          >
            <StyledTab label="Sections" data-testid="tab-sections-search" />
            <StyledTab label="Index #" data-testid="tab-index-search" />
          </StyledTabs>
          <span className="icon-wrapper">
            <LightTooltip
              placement="left-start"
              arrow
              sx={{ '.MuiTooltip-tooltip': { maxWidth: 'unset' } }}
              title={
                <Typography
                  component="span"
                  nowrap
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    width: 'max-content',
                  }}
                >
                  <span>
                    Use sections or index numbers to search for courses.
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Use the button&nbsp;
                    <ResetIcon
                      style={{ height: '1rem', width: '1rem' }}
                      onClick={handleReset}
                    />
                    &nbsp;to reset search.
                  </span>
                </Typography>
              }
              data-testid="courses-search-tooltip"
            >
              <InfoIcon
                className="info-icon"
                data-testid="courses-search-tooltip-trigger"
              />
            </LightTooltip>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: '#666666' }}
            />
            <ResetIcon className="reset-icon" onClick={handleReset} />
          </span>
        </Box>
        {renderSectionsTabContent()}
        {renderIndexTabContent()}
        <div className="courses-list-form__results">
          {(selectedTab === 0 && !(semester && unit && subjectDisplay)) ||
          (selectedTab === 1 && !index) ? (
            <Typography
              variant="h6"
              paragraph
              sx={{
                fontWeight: '600',
                color: '#333333',
                fontSize: '1.5rem',
                margin: 0,
              }}
            >
              Try a new Search by Sections or Index # from above.
            </Typography>
          ) : (
            (selectedTab === 0 || selectedTab === 1) && renderResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
