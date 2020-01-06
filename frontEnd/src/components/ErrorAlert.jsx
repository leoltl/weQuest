import React from 'react';
import { IonAlert } from '@ionic/react';

export default function ErrorAlert({ message, clear }) {
  return (
    <IonAlert isOpen={message.length > 0} onDidDismiss={clear} header={'Error'} message={message} buttons={['Ok']}
    />
  );
}