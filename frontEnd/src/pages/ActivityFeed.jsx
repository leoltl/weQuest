import React, { useState, useCallback } from 'react';
import Requests from '../components/ActivityFeed/Requests';
import Bids from '../components/ActivityFeed/Bids';
import {
  IonSegment,
  IonContent,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import './ActivityFeed.scss';

export default function ActivityFeed(props) {
  // const [tab, setTab] = useState('requests');
  
  const history = useHistory();
  const match = useRouteMatch('/activity/:tab');
  const tab = match && match.params.tab === 'bids' ? 'bids' : 'requests';

  const handleTabClick = useCallback((e) => { 
    e.preventDefault();
    history.push(`/activity/${e.currentTarget.value}`);
  }, [history]);
  

  return (
    <IonPage id='activity-page'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Activity Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonToolbar className='activity-toolbar'>
          {/* <IonSegment onIonChange={e => setTab(e.detail.value)}> */}
          <IonSegment>
            {/* <IonSegmentButton value='requests' checked={tab === 'requests'}> */}
            <IonSegmentButton value='requests' onClick={handleTabClick} checked={tab === 'requests'}>
              <IonLabel>Requests</IonLabel>
            </IonSegmentButton>
            {/* <IonSegmentButton value='bids' checked={tab === 'bids'}> */}
            <IonSegmentButton value='bids' onClick={handleTabClick} checked={tab === 'bids'}>
              <IonLabel>Bids</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {tab === 'requests' ? <Requests /> : <Bids />}
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
}