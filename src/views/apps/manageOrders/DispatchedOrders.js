import React, { useState } from 'react';
import {
  Tabs, Tab,
  Typography, Paper, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow,
  Button, Chip, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import useNonPendingOrders from '../../../hooks/useFetchOrdersByStatus';
import { useOrderDetails } from '../../../hooks/orders/useOrderDetails';
import OrderMapDialog from './OrderMapDialog';
import { useNavigate } from 'react-router-dom';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Dispatched Orders' },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Dispatched":
      return "primary";
    case "Picked":
      return "info";
    case "OutForDelivery":
      return "warning";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const theme = useTheme();
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

const DispatchedOrder = () => {
  const [tab, setTab] = useState('Dispatched');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { orders, loading, error } = useNonPendingOrders();
  const { orderDetail, requestDetails } = useOrderDetails();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleView = (order) => {
    requestDetails(order.id);
    setOpenDialog(true);
  };

  const filteredOrders = orders.filter((order) => order.status.toLowerCase() === tab);

  return (
    <>
      <Breadcrumb title="Dispatched Orders" items={BCrumb} />

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} centered>
          <Tab label="Dispatched" value="Dispatched" />
          <Tab label="Picked" value="Picked" />
          <Tab label="Out For Delivery" value="Out For Delivery" />
        </Tabs>
      </Paper>

      <Paper variant="outlined">
        <TableContainer>
          {loading ? (
            <Box p={5} textAlign="center">
              <CircularProgress />
              <Typography mt={2}>Loading orders...</Typography>
            </Box>
          ) : error ? (
            <Box p={5} textAlign="center">
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredOrders
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.customer_id}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusColor(row.status)}
                        size="small"
                        // variant="outlined"
                      />
                    </TableCell>
                    <TableCell>₹{row.total_amount}</TableCell>
                    <TableCell>
                      {new Date(row.created_at).toLocaleDateString('en-IN')}<br />
                      {new Date(row.created_at).toLocaleTimeString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => navigate(`/order/${row.id}`, { state: { order: row } })}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No orders found for <strong>{tab}</strong> status.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                    onPageChange={setPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </TableContainer>
      </Paper>

      <OrderMapDialog open={openDialog} onClose={() => setOpenDialog(false)} order={orderDetail} />
    </>
  );
};

export default DispatchedOrder;
