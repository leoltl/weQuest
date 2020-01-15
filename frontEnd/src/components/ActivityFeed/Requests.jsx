import React, { useEffect, useState, useContext } from 'react';
import { IonListHeader } from '@ionic/react';
import BidModal from '../../pages/BidModal';
import RequestList from '../RequestList/RequestList';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { arr2Obj } from '../../lib/utils';

const Requests = props => {
  const [activeRequests, setActiveRequests] = useState({});
  const [completedRequests, setCompletedRequests] = useState({});
  const [selected, setSelected] = useState(null);
  const { socket } = useContext(AuthContext);

  // TODO change implementation as it only makes axios call when you switch tabs
  useEffect(() => {
    props.setShowSpinner(true);

    const serverActiveRequests = axios.get('/api/requests/active').then(res => setActiveRequests(arr2Obj(res.data)));

    const serverCompletedRequests = axios.get('/api/requests/completed').then(res => setCompletedRequests(arr2Obj(res.data)));

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

    return () => {
      console.log('unmounting activity requests listener');
      socket.off('get-requests');
    };
  }, []);

  return (
    <>
      <IonListHeader>Active Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        // refractor to work with objs instead of passing down array
        requests={Object.values(activeRequests)}
        setRequests={setActiveRequests}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Select Winning Bid'
        setErrorMessage={props.setErrorMessage}
        setShowSpinner={props.setShowSpinner}
      ></RequestList>
      <IonListHeader>Completed Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        // refractor to work with objs instead of passing down array
        requests={Object.values(completedRequests)}
        setRequests={setCompletedRequests}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Bid History'
        setErrorMessage={props.setErrorMessage}
        setShowSpinner={props.setShowSpinner}
      ></RequestList>
    </>
  );
};

export default Requests;
