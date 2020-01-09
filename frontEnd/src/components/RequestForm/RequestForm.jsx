import React, { useState, useContext } from 'react';
import { IonContent, IonButton, IonText } from '@ionic/react';
import axios from 'axios';
import moment from 'moment';

import { withRouter } from "react-router";

import { AuthContext } from '../../contexts/authContext';

import './RequestForm.scss';
import RequestFieldGroup from './RequestFieldGroup';

const RequestForm = (props) => {
  const [item, setItem] = useState('');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState(null);
  const [startDate, setStartDate] = useState(moment().format());
  const [endDate, setEndDate] = useState(
    moment()
      .add(1, 'days')
      .format()
  );

  const resetFields = () => {
    setItem('');
    setBudget(null);
    setStartDate(moment().format());
    setEndDate(
      moment()
        .add(1, 'days')
        .format()
    );
    setNotes('');
  };

  const parseBudgetToCent = (budget) => {
    const _budget = parseFloat(budget) * 100
    return parseInt(_budget, 10);
  }

  const submit = () => {
    const data = {
      title: item,
      budgetCent: parseBudgetToCent(budget),
      borrowStart: startDate,
      borrowEnd: endDate,
      description: notes
    };

    if (isValid(data)) {
      axios.post('/api/requests', { payload: data }).then(res => {
        if (res.status === 201) {
          resetFields();
          props.history.push('/requestFeed')
        } else {
          // TODO: make error looks better
          window.alert('server error');
        }
      });
    } else {
      // TODO: make error looks better
      window.alert('invalid form');
    }
  };

  const isValid = data => {
    console.log(data);
    return (
      data.title &&
      data.budgetCent &&
      data.borrowStart &&
      data.borrowEnd &&
      data.borrowStart <= data.borrowEnd
    );
  };

  const { user } = useContext(AuthContext);
  // TODO: fix tmpuser
  const tmpuser = true;
  return (
    <IonContent>
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
            setNotes
          }}
          formValues={{ budget, item, startDate, endDate, notes }}
        />
        <IonButton
          className="ion-margin"
          disabled={tmpuser ? false : true} //temp using tmp user, change it back to user.....
          expand="block"
          type="submit"
        >
          Request It
        </IonButton>
        <IonButton expand="block" fill="clear" type="button">
          Cancel
        </IonButton>
      </form>
    </IonContent>
  );
};

export default withRouter(RequestForm);
