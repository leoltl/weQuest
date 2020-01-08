import React, { useState, useContext } from 'react';
import {
  IonSegment,
  IonContent,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { AuthContext } from '../contexts/authContext';
import ProfileAvatar from '../components/ProfileAvatar';

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
