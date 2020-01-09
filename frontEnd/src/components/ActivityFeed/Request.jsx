import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonListHeader, useIonViewWillEnter } from '@ionic/react';
import BidModal from '../../pages/BidModal';
import RequestList from '../RequestList/RequestList';
import axios from 'axios';

const Requests = props => {
  const isLoggedIn = true;
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    axios.get('/api/requests/active').then(res => setActiveRequests(res.data));
    axios.get('/api/requests/completed').then(res => setCompletedRequests(res.data));
  }, []);

  const updateRequestById = (id, payload) => {
    setActiveRequests(prev =>
      prev.map(request => {
        // console.log(prev);
        if (request.id === id) {
          return { ...request, ...payload };
        } else {
          return request;
        }
      }),
    );
  };

  return (
    <>
      <IonListHeader>Active Requests</IonListHeader>
      <RequestList modal={BidModal} requests={activeRequests} setRequests={setActiveRequests} selectedId={selected} onClick={setSelected}></RequestList>
      <IonListHeader>Completed Requests</IonListHeader>
      <RequestList
        modal={BidModal}
        requests={completedRequests}
        setRequests={setCompletedRequests}
        selectedId={selected}
        onClick={setSelected}
      ></RequestList>
    </>
  );
};

export default Requests;
