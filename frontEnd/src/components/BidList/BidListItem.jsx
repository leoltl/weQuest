import React, { useCallback } from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonAvatar, IonImg, IonBadge, IonButton } from '@ionic/react';
import './BidListItem.scss';

export default function BidListItem({ isExpanded, expand, selectWinner, id, name, pictureUrl, priceCent }) {

  const handleExpand = useCallback((e) => {
    e.preventDefault();
    expand(id);
  }, [id]);

  const handleWinner = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    selectWinner(id);
  }, [id]);
  
  return (
    <IonCard className={'bid-card'} onClick={handleExpand}>
      {isExpanded && <IonImg className={'bid-card__img'} src={pictureUrl || 'https://images.unsplash.com/photo-1571942676558-281b2f9b1f8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80'} alt={name || 'test'} title={name || 'test'} />}
      <IonCardHeader className={'bid-card__header'} color={isExpanded ? 'tertiary' : undefined}>
        {!isExpanded && <IonAvatar className={'bid-card__header-img'}>
          <IonImg src={pictureUrl || 'https://images.unsplash.com/photo-1571942676558-281b2f9b1f8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80'} alt={name || 'test'} title={name || 'test'} />
        </IonAvatar>}
        <IonCardTitle className={'bid-card__header-name'}>{name || 'Product Name'}</IonCardTitle>
        <IonBadge className={'bid-card__header-price'}>{`$${(priceCent || 5000) / 100}`}</IonBadge>
      </IonCardHeader>
      {isExpanded && <IonCardContent>
        <h2 class={'bid-card__heading'}>Item Description</h2>
        <p>Some content</p>
        <h2 class={'bid-card__heading'}>Notes</h2>
        <p>Some content</p>

        <h2 class={'bid-card__heading'}>About the Bidder</h2>
        <div className={'bid-card__user'}>
          <IonAvatar className={'bid-card__user-img'}>
            <IonImg src={pictureUrl || 'https://images.unsplash.com/photo-1571942676558-281b2f9b1f8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80'} alt={name || 'test'} title={name || 'test'} />
          </IonAvatar>
          <div className={'bid-card__user-name'}>
            <IonCardTitle >{name || 'John Doe'}</IonCardTitle>
          </div>
          <IonBadge className={'bid-card__user-rating'}>3/5</IonBadge>
        </div>

        {selectWinner && <IonButton className={'bid-card__btn'} onClick={handleWinner} color={'tertiary'}>Select Bid</IonButton>}
      </IonCardContent>}
    </IonCard>
  );

 }