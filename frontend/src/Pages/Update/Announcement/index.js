import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import AddNewAnnouncement from './AddNewAnnouncement';
import ExistingAnnouncement from './ExistingAnnouncement';

const Announcement = () => {
  const [refetchAnnouncements, setRefetchAnnouncements] = useState(
    new Date()?.valueOf()
  );

  return (
    <div className="announcement-container">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Announcement
      </Typography>
      <AddNewAnnouncement setRefetchAnnouncements={setRefetchAnnouncements} />
      <ExistingAnnouncement refetchAnnouncements={refetchAnnouncements} />
    </div>
  );
};

export default Announcement;
