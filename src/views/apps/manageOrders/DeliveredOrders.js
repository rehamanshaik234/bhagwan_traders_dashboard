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
  CircularProgress,
} from '@mui/material';
import { Box } from '@mui/system';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import useFetchDeliveredOrders from '../../../hooks/useFetchDeliveredOrders';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Delivered Orders' },
];

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const theme = useTheme();

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

const DeliveredOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { orders: delivered, loading, error } = useFetchDeliveredOrders();

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - delivered.length) : 0;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Breadcrumb title="Delivered Orders" items={BCrumb} />
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
            <Table sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? delivered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : delivered
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.customer_id}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color="success" size="small" />
                    </TableCell>
                    <TableCell>₹{row.total_amount}</TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
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
                    count={delivered.length}
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
          )}
        </TableContainer>
      </Paper>
    </>
  );
};

export default DeliveredOrders;
