import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonListHeader, useIonViewWillEnter } from '@ionic/react';
import RequestList from '../RequestList/RequestList';
import axios from 'axios';

const Requests = props => {
  const isLoggedIn = true;
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  useIonViewWillEnter(() => {
    axios.get('/api/requests/').then(res => setActiveRequests(res.data));
    axios.get('/api/requests/completed').then(res => setCompletedRequests(res.data));
  });

  const updateRequestById = (id, payload) => {
    setActiveRequests(prev =>
      prev.map(request => {
        console.log(prev);
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
      {
        isLoggedIn
        // insert winning bid modal
        //   (<BidFormModal
        //     {...{
        //       showModal: showBidForm,
        //       setShowModal: setShowBidForm,
        //       request: { id: props.selectedId, currentPrice: 5000 },
        //       updateRequestById: updateRequestById,
        //     }}
        //   />)
      }
      <IonList>
        <IonListHeader>Active Requests</IonListHeader>
        <RequestList requests={activeRequests} setRequests={setActiveRequests} selectedId={selected} onClick={setSelected}></RequestList>
      </IonList>
      <IonList>
        <IonListHeader>Completed Requests</IonListHeader>
        <RequestList
          requests={completedRequests}
          setRequests={setCompletedRequests}
          selectedId={selected}
          onClick={setSelected}
        ></RequestList>
      </IonList>
    </>
  );
};

export default Requests;
