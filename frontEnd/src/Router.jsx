import React ,{ useState, useContext, useEffect } from 'react';
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
import ProtectedRoute from './Routes/ProtectedRoute';
import { AuthContext } from './contexts/authContext';
import Spinner from './components/Spinner';
import axios from 'axios';


export default function Router(props) {
  const [initialRender, setinitialRender] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  
  useEffect(() => {
    const getCurrentState = async e => {
      const user = await axios.get('/api/users');
      setUser(user.data);
      console.log("USER DEBUG", user)
      setinitialRender(false);
    };

    if (initialRender) {
      getCurrentState();
    }

  }, []);


  
  return initialRender ? <Spinner message='weQuest' ></Spinner> : (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tab1" component={Tab1} exact={true} />
          <Route path="/tab2" component={NewRequest} exact={true} />
          <Route path="/tab2/details" component={Details} />
          <Route path="/requestFeed" component={RequestFeed} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/activity" component={ActivityFeed} />
          <Route path="/" render={() => <Redirect to="/tab1" />} exact={true} />
          <ProtectedRoute path="/profile" component={Profile} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={flash} />
            <IonLabel>Tab One</IonLabel>
          </IonTabButton>{' '}
          */}
          <IonTabButton tab="requestFeed" href="/requestFeed">
            <IonIcon icon={list} />
            <IonLabel>Request Feed</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={add} />
            <IonLabel>Tab Two</IonLabel>
          </IonTabButton>
          <IonTabButton tab="activityFeed" href="/activity">
            <IonIcon icon={list} />
            <IonLabel>Activity</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/profile">
            <IonIcon icon={apps} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )
}