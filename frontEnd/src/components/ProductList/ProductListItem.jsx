import React from 'react';
import { IonAvatar, IonIcon, IonImg, IonSegmentButton, IonLabel } from '@ionic/react';

export default function ProductListItem({ id, name, pictureUrl, isSelected, isIcon = false }) {
  return (
    <IonSegmentButton className={'product-list__item'} value={id} style={{ border: 'none' }} checked={isSelected}>
      <IonAvatar>
        {isIcon ? (
          <IonIcon className='product-list__icon' icon={pictureUrl} />
        ) : (
          <IonImg className='product-list__img' src={pictureUrl} alt={name} title={name} />
        )}
      </IonAvatar>
      <IonLabel style={{ marginTop: 12 }} className='product-list__label'>
        {name}
      </IonLabel>
    </IonSegmentButton>
  );
}
