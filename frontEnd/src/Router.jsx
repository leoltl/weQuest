import React, { useState, useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { contact, search, list, addCircleOutline, home } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import NewRequest from './pages/NewRequest';
import LoginScreen from './pages/LoginScreen';
import RequestFeed from './pages/RequestFeed';
import Profile from './pages/Profile';
import ActivityFeed from './pages/ActivityFeed';
import ProtectedRoute from './Routes/ProtectedRoute';
import { AuthContext } from './contexts/authContext';
import axios from 'axios';
import SearchPage from './pages/SearchPage';
import { Wave } from 'react-animated-text';
import SplashPage from './components/SpashPage';

export default function Router(props) {
  const [initialRender, setinitialRender] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  const getCurrentState = async e => {
    const _user = await axios.get('/api/users');
    setUser(prev => (prev && _user.data && prev.id === _user.data.id ? prev : _user.data || null));
    setinitialRender(false);
  };

  useEffect(() => {
    getCurrentState();
  }, [user]);

  return initialRender ? (
    <SplashPage />
  ) : (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet animated={false}>
          <Route path='/search' component={SearchPage} exact={true} />
          <Route path='/request/new' component={NewRequest} exact={true} />
          <Route path='/requests' component={RequestFeed} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/' render={() => <Redirect to='/requests' />} exact={true} />
          <ProtectedRoute path='/activity/:tab' component={ActivityFeed} />
          <ProtectedRoute path='/profile' component={Profile} />
        </IonRouterOutlet>
        <IonTabBar className='tab-bar' slot='bottom'>
          <IonTabButton tab='requestFeed' href='/requests'>
            <IonIcon alt='home feed' icon={home} />
          </IonTabButton>
          <IonTabButton tab='search' href='/search'>
            <IonIcon alt='search' icon={search} />
          </IonTabButton>
          <IonTabButton tab='newRequest' href='/request/new'>
            <IonIcon alt='create new request' icon={addCircleOutline} />
          </IonTabButton>
          <IonTabButton tab='activityFeed' href='/activity/requests/'>
            <IonIcon alt='activity feed' icon={list} />
          </IonTabButton>
          <IonTabButton tab='profile' href='/profile'>
            <IonIcon alt='profile' icon={contact} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
