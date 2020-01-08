import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonButton } from '@ionic/react';
import RequestListItem from '../RequestList/RequestListItem';
import axios from 'axios';

const RequestList = props => {
  const isLoggedIn = true;
  const [requests, setRequests] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    axios.get('/api/requests').then(res => setRequests(res.data));
  }, []);

  const updateRequestById = (id, payload) => {
    setRequests(prev =>
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

  const renderedRequestItem = requests.map(listItem => {
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

  const test = () => {
    updateRequestById(101, { priceCent: 2000 });
  };

  return <IonContent id="request-list-item"></IonContent>;
};

export default RequestList;
