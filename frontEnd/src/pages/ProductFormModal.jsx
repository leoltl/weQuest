import React, { useState, useCallback } from 'react';
import { IonInput, IonButton, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonTextarea } from '@ionic/react';

import Modal from '../components/Modal';
import ErrorAlert from '../components/ErrorAlert';

function readClientFile(file) {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => {
      reader.abort();
    }
    reader.onabort = (e) => {
      reject('Error while loading the file!');
    }
    reader.readAsDataURL(file);

  });
}


export default function ProductFormScreen({ showModal, setShowModal, onSuccess}) {

  console.log('rendering new product form');

  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');

  const resetProduct = useCallback(() => {
    setName('');
    setDescription('');
    setPictureUrl('');
  }, []);

  const loadPicture = useCallback((e) => {
    e.preventDefault();
    setShowSpinner('Saving...');

    const file = e.currentTarget.querySelector('input').files[0];
    if (!file) return setShowSpinner(false);

    readClientFile(file)
    .then((img) => setPictureUrl(img))
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setShowSpinner(false));

  }, []);

  const submitProduct = (e) => {

    e.preventDefault();
    e.stopPropagation();
    console.log('submitting product');

    if (!name) return setErrorMessage('The name field cannot be blank!');
    if (!description) return setErrorMessage('The description field cannot be blank!');
    if (!pictureUrl) return setErrorMessage('You must attach a picture!');
    
    setShowSpinner('Saving...');

    const product = {
      id: 6,
      name,
      description,
      pictureUrl
    };
    // TODO: replace resolve with axios call
    new Promise((resolve) => {
      setTimeout(() => resolve({ data: product }), 3000);
    })
    .then(({ data: product }) => {
      setShowModal(false);
      resetProduct();
      onSuccess(product);
    })
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setShowSpinner(false));

  };
  

  return (
    <Modal {...{ showModal, setShowModal, showSpinner, title: 'Add New Item' }}>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <form onSubmit={submitProduct}>
        <IonList>
          <IonItem>
            <IonLabel position='floating' style={{ marginBottom: 40 }}>Upload a Picture</IonLabel>
            {pictureUrl && <IonAvatar>
              <IonImg src={pictureUrl} alt='New Item' title='New Item' />
            </IonAvatar>}
            <IonButton onClick={(e) => e.currentTarget.querySelector('input').click()}>
              {pictureUrl ? 'Select New Picture' : 'Upload Picture'}
              <IonInput type='file' name='pictureUrl' accept='image/png, image/jpeg, image/gif' onIonChange={loadPicture} style={{ display: 'none' }} />
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel position='floating'>Name</IonLabel>
            <IonInput type='text' name='name' spellcheck value={name} onIonChange={(e) => setName(e.currentTarget.value)} debounce={100} required />
          </IonItem>
          <IonItem>
            <IonLabel position='floating'>Description</IonLabel>
            <IonTextarea name='description' value={description} rows={4} spellcheck onIonChange={(e) => setDescription(e.currentTarget.value)} debounce={100} required></IonTextarea>
          </IonItem>
        </IonList>
        <IonButton type='submit'>Add</IonButton>
      </form>
    </Modal>
  );
}