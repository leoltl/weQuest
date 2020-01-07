import React, { useState, useContext } from 'react';
import { IonInput, IonButton, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonTextarea } from '@ionic/react';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';

export default function ProfileAvatar(props) {
  const { user, setUser } = useContext(AuthContext);

  const signOut = async e => {
    setUser(null);
    axios.get('/api/users/logout');
  };

  const userInfo = user => (
    <>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* <img src={user.picture.data.url} height={user.picture.height} width={user.picture.width} alt="avatar" /> */}
    </>
  );
  return (
    <>
      <IonList>{user ? userInfo(user) : ''}</IonList>
      <IonItem>
        <IonButton className="login-button" onClick={() => signOut()} expand="full" fill="solid" color="danger">
          Logout from Facebook
        </IonButton>
      </IonItem>
    </>
  );
}
