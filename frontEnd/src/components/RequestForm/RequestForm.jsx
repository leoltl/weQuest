import React, { useState, useContext } from 'react';
import { IonButton, IonList } from '@ionic/react';
import axios from 'axios';
import moment from 'moment';

import { withRouter } from 'react-router';

import { AuthContext } from '../../contexts/authContext';

import RequestFieldGroup from './RequestFieldGroup';
import Spinner from '../Spinner';
import ErrorAlert from '../ErrorAlert';

const RequestForm = props => {
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState('');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState(0);
  const [startDate, setStartDate] = useState(moment().format());
  const [endDate, setEndDate] = useState(
    moment()
      .add(1, 'days')
      .format(),
  );
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetFields = () => {
    setItem('');
    setBudget(null);
    setStartDate(moment().format());
    setEndDate(
      moment()
        .add(1, 'days')
        .format(),
    );
    setNotes('');
  };

  const parseBudgetToCent = budget => {
    const _budget = parseFloat(budget) * 100;
    return parseInt(_budget, 10);
  };

  const isValid = data => {
    return data.title && data.budgetCent && data.borrowStart && data.borrowEnd && data.borrowStart <= data.borrowEnd;
  };

  const submit = () => {
    
    if (!user) {
      props.history.push({ pathname: '/login', state: { redirectOnSuccess: '/request/new' } });
      return;
    }

    const data = {
      title: item,
      budgetCent: parseBudgetToCent(budget),
      borrowStart: startDate,
      borrowEnd: endDate,
      description: notes,
    };

    if (!isValid(data)) return setErrorMessage('Invalid form.');

    setShowSpinner('Saving...');
    axios.post('/api/requests', { payload: data })
    .then((res) => {
      resetFields();
      props.history.push('/requests');
    })
    .catch(() => setErrorMessage('Error while saving'))
    .finally(() => setShowSpinner(false));
  };

  const onCancel = e => {
    e.preventDefault();
    e.stopPropagation();
    resetFields();
    props.history.goBack();
  };

  return (
    <>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <Spinner message={showSpinner} />
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <RequestFieldGroup
          formSetters={{
            setBudget,
            setItem,
            setStartDate,
            setEndDate,
            setNotes,
          }}
          formValues={{ budget, item, startDate, endDate, notes }}
        />
        <IonButton expand='block' type='submit'>
          {user ? 'Request It' : 'Login to request'}
        </IonButton>
        <IonButton expand='block' fill='clear' type='button' onClick={onCancel}>
          Cancel
        </IonButton>
      </form>
    </>
  );
};

export default withRouter(RequestForm);
