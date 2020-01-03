import React from 'react';
import { IonAvatar, IonIcon, IonImg, IonSegmentButton, IonLabel } from '@ionic/react';

export default function ProductListItem({ id, name, pictureUrl, isSelected, isIcon = false }) {
  return (
    <IonSegmentButton value={id} style={{ border: 'none' }} checked={isSelected}>
      <IonAvatar>
        {
          isIcon ?
            <IonIcon icon={pictureUrl} style={{ fontSize: 64 }} /> :
            <IonImg src={pictureUrl} alt={name} title={name} />
        }
      </IonAvatar>
      <IonLabel style={{ marginTop: 12 }}>{name}</IonLabel>
    </IonSegmentButton>
  );

 }