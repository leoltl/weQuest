import React from 'react';
import { IonToolbar, IonHeader, IonTitle, IonButtons, IonText } from '@ionic/react';
import './Header.scss';

export default function Header(props) {
  return (
    <IonHeader className='header__container'>
      <IonToolbar className='header__toolbar' color={'primary'}>
        <IonTitle className='header__toolbar-title'>{props.title}</IonTitle>
        <IonButtons slot='start'>
          <IonText className='header__toolbar-logo'>weQuest</IonText>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
