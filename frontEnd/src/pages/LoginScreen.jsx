import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
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
import axios from 'axios';

const LoginScreen = props => {
  const [segment, setSegment] = useState('login');
  const { user, setUser } = useContext(AuthContext);
  const history = useHistory();

  const getCurrentState = async e => {
    axios.get('/api/users').then(user => {
      console.log(user.data);
      // setUser(user.data);
      // if (user.data) {
      //redirect is not working
      // history.push('/profile');
      // }
    });
  };

  useEffect(() => {
    getCurrentState();
  }, []);

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
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
