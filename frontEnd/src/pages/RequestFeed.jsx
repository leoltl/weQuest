import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent, useIonViewDidEnter } from '@ionic/react';
import axios from 'axios';
import RequestList from '../components/RequestList/RequestList';
import BidFormModal from './BidFormModal';
import io from 'socket.io-client';

const RequestFeed = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  useIonViewDidEnter(() => {
    const socket = io('/');
    // const socket = io('/');
    socket.on('connect', () => {
      console.log('socket connected', socket.connected);
      socket.emit('hi');
    });
    socket.on('update', msg => console.log(msg));

    axios.get('/api/requests').then(res => setRequests(res.data));
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>See all requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RequestList
          modal={BidFormModal}
          requests={requests}
          setRequests={setRequests}
          selectedId={selected}
          onClick={setSelected}
          buttonTitle='Bid Now'
        ></RequestList>
      </IonContent>
    </IonPage>
  );
};

export default RequestFeed;
