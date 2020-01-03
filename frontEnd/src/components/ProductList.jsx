import React, { useCallback, useState } from 'react';
import { IonSegment } from '@ionic/react';
import { add } from 'ionicons/icons';
import ProductFormModal from '../pages/ProductFormModal';
import ProductListItem from './ProductListItem';

export default function ProductList({ products, product, setProduct, addProduct }) {

  console.log('rendering product list');

  const [showProductForm, setShowProductForm] = useState(false);

  const selectProduct = useCallback((e) => {
    const value = e.currentTarget.value;
    
    if (value === 'add') {
      e.currentTarget.value = null;
      setProduct(null);
      setShowProductForm(true);
    } else {
      setProduct(value);
    }

  },[setProduct])

  return (
    <>
      <ProductFormModal {...{ showModal: showProductForm, setShowModal: setShowProductForm, onSuccess: addProduct} } />
      <IonSegment scrollable onIonChange={selectProduct}>
        <ProductListItem {...{ key:'add', id: 'add', name: 'Add Item', pictureUrl: add, isIcon: true }} />
        {products.map((p) => <ProductListItem {...{ key: p.id, ...p, isSelected: product === p.id }} />)}
      </IonSegment>
    </>
  );

 }