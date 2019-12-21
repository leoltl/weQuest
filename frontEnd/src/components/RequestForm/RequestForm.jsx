import React, { useState, useContext } from 'react';
import { IonContent, IonButton, IonText } from '@ionic/react';

import { AuthContext } from '../../contexts/authContext';

import './RequestForm.scss';
import RequestFieldGroup from './RequestFieldGroup';

const RequestForm = () => {
  const [item, setItem] = useState('');
  const [budget, setBudget] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const submit = () => {
    window.alert(`attempt submit! 
    values: 
    ${item},
    ${budget},
    ${startDate},
    ${endDate}`);
    setItem('');
    setBudget(null);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const { isLoggedIn, user, hardChangeAuth } = useContext(AuthContext);

  return (
    <IonContent>
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <RequestFieldGroup
          formSetters={{ setBudget, setItem, setStartDate, setEndDate }}
          formValues={{ budget, item, startDate, endDate }}
        />
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
        <br />
        <br />
        <br />
        <br />
        development temperpory configs:
        <br />
        <IonText className="ion-margin">
          Logged In as: {user || 'Not Logged In'}
        </IonText>
        <IonButton onClick={hardChangeAuth} expand="block" fill="clear">
          Hard Log in
        </IonButton>
      </form>
    </IonContent>
  );
};

export default RequestForm;
