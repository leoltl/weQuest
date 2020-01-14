import React, { useState, useContext, useCallback } from 'react';
import { IonPage, IonContent, useIonViewDidEnter, useIonViewWillLeave } from '@ionic/react';
import axios from 'axios';
import RequestList from '../components/RequestList/RequestList';
import BidFormModal from './BidFormModal';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import { AuthContext } from '../contexts/authContext';
import { arr2Obj } from '../lib/utils';
import { request } from 'https';

const RequestFeed = () => {
  const [requests, setRequests] = useState({});
  const [selected, setSelected] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { socket } = useContext(AuthContext);

  useIonViewDidEnter(() => {
    setShowSpinner(true);

    axios.get('/api/requests')
      .then(res => {
        setRequests(arr2Obj(res.data));
      })
      .catch(err => setErrorMessage('Error while loading the feed'))
      .finally(() => setShowSpinner(false));

    // document.addEventListener('mousedown', handleClickOutside);

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

  console.log('LOAD REQUESTS', requests);

  useIonViewWillLeave(() => {
    // document.removeEventListener('mousedown', handleClickOutside);

    // disconnect from socket
    console.log('unmount listener request feed')
    socket.off('get-requests');
  });

  const onRefresh = useCallback(event => {
    setShowSpinner(true);
    axios
      .get('/api/requests')
      .then(res => setRequests(res.data))
      .then(event.detail.complete())
      .catch(err => setErrorMessage('Error while loading bids'))
      .finally(() => setShowSpinner(false))
  });

  // const handleClickOutside = useCallback(event => {
  //   setSelected(null);
  // });

  return (
    <IonPage>
      <Header title='Request Feed'></Header>
      <IonContent>
        {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
        <Spinner message={showSpinner} />
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
