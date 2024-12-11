import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';

import AnnouncementForm from './AnnouncementForm';

const AddNewAnnouncement = ({ setRefetchAnnouncements }) => {
  const [openAddAnnouncement, setOpenAddAnnouncement] = useState(true);
  const refetchAnnouncements = () =>
    setRefetchAnnouncements(new Date()?.valueOf());
  const toggleRowForAddAnnouncement = () =>
    setOpenAddAnnouncement(!openAddAnnouncement);

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
          borderBottom: openAddAnnouncement
            ? '1px solid rgba(0, 0, 0, 0.2)'
            : '0',
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
          Add New Announcement
        </Typography>
        {openAddAnnouncement ? (
          <ExpandLess
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddAnnouncement}
            data-testid="add-new-user-collapse"
          />
        ) : (
          <ExpandMore
            style={{
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={toggleRowForAddAnnouncement}
            data-testid="add-new-user-expand"
          />
        )}
      </Box>
      <Collapse in={openAddAnnouncement}>
        <Box sx={{ padding: '2rem 2rem 1rem' }}>
          <AnnouncementForm refetchAnnouncements={refetchAnnouncements} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddNewAnnouncement;
