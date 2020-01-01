import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { IonButton, } from '@ionic/react';

import Modal from '../components/Modal';
import BidForm from '../components/BidForm';

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
];

const dummyProduct = {
  id: 5,
  name: 'Camera',
  description: 'product description',
  pictureUrl: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
}


/*
PROPS:
- requestId
- maxPrice (current bid - 0.5 or whatever step we choose)
- showBidScreen
- setShowBidScreen
*/

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
    
    case bidActions.RESET:
      return {
        ...state,
        product: null,
        price: 0,
        notes: '',
      };

    default:
      throw Error(`Tried to reduce with unsupported action of type ${type}.`);

  }

}

export default function BidScreen(props) {

  console.log('rendering bid');
  
  // should get from props
  const requestId = 2 || props.requestId;
  const maxPrice = 20 || props.maxPrice;

  // should be lifted to request feed (where 'bid' button should be)
  const [showBidScreen, setShowBidScreen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  //state reducer
  const [bidState, bidDispatch] = useReducer(bidReducer, bidInitialState);

  const resetBid = useCallback(() => {
    bidDispatch({ type: bidActions.RESET });
  }, []);

  const setProduct = useCallback((product) => {
    bidDispatch({ type: bidActions.SET_PRODUCT, payload: { product: parseInt(product) || null } })
  }, []);

  // TODO: add spinner??
  const addProduct = useCallback((product) => {

    // TODO: replace resolve with axios call
    new Promise((resolve, _) => {
      setTimeout(() => resolve({ data: product }), 3000)
    })
    .then(({ data: product }) => {
      bidDispatch({ type: bidActions.ADD_PRODUCT, payload: { product } })
    })
    .catch(err => console.log(`Error: ${err.message}`));
  }, []);

  const setPrice = useCallback((price) => {
    bidDispatch({ type: bidActions.SET_PRICE, payload: { price: Math.min(parseInt(price), maxPrice * 100) } })
  }, [maxPrice]);

  const setNotes = useCallback((notes) => {
    bidDispatch({ type: bidActions.SET_NOTES, payload: { notes } })
  }, []);

  const submitBid = (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const bid = {
      requestId,
      product: bidState.product,
      price: bidState.price,
      notes: bidState.notes
    }
    // TODO: replace resolve with axios call
    new Promise((resolve, _) => {
      setTimeout(() => resolve({ data: bid }), 3000)
    })
    .then(({ data: bid }) => {
      resetBid();
      
    })
    .catch(err => console.log(`Error: ${err.message}`))
    .finally(() => setShowSpinner(false))

  };

  // reset form if request id changes
  useEffect(() => {
    resetBid();
  }, [requestId, resetBid]);

  // load product data
  useEffect(() => {

    console.log('effect');
    setShowSpinner(true);
    
    // TODO: replace resolve with axios call
    new Promise((resolve, _) => {
      setTimeout(() => resolve({ data: dummyProducts }), 3000)
    })
    .then(({ data: products }) => {
      bidDispatch({ type: bidActions.PRODUCT_DATA, payload: { products } });
    })
    .catch(err => console.log(`Error: ${err.message}`))
    .finally(() => setShowSpinner(false))

  }, []);

  return (
    <>
      <Modal {...{ showModal: showBidScreen, setShowModal: setShowBidScreen, showSpinner, title: `Bid on Tesla ${ requestId}` }}>
        <BidForm {...{ bidState, setProduct, addProduct, setPrice, setNotes, submitBid, maxPrice }} />
      </Modal>
      <IonButton onClick={(e) => setShowBidScreen(true)}>Show Bid Screen</IonButton>
    </>
  );
}