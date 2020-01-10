import React, { useState, useContext } from 'react';
import axios from 'axios';
import { IonHeader, IonToolbar, IonContent, IonItem, IonLabel, IonInput, IonList, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

const Register = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const history = useHistory();

  const [formErrors, setFormErrors] = useState({});

  const validateForm = e => {
    if (name.length < 1) {
      setFormErrors({ message: 'Name cannot be empty' });
    }
    if (email.length < 1) {
      setFormErrors({ message: 'Email cannot be empty' });
    }
    if (password.length < 1) {
      setFormErrors({ message: 'Password cannot be empty' });
    }
    if (password !== passwordConfirmation) {
      setFormErrors({ message: 'Passwords Do Not Match' });
    }
  };

  const { setUser } = useContext(AuthContext);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
  }

  const submit = async e => {
    validateForm(e);
    try {
      await axios.post('/api/users', {
        user: { name: name, email: email, password: password },
      }).then(res => {
        setUser(res.data);
        clearForm();
      });
      history.push('/requests');
    } catch (e) {
      setFormErrors(e);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonContent>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit(e);
          }}
        >
          <div>{formErrors ? formErrors.message : null}</div>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              <IonInput name="name" type="name" value={name} clearInput inputMode="text" onIonChange={e => setName(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput name="email" type="email" value={email} clearInput onIonChange={e => setEmail(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password Confirmation</IonLabel>
              <IonInput
                name="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onIonChange={e => setPasswordConfirmation(e.target.value)}
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" fill="outline" type="submit">
            Register
          </IonButton>
        </form>
      </IonContent>
    </>
  );
};

export default Register;
