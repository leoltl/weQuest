import React, { useEffect, useCallback } from 'react';
import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonIcon, IonButton, IonButtons } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import Spinner from './Spinner';

export default function Modal({ showModal, setShowModal, showSpinner = false, title, children }) {

  const handleDismiss = useCallback((e) => {
    e.preventDefault();
    window.history.back();
    setShowModal(false);
  });

  // handleDismiss will be fired after isOpen changes to false
  const handleClose = useCallback((e) => {
    e.preventDefault();
    e.type === 'popstate' && window.history.pushState('modal','modal');
    setShowModal(false);
  });
  
  useEffect(() => {
    // push state into history when modal is brought into view
    console.log('showModal changed', showModal)
    if (showModal) {
      window.history.pushState('modal','modal');
      // window.addEventListener('popstate', e => setShowModal(false), { once: true });
      window.addEventListener('popstate', handleClose, { once: true });
    }
  }, [showModal]);

  return (
    // <IonModal isOpen={showModal} onIonModalWillDismiss={e => setShowModal(false)}>
    <IonModal isOpen={showModal} onIonModalWillDismiss={handleDismiss}>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot='start'>
            {/* <IonButton onClick={e => setShowModal(false)}> */}
            <IonButton onClick={handleClose}>
              <IonIcon slot='icon-only' icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{showSpinner !== false ? <Spinner message={showModal && showSpinner} /> : children}</IonContent>
    </IonModal>
  );
}
