import React, { useEffect, useState, useContext, useCallback } from 'react';
import { IonListHeader } from '@ionic/react';
import BidModal from '../../pages/BidModal';
import RequestList from '../RequestList/RequestList';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { arrayToObject } from '../../lib/utils';
import Spinner from '../Spinner';


const Requests = props => {
  const [activeRequests, setActiveRequests] = useState({});
  const [completedRequests, setCompletedRequests] = useState({});
  const [selected, setSelected] = useState(null);
  const { socket } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);


  // TODO change implementation as it only makes axios call when you switch tabs
  useEffect(() => {
    props.setShowSpinner(true);

    const serverActiveRequests = axios.get('/api/requests/active').then(res => setActiveRequests(arrayToObject(res.data)));

    const serverCompletedRequests = axios.get('/api/requests/completed').then(res => setCompletedRequests(arrayToObject(res.data)));

    Promise.all([serverActiveRequests, serverCompletedRequests])
      .catch(err => props.setErrorMessage('Error while loading requests'))
      .finally(() => {
        props.setShowSpinner(false)
        //socket connection
        console.log('mounting activity feed request socket')
        socket.on('get-requests', event => {
          // console.log('EVENT', event);
          const update = event.data;

          setActiveRequests(prev => {
            console.log('prev', prev[update.id], update)
            // if requestStatus changes remove it from requests
            if (prev[update.id].requestStatus !== update.requestStatus) {
              const { [update.id]: undefined, ...rest } = prev;
              // console.log('REST', rest);
              return rest;
            }
            return { ...prev, [update.id]: update };
          });
          setCompletedRequests(prev => {
            if (prev[update.id] && prev[update.id].requestStatus !== update.requestStatus) {
              return { ...prev, [update.id]: update };
            }
            return prev
          });
        });
    });

    console.log(activeRequests);

    return () => {
      console.log('unmounting activity requests listener');
      socket.off('get-requests');
    };
  }, []);

  const onRefresh = useCallback(event => {
    setShowSpinner(true);

    const serverActiveRequests = axios.get('/api/requests/active').then(res => setActiveRequests(arrayToObject(res.data)));

    const serverCompletedRequests = axios.get('/api/requests/completed').then(res => setCompletedRequests(arrayToObject(res.data)));

    Promise.all([serverActiveRequests, serverCompletedRequests])
      .catch(err => props.setErrorMessage('Error while loading requests'))
      .finally(() => {
        event.detail.complete()
        setShowSpinner(false)
      })
  });

  return (
    <>
      <IonListHeader>Active Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        // refractor to work with objs instead of passing down array
        requests={Object.values(activeRequests).reverse()}
        setRequests={setActiveRequests}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Select Winning Bid'
        setErrorMessage={props.setErrorMessage}
        setShowSpinner={props.setShowSpinner}
        onRefresh={onRefresh}
      ></RequestList>
      <IonListHeader>Completed Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        // refractor to work with objs instead of passing down array
        requests={Object.values(completedRequests).reverse()}
        setRequests={setCompletedRequests}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Bid History'
        setErrorMessage={props.setErrorMessage}
        setShowSpinner={props.setShowSpinner}
        onRefresh={onRefresh}
      ></RequestList>
    </>
  );
};

export default Requests;
