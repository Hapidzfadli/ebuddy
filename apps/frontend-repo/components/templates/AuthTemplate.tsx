import React, { ReactNode } from 'react';
import { Container, Box } from '@mui/material';

interface AuthTemplateProps {
  children: ReactNode;
  title?: string; // Made optional since we'll handle the title in LoginForm
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: { xs: 2, md: 4 }
      }}
    >
      <Container 
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default AuthTemplate;