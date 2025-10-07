import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Stack, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';

const LoginCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authUser');
        if (isAuthenticated) {
            navigate('/dashboards/ecommerce'); // Redirect to dashboard if already authenticated
        }else{
            navigate('/auth/login'); // Stay on login page
        }
    }, []);

    return (
          <PageContainer title="Login" description="this is Login page">
        </PageContainer>
    );
}

export default LoginCheck;
