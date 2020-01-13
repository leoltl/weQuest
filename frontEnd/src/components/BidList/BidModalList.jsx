import React, { useState, useCallback } from 'react';
import { IonList } from '@ionic/react';
import BidModalListItem from './BidModalListItem';

export default function BidList({ selectWinner, winningBidId, bids }) {

  const [expandedBid, setExpandedBid] = useState(null);

  const expand = useCallback((bidId) => {
    setExpandedBid(prev => (prev === bidId ? null : bidId));
  }, []);

  return (
    <IonList>
      {bids.map(bid => (
        <BidModalListItem {...{
          key: bid.id,
          isExpanded: expandedBid === bid.id,
          expand,
          selectWinner,
          isWinner: winningBidId == bid.id,
          ...bid 
        }} />
      ))}
    </IonList>
  );
}
