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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formErrors, setFormErrors] = useState({});

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
          <IonButton expand="block" fill="clear" type="submit">
            Forgot your password?
          </IonButton>
        </form>
      </IonContent>
    </>
  );
};

export default Login;
