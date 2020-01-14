import React, { useState } from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonPage, IonHeader, IonToolbar } from '@ionic/react';
import Header from '../components/Header';
import Login from '../components/User/Login';
import Register from '../components/User/Register';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

import './LoginScreen.scss';

const LoginScreen = props => {
  console.log('login rendered');
  const [segment, setSegment] = useState('login');
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      <Header title={segment === 'login' ? 'Login' : 'Register'} />
      <IonToolbar className='login-toolbar'>
        <IonSegment color={'primary'} onIonChange={e => setSegment(e.detail.value)}>
          <IonSegmentButton value='login' checked={segment === 'login'}>
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='register' checked={segment === 'register'}>
            <IonLabel>Register</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <Spinner message={showSpinner} />
      {segment === 'login' ? <Login {...{ setErrorMessage, setShowSpinner }} /> : <Register {...{ setErrorMessage, setShowSpinner }} />}
    </IonPage>
  );
};

export default LoginScreen;
