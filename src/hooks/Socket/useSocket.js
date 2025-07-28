// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url = 'https://materialmart.shop') => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, { transports: ['websocket'], reconnection: true });
    return () => {
      socketRef.current.disconnect();
    };
  }, [url]);

  const on = (event, handler) => {
    socketRef.current?.on(event, handler);
  };
  const off = (event, handler) => {
    socketRef.current?.off(event, handler);
  };
  const emit = (event, payload) => {
    socketRef.current?.emit(event, payload);
  };

  return { on, off, emit };
};

export default useSocket;
