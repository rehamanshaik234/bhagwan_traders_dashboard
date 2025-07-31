import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TableFooter, TablePagination, TextField, Button, CircularProgress,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar,
  Tooltip, useTheme
} from "@mui/material";
import { Add, Delete, Edit, Lock } from "@mui/icons-material";
import { useUsers } from "../../../hooks/users/useUsers";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Users" },
];

const AddUser = () => {
  const {
    users, loading, getUsers,
    addUser, updateUser, deleteUser, changePassword
  } = useUsers();

  const [openModal, setOpenModal] = useState(false);
  const [openPwdModal, setOpenPwdModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const theme = useTheme();

  useEffect(() => {
    getUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setForm(
      user
        ? { name: user.name, email: user.email, role: user.role, password: "" }
        : { name: "", email: "", role: "", password: "" }
    );
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        const response = await updateUser(selectedUser.id, form);
        setSnackbar({ open: true, message: response.data.message ?? "User updated successfully" });
      } else {
        const response = await addUser(form);
        setSnackbar({ open: true, message: response.data.message ?? "User added successfully" });
      }
      getUsers();
      setOpenModal(false);
    } catch (err) {
      setSnackbar({ open: true, message: "Error saving user" });
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ open: true, userId: id });
  };

  const handleDelete = async () => {
    try {
      const response = await deleteUser(deleteConfirm.userId);
      getUsers();
      setSnackbar({ open: true, message: response.data.message ?? "User deleted" });
    } catch {
      setSnackbar({ open: true, message: "Delete failed" });
    } finally {
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await changePassword(selectedUser.id, passwordForm);
      setSnackbar({ open: true, message: response.data.message ?? "Password updated" });
      setOpenPwdModal(false);
    } catch {
      setSnackbar({ open: true, message: "Password update failed" });
    }
  };

  return (
    <>
      <Breadcrumb title="Users" items={BCrumb} />
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpenModal()}>
            Add User
          </Button>
        </Box>

        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit"><IconButton color="primary" onClick={() => handleOpenModal(user)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton color="error" onClick={() => confirmDelete(user.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Change Password"><IconButton onClick={() => { setSelectedUser(user); setOpenPwdModal(true); }}><Lock fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {loading ? "Loading..." : "No users found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Add/Edit User Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} fullWidth />
          <TextField label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} fullWidth />
          {!selectedUser && (
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={openPwdModal} onClose={() => setOpenPwdModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Current Password" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} fullWidth />
          <TextField label="New Password" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPwdModal(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, userId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, userId: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
};

export default AddUser;
