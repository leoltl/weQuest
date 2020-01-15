import React, { useState, useCallback, useContext } from 'react';
import { withRouter } from 'react-router';
import { IonList, IonRefresherContent, IonRefresher } from '@ionic/react';
import RequestListItem from './RequestListItem';
import './RequestList.scss';
import { AuthContext } from '../../contexts/authContext';

const RequestList = ({ modal: Modal, ...props }) => {
  const { user: isLoggedIn } = useContext(AuthContext);
  const { requests, setRequests } = props;
  const [showBidForm, setShowBidForm] = useState(false);

  // TODO: change implementation to accept objects
  const updateRequestById = useCallback(
    (id, payload) => {
      setRequests(
        prev => {
          return { ...prev, id: { ...prev[id], ...payload } };
        },
        // console.log("PREV", prev)
        // Object.values(prev).map(request => {
        //   return request.id === id ? { ...request, ...payload } : request;
        // }),
      );
    },
    [setRequests],
  );

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
      props.history.push({ pathname: '/login', state: { redirectOnSuccess: '/requests', toastMessage: 'Please login to proceed.' } });
    }
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
        buttonTitle={props.buttonTitle}
        onBidClick={onBidClick}
      />
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

      {props.onRefresh && (
        <IonRefresher slot='fixed' onIonRefresh={props.onRefresh}>
          <IonRefresherContent
            pullingIcon='arrow-dropdown'
            pullingText='Pull to refresh'
            refreshingSpinner='bubbles'
            refreshingText='Refreshing...'
          />
        </IonRefresher>
      )}

      <IonList className='request-feed__list-container'>{renderedRequestItem}</IonList>
    </>
  );
};

export default withRouter(RequestList);
