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
  Modal,
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
import useSocket from '../../../hooks/Socket/useSocket';
import { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useLiveOrders } from "./../../../hooks/orders/useLiveOrders"
import OrderDetail from './OrderDetail';
import { blue } from '@mui/material/colors';

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
  const [customerId, setCustomerId] = useState(null);
  const [newOrderNotification, setNewOrderNotification] = useState(null);
  const [canPlayAudio, setCanPlayAudio] = useState(false);
  const { on, off, emit } = useSocket();
  const { orders } = useLiveOrders();
  const [dialog, setDialog] = useState(false);
  

  const {
    pendingOrders,
    loading,
    btnLoadingId,
    handleStatusUpdate,
    refetchPendingOrders,
  } = usePendingOrders();

  useEffect(() => {
    const handleUserInteraction = () => {
      setCanPlayAudio(true);
      window.removeEventListener('click', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);
  


  const handleOpenDialog = (orderId,customerId) => {
    setSelectedOrderId(orderId);
    setCustomerId(customerId)
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  const handleConfirmUpdate = async () => {
    if (selectedOrderId) {
      // handleStatusUpdate(selectedOrderId);
      emit("dispatch_order", {
      orderId: selectedOrderId,
      status: "Dispatched",
      customer_id : customerId
      });
      refetchPendingOrders();
      playNotificationSound();
      handleCloseDialog();
    }
  };

  const playNotificationSound = () => {
    if (!canPlayAudio) {
      console.warn("Audio blocked: no user interaction yet");
      return;
    }

    const audio = new Audio('/sound/notification.mp3');
    audio.play().catch((err) => {
      console.error("Audio playback failed:", err);
    });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pendingOrders.length) : 0;


    useEffect(() => {
      const handleNewOrder = (payload) => {
        console.log("New order received:", payload);
        setNewOrderNotification(`${payload.message} - orderId: ${payload.data.order_id}`);
        playNotificationSound();
      };

      on("new_order", handleNewOrder);

      return () => {
        off("new_order", handleNewOrder);
      };
    }, [on, off, canPlayAudio]);

  return (
    <>
      <Breadcrumb title="Pending Orders" items={BCrumb} />
        <Modal open={dialog} onClose={() => setDialog(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: 400,
            }}
          >
            <OrderDetail _id={selectedOrderId} />
            <Button variant="outlined" onClick={() => setDialog(false)} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
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
                  <TableCell sx={{ cursor: 'pointer', '&:hover': { color: blue[500], textDecoration: 'underline' } }} onClick={() => {
                      setSelectedOrderId(row.id);
                      setDialog(true);
                    }}>{row.id}</TableCell>
                  <TableCell sx={{ cursor: 'pointer', '&:hover': { color: blue[500], textDecoration: 'underline' } }} onClick={() => {
                      setSelectedOrderId(row.id);
                      setDialog(true);
                    }}>{row.customer_id}</TableCell>
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
                      onClick={() => handleOpenDialog(row.id,row.customer_id)}
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

      <Snackbar
        open={!!newOrderNotification}
        autoHideDuration={4000}
        onClose={() => setNewOrderNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="info" onClose={() => setNewOrderNotification(null)} variant="filled">
          {newOrderNotification}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PendingOrders;
