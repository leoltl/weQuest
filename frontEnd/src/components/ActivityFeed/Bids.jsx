import React, { useEffect, useState, useContext } from 'react';
import { IonListHeader } from '@ionic/react';
import BidList from '../BidList/BidList';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { arr2Obj } from '../../lib/utils';

const Bids = props => {
  const [activeBids, setActiveBids] = useState({});
  const [completedBids, setCompletedBids] = useState({});
  const [selected, setSelected] = useState(null);
  const { socket } = useContext(AuthContext);

  useEffect(() => {
    axios.get('/api/bids').then(res => setActiveBids(arr2Obj(res.data)));
    axios.get('/api/bids/?completed=true').then(res => setCompletedBids(arr2Obj(res.data)));

    // socket connection
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

    return () => {
      socket.off('get-bids');
    };
  }, []);

  return (
    <>
      <IonListHeader>Active Bids</IonListHeader>
      <BidList
        modal={BidFormModal}
        bids={Object.values(activeBids)}
        setBids={setActiveBids}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Bid Again'
      />
      <IonListHeader>Completed Bids</IonListHeader>
      <BidList
        modal={BidFormModal}
        bids={Object.values(completedBids)}
        setBids={setCompletedBids}
        selectedId={selected}
        onClick={setSelected}
      />
    </>
  );
};

export default Bids;
