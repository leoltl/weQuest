import React, { useState, useContext } from 'react';
import { IonContent, IonItem, IonLabel, IonInput, IonList, IonButton, IonRippleEffect, IonToast, useIonViewDidLeave, useIonViewDidEnter } from '@ionic/react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { AuthContext } from '../../contexts/authContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  

  useIonViewDidEnter(() => {
    if (history.location.state && history.location.state.redirectOnSuccess && !showToast) {
      setShowToast(true);
    }
  });

  useIonViewDidLeave(() => {
      setShowToast(false)
    }
  );

  console.log(history.location.state, showToast);

  const redirectOnSuccess = () => {
      //redirectOnSuccess comes from Request Form
      if (history.location.state.redirectOnSuccess) {
        history.push(history.location.state.redirectOnSuccess);
      } else {
        history.push('/requests');
      }
  }

  const responseFacebook = async response => {
    // console.log('Facebook', response.name);
    const userData = { user: { name: response.name, email: response.email, password: '123' } };
    await axios.post('/api/users', userData, response => console.log('id:', response));
    setUser(response);
    redirectOnSuccess();
  };

  const responseGoogle = async response => {
    // console.log('Google', response.w3);
    const userData = {
      user: {
        name: response.w3.ig,
        email: response.w3.U3,
        password: '123',
      },
    };
    await axios.post('/api/users', userData, response => console.log('id:', response));
    setUser(response);
    redirectOnSuccess()
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const submit = async e => {
    try {
      await axios.post('/api/users/login', { email, password }).then(response => {
        setUser(response);
        clearForm();
        redirectOnSuccess();
      });
    } catch (e) {
      console.log(e);
      setFormErrors(e);
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
          <div>{formErrors ? formErrors.message : null}</div>
          <IonList>
            <IonItem>
              <IonLabel position='floating'>Email</IonLabel>
              <IonInput name='email' type='email' value={email} autocomplete='on' clearInput onIonChange={e => setEmail(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Password</IonLabel>
              <IonInput name='password' type='password' value={password} onIonChange={e => setPassword(e.target.value)} />
            </IonItem>
          </IonList>
          <IonItem lines='none'>
            <IonButton id="login__login-btn" expand='block' fill='outline' type='submit'>
              <IonRippleEffect></IonRippleEffect>
              Login
            </IonButton>
          </IonItem>
          <IonItem lines='none'>
            <FacebookLogin
              appId='625636154855382'
              fields='name,email,picture'
              callback={responseFacebook}
              onFailure={responseFacebook}
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
              onFailure={responseGoogle}
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
          <IonButton expand='block' fill='clear' type='submit'>
            Forgot your password?
          </IonButton>
        </form>
        <IonToast
          color="medium"
          duration={3000}
          isOpen={showToast}
          showCloseButton={true}
          message={history.location.state && history.location.state.toastMessage}
          position="bottom"
          onDidDismiss={() => setShowToast(false)}/>
      </IonContent>
    </>
  );
};

export default Login;
