import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import TuitionForm from './TuitionForm';

const AddNewTuition = ({
  row,
  unitListData,
  termAndYearList,
  refetchTuitionList,
}) => {
  const [openAddTuition, setOpenAddTuition] = useState(true);
  const toggleRowForAddTuition = () => setOpenAddTuition(!openAddTuition);

  const unitList = unitListData?.data?.map(item => ({
    value: item?.offering_unit,
    label: item?.offering_unit_cd,
  }));

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '2rem',
        padding: '1rem 0',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          paddingBottom: '0.5rem',
          paddingRight: '2rem',
          paddingLeft: '2rem',
          borderBottom: openAddTuition ? '1px solid rgba(0, 0, 0, 0.2)' : '0',
          display: 'flex',
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="div"
          sx={{
            fontWeight: '400',
            color: '#383C49',
            fontSize: '2rem',
          }}
        >
          Add New Tuition
        </Typography>
        {openAddTuition ? (
          <ExpandLess
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddTuition}
            data-testid="add-tuition-collapse"
          />
        ) : (
          <ExpandMore
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddTuition}
            data-testid="add-tuition-expand"
          />
        )}
      </Box>
      <Collapse in={openAddTuition}>
        <Box sx={{ padding: '2rem 2rem 1rem' }}>
          <TuitionForm
            tuitionData={row}
            unitList={unitList}
            termAndYearList={termAndYearList}
            refetchTuitionList={refetchTuitionList}
            testId="add-new-appointment-form"
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddNewTuition;
