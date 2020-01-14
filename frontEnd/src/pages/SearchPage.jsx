import React, { useEffect, useState, useContext } from 'react';
import { IonContent, IonPage, IonSearchbar, useIonViewDidEnter, useIonViewWillLeave } from '@ionic/react';
import RequestList from '../components/RequestList/RequestList';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';
import { arr2Obj } from '../lib/utils';
import BidFormModal from './BidFormModal';
import Header from '../components/Header';

import './SearchPage.scss';

export default function SearchPage(props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState({});
  const { socket } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`/api/requests/?query=${query}`).then(res => {
      setRequests(arr2Obj(res.data));
    });
  }, [query]);

  useIonViewDidEnter(() => {
    console.log('mount listener search');
    socket.on('get-requests', e => {
      const update = e.data;
      console.log('EVENT', e);
      setRequests(prev => {
        return { ...prev, [update.id]: update };
      });
    });
  });

  useIonViewWillLeave(() => {
    // disconnect from socket
    console.log('unmount listener search');
    socket.off('get-requests');
  });

  return (
    <IonPage id='search-page'>
      <Header title='Search'></Header>
      <IonContent>
        <IonSearchbar className='search__bar' debounce={500} onIonChange={e => setQuery(e.target.value)}></IonSearchbar>
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
