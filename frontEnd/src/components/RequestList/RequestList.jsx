import React, { useEffect, useState } from 'react';
import { IonContent, IonList } from '@ionic/react';
import RequestListItem from './RequestListItem';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';

import './RequestList.scss';

const RequestList = props => {
  const isLoggedIn = true;
  const [requests, setRequests] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    axios.get('/api/requests').then(res => setRequests(res.data));
  }, []);

  const renderedRequestItem = requests.map(listItem => {
    return (
      <RequestListItem
        key={listItem.id}
        currentBid={listItem.priceCent}
        user={listItem.email}
        requestDetails={listItem}
        isSelected={listItem.id === props.selectedId}
        selectCard={() =>
          props.onClick(listItem.id === props.selectedId ? null : listItem.id)
        }
        onBidClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowBidForm(true);
        }}
      ></RequestListItem>
    );
  });

  return (
    <IonContent id="request-list-item">
      {isLoggedIn && (
        <BidFormModal
          {...{
            showModal: showBidForm,
            setShowModal: setShowBidForm,
            request: { id: props.selectedId, currentPrice: 5000 }
          }}
        />
      )}
      <IonList>{renderedRequestItem}</IonList>
    </IonContent>
  );
};

export default RequestList;
