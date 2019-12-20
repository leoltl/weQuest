import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonContent
} from "@ionic/react";
import RequestList from "../components/RequestList";

const RequestFeed = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RequestList></RequestList>
      </IonContent>
    </IonPage>
  );
};

export default RequestFeed;
