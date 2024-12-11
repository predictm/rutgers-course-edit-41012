import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SimpleModal from 'Components/SimpleModal';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import AnnouncementForm from './AnnouncementForm';

const AnnouncementEditModal = ({
  open,
  onClose,
  refetchAnnouncements,
  announcementData,
}) => {
  return (
    <SimpleModal open={open} onClose={onClose}>
      <div style={{ paddingLeft: '2rem', paddingRight: '1rem' }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: '2px solid #C9C9C9' }}
        >
          <Grid item>
            <Typography
              variant="h4"
              sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
              data-testid="edit-announcement-title"
            >
              Edit Announcement - {announcementData?.id}
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={onClose}
              style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
              data-testid="close-edit-announcement-modal"
            />
          </Grid>
        </Grid>
      </div>
      <Box container my={2}>
        <AnnouncementForm
          announcementData={announcementData}
          refetchAnnouncements={refetchAnnouncements}
          onCancel={onClose}
          testId="edit-announcement-modal"
        />
      </Box>
    </SimpleModal>
  );
};

export default AnnouncementEditModal;
