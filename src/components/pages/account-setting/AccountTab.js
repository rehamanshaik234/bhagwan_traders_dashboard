import React, { useEffect, useState } from 'react';
import {
  CardContent, Grid, Typography, MenuItem, Button, Stack, Snackbar
} from '@mui/material';
import axios from '../../../utils/axios';
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../forms/theme-elements/CustomSelect';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' }
];

const AccountTab = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load user from token/localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('authUser'));
    if (userInfo && userInfo.id) {
      setUserId(userInfo.id);
      setFormData({
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role
      });
    } else {
      setErrorMsg('User not authenticated');
    }
  }, []);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswords(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/user/updateUser/${userId}`, formData);
      if (res.data.success) {
        setSuccessMsg('User updated successfully');
        localStorage.setItem('authUser', JSON.stringify({ ...formData, id: userId }));
      } else {
        setErrorMsg(res.data.message || 'Update failed');
      }
    } catch (err) {
      setErrorMsg('Server error while updating');
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      return setErrorMsg('New password and confirm password must match');
    }

    try {
      const res = await axios.put(`/user/userChangePassword/${userId}`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      if (res.data.success) {
        setSuccessMsg('Password changed successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setErrorMsg(res.data.message || 'Password change failed');
      }
    } catch (err) {
      setErrorMsg('Server error while changing password');
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Personal Details */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>Personal Details</Typography>
            <Typography color="textSecondary" mb={3}>Edit your personal details</Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="name">Your Name</CustomFormLabel>
                  <CustomTextField id="name" value={formData.name} onChange={handleChange('name')} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="role">Role</CustomFormLabel>
                  <CustomSelect id="role" value={formData.role} onChange={handleChange('role')} fullWidth>
                    {roles.map(role => (
                      <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                  <CustomTextField id="email" value={formData.email} onChange={handleChange('email')} fullWidth />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </BlankCard>
      </Grid>

      {/* Password Section */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>Change Password</Typography>
            <Typography color="textSecondary" mb={3}>Change your password</Typography>
            <form>
              <CustomFormLabel htmlFor="current">Current Password</CustomFormLabel>
              <CustomTextField id="current" type="password" value={passwords.current} onChange={handlePasswordChange('current')} fullWidth />
              <CustomFormLabel htmlFor="new">New Password</CustomFormLabel>
              <CustomTextField id="new" type="password" value={passwords.new} onChange={handlePasswordChange('new')} fullWidth />
              <CustomFormLabel htmlFor="confirm">Confirm Password</CustomFormLabel>
              <CustomTextField id="confirm" type="password" value={passwords.confirm} onChange={handlePasswordChange('confirm')} fullWidth />
              <Stack mt={2}>
                <Button variant="outlined" color="primary" onClick={handleChangePassword}>Save Password</Button>
              </Stack>
            </form>
          </CardContent>
        </BlankCard>
      </Grid>

      {/* Save Button */}
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="end" mt={3}>
          <Button size="large" variant="contained" color="primary" onClick={handleSave}>Save</Button>
          {/* <Button size="large" variant="text" color="error">Cancel</Button> */}
        </Stack>
      </Grid>

      {/* Toasts */}
      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}/>
      <Snackbar open={!!errorMsg} autoHideDuration={3000} onClose={() => setErrorMsg('')} message={errorMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}/>
    </Grid>
  );
};

export default AccountTab;
