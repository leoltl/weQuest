import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { IonList, IonItem, IonLabel, IonButton, IonInput, IonTextarea } from '@ionic/react';
import axios from 'axios';

import Modal from '../components/Modal';
import ErrorAlert from '../components/ErrorAlert';
import ProductList from "../components/ProductList/ProductList";

// dummy data
const dummyProducts = [
  {
    id: 1,
    name: 'Barbecue',
    description: 'product description',
    pictureUrl: 'https://images.unsplash.com/photo-1500840922267-8ff91fbf85aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80'
  },
  {
    id: 2,
    name: 'Drill',
    description: 'product description',
    pictureUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1686&q=80'
  },
  {
    id: 3,
    name: 'Clown',
    description: 'product description',
    pictureUrl: 'https://images.unsplash.com/photo-1502488207239-dcf4114041cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: 4,
    name: 'Keyboard',
    description: 'product description',
    pictureUrl: 'https://images.unsplash.com/photo-1545112719-ce81d7de0b71?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1622&q=80'
  },
  {
    id: 5,
    name: 'Camera',
    description: 'product description',
    pictureUrl: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
  }
];

const bidInitialState = {
  products: [],
  product: null,
  price: 0,
  notes: '',
};

// action types enum
const bidActions = {
  PRODUCT_DATA: 0,
  SET_PRODUCT: 1,
  ADD_PRODUCT: 2,
  SET_PRICE: 3,
  SET_NOTES: 4,
  RESET: 5
};

function bidReducer(state, { type, payload }) {

  switch(type) {
    case bidActions.PRODUCT_DATA:
      return {
        ...state,
        products: payload.products,
      };
    
    case bidActions.SET_PRODUCT:
      return {
        ...state,
        product: payload.product
      };
        
    case bidActions.ADD_PRODUCT:
      return {
        ...state,
        products: state.products.concat(payload.product),
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
    
    case bidActions.RESET:
      return {
        ...state,
        product: null,
        price: payload.price - 50,
        notes: '',
      };

    default:
      throw Error(`Tried to reduce with unsupported action of type ${type}.`);

  }

}

export default function BidFormModal({ showModal, setShowModal, request }) {

  console.log('rendering bid');

  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // state reducer
  const [bidState, bidDispatch] = useReducer(bidReducer, bidInitialState);

  const setProduct = useCallback((product) => {
    bidDispatch({ type: bidActions.SET_PRODUCT, payload: { product: parseInt(product) || null } });
  }, []);

  const addProduct = useCallback((product) => {
    bidDispatch({ type: bidActions.ADD_PRODUCT, payload: { product } });
  }, []);

  const setPrice = useCallback((price) => {
    bidDispatch({ type: bidActions.SET_PRICE, payload: { price: Math.min(parseInt(price), request.currentPrice * 100) } });
  }, [request]);

  const setNotes = useCallback((notes) => {
    bidDispatch({ type: bidActions.SET_NOTES, payload: { notes } });
  }, []);

  const submitBid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('submitting bid');

    if (!bidState.product) return setErrorMessage('You must select an item to bid with!');
    if (bidState.price >= request.currentPrice) return setErrorMessage('Your price is too high relative to the latest bids!');
    
    setShowSpinner('Saving...');

    const bid = {
      requestId: request.id,
      itemId: bidState.product,
      priceCent: bidState.price,
      notes: bidState.notes
    };
    // TODO: replace resolve with axios call
    // new Promise((resolve) => {
    //   setTimeout(() => resolve({ data: bid }), 3000);
    // })
    axios.post('/api/bids', bid)
    .then(({ data: bid }) => {
      setShowModal(false);
      console.log(bid);
      
    })
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setShowSpinner(false));

  };

  // reset form if request id or currentPrice change
  useEffect(() => {
    bidDispatch({ type: bidActions.RESET, payload: { price: request.currentPrice } });
  }, [request.id, request.currentPrice]);

  // load product data
  useEffect(() => {

    console.log('effect');
    setShowSpinner(true);
    
    // TODO: replace resolve with axios call
    // new Promise((resolve) => {
    //   setTimeout(() => resolve({ data: dummyProducts }), 3000);
    // })
    axios.get('/api/items')
    .then(({ data: products }) => {
      bidDispatch({ type: bidActions.PRODUCT_DATA, payload: { products } });
    })
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setShowSpinner(false));

  }, []);

  return (
    <Modal {...{ showModal, setShowModal, showSpinner, title: `Bid on Tesla ${ request.id}` }}>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <form onSubmit={submitBid}>
        {/* <h3>Pick a Product</h3> */}
        <IonList>
          {/* Label and product list should be under one and the same item component. Need to fix formatting */}
          <IonItem>
            <IonLabel position='stacked' style={{ marginBottom: 20 }}>Pick a Product</IonLabel>
          </IonItem>
          <IonItem>
            <ProductList { ...{ products: bidState.products, product: bidState.product, setProduct, addProduct } } />
          </IonItem>
          {/* <h3>Name Your Price</h3> */}
          <IonItem>
            <IonLabel position='floating'>Name Your Price</IonLabel>
            <IonInput type='number' name='price' max={(request.currentPrice - 50) / 100} value={bidState.price / 100} step={0.5} inputmode='decimal' onIonChange={(e) => setPrice(e.currentTarget.value * 100)} debounce={100} required></IonInput>
          </IonItem>
          {/* <h3>Notes</h3> */}
          <IonItem>
            <IonLabel position='floating'>Notes</IonLabel>
            <IonTextarea name='notes' value={bidState.notes} rows={4} spellcheck onIonChange={(e) => setNotes(e.currentTarget.value)} debounce={100}></IonTextarea>
          </IonItem>
        </IonList>
        <IonButton type='submit'>Bid</IonButton>
      </form>
    </Modal>
  );
}