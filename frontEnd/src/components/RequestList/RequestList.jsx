import React, { useEffect, useState, useCallback, useContext } from 'react';
import { withRouter } from 'react-router';
import { IonContent, IonList, IonButton } from '@ionic/react';
import RequestListItem from './RequestListItem';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';

import './RequestList.scss';
import { AuthContext } from '../../contexts/authContext';

const RequestList = ({ modal: Modal, ...props }) => {
  const isLoggedIn = true;
  const { requests, setRequests } = props;
  const [showBidForm, setShowBidForm] = useState(false);

  // console.log('RENDERLIST', isLoggedIn);

  // useEffect(() => {
  //   axios.get('/api/requests').then(res => setRequests(res.data));
  // }, []);

  const updateRequestById = useCallback((id, payload) => {
    setRequests(prev =>
      prev.map(request => {
        return request.id === id ? { ...request, ...payload } : request;
      }),
    );
  }, []);

  const getRequestById = useCallback(
    id => {
      return requests.find(request => request.id === id);
    },
    [requests],
  );

  const onBidClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      setShowBidForm(true);
    } else {
      props.history.push('/login')
    }
  }

  const renderedRequestItem = requests.map(listItem => {
    return (
      <RequestListItem
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
      ></RequestListItem>
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

export default withRouter(RequestList);
