import React from 'react';
import { IonToolbar, IonHeader, IonTitle, IonButtons, IonText } from '@ionic/react';
import './Header.scss';

export default function Header(props) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{props.title}</IonTitle>
        <IonButtons slot='start'>
          <IonText className='logo'>weQuest</IonText>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
