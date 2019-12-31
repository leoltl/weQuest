import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';

const RequestListItem = props => {
  return (
    <IonCard onClick={props.selectCard}>
      <IonCardHeader>
        <div className="request-card--header">
          <IonCardTitle>Request Title</IonCardTitle>
          <IonCardSubtitle>$30.00</IonCardSubtitle>
        </div>
        <IonCardContent>
          <div className="request-card--user">
            <img alt="user avatar" src="https://i.pravatar.cc/50"></img>4/5
          </div>
        </IonCardContent>
      </IonCardHeader>
      {props.isSelected ? (
        <IonCardContent>{props.requestDetails.description}</IonCardContent>
      ) : (
        ''
      )}
    </IonCard>
  );
};

export default RequestListItem;
