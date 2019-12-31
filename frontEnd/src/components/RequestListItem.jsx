import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';

const RequestListItem = props => {
  console.log(props.requestDetails);
  return (
    <IonCard onClick={props.selectCard}>
      <IonCardHeader>
        <IonCardTitle>Card Title</IonCardTitle>
        <IonCardSubtitle>SubTittle</IonCardSubtitle>
      </IonCardHeader>
      {props.selected ? (
        <IonCardContent>{props.requestDetails.description}</IonCardContent>
      ) : (
        ''
      )}
    </IonCard>
  );
};

export default RequestListItem;
