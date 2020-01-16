import React, { useEffect, useState, useContext, useCallback } from 'react';
import { IonListHeader } from '@ionic/react';
import BidList from '../BidList/BidList';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { arrayToObject } from '../../lib/utils';
import Spinner from '../Spinner';


const Bids = props => {
  const [activeBids, setActiveBids] = useState({});
  const [completedBids, setCompletedBids] = useState({});
  const [selected, setSelected] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const { socket } = useContext(AuthContext);

  useEffect(() => {
    props.setShowSpinner(true);

    const serverActiveBids = axios.get('/api/bids').then(res => setActiveBids(arrayToObject(res.data)));

    const serverCompletedBids = axios.get('/api/bids/?completed=true').then(res => setCompletedBids(arrayToObject(res.data)));

    Promise.all([serverActiveBids, serverCompletedBids])
      .catch(err => props.setErrorMessage('Error while loading bids'))
      .finally(() => {
        props.setShowSpinner(false)

      // socket connection
      console.log('mount activity feed bid socket')
      socket.on('get-bids', event => {
      console.log('BID EVENT', event);
      const update = event.data;
      setActiveBids(prev => {
        // if requestStatus changes remove it from requests
        if (prev[update.id].isActive !== update.isActive) {
          const { [update.id]: undefined, ...rest } = prev;
          console.log('REST', rest);
          return rest;
        }
        return { ...prev, [update.id]: update };
      });
      setCompletedBids(prev => {
        return { ...prev, [update.id]: update };
      });
    });
        
      });

    return () => {
      console.log('unmounting bid socket')
      socket.off('get-bids');
    };
  }, []);

  const onRefresh = useCallback(event => {
    setShowSpinner(true);

    const serverActiveBids = axios.get('/api/bids').then(res => setActiveBids(arrayToObject(res.data)));

    const serverCompletedBids = axios.get('/api/bids/?completed=true').then(res => setCompletedBids(arrayToObject(res.data)));

    Promise.all([serverActiveBids, serverCompletedBids])
      .catch(err => props.setErrorMessage('Error while loading bids'))
      .finally(() => {
        event.detail.complete()
        props.setShowSpinner(false)
      });
  });

  return (
    <>
      <IonListHeader>Active Bids</IonListHeader>
      <BidList
        modal={BidFormModal}
        bids={Object.values(activeBids).reverse()}
        setBids={setActiveBids}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Bid Again'
        setErrorMessage={props.setErrorMessage}
        setShowSpinner={props.setShowSpinner}
        onRefresh={onRefresh}

      />
      <IonListHeader>Completed Bids</IonListHeader>
      <BidList
        modal={BidFormModal}
        bids={Object.values(completedBids).reverse()}
        setBids={setCompletedBids}
        selectedId={selected}
        onClick={setSelected}
        setErrorMessage={props.setErrorMessage}
        setShowSpinner={props.setShowSpinner}
        onRefresh={onRefresh}

      />
    </>
  );
};

export default Bids;
