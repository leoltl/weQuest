import React from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonDatetime
} from '@ionic/react';

const RequestFieldGroup = ({ formSetters, formValues }) => {
  const { setItem, setBudget, setStartDate, setEndDate } = formSetters;
  const { item, budget, startDate, endDate } = formValues;
  return (
    <IonList className="my-list">
      <IonItem className="my-list--input">
        <IonLabel position="floating">
          What are you looking for today?
          <ion-text color="danger">*</ion-text>
        </IonLabel>
        <IonInput
          name="item"
          type="item"
          value={item}
          onIonChange={e => setItem(e.target.value)}
        />
      </IonItem>
      <IonItem className="my-list--input">
        <IonLabel position="floating">
          What is your budget?<ion-text color="danger">*</ion-text>
        </IonLabel>
        <IonInput
          name="budget"
          type="budget"
          value={budget}
          onIonChange={e => setBudget(e.target.value)}
        />
      </IonItem>
      <IonItem className="my-list--input">
        <IonLabel>Start Date</IonLabel>
        <IonDatetime
          value={startDate}
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 2}
          displayFormat="DDD. MMM DD, YYYY"
          onIonChange={e => setStartDate(e.target.value)}
        ></IonDatetime>
      </IonItem>
      <IonItem className="my-list--input">
        <IonLabel>End Date</IonLabel>
        <IonDatetime
          value={endDate}
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 2}
          displayFormat="DDD. MMM DD, YYYY"
          onIonChange={e => setEndDate(e.target.value)}
        ></IonDatetime>
      </IonItem>
    </IonList>
  );
};

export default RequestFieldGroup;
