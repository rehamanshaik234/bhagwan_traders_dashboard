import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { IconPower } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import img1 from 'src/assets/images/profile/user-1.jpg';
import useAuth from '../../../../../hooks/auth/useAuth';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const handleLogout = () => {
    logoutUser();         // clears Redux & localStorage
    navigate('/auth/login'); // redirects to login
  };

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ m: 3, p: 2, bgcolor: `secondary.light` }}>
      {!hideMenu && (
        <>
          <Avatar alt={user?.name || 'User'} src={img1} />
          <Box>
            <Typography variant="h6" color="textPrimary" sx={{fontSize: '12px'}}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.role || 'Role'}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" onClick={handleLogout} aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );
};
