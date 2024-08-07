import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userLoginRegister } from '../enpoints/auth';
import { CreateUser } from '../types/authTypes';
import SnackbarProvider, { useSnackbar } from './SnackbarProvider';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [user_name, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const createUserData: CreateUser = {
      name: name,
      surname: surname,
      user_name: user_name,
      email: email,
      password: password,
      role_id: 2,
      remember: true
    }
    userLoginRegister(createUserData, "false")
      .then((data: any) => {
        console.log(data);
        openSnackbar('Register is a success!', 'success', 'bottom', 'right');
        navigate('/login');
      })
      .catch((error: Error) => {
        openSnackbar('Register is not a success!', 'info', 'bottom', 'right');
        console.log("User creation failed:", error);
      });
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& .MuiTextField-root': { m: 1, width: '300px' },
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          ComplainTracker | Register
        </Typography>

        <TextField
          label="Name"
          variant="outlined"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Surname"
          variant="outlined"
          type="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <TextField
          label="Username"
          variant="outlined"
          type="user_name"
          value={user_name}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Register
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link component={RouterLink} to="/login">Login</Link>
        </Typography>
      </Box>
      <SnackbarProvider children={undefined} />
    </>
  );
};

export default RegisterForm;
