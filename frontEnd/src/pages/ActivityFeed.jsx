import React, { useState, useContext } from 'react';
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
  useIonViewDidLeave,
} from '@ionic/react';
import { AuthContext } from '../contexts/authContext';


import './ActivityFeed.scss';

const ActivityFeed = props => {
  const [tab, setTab] = useState('requests');
  const {socket} = useContext(AuthContext);

  useIonViewDidLeave(() => {
    socket.off('get-requests');
  })


  return (
    <IonPage id='activity-page'>
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonContent>
        <IonToolbar className='activity-toolbar'>
          <IonSegment onIonChange={e => setTab(e.detail.value)}>
            <IonSegmentButton value='requests' checked={tab === 'requests'}>
              <IonLabel>Requests</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='bids' checked={tab === 'bids'}>
              <IonLabel>Bids</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {tab === 'requests' ? <Request /> : <Bids />}
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
};

export default ActivityFeed;
