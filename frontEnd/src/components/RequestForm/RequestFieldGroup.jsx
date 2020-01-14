import React from 'react';
import { IonItem, IonLabel, IonList, IonDatetime, IonTextarea, IonInput } from '@ionic/react';

const RequestFieldGroup = ({ formSetters, formValues }) => {
  const { setItem, setBudget, setStartDate, setEndDate, setNotes } = formSetters;
  const { item, budget, startDate, endDate, notes } = formValues;
  return (
    <IonList className='my-list'>
      <IonItem className='my-list--input'>
        <IonLabel position='floating'>
          What are you looking for today?
          <ion-text color='danger'>*</ion-text>
        </IonLabel>
        <IonTextarea name='item' type='text' value={item} onIonChange={e => setItem(e.target.value)} />
      </IonItem>
      <IonItem className='my-list--input'>
        <IonLabel position='floating'>
          What is your budget?<ion-text color='danger'>*</ion-text>
        </IonLabel>
        <IonInput name='budget' type='number' inputmode='decimal' value={budget} onIonChange={e => setBudget(e.target.value)} />
      </IonItem>
      <IonItem className='my-list--input'>
        <IonLabel position='floating'>Start Date</IonLabel>
        <IonDatetime
          value={startDate}
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 2}
          displayFormat='DDD. MMM DD, YYYY'
          onIonChange={e => setStartDate(e.target.value)}
        ></IonDatetime>
      </IonItem>
      <IonItem className='my-list--input'>
        <IonLabel position='floating'>End Date</IonLabel>
        <IonDatetime
          value={endDate}
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 2}
          displayFormat='DDD. MMM DD, YYYY'
          onIonChange={e => setEndDate(e.target.value)}
        ></IonDatetime>
      </IonItem>
      <IonItem>
        <IonLabel position='stacked'>Notes</IonLabel>
        <IonTextarea
          name='notes'
          value={notes}
          autoGrow={true}
          spellcheck
          onIonChange={e => setNotes(e.currentTarget.value)}
          debounce={100}
        ></IonTextarea>
      </IonItem>
    </IonList>
  );
};

export default RequestFieldGroup;
