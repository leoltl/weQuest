import React, { useState } from 'react';
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
} from '@ionic/react';

import './ActivityFeed.scss';

const ActivityFeed = props => {
  const [tab, setTab] = useState('requests');

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
          {tab === 'requests' ? <Request></Request> : <Bids></Bids>}
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
};

export default ActivityFeed;
