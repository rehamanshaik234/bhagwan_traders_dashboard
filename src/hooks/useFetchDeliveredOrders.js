import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveredOrders } from '../store/apps/orders/orderSlice';

const useFetchDeliveredOrders = () => {
  const dispatch = useDispatch();
  const { deliveredOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchDeliveredOrders());
  }, [dispatch]);

  return {
    orders: deliveredOrders,
    loading,
    error,
  };
};

export default useFetchDeliveredOrders;
