import React, { useEffect, useState, useContext } from 'react';
import { IonListHeader, useIonViewDidLeave } from '@ionic/react';
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
    axios.get('/api/requests/active').then(res => setActiveRequests(arr2Obj(res.data)));
    axios.get('/api/requests/completed').then(res => setCompletedRequests(arr2Obj(res.data)));

    // socket connection
    socket.on('get-requests', event => {
      console.log('EVENT', event);
      const update = event.data;

      setActiveRequests(prev => {
        const { [update.id]: undefined, ...rest } = prev;
        console.log('REST', rest);
        return rest;
      });
      setCompletedRequests(prev => {
        return { ...prev, [update.id]: update };
      });
    });
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
        buttonTitle='Winning Bids'
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
      ></RequestList>
    </>
  );
};

export default Requests;
