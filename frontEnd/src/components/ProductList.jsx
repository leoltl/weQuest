import React, { useCallback, useState } from 'react';
import { IonSegment } from '@ionic/react';
import { add } from 'ionicons/icons';
import ProductListItem from './ProductListItem';
import ProductListItemSkeleton from './ProductListItemSkeleton';
import ProductAddScreen from '../pages/ProductAddScreen';

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

  const [showProductScreen, setShowProductScreen] = useState(false);

  const handleChange = useCallback((e) => {
    const value = e.currentTarget.value;
    
    if (value === 'add') {
      e.currentTarget.value = null;
      setProduct(null);

      // bring add modal into view
      setShowProductScreen(true);

      // addProduct
    } else {
      setProduct(value);
    }

  },[])

  return (
    <>
      <ProductAddScreen {...{ showProductScreen, setShowProductScreen, addProduct} } />
      <IonSegment scrollable onIonChange={handleChange}>
        {/* <ProductListItemSkeleton key={'load'} /> */}
        <ProductListItem {...{ key:'add', id: 'add', name: 'Add Item', pictureUrl: add, isIcon: true }} />
        {products.map((p, i) => <ProductListItem {...{ key: p.id, ...p, checked: product === p.id }} />)}
      </IonSegment>
    </>
  );

 }