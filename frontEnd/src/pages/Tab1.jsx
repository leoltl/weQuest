import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonThumbnail,
  IonButton,
} from '@ionic/react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React, { useState } from 'react';

import './Tab1.scss';

const Tab1 = props => {
  const [state, setState] = useState({ user: {} });
  const [showBidForm, setShowBidForm] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab One</IonTitle>
        </IonToolbar>
      </IonHeader>
      z
      <IonContent>
        <IonCard className="welcome-card">
          <img src="/assets/shapes.svg" alt="" />
          <IonCardHeader>
            <IonCardSubtitle>Get Started</IonCardSubtitle>
            <IonCardTitle>Welcome to Ionic</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Now that your app has been created, you'll want to start building out features and components. Check out some of the resources
              below for next steps.
            </p>
          </IonCardContent>
        </IonCard>
        <IonList lines="none">
          <IonListHeader>
            <IonLabel>Resources</IonLabel>
          </IonListHeader>
          <IonItem href="https://ionicframework.com/docs/" target="_blank">
            <IonIcon slot="start" color="medium" icon={book} />
            <IonLabel>Ionic Documentation</IonLabel>
          </IonItem>
          <IonItem href="https://ionicframework.com/docs/building/scaffolding" target="_blank">
            <IonIcon slot="start" color="medium" icon={build} />
            <IonLabel>Scaffold Out Your App</IonLabel>
          </IonItem>
          <IonItem href="https://ionicframework.com/docs/layout/structure" target="_blank">
            <IonIcon slot="start" color="medium" icon={grid} />
            <IonLabel>Change Your App Layout</IonLabel>
          </IonItem>
          <IonItem href="https://ionicframework.com/docs/theming/basics" target="_blank">
            <IonIcon slot="start" color="medium" icon={colorFill} />
            <IonLabel>Theme Your App</IonLabel>
          </IonItem>

          {state.user.name && (
            <IonItem>
              <IonThumbnail slot="start">
                <img alt="hi" src={state.user.picture.data.url} />
              </IonThumbnail>
              <IonLabel>
                <h3>{state.user.name}</h3>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
        <IonButton onClick={(e) => setShowBidForm(true)}>Show Bid Screen</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
