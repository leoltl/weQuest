import React, { useEffect, useState, useCallback, useContext } from 'react';
import { withRouter } from 'react-router';
import { IonContent, IonList, IonButton } from '@ionic/react';
import BidListItem from './BidListItem';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';

import { AuthContext } from '../../contexts/authContext';

const BidList = ({ modal: Modal, ...props }) => {
  const isLoggedIn = true;
  const { bids, setBids } = props;
  const [showBidForm, setShowBidForm] = useState(false);

  // console.log('RENDERLIST', isLoggedIn);

  // useEffect(() => {
  //   axios.get('/api/bids').then(res => setBids(res.data));
  // }, []);

  const updateRequestById = useCallback((id, payload) => {
    setBids(prev =>
      prev.map(request => {
        return request.id === id ? { ...request, ...payload } : request;
      }),
    );
  }, []);

  const getRequestById = useCallback(
    id => {
      return bids.find(request => request.id === id);
    },
    [bids],
  );

  const onBidClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      setShowBidForm(true);
    } else {
      props.history.push('/login');
    }
  };

  const renderedRequestItem = bids.map(listItem => {
    console.log('bids', listItem);
    return (
      <BidListItem
        key={listItem.id}
        currentBid={listItem.priceCent}
        user={listItem.email}
        requestDetails={listItem}
        isSelected={listItem.id === props.selectedId}
        selectCard={() => props.onClick(listItem.id === props.selectedId ? null : listItem.id)}
        buttonTitle={props.buttonTitle}
        onBidClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowBidForm(true);
        }}
      ></BidListItem>
    );
  });

  return (
    <>
      {isLoggedIn && (
        <Modal
          {...{
            showModal: showBidForm,
            setShowModal: setShowBidForm,
            request: getRequestById(props.selectedId) || { id: 0, priceCent: 0 },
            updateRequestById,
          }}
        />
      )}
      <IonList>{renderedRequestItem}</IonList>
    </>
  );
};

export default BidList;
