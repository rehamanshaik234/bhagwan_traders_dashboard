import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../utils/axios';
import {
  setAmountData,
  setProductData,
  setLoading,
  setError,
} from '../../store/apps/sales/salesSlice';

const useSalesData = ({ type = 'monthly', metric = 'amount', filters = {} }) => {
  const dispatch = useDispatch();
  const { amountData, productData, loading, error } = useSelector((state) => state.sales);

  const buildQuery = () => {
    const params = new URLSearchParams({ type, ...filters }).toString();
    return `/sales/${metric === 'product' ? 'product-stats' : 'amount-stats'}?${params}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(buildQuery());
        if (metric === 'product') {
          dispatch(setProductData(res.data.data));
        } else {
          dispatch(setAmountData(res.data.data));
        }
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [type, metric, JSON.stringify(filters), dispatch]); // ✅ Note JSON.stringify

  return {
    data: (metric === 'product' ? productData : amountData) || [],
    loading,
    error,
  };
};

export default useSalesData;
