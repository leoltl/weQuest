import React, { useState, useContext } from 'react';
import { IonContent, IonButton, IonText } from '@ionic/react';
import axios from 'axios';
import moment from 'moment';

import { AuthContext } from '../../contexts/authContext';

import './RequestForm.scss';
import RequestFieldGroup from './RequestFieldGroup';

const RequestForm = () => {
  const [item, setItem] = useState('');
  const [budget, setBudget] = useState(null);
  const [startDate, setStartDate] = useState(moment().format());
  const [endDate, setEndDate] = useState(
    moment()
      .add(1, 'days')
      .format(),
  );

  const submit = () => {
    const data = {
      item,
      budget,
      startDate,
      endDate,
    };

    if (isValid(data)) {
      axios.post('/requests', { payload: data }).then(res => {
        console.log(res);
      });
      setItem('');
      setBudget(null);
      setStartDate(moment().format());
      setEndDate(
        moment()
          .add(1, 'days')
          .format(),
      );
    } else {
      window.alert('invalid form');
    }
  };

  const isValid = data => {
    return data.item && data.budget && data.startDate && data.endDate && data.startDate <= data.endDate;
  };

  const { user, hardChangeAuth } = useContext(AuthContext);

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
        <IonButton className="ion-margin" disabled={user ? false : true} expand="block" type="submit">
          Request It
        </IonButton>
        <IonButton expand="block" fill="clear" type="button">
          Cancel
        </IonButton>
        <br />
        <br />
        <br />
        <br />
        development temperpory configs:
        <br />
        <IonText className="ion-margin">Logged In as: {user || 'Not Logged In'}</IonText>
        <IonButton onClick={hardChangeAuth} expand="block" fill="clear">
          Hard Log in
        </IonButton>
      </form>
    </IonContent>
  );
};

export default RequestForm;
