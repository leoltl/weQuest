import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react';
import moment from 'moment';
import { currencyFormatter } from '../../lib/utils';

import './RequestListItem.scss';

const RequestListItem = props => {
  console.log(props.requestDetails);
  return (
    <IonCard
      onClick={e => {
        e.nativeEvent.stopImmediatePropagation();
        props.selectCard();
      }}
    >
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
          <IonCardContent className="request-card__details">
            {props.requestDetails.borrowStart && props.requestDetails.borrowEnd && <><span className="request-card__details-indicator">Item needed from:</span> <br /><span className="request-card__date">{moment(props.requestDetails.borrowStart).format('ddd, MMM Do')} to {moment(props.requestDetails.borrowEnd).format('ddd, MMM do, YYYY')}</span></>}
            <br />
            
            {props.requestDetails.description && 
            <><span className="request-card__details-indicator">Request Notes:</span> <br /> {props.requestDetails.description}</>}
          <IonButton id={props.requestDetails.id} className='ion-margin generic-card__button' expand='block' onClick={props.onBidClick}>
            {props.buttonTitle}
          </IonButton>
          </IonCardContent>
        </>
      )}
    </IonCard>
  );
};

export default RequestListItem;
