import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { apps, flash, list, add } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import Tab1 from './pages/Tab1';
import NewRequest from './pages/NewRequest';
import LoginScreen from './pages/LoginScreen';
import Details from './pages/Details';
import RequestFeed from './pages/RequestFeed';
import Profile from './pages/Profile';
import ActivityFeed from './pages/ActivityFeed';
import AuthContextProvider from './contexts/authContext';

import ProtectedRoute from './Routes/ProtectedRoute';
import Router from './Router';

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
const socket = io('/', { path: '/socket' });
// const socket = io('/');
socket.on('connect', () => {
  console.log('socket connected', socket.connected);
  socket.emit('hi');
});
const socketData = {
  'get-bids': [],
  'get-requests': []
}
socket.on('get-bids', (data) => {
  socketData['get-bids'].push(data.data);
  console.log(socketData);
});
socket.on('get-requests', (data) => {
  socketData['get-requests'].push(data.data);
  console.log(socketData);
});


const App = () => (
  <IonApp>
    <AuthContextProvider>
      <Router></Router>
    </AuthContextProvider>
  </IonApp>
);

export default App;
