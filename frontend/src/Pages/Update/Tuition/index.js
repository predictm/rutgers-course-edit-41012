import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import AddNewTuition from './AddNewTuition';
import ExistingTuitions from './ExistingTuitions';
import { useTuitionsQueries } from 'services/queries';
import { useCoursesQueries } from 'services/queries';

const Tuitions = () => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [payload, setPayload] = useState({});
  const [ordering, setOrdering] = useState(
    'offering_unit_cd,offering_unit_name'
  );

  const { data: unitListData } = useCoursesQueries.useUnitListQuery({
    enabled: true,
  });

  const { data: semesterListData } = useCoursesQueries.useSemesterListQuery({
    enabled: true,
  });

  const semesterList = semesterListData?.data?.map(item => ({
    value: `${item?.year}--${item?.term}`,
    label: item?.semester_display,
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const setPayloadForTemplateFetch = searchFilter => {
    setPage(1);
    setPayload(searchFilter);
  };

  const setOrderForSorting = order => {
    setOrdering(order);
  };

  const { data: tuitionsListData, refetch: refetchTuitionList } =
    useTuitionsQueries.useGetTuitionsQuery({
      payload: {
        ...payload,
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        ordering,
      },
      enabled: true,
    });

  return (
    <div className="tuitions-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Tuition
      </Typography>
      <AddNewTuition
        unitListData={unitListData}
        termAndYearList={semesterList}
        refetchTuitionList={refetchTuitionList}
      />
      <ExistingTuitions
        unitListData={unitListData}
        termAndYearList={semesterList}
        tuitionsListData={tuitionsListData}
        refetchTuitionList={refetchTuitionList}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        setPayloadForTemplateFetch={setPayloadForTemplateFetch}
        setOrderForSorting={setOrderForSorting}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
};

export default Tuitions;
