// src/hooks/useLiveOrders.js
import { useState, useEffect } from 'react';
import useSocket from '../Socket/useSocket';
import { func } from 'prop-types';
import { useDispatch } from 'react-redux';

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

export function orderDetails(){
  const dispatch = useDispatch();
  
}
