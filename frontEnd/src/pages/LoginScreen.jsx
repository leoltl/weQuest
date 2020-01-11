import React, { useState } from 'react';
import Login from '../components/User/Login';
import Register from '../components/User/Register';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
} from '@ionic/react';

import './LoginScreen.scss';

const LoginScreen = props => {
  const [segment, setSegment] = useState('login');

  // const getCurrentState = async e => {
  //   axios.get('/api/users').then(user => {
  //     setUser(user.data);
  //     if (user) {
  //       history.push('/profile');
  //     }
  //   });
  // };

  // useIonViewWillEnter(() => {
  //   getCurrentState();
  // });

  return (
    <IonPage id='login-page'>
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonToolbar className='login-toolbar'>
        <IonSegment onIonChange={e => setSegment(e.detail.value)}>
          <IonSegmentButton value='login' checked={segment === 'login'}>
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='register' checked={segment === 'register'}>
            <IonLabel>Register</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      {segment === 'login' ? <Login></Login> : <Register></Register>}
    </IonPage>
  );
};

export default LoginScreen;
