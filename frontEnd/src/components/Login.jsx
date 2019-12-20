import React, { useState, Fragment } from "react";
import { render } from "react-dom";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonButton
} from "@ionic/react";
import { format } from "path";
import { logIn } from "ionicons/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const submit = async () => {
    try {
      await logIn({
        email,
        password
      });
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
            submit();
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
                onChange={e => setEmail(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" fill="outline" type="submit">
            Log in
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