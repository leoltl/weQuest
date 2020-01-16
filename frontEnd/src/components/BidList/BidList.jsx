import React, { useState, useCallback, useContext } from 'react';
import { IonList, IonRefresher, IonRefresherContent } from '@ionic/react';
import BidListItem from './BidListItem';

import { AuthContext } from '../../contexts/authContext';

const BidList = ({ modal: Modal, ...props }) => {
  const { user: isLoggedIn } = useContext(AuthContext);
  const { bids, setBids } = props;
  const [showBidForm, setShowBidForm] = useState(false);

  // console.log('RENDERLIST', isLoggedIn);

  // useEffect(() => {
  //   axios.get('/api/bids').then(res => setBids(res.data));
  // }, []);

  const updateRequestById = useCallback((id, payload) => {
    setBids(prev => {
      return {
        ...prev,
        id: { ...prev[id], ...payload },
      };
      // setBids(prev =>
      //   prev.map(request => {
      //     return request.id === id ? { ...request, ...payload } : request;
      //   }),
      // );
    });
  }, []);

  const getRequestById = useCallback(
    id => {
      return bids.find(request => request.id === id);
    },
    [bids],
  );

  const renderedRequestItem = bids.map(listItem => {
    return (
      <BidListItem
        key={listItem.id}
        priceCent={listItem.priceCent}
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

export default BidList;
