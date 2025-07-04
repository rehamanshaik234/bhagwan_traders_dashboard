import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import useAuth from '../../../hooks/auth/useAuth';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const { login, error, loading, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboards/ecommerce');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  const handleLogin = () => {
    login(username, password);
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Box>
      </Stack>

      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Box>

      {subtitle}

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        message={error}
      />
    </>
  );
};

export default AuthLogin;
