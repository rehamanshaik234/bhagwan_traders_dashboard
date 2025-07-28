import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import ScrollToTop from './components/shared/ScrollToTop';
import Router from './routes/Router';
import { Alert, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import { messaging, getToken, onMessage } from './firebase';
import { useEffect, useState } from 'react';
import useSocket from './hooks/Socket/useSocket';

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      'BDE1cpQDSHlLV4r8zNJ6dDyY_lc1f66nwsLI-bKMTV_QIOAAFzy-tj5P1o8usGkGnk-ZUpJmR4NZXjSS7DC4K60',
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Send token to your backend here if needed
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);
  const { on, off } = useSocket();
  const [notification, setNotification] = useState(null);
  const [canPlayAudio, setCanPlayAudio] = useState(false);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // You can show custom toast or alert here
    });
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          requestForToken();
        } else {
          console.log('Notification permission denied.');
        }
      });
    } else if (Notification.permission === 'granted') {
      requestForToken(); // already granted, just get the token
    }
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      setCanPlayAudio(true);
      window.removeEventListener('click', handleUserInteraction);
    };
    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const handleNewOrder = (payload) => {
      console.log('🔔 New order received:', payload);
      setNotification(`${payload.message} - orderId: ${payload.data.order_id}`);
      if (canPlayAudio) {
        const audio = new Audio('/sound/notification.mp3');
        audio.play().catch(console.error);
      }
    };

    on('new_order', handleNewOrder);
    return () => off('new_order', handleNewOrder);
  }, [on, off, canPlayAudio]);

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
        <Snackbar
          open={!!notification}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="info" onClose={() => setNewOrderNotification(null)} variant="filled">
            {notification}
          </Alert>
        </Snackbar>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
