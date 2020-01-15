import React, { useContext } from 'react';
import { IonButton, IonGrid, IonList, IonItem, IonRow, IonIcon, IonLabel, IonImg } from '@ionic/react';
import { pin, mail } from 'ionicons/icons';
import { withRouter } from 'react-router';
import { AuthContext } from '../../contexts/authContext';
import axios from 'axios';

function ProfileAvatar(props) {
  const { user, setUser } = useContext(AuthContext);

  const signOut = async e => {
    setUser(null);
    await axios.get('/api/users/logout');
    props.history.push('/requests');
  };

  // console.log('USER PROFILE ', user);

  const userInfo = user => (
    <>
      <IonRow className='profile-page__img-container'>
        <IonImg className='profile-page__img-container-img' alt='profile' src={`https://i.pravatar.cc/150?u=${user.name}`}></IonImg>
      </IonRow>
      <IonRow className='profile-page__details-container'>
        <IonList className='profile-page__details-container-list'>
          <IonItem lines='none'>
            <div className='profile-page__details-container-name'>{user.name}</div>
          </IonItem>
          <IonItem>
            <IonIcon className='profile-page__icon' icon={pin}></IonIcon>
            <IonLabel className='profile-page__details-container-location'>Toronto, ON</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon className='profile-page__icon' icon={mail}></IonIcon>
            <IonLabel className='profile-page__details-container-email'>{user.email}</IonLabel>
          </IonItem>
        </IonList>
      </IonRow>
    </>
  );
  return (
    <>
      <IonGrid className='profile-page__profile-container'>
        {user ? userInfo(user) : ''}
        <IonRow className='profile-page__button-container'>
          <IonButton
            className='profile-page__button-container-logout'
            onClick={() => signOut()}
            expand='border'
            fill='solid'
            color='primary'
            style={{ opacity: 0.8 }}
          >
            Logout
          </IonButton>
        </IonRow>
      </IonGrid>
    </>
  );
}

export default withRouter(ProfileAvatar);
