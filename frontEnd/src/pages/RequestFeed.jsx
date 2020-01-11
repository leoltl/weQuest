import React, { useState, useContext } from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent, useIonViewDidEnter } from '@ionic/react';
import axios from 'axios';
import RequestList from '../components/RequestList/RequestList';
import BidFormModal from './BidFormModal';
import { AuthContext } from '../contexts/authContext';
import { arr2Obj } from '../lib/utils';

const RequestFeed = () => {
  const [requests, setRequests] = useState({});
  const [selected, setSelected] = useState(null);
  const { socket } = useContext(AuthContext);

  useIonViewDidEnter(() => {
    axios.get('/api/requests').then(res => setRequests(arr2Obj(res.data)));

    socket.on('get-requests', event => {
      // console.log(event.data[0]);
      const update = event.data[0];
      setRequests(prev => {
        return { ...prev, [update.id]: update };
      });
    });
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
          // refractor to work with objs instead of passing down array
          requests={Object.values(requests)}
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
