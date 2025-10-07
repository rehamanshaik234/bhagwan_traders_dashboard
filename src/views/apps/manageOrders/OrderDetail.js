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
import _ from 'lodash';
import { fontWeight } from '@mui/system';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/dispatchedOrders', title: 'Dispatched Orders' },
  { title: 'Order Details' }
];

const OrderDetail = ({ _id }) => {
  const { id } = useParams();
  const orderId = _id || id;

  const navigate = useNavigate();
  const { orderDetail, requestDetails, loading } = useOrderDetails();

  useEffect(() => {
    requestDetails(orderId);
  }, [orderId]);

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


  const gmapUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAgJaHy0QbjM9qZfn3NtDvdJQh4u6StR5s&origin=${latitude},${longitude}&destination=${address?.latitude},${address?.longitude}&mode=driving`;

  return (
    <>
      {console.log( order_items?.[0])}
      <Breadcrumb title={`Order #${orderId}`} items={BCrumb} visibility={_id==null} />
      <Paper sx={{ p: 3, mb: 4 }}>
        <Button variant="contained" onClick={() => navigate('/dispatchedOrders')} sx={{ mb: 2, display: _id!=null ? 'none' : '' }}>
          ← Back to Dispatched Orders
        </Button>
        <Typography variant="h6" gutterBottom>Order Details</Typography>
        <Typography> <strong style={{ color: "grey" }}>Status:</strong> {status}</Typography>
        <Typography> <strong style={{ color: "grey" }}>Total Amount:</strong> ₹{total_amount}</Typography>
        <Typography> <strong style={{ color: "grey" }}>Ordered At:</strong> {new Date(created_at).toLocaleString('en-IN')}</Typography>
        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Customer Details</Typography>
        <Typography><strong style={{ color: "grey" }}>Number:</strong> {customer?.number}</Typography>
        <Typography>
          <strong style={{ color: "grey" }}>Address:</strong> {address?.building_name}, {address?.address_line}, {address?.city}, {address?.state} - {address?.postal_code}
        </Typography>

        <Divider sx={{ my: 3 , display: order_items?.length > 0 ? 'block' : 'none' }} />
        <Typography variant="h6" gutterBottom sx={{ display: order_items?.length > 0 ? 'block' : 'none'}}>Delivery Items</Typography>
      {
        order_items?.length > 0 && (
          order_items.map((item, index) => (
            <Box mt={2} display="flex" alignItems="center" gap={2} sx={{display: 'flex', justifyContent:"space-evenly"}}>
                <Avatar
                  src={item.product.image_url}
                  alt={item.product.name}
                  variant="rounded"
                sx={{ width: 64, height: 64 }}
              />
              <Typography variant="subtitle1">{item.product.name}</Typography>
              <Typography variant="subtitle1">X</Typography>
              <Typography variant="subtitle1">{item.quantity}</Typography>
            </Box>
          ))

      )}
      </Paper>

      <Paper sx={{ p: 3 , display: _id!=null ? 'none' : '' }}>
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
