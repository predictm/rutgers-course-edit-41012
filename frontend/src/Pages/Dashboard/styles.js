import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { ReactComponent as EditIcon } from 'assets/icons/icon-edit.svg';
import { ReactComponent as GraphIcon } from 'assets/icons/icon-view-appointments.svg';

export const StyledEditIcon = styled(EditIcon)({
  height: '2rem',
  width: '1.563rem',
  cursor: 'pointer',

  path: {
    fill: '#FFFFFF',
  },
});

export const StyledBox = styled(Box)({
  background: '#F5F5F5',
  borderRadius: '1.875rem',
  width: '32%',
  height: '10rem',
  padding: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  position: 'relative',

  '.profile-edit-icon': {
    position: 'absolute',
    top: '1.25rem',
    right: '1.125rem',
    opacity: 0,
  },

  '&:hover .profile-edit-icon': {
    opacity: 1,
  },
});

export const AppointMentGraphIcon = styled(GraphIcon)({
  width: '2.188rem',
  height: '1.563rem',
  position: 'absolute',
  top: '1.25rem',
  right: '1.125rem',
});

export const StyledStack = styled(Stack)({
  borderRadius: '1.875rem',
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  padding: '1.25rem',
  backgroundColor: '#FFFFFF',
});
