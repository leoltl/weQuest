import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { IonList, IonItem, IonLabel, IonButton, IonInput, IonTextarea } from '@ionic/react';
import axios from 'axios';

import Modal from '../components/Modal';
import ErrorAlert from '../components/ErrorAlert';
import ProductList from '../components/ProductList/ProductList';
import './BidFormModal.scss';

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
  RESET: 5,
};

function bidReducer(state, { type, payload }) {
  switch (type) {
    case bidActions.PRODUCT_DATA:
      return {
        ...state,
        products: payload.products,
      };

    case bidActions.SET_PRODUCT:
      return {
        ...state,
        product: payload.product,
      };

    case bidActions.ADD_PRODUCT:
      return {
        ...state,
        products: state.products.concat(payload.product),
        product: payload.product.id,
      };

    case bidActions.SET_PRICE:
      return {
        ...state,
        price: payload.price,
      };

    case bidActions.SET_NOTES:
      return {
        ...state,
        notes: payload.notes,
      };

    case bidActions.RESET:
      return {
        ...state,
        product: null,
        price: Math.max(payload.price - 100, 0),
        notes: '',
      };

    default:
      throw Error(`Tried to reduce with unsupported action of type ${type}.`);
  }
}

export default function BidFormModal({ showModal, setShowModal, request, updateRequestById }) {
  // console.log('rendering bid form');

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
    bidDispatch({ type: bidActions.SET_PRICE, payload: { price: Math.min(parseInt(price), request.priceCent * 100) } });
  }, [request]);

  const setNotes = useCallback((notes) => {
    bidDispatch({ type: bidActions.SET_NOTES, payload: { notes } });
  }, []);

  const submitBid = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!bidState.product) return setErrorMessage('You must select an item to bid with!');
    if (bidState.price >= request.priceCent) return setErrorMessage('Your price is too high relative to the latest bids!');

    setShowSpinner('Saving...');

    const bid = {
      requestId: request.id,
      itemId: bidState.product,
      priceCent: bidState.price,
      notes: bidState.notes,
    };

    axios
      .post('/api/bids', bid)
      .then(data => new Promise((resolve) => {
        setTimeout(() => resolve(data), 3000);
      }))
      .then(({ data: { requestId, priceCent } }) => {
        setShowModal(false);
        updateRequestById(requestId, { priceCent });
      })
      .catch(err => setErrorMessage(err.message))
      .finally(() => setShowSpinner(false));
  };

  // reset form if request id or priceCent change
  useEffect(() => {
    bidDispatch({ type: bidActions.RESET, payload: { price: request.priceCent } });
  }, [request.id, request.priceCent]);

  // load product data
  useEffect(() => {
    if (showModal) {
      setShowSpinner(true);

      axios
        .get('/api/items')
        .then(({ data: products }) => {
          bidDispatch({ type: bidActions.PRODUCT_DATA, payload: { products } });
        })
        .catch(err => setErrorMessage(err.message))
        .finally(() => setShowSpinner(false));
      }
  }, [showModal]);

  return (
    <Modal {...{ showModal, setShowModal, showSpinner, title: `Bid on ${request.title}` }}>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <form onSubmit={submitBid}>
        <IonList className='bid-form-modal__list-container'>
          <IonItem lines='none'>
            <IonLabel className='bid-form-modal__item-title'>Pick a Product</IonLabel>
          </IonItem>
          <ProductList {...{
            products: bidState.products,
            product: bidState.product,
            setProduct,
            addProduct
            }} />
          <IonItem>
            <IonLabel position='floating'>Name Your Price ($)</IonLabel>
            <IonInput {...{
              type: 'number',
              name: 'price',
              max: Math.max((request.priceCent - 100) / 100, 0),
              min: 0,
              value: bidState.price / 100,
              step: 0.5,
              inputmode: 'decimal',
              onIonChange: e => setPrice(e.currentTarget.value * 100),
              debounce: 100,
              required: true
            }} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Notes</IonLabel>
            <IonTextarea {...{
              name: 'notes',
              value: bidState.notes,
              spellcheck: true,
              onIonChange: e => setNotes(e.currentTarget.value),
              debounce: 100,
              autoGrow: true
            }}></IonTextarea>
          </IonItem>
        </IonList>
        <IonButton className={'bid-form-modal__btn'} expand={'block'} type='submit'>
          Bid Now
        </IonButton>
      </form>
    </Modal>
  );
}
