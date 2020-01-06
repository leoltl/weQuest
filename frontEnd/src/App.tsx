import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { apps, flash, list, addCircleOutline, add } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import Tab1 from './pages/Tab1';
import NewRequest from './pages/NewRequest';
import LoginScreen from './pages/LoginScreen';
import Details from './pages/Details';
import RequestFeed from './pages/RequestFeed';
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

const App: React.FC = () => (
  <IonApp>
    <AuthContextProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/tab1" component={Tab1} exact={true} />
            <Route path="/tab2" component={NewRequest} exact={true} />
            <Route path="/tab2/details" component={Details} />
            <Route path="/requestFeed" component={RequestFeed} />
            <Route path="/login" component={LoginScreen} />
            <Route
              path="/"
              render={() => <Redirect to="/tab1" />}
              exact={true}
            />
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
            <IonTabButton tab="tab4" href="/login">
              <IonIcon icon={apps} />
              <IonLabel>Login</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </AuthContextProvider>
  </IonApp>
);

export default App;
