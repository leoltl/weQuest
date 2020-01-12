import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonBadge } from '@ionic/react';
import moment from 'moment';
import { currencyFormatter } from '../../lib/utils'

const BidListItem = props => {
  return (
    <IonCard onClick={props.selectCard} >
      {(props.priceCent === props.requestDetails.currentBidPrice) && <IonBadge color="secondary" style={{borderRadius: 0, borderBottomRightRadius: '8px', paddingRight: '6px', paddingBottom: '5px'}}> Currently winning</IonBadge>}
      <IonCardHeader style={{paddingTop: '0.1rem'}}>
        <div className="request-card__header">
          <IonCardSubtitle
            mode="md"
            style={{
              fontSize: '1.15rem',
              padding: 0,
            }}
          >
            {props.requestDetails.requestTitle}
          </IonCardSubtitle>
          <IonCardContent style={{fontSize: '1rem', textAlign: 'right', margin: 0, padding: 0}}>
            <span style={{
              fontSize: '0.85rem',
              padding: 0,
            }} >Your Bid:</span>
            <br />
            {props.priceCent && (currencyFormatter(props.priceCent) || 'Free')}
          </IonCardContent>
        </div>
        <IonCardContent className="request-card__user">
          <div className="request-card__left">
            <img alt="item" src={props.requestDetails.pictureUrl}></img>
            <div className="request-card__right" >
              <span className="request-card__user-rating">{props.requestDetails.name}</span>
            </div>
            
          </div>
          <div className="request-card__right" style={{
              fontSize: '0.75rem',
              padding: 0,
              textAlign: 'right',
            }}>
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
