export const initialState = {
  courseFilters: {
    semester: '',
    unit: '',
    subjectDisplay: '',
    course: '',
    section: '',
    term: '',
    year: '',
    subject: '',
    unitLevel: '',
  },
  indexFilter: {
    index: '',
    semester: '',
    term: '',
    year: '',
  },
  regIndex: '',
  indexTerm: '',
  indexYear: '',
  indexSemester: '',
};

const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEMESTER': {
      const [term, year] = action.payload?.split(':') || [];
      return {
        ...initialState,
        courseFilters: {
          semester: action.payload,
          term,
          year,
        },
      };
    }
    case 'SET_UNIT': {
      return {
        ...initialState,
        courseFilters: {
          ...state.courseFilters,
          unit: action?.payload,
          subjectDisplay: '',
          subject: '',
          unitLevel: '',
          course: '',
          section: '',
        },
      };
    }
    case 'SET_SUBJECT': {
      const [subject, unitLevel] = action.payload?.split(':') || [];
      return {
        ...initialState,
        courseFilters: {
          ...state.courseFilters,
          subjectDisplay: action?.payload,
          subject,
          unitLevel,
          course: '',
          section: '',
        },
      };
    }
    case 'SET_COURSE': {
      return {
        ...initialState,
        courseFilters: {
          ...state.courseFilters,
          course: action?.payload,
        },
      };
    }
    case 'SET_SECTION': {
      return {
        ...initialState,
        courseFilters: {
          ...state.courseFilters,
          section: action?.payload,
        },
      };
    }
    case 'SET_COURSE_FILTER': {
      return {
        ...initialState,
        courseFilters: action.payload,
      };
    }
    case 'SET_REG_INDEX': {
      return {
        ...initialState,
        regIndex: action.payload,
        indexSemester: state?.indexSemester,
        indexTerm: state?.indexTerm,
        indexYear: state?.indexYear,
      };
    }
    case 'SET_INDEX_SEMESTER': {
      const [term, year] = action.payload?.split(':') || [];
      return {
        ...initialState,
        regIndex: state.regIndex,
        indexSemester: action.payload,
        indexTerm: term,
        indexYear: year,
      };
    }
    case 'SET_INDEX_FILTER': {
      return {
        ...state,
        courseFilter: {
          ...initialState.courseFilters,
        },
        indexFilter: {
          index: action.payload.regIndex,
          semester: action.payload.semester,
          term: action.payload.term,
          year: action.payload.year,
        },
      };
    }
    case 'RESET_FILTER': {
      return {
        ...initialState,
      };
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
};

export default coursesReducer;
