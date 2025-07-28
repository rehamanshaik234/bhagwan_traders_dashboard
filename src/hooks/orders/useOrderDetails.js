// src/hooks/useOrderDetails.js
import { useEffect, useState, useCallback } from 'react';
import useSocket from '../Socket/useSocket';

export function useOrderDetails() {
  const { on, off, emit } = useSocket();
  const [orderDetail, setOrderDetail] = useState(null);

  const requestDetails = useCallback((orderId) => {
    setOrderDetail(null);
    emit('get_order_details', { orderId });
  }, [emit]);

  useEffect(() => {
    on('order_details', (msg) => {
      setOrderDetail(msg.data);
    });
    return () => {
      off('order_details');
    };
  }, [on, off]);

  return { orderDetail, requestDetails };
}
