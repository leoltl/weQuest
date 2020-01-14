import React, { useState, useCallback } from 'react';
import { IonInput, IonButton, IonList, IonItem, IonImg, IonLabel, IonTextarea } from '@ionic/react';
import axios from 'axios';
import { readFile } from '../lib/utils';

import Modal from '../components/Modal';
import ErrorAlert from '../components/ErrorAlert';
import './ProductFormModal.scss';

export default function ProductFormScreen({ showModal, setShowModal, onSuccess }) {
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

  const loadPicture = useCallback(e => {
    e.preventDefault();
    setShowSpinner('Saving...');

    const file = e.currentTarget.querySelector('input').files[0];
    if (!file) return setShowSpinner(false);

    readFile(file)
      .then(img => setPictureUrl(img))
      .catch(err => setErrorMessage(err.message))
      .finally(() => setShowSpinner(false));
  }, []);

  const submitProduct = e => {
    e.preventDefault();
    e.stopPropagation();
    console.log('submitting product');

    if (!name) return setErrorMessage('The name field cannot be blank!');
    if (!description) return setErrorMessage('The description field cannot be blank!');
    if (!pictureUrl) return setErrorMessage('You must attach a picture!');

    setShowSpinner('Saving...');

    const product = {
      // id: 6,
      name,
      description,
      pictureUrl,
    };

    axios
      .post('/api/items', product)
      .then(({ data: product }) => {
        setShowModal(false);
        resetProduct();
        onSuccess(product);
      })
      .catch(err => setErrorMessage(err.message))
      .finally(() => setShowSpinner(false));
  };

  return (
    <Modal {...{ showModal, setShowModal, showSpinner, title: 'Add New Item' }}>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <form onSubmit={submitProduct}>
        <IonList>
          <IonItem className={'product-form__img-item'} lines='none'>
            <IonLabel className={'product-form__img-label'} position='stacked'>
              Upload a Picture
            </IonLabel>
            <IonImg
              className={'product-form__img-img'}
              src={
                pictureUrl ||
                'https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
              }
              alt='New Item'
              title='New Item'
            />
            <IonButton className={'product-form__img-btn'} onClick={e => e.currentTarget.querySelector('input').click()}>
              {pictureUrl ? 'Select New Picture' : 'Upload Picture'}
              <IonInput
                type='file'
                name='pictureUrl'
                accept='image/png, image/jpeg, image/gif, image/heif, image/heic'
                onIonChange={loadPicture}
                style={{ display: 'none' }}
              />
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel position='floating'>Name</IonLabel>
            <IonInput
              type='text'
              name='name'
              spellcheck
              value={name}
              onIonChange={e => setName(e.currentTarget.value)}
              debounce={100}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position='floating'>Description</IonLabel>
            <IonTextarea
              name='description'
              value={description}
              rows={4}
              spellcheck
              onIonChange={e => setDescription(e.currentTarget.value)}
              debounce={100}
              required
            ></IonTextarea>
          </IonItem>
        </IonList>
        <IonButton className={'product-form__btn'} expand={'block'} type='submit'>
          Add Item
        </IonButton>
      </form>
    </Modal>
  );
}
