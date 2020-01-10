import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonListHeader, useIonViewWillEnter } from '@ionic/react';
import BidModal from '../../pages/BidModal';
import RequestList from '../RequestList/RequestList';
import axios from 'axios';

const Requests = props => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/requests/active').then(res => setActiveRequests(res.data));
    axios.get('/api/requests/completed').then(res => setCompletedRequests(res.data));
  }, []);

  return (
    <>
      <IonListHeader>Active Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        requests={activeRequests}
        setRequests={setActiveRequests}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Winning Bids'
      ></RequestList>
      <IonListHeader>Completed Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        requests={completedRequests}
        setRequests={setCompletedRequests}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Bid History'
      ></RequestList>
    </>
  );
};

export default Requests;
