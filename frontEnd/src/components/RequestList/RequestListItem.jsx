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
          <IonCardSubtitle
            style={{
              fontSize: '1.15rem',
              padding: 0
            }}
          >
            Request Title
          </IonCardSubtitle>
          <IonCardContent
            style={{
              fontSize: '1.3rem',
              padding: 0
            }}
          >
            $30.00
          </IonCardContent>
        </div>
        <IonCardContent className="request-card--user">
          <img alt="user avatar" src="https://i.pravatar.cc/50"></img>
          <span class="request-card--user-rating"></span>4/5
        </IonCardContent>
      </IonCardHeader>
      {props.isSelected ? (
        <>
          <IonCardContent>{props.requestDetails.description}</IonCardContent>
          <IonButton
            className="ion-margin"
            disabled={isLoggedIn ? false : true}
            expand="block"
            type="submit"
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
