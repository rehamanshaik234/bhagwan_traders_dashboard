import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, Divider } from '@mui/material';

const OrderMapDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const { latitude, longitude, address, customer, order_items, total_amount, status, id } = order;
  const product = order_items?.[0]?.product;

  const gmapUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAgJaHy0QbjM9qZfn3NtDvdJQh4u6StR5s&origin=${latitude},${longitude}&destination=${address.latitude},${address.longitude}&mode=driving`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order #{id} Tracking</DialogTitle>
      <DialogContent>
        {/* Order Details */}
        <Box mb={2}>
          <Typography variant="subtitle1"><strong>Status:</strong> {status}</Typography>
          <Typography variant="subtitle1"><strong>Customer Number:</strong> {customer?.number}</Typography>
          <Typography variant="subtitle1"><strong>Delivery Address:</strong> {address?.building_name}, {address?.address_line}, {address?.city}, {address?.state} - {address?.postal_code}</Typography>
          <Typography variant="subtitle1"><strong>Total Amount:</strong> ₹{total_amount}</Typography>

          {/* Product Info */}
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
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Google Map */}
        <iframe
          title="Order Route"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={gmapUrl}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderMapDialog;
