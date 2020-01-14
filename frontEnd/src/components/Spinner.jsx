import React from 'react';
import { IonLoading } from '@ionic/react';

export default function Spinner({ message }) {
  return (
    <IonLoading isOpen={message !== undefined && message !== false} message={message === true ? 'Loading...' : message} />
  );
}