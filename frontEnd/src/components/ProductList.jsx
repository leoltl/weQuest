import React from 'react';
import { IonSegment } from '@ionic/react';
import ProductListItem from './ProductListItem';
import ProductListItemSkeleton from './ProductListItemSkeleton';

/* controlled component

props: 
- handleSelect: function
- products: object with all products
- selected: boolean

actions (value):
- add -> show product add modal
- number -> id of product selected
*/

export default function ProductList() {


  return (
    <IonSegment scrollable onIonChange={(e) => console.log('Segment selected', e.detail.value)}>
      <ProductListItemSkeleton key={'load'} />
      <ProductListItem key={'add'} id={'add'} />
      {Array(10).fill('').map((_, i) => <ProductListItem key={i} id={i} />)}
    </IonSegment>
  );

 }