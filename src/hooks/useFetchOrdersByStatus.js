import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDispatchedOrders } from '../store/apps/orders/orderSlice';

const useFetchOrdersByStatus = () => {
  const dispatch = useDispatch();
  const { dispatchedOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchDispatchedOrders());
  }, [dispatch]);

  return {
    orders: dispatchedOrders,
    loading,
    error,
  };
};

export default useFetchOrdersByStatus;
