import React, { useState, useCallback } from 'react';
import { IonList } from '@ionic/react';
import BidListItem from './BidListItem';

export default function BidList({ selectWinner }) {

  console.log('rendering bid list');

  const [expandedBid, setExpandedBid] = useState(null);

  const expand = useCallback((bidId) => {
    setExpandedBid(prev => prev === bidId ? null : bidId);
  }, []);

  return (
    <IonList>
      {Array(10).fill(undefined).map((p, i) => <BidListItem {...{ key: i, isExpanded: expandedBid === i, expand, selectWinner, id: i }} />)}
    </IonList>
  );

 }