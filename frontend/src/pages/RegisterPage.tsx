import React from 'react';
import { Container, Box } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;
