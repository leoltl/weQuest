import React from "react";
import { IonContent, IonList } from "@ionic/react";
import RequestListItem from "./RequestListItem";

const RequestList = props => {
  const tempItem = [
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
  return (
    <IonContent id="request-list-item">
      <IonList>{tempItem.map(listItem => renderRequestItem(listItem))}</IonList>
    </IonContent>
  );
};

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
    ></RequestListItem>
  );
};

export default RequestList;
