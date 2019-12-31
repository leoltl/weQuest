import React from 'react';
import { IonAvatar, IonImg, IonSegmentButton, IonLabel } from '@ionic/react';

export default function ProductListItem({id}) {
  return (
    <IonSegmentButton value={id}>
      <IonAvatar>
        <IonImg src={'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'} alt={`Product ${id}`} title={`Product ${id}`} />
      </IonAvatar>
      <IonLabel>{`Product ${id}`}</IonLabel>
    </IonSegmentButton>
  );

 }