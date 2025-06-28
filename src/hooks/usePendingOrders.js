import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingOrders, updateOrderStatus } from '../store/apps/orders/orderSlice';

const usePendingOrders = () => {
  const dispatch = useDispatch();
  const { pendingOrders, loading } = useSelector((state) => state.orders);
  const [btnLoadingId, setBtnLoadingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId) => {
    setBtnLoadingId(orderId);
    try {
      await dispatch(updateOrderStatus({ orderId, newStatus: 'dispatched' })).unwrap();
    } finally {
      setBtnLoadingId(null);
    }
  };

  return {
    pendingOrders,
    loading,
    btnLoadingId,
    handleStatusUpdate,
  };
};

export default usePendingOrders;
