import React, { useState, useEffect, Fragment } from "react";
import { render } from "react-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import {
  IonSegment,
  IonContent,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton
} from "@ionic/react";

const LoginScreen = () => {
  const [segment, setSegment] = useState("login");

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonToolbar>
          <IonSegment onIonChange={e => setSegment(e.detail.value)}>
            <IonSegmentButton value="login" checked={segment === "login"}>
              <IonLabel>Login</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="register" checked={segment === "register"}>
              <IonLabel>Register</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {segment === "login" ? <Login></Login> : <Register></Register>}
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
