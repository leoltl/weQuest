import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { IonInput, IonButton } from '@ionic/react';

import Modal from '../components/Modal';
// import productForm from '../components/productForm';

// dummy data

const dummyProduct = {
  id: 5,
  name: 'Camera',
  description: 'product description',
  pictureUrl: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
}


export default function ProductAddScreen({ showProductScreen, setShowProductScreen, addProduct}) {

  console.log('rendering new product form');

  const [showSpinner, setShowSpinner] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');

  const submitProduct = useCallback(() => {

  }, []);
  

  return (
      <Modal {...{ showModal: showProductScreen, setShowModal: setShowProductScreen, showSpinner, title: 'Add New Item' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>Select a Picture</h3>
          <IonInput type='file' name='pictureUrl' accept='jpg,jpeg,gif,png' onIonChange={(e) => console.log(e.target)} required></IonInput>
          <IonButton type='submit'>Add</IonButton>
          </form>
      </Modal>
  );
}