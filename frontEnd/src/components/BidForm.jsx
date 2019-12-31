import React, { useState } from "react";
import {
  IonButton,
  IonInput,
  IonTextarea
} from "@ionic/react";

import ProductList from "./ProductList";

/*
props

bidState, setProduct, addProduct, setPrice, setNotes, submitBid

*/

export default function BidForm({ bidState, setProduct, addProduct, setPrice, setNotes, submitBid, maxPrice }) {
  return (
    <form onSubmit={submitBid}>
      <h3>Pick a Product</h3>
      <ProductList { ...{ products: bidState.products, product: bidState.product, setProduct, addProduct } } />
      <h3>Name Your Price</h3>
      <IonInput type='number' name='price' max={maxPrice} value={bidState.price / 100} step={0.5} inputmode='decimal' onIonChange={(e) => setPrice(e.currentTarget.value * 100)} debounce={100} required></IonInput>
      <h3>Notes</h3>
      <IonTextarea name='notes' value={bidState.notes} rows={4} spellcheck onIonChange={(e) => setNotes(e.currentTarget.value)} debounce={100}></IonTextarea>
      <IonButton type='submit'>Bid</IonButton>
    </form>
  );

};