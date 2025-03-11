import React from 'react';
import { Typography as MuiTypography, TypographyProps } from '@mui/material';

const Typography: React.FC<TypographyProps> = ({ children, ...rest }) => {
  return <MuiTypography {...rest}>{children}</MuiTypography>;
};

export default Typography;