import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonContent
} from '@ionic/react';
import RequestList from '../components/RequestList/RequestList';

const requests = [
  {
    id: 1,
    name: 'James Troung',
    item: 'BasketBall',
    currentBid: 30,
    noOfBids: 3,
    avatar: 'url',
    rating: 4,
    description:
      "Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean.",
    startDate: '09-12-2019',
    endDate: '09-15-2019'
  },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 }
];

const RequestFeed = () => {
  const [selected, setSelected] = useState(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>See all requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RequestList
          request={requests}
          selectedId={selected}
          onClick={setSelected}
        ></RequestList>
      </IonContent>
    </IonPage>
  );
};

export default RequestFeed;
