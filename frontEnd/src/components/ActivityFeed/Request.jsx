import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonListHeader } from '@ionic/react';
import RequestListItem from '../RequestList/RequestListItem';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';

const Requests = props => {
  const isLoggedIn = true;
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    axios.get('/api/requests').then(res => setActiveRequests(res.data));
  }, []);

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

  const renderedActiveRequests = activeRequests.map(listItem => {
    return (
      <RequestListItem
        key={listItem.id}
        currentBid={listItem.priceCent}
        user={listItem.email}
        requestDetails={listItem}
        isSelected={listItem.id === props.selectedId}
        selectCard={() => props.onClick(listItem.id === props.selectedId ? null : listItem.id)}
        onBidClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowBidForm(true);
        }}
      ></RequestListItem>
    );
  });

  const renderedCompletedRequests = completedRequests.map(listItem => {
    return (
      <RequestListItem
        key={listItem.id}
        currentBid={listItem.priceCent}
        user={listItem.email}
        requestDetails={listItem}
        isSelected={listItem.id === props.selectedId}
        selectCard={() => props.onClick(listItem.id === props.selectedId ? null : listItem.id)}
        onBidClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowBidForm(true);
        }}
      ></RequestListItem>
    );
  });

  return (
    <IonContent id="-active-requests">
      {isLoggedIn && (
        // insert winning bid modal
        <BidFormModal
          {...{
            showModal: showBidForm,
            setShowModal: setShowBidForm,
            request: { id: props.selectedId, currentPrice: 5000 },
            updateRequestById: updateRequestById,
          }}
        />
      )}
      <IonList>
        <IonListHeader>Active Requests</IonListHeader>
        {renderedActiveRequests}
      </IonList>
      <IonList>
        <IonListHeader>Completed Requests</IonListHeader>
        {renderedCompletedRequests}
      </IonList>
    </IonContent>
  );
};

export default Requests;
