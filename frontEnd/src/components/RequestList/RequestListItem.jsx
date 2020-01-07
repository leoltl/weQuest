import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonButton
} from '@ionic/react';

const RequestListItem = props => {
  const isLoggedIn = true;
  return (
    <IonCard onClick={props.selectCard}>
      <IonCardHeader>
        <div className="request-card--header">
          {props.requestDetails.id}
          <IonCardSubtitle
            style={{
              fontSize: '1.15rem',
              padding: 0
            }}
          >
            {props.requestDetails.title}
          </IonCardSubtitle>
          <IonCardContent
            style={{
              fontSize: '1.3rem',
              padding: 0
            }}
          >
            ${props.currentBid / 100}
          </IonCardContent>
        </div>
        <IonCardContent className="request-card--user">
          <img alt="user avatar" src="https://i.pravatar.cc/50"></img>
          <span className="request-card--user-rating">4/5</span>
        </IonCardContent>
      </IonCardHeader>
      {props.isSelected ? (
        <>
          <IonCardContent>{props.requestDetails.description}</IonCardContent>
          <IonButton
            className="ion-margin"
            disabled={isLoggedIn ? false : true}
            expand="block"
            onClick={props.onBidClick}
          >
            Bid Now
          </IonButton>
        </>
      ) : (
        ''
      )}
    </IonCard>
  );
};

export default RequestListItem;
