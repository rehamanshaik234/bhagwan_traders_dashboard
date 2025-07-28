import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { useOrderDetails } from '../../../hooks/orders/useOrderDetails';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/dispatchedOrders', title: 'Dispatched Orders' },
  { title: 'Order Details' }
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orderDetail, requestDetails, loading } = useOrderDetails();

  useEffect(() => {
    requestDetails(id);
  }, [id]);

  if (loading || !orderDetail) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading order details...</Typography>
      </Box>
    );
  }

  // Destructure necessary fields
  const {
    customer_id,
    status,
    total_amount,
    created_at,
    latitude,
    longitude,
    address,
    customer,
    order_items,
  } = orderDetail;

  const product = order_items?.[0]?.product;

  const gmapUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAgJaHy0QbjM9qZfn3NtDvdJQh4u6StR5s&origin=${latitude},${longitude}&destination=${address?.latitude},${address?.longitude}&mode=driving`;

  return (
    <>
      <Breadcrumb title={`Order #${id}`} items={BCrumb} />
      <Paper sx={{ p: 3, mb: 4 }}>
        <Button variant="contained" onClick={() => navigate('/dispatchedOrders')} sx={{ mb: 2 }}>
          ← Back to Dispatched Orders
        </Button>

        <Typography variant="h6">Customer ID: {customer_id}</Typography>
        <Typography>Status: {status}</Typography>
        <Typography>Total Amount: ₹{total_amount}</Typography>
        <Typography>
          Created At: {new Date(created_at).toLocaleString('en-IN')}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Delivery Details</Typography>
        <Typography><strong>Customer Number:</strong> {customer?.number}</Typography>
        <Typography>
          <strong>Address:</strong> {address?.building_name}, {address?.address_line}, {address?.city}, {address?.state} - {address?.postal_code}
        </Typography>

        {product && (
          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <Avatar
              src={product.image_url}
              alt={product.name}
              variant="rounded"
              sx={{ width: 64, height: 64 }}
            />
            <Typography variant="subtitle1">{product.name}</Typography>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Delivery Route (Google Maps)</Typography>
        <iframe
          title="Order Route"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={gmapUrl}
        />
      </Paper>
    </>
  );
};

export default OrderDetail;
