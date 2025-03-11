import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

const Button: React.FC<CustomButtonProps> = ({ 
  children, 
  loading = false, 
  disabled, 
  ...rest 
}) => {
  return (
    <MuiButton
      disabled={loading || disabled}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;