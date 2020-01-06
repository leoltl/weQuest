import React from 'react';
import { IonAvatar, IonSkeletonText, IonSegmentButton, IonLabel } from '@ionic/react';

export default function ProductListItemSkeleton() {
  return (
    <IonSegmentButton disabled>
      <IonAvatar>
        <IonSkeletonText animated />
      </IonAvatar>
      <IonLabel>
        <IonSkeletonText animated width='80px' />
      </IonLabel>
    </IonSegmentButton>
  );

 }