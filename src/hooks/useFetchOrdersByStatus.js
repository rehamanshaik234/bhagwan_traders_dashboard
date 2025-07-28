import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNonPendingOrders  } from '../store/apps/orders/orderSlice';

const useFetchOrdersByStatus = () => {
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchNonPendingOrders());
  }, [dispatch]);

  return {
    orders: allOrders,
    loading,
    error,
  };
};

export default useFetchOrdersByStatus;
