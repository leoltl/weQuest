import React, { useState, useContext } from 'react';
import { IonHeader, IonToolbar, IonContent, IonItem, IonLabel, IonInput, IonList, IonButton } from '@ionic/react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';
import { repeat } from 'ionicons/icons';

const Login = props => {
  // const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const getCurrentState = async e => {
    const result = await FacebookLogin.getCurrentAccessToken();
    try {
      return result && result.accessToken;
    } catch (e) {
      return false;
    }
  };

  const signIn = async e => {
    const { history } = props;
    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
    const result = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    // if (result && result.accessToken) {
    //   console.log(`Facebook access token is ${result.accessToken.token}`);
    //   history.push({
    //     pathname: "/home",
    //     state: {
    //       token: result.accessToken.token,
    //       userId: result.accessToken.userId
    //     }
    //   });
    // }
  };

  const { user, setUser } = useContext(AuthContext);

  const responseFacebook = response => {
    // console.log('Facebook', response.name);
    setUser(response);
    const userData = { name: response.name, email: response.email, password: 'dummy' };
    console.log(userData);
    axios.post('http://localhost:8080/api/users/', userData, response => {
      console.log(response);
    });
  };

  const responseGoogle = response => {
    console.log('Google', response);
  };

  const userInfo = user => (
    <>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.picture.data.url} height={user.picture.height} width={user.picture.width} alt="avatar" />
    </>
  );

  const submit = async e => {
    try {
      console.log('email:', email, 'password:', password);
    } catch (e) {
      setFormErrors(e);
    }
  };

  return (
    <>
      <IonHeader>{user ? userInfo(user) : ''}</IonHeader>
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
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              window.FB.logout();
            }}
          >
            logout
          </a>
          <IonButton expand="block" fill="clear" type="submit">
            Forgot your password?
          </IonButton>
        </form>
      </IonContent>
    </>
  );
};

export default Login;
