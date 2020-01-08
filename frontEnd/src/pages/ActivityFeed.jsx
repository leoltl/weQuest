import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Request from '../components/ActivityFeed/Request';
import Bids from '../components/ActivityFeed/Bids';
import {
  IonSegment,
  IonContent,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  useIonViewDidEnter,
} from '@ionic/react';
import { AuthContext } from '../contexts/authContext';

const LoginScreen = props => {
  const [tab, setTab] = useState('requests');
  const history = useHistory();

  return (
    <IonPage id="activity-page">
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonContent>
        <IonToolbar>
          <IonSegment onIonChange={e => setTab(e.detail.value)}>
            <IonSegmentButton value="requests" checked={tab === 'requests'}>
              <IonLabel>Requests</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="bids" checked={tab === 'bids'}>
              <IonLabel>Bids</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {tab === 'requests' ? <Request></Request> : <Bids></Bids>}
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
