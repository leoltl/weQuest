import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
} from '@ionic/react';
import ProfileAvatar from '../components/User/ProfileAvatar';

export default function Profile(props) {
  return (
    <IonPage id="profile-page">
      <IonHeader></IonHeader>
      <IonContent>
        <ProfileAvatar></ProfileAvatar>
      </IonContent>
    </IonPage>
  );
}
