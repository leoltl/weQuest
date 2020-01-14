import React, { useState, useCallback, useContext } from 'react';
import Requests from '../components/ActivityFeed/Requests';
import Bids from '../components/ActivityFeed/Bids';
import { IonSegment, IonContent, IonSegmentButton, IonLabel, IonPage, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

import './ActivityFeed.scss';

export default function ActivityFeed(props) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const match = useRouteMatch('/activity/:tab');
  const tab = match && match.params.tab === 'bids' ? 'bids' : 'requests';
  const { socket } = useContext(AuthContext);

  const handleTabClick = useCallback(
    e => {
      e.preventDefault();
      history.push(`/activity/${e.currentTarget.value}`);
    },
    [history],
  );

  useIonViewDidLeave(() => {
    socket.off('get-requests');
    socket.off('get-bids');
  });

  return (
    <IonPage id='activity-page'>
      <Header title='Activity'></Header>
      <IonContent>
        {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
        <Spinner message={showSpinner} />
        <IonToolbar className='activity__toolbar'>
          {/* <IonSegment onIonChange={e => setTab(e.detail.value)}> */}
          <IonSegment className='activity__segment' color={'primary'}>
            {/* <IonSegmentButton value='requests' checked={tab === 'requests'}> */}
            <IonSegmentButton value='requests' onClick={handleTabClick} checked={tab === 'requests'}>
              <IonLabel>Requests</IonLabel>
            </IonSegmentButton>
            {/* <IonSegmentButton value='bids' checked={tab === 'bids'}> */}
            <IonSegmentButton value='bids' onClick={handleTabClick} checked={tab === 'bids'}>
              <IonLabel>Bids</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {tab === 'requests' ? <Requests {...{ setErrorMessage, setShowSpinner }} /> : <Bids {...{ setErrorMessage, setShowSpinner }} />}
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
}
