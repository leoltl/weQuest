import React, { useState } from 'react';
import Login from '../components/User/Login';
import Register from '../components/User/Register';
import {
  IonSegment,
  IonContent,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
} from '@ionic/react';

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
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonContent>
        <IonToolbar>
          <IonSegment onIonChange={e => setSegment(e.detail.value)}>
            <IonSegmentButton value="login" checked={segment === 'login'}>
              <IonLabel>Login</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="register" checked={segment === 'register'}>
              <IonLabel>Register</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {segment === 'login' ? <Login></Login> : <Register></Register>}
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
