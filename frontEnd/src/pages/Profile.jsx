import React from 'react';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
import ProfileAvatar from '../components/User/ProfileAvatar';
import Header from '../components/Header';

import './Profile.scss';

export default function Profile(props) {
  return (
    <IonPage id='profile-page'>
      <Header title='Profile'></Header>
      <IonContent className='profile-page'>
        <ProfileAvatar></ProfileAvatar>
      </IonContent>
    </IonPage>
  );
}
