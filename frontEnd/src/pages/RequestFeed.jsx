import React, { useState, useContext, useCallback, useRef } from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent, useIonViewDidEnter, useIonViewWillLeave } from '@ionic/react';
import axios from 'axios';
import RequestList from '../components/RequestList/RequestList';
import BidFormModal from './BidFormModal';
import Header from '../components/Header';
import { AuthContext } from '../contexts/authContext';
import { arr2Obj } from '../lib/utils';
import Notification from '../components/Notification';
import { connect } from 'tls';
// import useOnClickOutside from '../components/useOnClickOutside';

const RequestFeed = () => {
  const [requests, setRequests] = useState({});
  const [selected, setSelected] = useState(null);
  const { socket, notification } = useContext(AuthContext);

  // to listen to clicks outside of the request list
  // const ref = useRef(selected);
  // useOnClickOutside(ref, () => setSelected(null));

  useIonViewDidEnter(() => {
    axios.get('/api/requests').then(res => {
      setRequests(arr2Obj(res.data));
    });

    document.addEventListener('click', handleClickOutside);

    socket.on('get-requests', event => {
      console.log('EVENT', event);
      const update = event.data;

      // only update requests if something is changed
      // console.log('PREV REQUESTS', requests);
      setRequests(prev => {
        // console.log('PREV', prev);
        // console.log('PREV ITEM', prev[update.id]);
        // console.log('INC', update);
        if (prev[update.id].priceCent !== update.priceCent) {
          return { ...prev, [update.id]: update };
        } else if (prev[update.id].requestStatus !== update.requestStatus) {
          const { [update.id]: undefined, ...rest } = prev;
          console.log('REST', rest);
          return rest;
        }

        return { ...prev };
      });
    });
  });

  useIonViewWillLeave(() => {
    document.removeEventListener('click', handleClickOutside);

    // disconnect from socket
    console.log('unmount listener request feed');
    socket.off('get-requests');
  });

  const onRefresh = useCallback(event => {
    axios
      .get('/api/requests')
      .then(res => setRequests(res.data))
      .then(event.detail.complete());
  });

  const handleClickOutside = useCallback(event => {
    console.log('PARENT EVENT', event);
    setSelected(null);
  });

  return (
    <IonPage>
      <Header title='Request Feed'></Header>
      <IonContent>
        <Notification />
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
