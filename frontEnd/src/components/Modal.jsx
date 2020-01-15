import React from 'react';
import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonIcon, IonButton, IonButtons } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import Spinner from './Spinner';

export default function Modal({ showModal, setShowModal, showSpinner = false, title, children }) {

  return (
    <IonModal isOpen={showModal} onIonModalWillDismiss={e => setShowModal(false)}>
      <IonHeader>
        <IonToolbar color='light'>
          <IonButtons slot='start'>
            <IonButton onClick={e => setShowModal(false)}>
              <IonIcon slot='icon-only' icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {showSpinner !== false ? <Spinner message={showModal && showSpinner} /> : children}
      </IonContent>
    </IonModal>
  );
}
