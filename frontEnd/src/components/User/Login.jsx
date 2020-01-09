import React, { useState, useContext, useEffect } from 'react';
import { IonHeader, IonToolbar, IonContent, IonItem, IonLabel, IonInput, IonList, IonButton } from '@ionic/react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { AuthContext } from '../../contexts/authContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = props => {
  // const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { user, setUser } = useContext(AuthContext);
  const history = useHistory();

  const responseFacebook = async response => {
    console.log('Facebook', response.name);
    const userData = { user: { name: response.name, email: response.email, password: 'dummy' } };
    await axios.post('/api/users', userData, response => console.log('id:', response));
    setUser(response);
  };

  const responseGoogle = response => {
    console.log('Google', response);
  };

  const submit = async e => {
    try {
      await axios.post('/api/users/login', { email, password }).then(response => setUser(response));
      //redirectOnSuccess comes from Request Form
      if (history.location.state.redirectOnSuccess) {
        history.push(history.location.state.redirectOnSuccess)
      } else {
        history.push('/requestFeed');
      }
    } catch (e) {
      console.log(e);
      setFormErrors(e);
    }
  };


  return (
    <>
      <IonHeader></IonHeader>
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
              <IonLabel position="floating">Email</IonLabel>
              <IonInput name="email" type="email" value={email} clearInput onIonChange={e => setEmail(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.target.value)} />
            </IonItem>
          </IonList>
          <IonButton expand="block" fill="outline" type="submit">
            Log in
          </IonButton>
          <FacebookLogin appId="625636154855382" fields="name,email,picture" callback={responseFacebook} onFailure={responseFacebook} />
          <GoogleLogin
            clientId="90834222802-0s3k5otim13fak7fbdhaambgh1vjb3vt.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
          <IonButton expand="block" fill="clear" type="submit">
            Forgot your password?
          </IonButton>
        </form>
      </IonContent>
    </>
  );
};

export default Login;
