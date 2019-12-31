import React, { useState, useReducer } from 'react';
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
  IonButtons
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

import ProductList from '../components/ProductList';


/*
PROPS:
- requestId

*/

// custom hook for managing selected product + add product
// once product is added, selected product should change to that product (pass callback to product modal)

const bidState = {
  products: [],
  product: null,
  price: 0,
  notes: ''
};

// action types enum
const bidActions = {
  PRODUCT_DATA: 0,
  SET_PRODUCT: 1,
  ADD_PRODUCT: 2,
  SET_PRICE: 3,
  SET_NOTES: 4,
};

function bidReducer(state, { type, payload }) {

  switch(type) {
    case bidActions.PRODUCT_DATA:
      return {
        ...state,
        products: payload.products
      };

    case bidActions.SET_PRODUCT:
      return {
        ...state,
        product: payload.product
      };
        
    case bidActions.ADD_PRODUCT:
      return {
        ...state,
        products: payload.products.concat(payload.product),
        product: payload.product.id
      };
          
    case bidActions.SET_PRICE:
      return {
        ...state,
        price: payload.price
      };

    case bidActions.SET_NOTES:
      return {
        ...state,
        notes: payload.notes
      };

    default:
      throw Error(`Tried to reduce with unsupported action of type ${type}.`);

  }

}

export default function BidScreen(props) {

  // should get from props
  const requestId = 2 || props.requestId;


  // should be lifted
  const [showBidScreen, setShowBidScreen] = useState(false);

  //use effect to load products - should be called whenever component is mounted or product is added

  //custom hook for managing selected product + add product

  //states for price and notes
  const [state, dispatch] = useReducer(bidReducer, bidState);


  const [productId, setProductId] = useState(null);



  return (
    // <>
      <IonModal isOpen={showBidScreen} backdropDismiss={false}>
        <IonHeader>
          <IonToolbar color={'tertiary'}>
            <IonButtons slot='start'>
              <IonButton onClick={(e) => setShowBidScreen(false)}>
                <IonIcon slot='icon-only' icon={arrowBack} />
              </IonButton>
            </IonButtons>
            <IonTitle>Bid on {'Tesla' + requestId}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h3>Pick a Product</h3>
          <ProductList />
        </IonContent>
      </IonModal>
    //   <IonButton onClick={() => setShowBidScreen(true)}>Show Bid Screen</IonButton>
    // </>
  );
}