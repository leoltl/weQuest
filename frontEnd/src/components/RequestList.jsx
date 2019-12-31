import React, { useEffect, useState } from 'react';
import { IonContent, IonList } from '@ionic/react';
import RequestListItem from './RequestListItem';
import Axios from 'axios';

const RequestList = props => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:8080/requests').then(res =>
      setRequests(res.data)
    );
  }, []);
  const renderedRequestItem = requests.map(listItem => {
    return (
      <RequestListItem
        key={listItem.id}
        requestDetails={listItem}
        selected={listItem.id === props.value}
        selectCard={() =>
          props.onClick(listItem.id === props.value ? null : listItem.id)
        }
      ></RequestListItem>
    );
  });

  return (
    <IonContent id="request-list-item">
      <IonList>{renderedRequestItem}</IonList>
    </IonContent>
  );
};

export default RequestList;
