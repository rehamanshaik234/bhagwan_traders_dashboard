import React, { useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { Box } from '@mui/system';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import usePendingOrders from '../../../hooks/usePendingOrders';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Pending Orders' },
];

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const PendingOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
const [selectedOrderId, setSelectedOrderId] = useState(null);

const handleOpenDialog = (orderId) => {
  setSelectedOrderId(orderId);
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setSelectedOrderId(null);
};

const handleConfirmUpdate = () => {
  if (selectedOrderId) {
    handleStatusUpdate(selectedOrderId);
    handleCloseDialog();
  }
};


  const {
    pendingOrders,
    loading,
    btnLoadingId,
    handleStatusUpdate,
  } = usePendingOrders();

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pendingOrders.length) : 0;

  return (
    <>
      <Breadcrumb title="Pending Orders" items={BCrumb} />
      <Paper variant="outlined">
        <TableContainer>
          <Table sx={{ whiteSpace: 'nowrap' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? pendingOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : pendingOrders
              ).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.customer_id}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color="warning" size="small" />
                  </TableCell>
                  <TableCell>${row.total_amount}</TableCell>
                  <TableCell>
                      {new Date(row.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      {new Date(row.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={btnLoadingId === row.id}
                      onClick={() => handleOpenDialog(row.id)}
                      startIcon={
                        btnLoadingId === row.id ? <CircularProgress size={18} color="inherit" /> : null
                      }
                    >
                      {btnLoadingId === row.id ? 'Updating...' : 'Dispatch'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={pendingOrders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Confirm Dispatch</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark this order as dispatched?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdate} color="primary" variant="contained">
              Yes, Dispatch
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default PendingOrders;
