import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Menu, Avatar, Typography, Divider, Button, IconButton
} from '@mui/material';
import * as dropdownData from './data';
import { IconMail } from '@tabler/icons';
import { Stack } from '@mui/system';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import useAuth from '../../../../hooks/auth/useAuth';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => setAnchorEl2(event.currentTarget);
  const handleClose2 = () => setAnchorEl2(null);

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth/login');
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="user profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{
          ...(anchorEl2 && {
            color: 'primary.main',
          }),
        }}
      >
        <Avatar
          src={user?.avatar || '/src/assets/images/profile/user-1.jpg'}
          alt={user?.name || 'User'}
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ '& .MuiMenu-paper': { width: '360px' } }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>

            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar
                src={user?.avatar || '/src/assets/images/profile/user-1.jpg'}
                alt={user?.name || 'User'}
                sx={{ width: 95, height: 95 }}
              />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {user?.role || 'User Role'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <IconMail width={15} height={15} />
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {dropdownData.profile.map((profile) => (
              <Box key={profile.title} py={2}>
                <Link to={profile.href}>
                  <Stack direction="row" spacing={2} className="hover-text-primary">
                    <Box
                      width="45px"
                      height="45px"
                      bgcolor="primary.light"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Avatar
                        src={profile.icon}
                        alt={profile.icon}
                        sx={{ width: 24, height: 24, borderRadius: 0 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} color="textPrimary" noWrap>
                        {profile.title}
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle2" noWrap>
                        {profile.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              </Box>
            ))}

            <Box mt={2}>
              <Button variant="outlined" color="primary" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
