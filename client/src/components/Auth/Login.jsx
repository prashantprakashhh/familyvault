// client/src/components/Auth/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import api from '../../services/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/login', { email, password });
      setMessage(res.data.message);
      // store token in localStorage
      localStorage.setItem('token', res.data.token);
      // redirect to home or dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <Box component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      <Card sx={{ maxWidth: 400, p: 2, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" mb={2}>
            Log In
          </Typography>
          {message && (
            <Typography variant="body2" color="error" mb={1}>
              {message}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField 
              label="Email" 
              type="email"
              variant="outlined" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField 
              label="Password" 
              type="password"
              variant="outlined" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" size="large">
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
