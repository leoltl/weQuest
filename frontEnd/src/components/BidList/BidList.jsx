import React, { useState, useCallback } from 'react';
import { IonList } from '@ionic/react';
import BidListItem from './BidListItem';

export default function BidList({ selectWinner, bids }) {

  console.log('rendering bid list');

  const [expandedBid, setExpandedBid] = useState(null);

  const expand = useCallback((bidId) => {
    setExpandedBid(prev => prev === bidId ? null : bidId);
  }, []);

  return (
    <IonList>
      {bids.map((bid) => <BidListItem {...{ key: bid.id, isExpanded: expandedBid === bid.id, expand, selectWinner, ...bid }} />)}
    </IonList>
  );

 }