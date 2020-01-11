import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react';
import moment from 'moment';
import { currencyFormatter } from '../../lib/utils'

const BidListItem = props => {
  return (
    <IonCard onClick={props.selectCard}>
      <IonCardHeader>
        <div className="request-card__header">
          <IonCardSubtitle
            style={{
              fontSize: '1.15rem',
              padding: 0,
            }}
          >
            {props.requestDetails.name}
          </IonCardSubtitle>
          <IonCardContent
            style={{
              fontSize: '1.3rem',
              padding: 0,
            }}
          >
            {props.currentBid && (currencyFormatter(props.currentBid) || 'Free')}
          </IonCardContent>
        </div>
        <IonCardContent className="request-card__user">
          <div className="request-card__left">
            <img alt="item" src={props.requestDetails.pictureUrl}></img>
            <span className="request-card__user-rating">4/5</span>
          </div>
          <div className="request-card__right">
            <span className="request-card__auction-end">Ends {moment(props.requestDetails.auctionEnd).fromNow()}</span>
          </div>
        </IonCardContent>
      </IonCardHeader>
      {props.isSelected ? (
        <>
          <IonCardContent>{props.requestDetails.description}</IonCardContent>
          <IonButton className="ion-margin" expand="block" onClick={props.onBidClick}>
            {props.buttonTitle}
          </IonButton>
        </>
      ) : (
        ''
      )}
    </IonCard>
  );
};

export default BidListItem;
