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
import { logIn } from "ionicons/icons";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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
              <IonLabel position="floating">Name</IonLabel>
              <IonInput
                name="name"
                type="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </IonItem>
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
            <IonItem>
              <IonLabel position="floating">Password Confirmation</IonLabel>
              <IonInput
                name="passwordConfirmation"
                type="passwordConfirmation"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
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
