import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import ProfileAvatar from '../components/User/ProfileAvatar';
import Header from '../components/Header';
import Notification from '../components/Notification';

import './Profile.scss';

export default function Profile(props) {
  return (
    <IonPage id='profile-page'>
      <Header title='Profile'></Header>
      <IonContent className='profile-page'>
        <Notification />
        <ProfileAvatar></ProfileAvatar>
      </IonContent>
    </IonPage>
  );
}
