import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent, useIonViewDidEnter } from '@ionic/react';
import axios from 'axios';
import RequestList from '../components/RequestList/RequestList';
import BidFormModal from './BidFormModal';


const RequestFeed = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  useIonViewDidEnter(() => {
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
        <RequestList modal={BidFormModal} requests={requests} setRequests={setRequests} selectedId={selected} onClick={setSelected}></RequestList>
      </IonContent>
    </IonPage>
  );
};

export default RequestFeed;
