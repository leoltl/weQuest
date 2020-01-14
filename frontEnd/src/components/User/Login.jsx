import React, { useState, useContext } from 'react';
import { IonContent, IonItem, IonLabel, IonInput, IonList, IonButton, IonRippleEffect } from '@ionic/react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { AuthContext } from '../../contexts/authContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { isEmail } from '../../lib/utils';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  const redirectOnSuccess = () => {
      //redirectOnSuccess comes from Request Form
      if (history.location.state.redirectOnSuccess) {
        history.push(history.location.state.redirectOnSuccess);
      } else {
        history.push('/requests');
      }
  }

  const responseFacebook = async response => {
    try {
      props.setShowSpinner(true);
      // console.log('Facebook', response.name);
      const userData = { user: { name: response.name, email: response.email, password: '123' } };
      const serverResponse = await axios.post('/api/users', userData);
      console.log('id:', serverResponse);

      setUser(response);
      redirectOnSuccess();

    } catch(err) {
      props.setErrorMessage('Error while logging in');

    } finally {
      props.setShowSpinner(false);
    }
  };

  const responseGoogle = async response => {
    try {
      props.setShowSpinner(true);
      // console.log('Google', response.w3);
      const userData = {
        user: {
          name: response.w3.ig,
          email: response.w3.U3,
          password: '123',
        },
      };
      const serverResponse = await axios.post('/api/users', userData);
      console.log('id:', serverResponse);

      setUser(response);
      redirectOnSuccess()
  
    } catch(err) {
      props.setErrorMessage('Error while logging in');

    } finally {
      props.setShowSpinner(false);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const submit = async e => {

    if (!email) return props.setErrorMessage('Email cannot be blank');
    if (!isEmail(email)) return props.setErrorMessage('Email is invalid');
    if (!password) return props.setErrorMessage('Password cannot be blank');

    try {
      props.setShowSpinner(true);

      const serverResponse = await axios.post('/api/users/login', { email, password })
      setUser(serverResponse);
      clearForm();
      redirectOnSuccess();

    } catch (err) {
      props.setErrorMessage('Error while logging in');

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
            submit(e);
          }}
        >
          <IonList>
            <IonItem>
              <IonLabel position='floating'>Email</IonLabel>
              <IonInput name='email' type='email' value={email} autocomplete='on' clearInput onIonChange={e => setEmail(e.target.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Password</IonLabel>
              <IonInput name='password' type='password' value={password} onIonChange={e => setPassword(e.target.value)} required />
            </IonItem>
          </IonList>
          <IonItem lines='none'>
            <IonButton id="login__login-btn" expand='block' fill='outline' type='submit'>
              <IonRippleEffect />
              Login
            </IonButton>
          </IonItem>
          <IonItem lines='none'>
            <FacebookLogin
              appId='625636154855382'
              fields='name,email,picture'
              callback={responseFacebook}
              onFailure={() => props.setErrorMessage('Error while logging in')}
              render={renderProps => (
                <button className='login-button login-button--facebook' onClick={ e => {
                  e.preventDefault();
                  renderProps.onClick()
                }}>
                  Login with Facebook
                </button>
              )}
            />
          </IonItem>
          <IonItem lines='none'>
            <GoogleLogin
              clientId='90834222802-0s3k5otim13fak7fbdhaambgh1vjb3vt.apps.googleusercontent.com'
              buttonText='LOGIN WITH GOOGLE'
              onSuccess={responseGoogle}
              onFailure={() => props.setErrorMessage('Error while logging in')}
              render={renderProps => (
                <button className='login-button login-button--google' onClick={ e => {
                  e.preventDefault();
                  renderProps.onClick()
                }} disabled={renderProps.disabled}>
                  Login with Google
                </button>
              )}
            />
          </IonItem>
        </form>
      </IonContent>
    </>
  );
};

export default Login;
