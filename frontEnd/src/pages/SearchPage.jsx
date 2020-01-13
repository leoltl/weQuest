import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonSearchbar } from '@ionic/react';
import RequestList from '../components/RequestList/RequestList';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';
import { arr2Obj } from '../lib/utils';
import BidFormModal from './BidFormModal';
import Header from '../components/Header';

export default function SearchPage(props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState({});

  useEffect(() => {
    axios.get(`/api/requests/?query=${query}`).then(res => {
      setRequests(arr2Obj(res.data));
    });
  }, [query]);

  return (
    <IonPage id='search-page'>
      <Header title='Search'></Header>
      <IonContent>
        <IonSearchbar debounce={500} onIonChange={e => setQuery(e.target.value)}></IonSearchbar>
        <RequestList
          modal={BidFormModal}
          setRequests={setRequests}
          selectedId={selected}
          onClick={setSelected}
          buttonTitle='Bid Now'
          // refractor to work with objs instead of passing down array
          requests={Object.values(requests)}
        />
      </IonContent>
    </IonPage>
  );
}
