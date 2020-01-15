import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import RequestForm from '../components/RequestForm/RequestForm.jsx';
import Header from '../components/Header';
import Notification from '../components/Notification';

import './NewRequest.scss';

export default function NewRequest() {
  return (
    <IonPage>
      <Header title='New Request'></Header>
      <IonContent className='new-request__container'>
        <Notification />
        <RequestForm />
      </IonContent>
    </IonPage>
  );
}
