import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

const Input: React.FC<TextFieldProps> = (props) => {
  return <TextField fullWidth variant="outlined" {...props} />;
};

export default Input;