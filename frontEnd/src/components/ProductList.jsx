import React from 'react';
import { IonSegment } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
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


products: bidState.products, product: bidState.product, setProduct
*/

export default function ProductList({ products, product, setProduct, addProduct }) {

  return (
    <IonSegment scrollable onIonChange={(e) => setProduct(e.detail.value)}>
      {/* <ProductListItemSkeleton key={'load'} /> */}
      <ProductListItem {...{ key:'add', id: 'add', name: 'Add Item', pictureUrl: arrowBack, isIcon: true }} />
      {products.map((p, i) => <ProductListItem {...{ key: p.id, ...p, checked: product === p.id }} />)}
    </IonSegment>
  );

 }