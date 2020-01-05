import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonButton
} from "@ionic/react";
import { Plugins } from "@capacitor/core";
const { FacebookLogin } = "@rdlabo/capacitor-facebook-login";

const Login = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const FACEBOOK_PERMISSIONS = [
      "email",
      "user_birthday",
      "user_photos",
      "user_gender"
    ];
    const result = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS
    });
    if (result && result.accessToken) {
      console.log(`Facebook access token is ${result.accessToken.token}`);
      history.push({
        pathname: "/home",
        state: {
          token: result.accessToken.token,
          userId: result.accessToken.userId
        }
      });
    }
  };

  const submit = async e => {
    try {
      console.log("email:", email, "password:", password);
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
          </IonList>
          <IonButton expand="block" fill="outline" type="submit">
            Log in
          </IonButton>
          <IonButton
            className="login-button"
            onClick={() => signIn()}
            expand="full"
            fill="solid"
            color="primary"
          >
            Login with Facebook
          </IonButton>
          <IonButton expand="block" fill="clear" type="submit">
            Forgot your password?
          </IonButton>
        </form>
      </IonContent>
    </>
  );
};

export default Login;
