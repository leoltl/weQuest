import React, { useEffect } from 'react';
import { IonApp } from '@ionic/react';

import Router from './Router';

import AuthContextProvider from './contexts/authContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

//instantiate socket connection
import io from 'socket.io-client';
import axios from 'axios';
const socket = io('/', { path: '/socket' });
// const socket = io('/', { path: '/socket', transports: ['websocket'] });
// const socket = io('/');
// socket.on('connect', () => {
//   console.log('socket connected', socket.connected);
// });

// socket.on('get-bids', data => {
//   socketData['get-bids'].push(data.data);
//   console.log('APP',socketData);
// });
// socket.on('get-requests', data => {
//   socketData['get-requests'].push(data.data);
//   console.log(socketData);
// });

// socket.on('queue', ({ event, data }) => {
//   event && (socketData[event] = socketData[event] || []).push(data);
//   console.log(socketData);
// });

const App = () => {
  useEffect(() => {
    socket.on('connect', () => {
      axios.get('/api/connect');
    });

    return (() =>{
      socket.off('notifications')
      socket.off('get-requests')
      socket.off('get-bids')
      socket.emit('disconnect')
    })
  }, [])

  return (<IonApp>
    <AuthContextProvider socket={socket}>
      <Router />
    </AuthContextProvider>
  </IonApp>)
};

export default App;
