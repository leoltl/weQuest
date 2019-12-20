import React from "react";
import { IonContent, IonList } from "@ionic/react";
import RequestListItem from "./RequestListItem";

const RequestList = props => {
  let requests = props.request;
  const renderRequestItem = listItem => {
    return (
      <RequestListItem
        key={listItem.id}
        name={listItem.name}
        item={listItem.item}
        currentBid={listItem.currentBid}
        noOfBids={listItem.noOfBids}
        avatar={listItem.url}
        rating={listItem.rating}
        selected={listItem.id === props.value}
        selectCard={() =>
          props.onClick(listItem.id === props.value ? null : listItem.id)
        }
      ></RequestListItem>
    );
  };

  return (
    <IonContent id="request-list-item">
      <IonList>{requests.map(listItem => renderRequestItem(listItem))}</IonList>
    </IonContent>
  );
};

export default RequestList;
