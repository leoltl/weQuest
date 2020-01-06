import React, { useState } from 'react';
import axios from 'axios';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonButton,
} from '@ionic/react';
import { logIn } from 'ionicons/icons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [formErrors, setFormErrors] = useState({});

  const submit = async e => {
    if (password !== passwordConfirmation) {
      setFormErrors({ message: 'Passwords Do Not Match' });
    } else {
      try {
        await axios
          .post('http://localhost:8080/users', {
            user: { name: name, email: email, password: password },
          })
          .then(res => console.log(res.data));
      } catch (e) {
        setFormErrors(e);
      }
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
              <IonInput
                name="name"
                type="name"
                value={name}
                clearInput
                inputMode="text"
                onIonChange={e => setName(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                name="email"
                type="email"
                value={email}
                clearInput
                onIonChange={e => setEmail(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                name="password"
                type="password"
                value={password}
                onIonChange={e => setPassword(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password Confirmation</IonLabel>
              <IonInput
                name="passwordConfirmation"
                type="passwordConfirmation"
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
