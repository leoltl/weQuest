import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonBadge } from '@ionic/react';
import moment from 'moment';
import { currencyFormatter } from '../../lib/utils'

import './BidListItem.scss'

const BidListItem = props => {
  const isWinning = props.priceCent === props.requestDetails.currentBidPrice
  return (
    <IonCard onClick={props.selectCard} >
      {isWinning && (
      <IonBadge className="activity-bid-card__badge" color="secondary"> 
         Currently winning
      </IonBadge>)}
      <IonCardHeader className="activity-bid-card__content">
        <div className={`generic-card__header activity-bid-card__header ${isWinning ? "activity-bid-card__header--winning" : ""}`}>
          <IonCardSubtitle className="generic-card__title activity-bid-card__title" mode="md">
            {props.requestDetails.requestTitle}
          </IonCardSubtitle>
          <IonCardContent className="activity-bid-card__your-bid">
            <span className="activity-bid-card__indicator" >Your Bid:</span>
            <br />
            {props.priceCent && (currencyFormatter(props.priceCent) || 'Free')}
          </IonCardContent>
        </div>
        <IonCardContent className="generic-card__user activity-bid-card__user">
          <div className="generic-card__left activity-bid-card__left">
            <img alt="item" src={props.requestDetails.pictureUrl}></img>
            <div className="request-card__right" >
              <span className="request-card__user-name">{props.requestDetails.name}</span>
            </div>
          </div>
          <div className="activity-bid-card__right">
            Lowest Bid:
            <br />
            {currencyFormatter(props.requestDetails.currentBidPrice)} 
          </div>
        </IonCardContent>
      </IonCardHeader>
      {props.isSelected ? (
        <>
          {( props.requestDetails.requestDescription && 
          <IonCardContent>
            Request Description: <br />
            {props.requestDetails.requestDescription}
          </IonCardContent>)}
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
