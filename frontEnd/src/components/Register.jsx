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

const login = (email, password) => {
  return true;
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const submit = async e => {
    if (password !== passwordConfirmation) {
      setFormErrors({ message: "Passwords Do Not Match" });
    } else {
      try {
        console.log(e);
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
                onIonChange={e => setName(e.target.value)}
              />
            </IonItem>
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
