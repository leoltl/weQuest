import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react';
import moment from 'moment';
import { currencyFormatter } from '../../lib/utils';

import './RequestListItem.scss';

const RequestListItem = props => {
  return (
    <IonCard onClick={props.selectCard}>
      <IonCardHeader>
        <div className='generic-card__header request-card__header'>
          <IonCardSubtitle className='request-card__request-title'>{props.requestDetails.title}</IonCardSubtitle>
          <IonCardContent className='request-card__request-current-price'>
            {(props.currentBid && currencyFormatter(props.currentBid)) || 'Free'}
          </IonCardContent>
        </div>
        <IonCardContent className='generic-card__user request-card__user'>
          <div className='generic-card__left request-card__left'>
            <img alt='profile' src={`https://i.pravatar.cc/50?u=${props.requestDetails.name}`}></img>
            <span className='request-card__user-name'>{props.requestDetails.name}</span>
          </div>
          <div className='request-card__right'>
            <span className='request-card__auction-end'>Ends {moment(props.requestDetails.auctionEnd).fromNow()}</span>
          </div>
        </IonCardContent>
      </IonCardHeader>
      {props.isSelected && (
        <>
          <IonCardContent>{props.requestDetails.description}</IonCardContent>
          <IonButton className='ion-margin generic-card__button' expand='block' onClick={props.onBidClick}>
            {props.buttonTitle}
          </IonButton>
        </>
      )}
    </IonCard>
  );
};

export default RequestListItem;
