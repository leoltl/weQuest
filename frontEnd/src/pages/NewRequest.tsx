import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './NewRequest.scss';
import RequestForm from '../components/RequestForm/RequestForm.jsx';

const Tab2: React.FC = () => {
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
};

export default Tab2;
