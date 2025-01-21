// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/store';
import { TextField, Button, Typography, Box, Container } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    // Reset error messages
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is not valid');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Validate the form fields
    if (!validateForm()) return;
  
    try {
      // Send a POST request to the correct login endpoint
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      console.log(res.data); // Debug response data
  
      if (res.data.token) {
        // Dispatch login success action with user data
        dispatch(loginSuccess(res.data));
        
        // Navigate to CarForm with user data
        navigate('/car-form', { state: { userId: res.data.userId } });
        console.log(res.data.userId); // Debug response data
      } else {
        dispatch(loginFailure('Invalid credentials.'));
      }
    } catch (err) {
      dispatch(loginFailure('Login failed. Please try again.'));
      console.error(err.response || err);
    }
  };
  
  

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          marginTop: '5vh',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Login
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ width: '80%' }}
          margin="normal"
          error={!!emailError} // Display error
          helperText={emailError} // Display error message
        />
        
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ width: '80%' }}
          margin="normal"
          error={!!passwordError} // Display error
          helperText={passwordError} // Display error message
        />

        <Button
          onClick={handleLogin}
          variant="contained"
          sx={{ marginTop: '5vh' }}
          color="primary"
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
