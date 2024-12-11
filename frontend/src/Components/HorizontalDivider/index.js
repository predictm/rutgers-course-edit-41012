import React from 'react';
import Divider from '@mui/material/Divider';

const HorizontalDivider = ({ color, borderStyle, sx, ...rest }) => {
  return (
    <Divider
      sx={{
        borderColor: color || 'white',
        borderBottomWidth: '2px',
        borderStyle: borderStyle || 'solid',
        ...(sx ? sx : null),
      }}
      {...rest}
    />
  );
};

export default HorizontalDivider;
