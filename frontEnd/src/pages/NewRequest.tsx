import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './NewRequest.scss';
import RequestForm from '../components/RequestForm/RequestForm.jsx';

export default function NewRequest() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='new-request-container'>
        <RequestForm />
      </IonContent>
    </IonPage>
  );
}
