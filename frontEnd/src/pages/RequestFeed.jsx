import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonContent,
  useIonViewDidEnter
} from "@ionic/react";
import axios from "axios";
import RequestList from "../components/RequestList";

const requests = [
  {
    id: 1,
    name: "James Troung",
    item: "BasketBall",
    currentBid: 30,
    noOfBids: 3,
    avatar: "url",
    rating: 4,
    description:
      "Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean.",
    startDate: "09-12-2019",
    endDate: "09-15-2019"
  },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 }
];

const RequestFeed = () => {
  const [state, setState] = useState(requests);
  const [selected, setSelected] = useState(null);

  useIonViewDidEnter(() => {
    axios.get("/api/requests").then(requests => {
      setState(requests);
    });
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RequestList
          request={state}
          value={selected}
          onClick={setSelected}
        ></RequestList>
      </IonContent>
    </IonPage>
  );
};

export default RequestFeed;
