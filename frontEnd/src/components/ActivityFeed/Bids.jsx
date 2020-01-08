import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonListHeader } from '@ionic/react';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';

const Bids = props => {
  const isLoggedIn = true;
  const [activeBids, setActiveBids] = useState([]);
  const [completedBids, setCompletedBids] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    axios.get('/api/bids').then(res => setActiveBids(res.data));
  }, []);

  const updateRequestById = (id, payload) => {
    setActiveBids(prev =>
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

  const renderedActiveBids = activeBids.map(listItem => {
    return (
      <BidListItem
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
      ></BidListItem>
    );
  });

  const renderedCompletedBids = completedBids.map(listItem => {
    return (
      <BidListItem
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
      ></BidListItem>
    );
  });

  return (
    <IonContent id="-active-Bids">
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
        <IonListHeader>Active Bids</IonListHeader>
        {renderedActiveBids}
      </IonList>
      <IonList>
        <IonListHeader>Completed Bids</IonListHeader>
        {renderedCompletedBids}
      </IonList>
    </IonContent>
  );
};

export default Bids;
