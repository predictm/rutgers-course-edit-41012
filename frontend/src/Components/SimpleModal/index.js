import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const SimpleModal = ({ open, onClose, children, bgColor }) => {
  console.log("bg", bgColor)
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={onClose}
      sx={{
        // boxShadow: '0px 0px 5px #00000029',
        // backgroundColor: 'yellow',

        '& .MuiPaper-root': {
          backgroundColor: bgColor || '#F5F5F5',
          boxShadow: '0px 0px 5px #00000029',
        },
        '& .MuiDialogContent-root css-ypiqx9-MuiDialogContent-root': {
          padding: 0,
        },
        '& .MuiBackdrop-root': {
          // backgroundColor: 'green',
        },
        '& .MuiDialog-paper': {
          borderRadius: '2rem',
          // backgroundColor: '#F5F5F5',
          padding: '0px',
          margin: '0px',
        },
      }}
    >
      <DialogContent
        sx={{
          padding: '0',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SimpleModal;
