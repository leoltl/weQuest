import React, { useState, useCallback, useContext } from 'react';
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
  IonTitle,
  useIonViewDidLeave
} from '@ionic/react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';


import './ActivityFeed.scss';

export default function ActivityFeed(props) {
  // const [tab, setTab] = useState('requests');
  
  const history = useHistory();
  const match = useRouteMatch('/activity/:tab');
  console.log(match)
  const tab = match && match.params.tab === 'bids' ? 'bids' : 'requests';
  const {socket} = useContext(AuthContext);
  
  const handleTabClick = useCallback((e) => { 
    e.preventDefault();
    history.push(`/activity/${e.currentTarget.value}`);
  }, [history]);

  useIonViewDidLeave(() => {
    socket.off('get-requests');
  })
  

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