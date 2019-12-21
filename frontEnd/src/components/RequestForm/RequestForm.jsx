import React, { useState } from 'react';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonButton,
  IonDatetime,
  IonText
} from '@ionic/react';

import { AuthContext } from '../../contexts/authContext';

import './RequestForm.scss';

const RequestForm = () => {
  const [item, setItem] = useState('');
  const [budget, setBudget] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [formErrors, setFormErrors] = useState({});

  const submit = () => {
    window.alert('attempt submit');
    console.log({
      item,
      budget,
      startDate,
      endDate
    });
  };

  return (
    <AuthContext.Consumer>
      {context => {
        const { isLoggedIn, user, hardChangeAuth } = context;
        console.log(hardChangeAuth);
        return (
          <IonContent>
            <form
              onSubmit={e => {
                e.preventDefault();
                submit();
              }}
            >
              <div>{formErrors ? formErrors.message : null}</div>
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
              <IonButton
                className="ion-margin"
                disabled={isLoggedIn ? false : true}
                expand="block"
                type="submit"
              >
                Request It
              </IonButton>
              <IonButton expand="block" fill="clear" type="cancel">
                Cancel
              </IonButton>
              <IonText className="ion-text-center">
                Logged In as: {user || 'Not Logged In'}
              </IonText>
              <IonButton onClick={hardChangeAuth} expand="block" fill="clear">
                Hard Log in
              </IonButton>
            </form>
          </IonContent>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default RequestForm;
