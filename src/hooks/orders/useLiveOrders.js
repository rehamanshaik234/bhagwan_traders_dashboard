// src/hooks/useLiveOrders.js
import { useState, useEffect } from 'react';
import useSocket from '../Socket/useSocket';

export function useLiveOrders() {
  const { on, off } = useSocket();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    on('dispatched_order', (msg) => {
      const newOrder = msg.data;
      setOrders(prev => [newOrder, ...prev.filter(o => o.id !== msg.orderId)]);
    });
    return () => {
      off('dispatched_order');
    };
  }, [on, off]);

  return { orders };
}
