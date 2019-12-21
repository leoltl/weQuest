import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent
} from "@ionic/react";

const RequestListItem = props => {
  return (
    <IonCard onClick={props.selectCard}>
      <IonCardHeader>
        <IonCardTitle>Card Title</IonCardTitle>
        <IonCardSubtitle>SubTittle</IonCardSubtitle>
      </IonCardHeader>
      {props.selected ? (
        <IonCardContent>
          Keep close to Nature's heart... and break clear away, once in awhile,
          and climb a mountain or spend a week in the woods. Wash your spirit
          clean.
        </IonCardContent>
      ) : (
        ""
      )}
    </IonCard>
  );
};

export default RequestListItem;
