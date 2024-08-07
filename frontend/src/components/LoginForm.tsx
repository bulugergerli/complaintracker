import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { userLoginRegister } from '../enpoints/auth';
import { LoginUser } from '../types/authTypes';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import SnackbarProvider, { useSnackbar } from './SnackbarProvider';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();



  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const loginUserData: LoginUser = {
      email: email,
      password: password,
    }

    userLoginRegister(loginUserData, "true")
      .then((data: any) => {
        cookies.set('token', data.token, { path: '/' });

        if (data.status == false) {
          openSnackbar('Login is not a success!', 'info', 'bottom', 'right');
        } else {
          openSnackbar('Login is a success!', 'success', 'bottom', 'right');
        }
        console.log(data.role);

        // TODO: redirect homepage 
        switch (data.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'user':
            navigate('/customer');
            break;
          case 'staff':
            navigate('/worker');
            break;
          case 'router':
            navigate('/router');
            break;
          default:
            // TODO: show error 
            break;
        }

      })
      .catch((error: Error) => {
        console.log("User creation failed:", error);
        // TODO: show error 
      });
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': { m: 1, width: '300px' },
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        ComplainTracker | Login
      </Typography>
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
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        Login
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link component={RouterLink} to="/register">Register</Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
