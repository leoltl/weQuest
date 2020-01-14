import React, { useState, useContext } from 'react';
import axios from 'axios';
import { IonContent, IonItem, IonLabel, IonInput, IonList, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import { isEmail } from '../../lib/utils';

const Register = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const history = useHistory();

  const validateForm = () => {
    if (name.length < 1) {
      props.setErrorMessage('Name cannot be empty');
      return false;
    }
    if (email.length < 1) {
     props.setErrorMessage('Email cannot be empty');
     return false;
    }
    if (!isEmail(email)) {
     props.setErrorMessage('Email is invalid');
     return false;
    }
    if (password.length < 1) {
     props.setErrorMessage('Password cannot be empty');
     return false;
    }
    if (password !== passwordConfirmation) {
     props.setErrorMessage('Passwords Do Not Match');
     return false;
    }

    return true;
  };

  const { setUser } = useContext(AuthContext);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
  };

  const submit = async () => {

    if (!validateForm()) return;

    try {
      props.setShowSpinner(true);
      const serverResponse = await axios
        .post('/api/users', {
          user: { name, email, password },
        })

      setUser(serverResponse.data);
      clearForm();
      history.push('/requests');

    } catch (err) {
      props.setErrorMessage('Error while signing up');

    } finally {
      props.setShowSpinner(false);
    }
  };

  return (
    <>
      <IonContent className={'login-container'}>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <IonList>
            <IonItem>
              <IonLabel position='floating'>Name</IonLabel>
              <IonInput name='name' type='name' value={name} clearInput autcomplete='on' onIonChange={e => setName(e.target.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Email</IonLabel>
              <IonInput name='email' type='email' value={email} clearInput autcomplete='on' onIonChange={e => setEmail(e.target.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Password</IonLabel>
              <IonInput name='password' type='password' value={password} onIonChange={e => setPassword(e.target.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Password Confirmation</IonLabel>
              <IonInput
                name='passwordConfirmation'
                type='password'
                value={passwordConfirmation}
                onIonChange={e => setPasswordConfirmation(e.target.value)}
                required
              />
            </IonItem>
          </IonList>
          <IonItem lines='none'>
            <IonButton expand='block' fill='outline' type='submit'>
              Register
            </IonButton>
          </IonItem>
        </form>
      </IonContent>
    </>
  );
};

export default Register;
