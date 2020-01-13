import React, { useState, useContext } from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave } from '@ionic/react';
import axios from 'axios';
import RequestList from '../components/RequestList/RequestList';
import BidFormModal from './BidFormModal';
import Header from '../components/Header';
import { AuthContext } from '../contexts/authContext';
import { arr2Obj } from '../lib/utils';

const RequestFeed = () => {
  const [requests, setRequests] = useState({});
  const [selected, setSelected] = useState(null);
  const { socket } = useContext(AuthContext);

  useIonViewDidEnter(() => {
    axios.get('/api/requests').then(res => {
      setRequests(arr2Obj(res.data));
    });

    console.log('mount listener request feed')
    socket.on('get-requests', event => {
      console.log('EVENT', event);
      const update = event.data;
      setRequests(prev => {
        return { ...prev, [update.id]: update };
      });
    });
  });

  useIonViewWillLeave(() => {
    // disconnect from socket
    console.log('unmount listener request feed')
    socket.off('get-requests');
  });

  const onRefresh = event => {
    axios
      .get('/api/requests')
      .then(res => setRequests(res.data))
      .then(event.detail.complete());
  };

  return (
    <IonPage>
      <Header title='Request Feed'></Header>
      <IonContent>
        <RequestList
          modal={BidFormModal}
          setRequests={setRequests}
          selectedId={selected}
          onClick={setSelected}
          buttonTitle='Bid Now'
          // refractor to work with objs instead of passing down array
          requests={Object.values(requests)}
          onRefresh={onRefresh}
        />
      </IonContent>
    </IonPage>
  );
};

export default RequestFeed;
