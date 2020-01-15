import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { IonContent, IonItem, IonLabel, IonInput, IonList, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import { isEmail, readFile } from '../../lib/utils';

const _firstName = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];   
	
const _lastName = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler" ];


const Register = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const history = useHistory();
  const { setNotification } = useContext(AuthContext);

  // AUTO FILL FOR DEMO PURPOSES ONLY
  const autoFillInfo = useCallback(() => {

    const firstName = _firstName[Math.floor(Math.random()*(_firstName.length))]
    console.log(Math.random()*(_firstName.length) + 1)
    const lastName = _lastName[Math.floor(Math.random()*(_lastName.length))]
    console.log(_lastName)
    const email = Math.random()
      .toString(36)
      .substring(7);
    setName(firstName + " " + lastName)
    setEmail(email + '@gmail.com');
    setPassword(email);
    setPasswordConfirmation(email);
  });

  // AUTO ITEM CREATION FOR DEMO PURPOSES ONLY
  const createItem = useCallback(() => {

    props.setShowSpinner(true);

    const product = {
      name: 'Thumbs Up',
      description: 'Per urbandictionary.com: What you must give to this definition, or my parents will beat me.',
      pictureUrl: 'secretdefaultdev',
    };

    axios.post('/api/items', product)
      .then(() => setNotification('An item has been automatically added to your item list. Let\'s get the bidding started!'))
      .catch(err => console.log('Failed to add item automatically', err))
      .finally(() => props.setShowSpinner(false));

  });

  const { setUser } = useContext(AuthContext);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
  };

  const submit = async () => {
    try {
      props.setShowSpinner(true);
      const serverResponse = await axios.post('/api/users', {
        user: { name, email, password },
      });

      setUser(serverResponse.data);
      clearForm();

      //DEMO ONLY: create dummy item
      await createItem();

      history.push('/requests');
    } catch (err) {
      props.setErrorMessage('Error while signing up');
    } finally {
      props.setShowSpinner(false);
    }
  };

  return (
    <>
      <IonContent className={'login-container'}>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <IonList>
            <IonItem>
              <IonLabel position='floating'>Name</IonLabel>
              <IonInput
                name='name'
                type='name'
                value={name}
                clearInput
                // autcomplete='on'
                onIonFocus={() => autoFillInfo()}
                onIonChange={e => setName(e.target.value)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Email</IonLabel>
              <IonInput
                name='email'
                type='email'
                value={email}
                clearInput
                // autcomplete='on'
                onIonChange={e => setEmail(e.target.value)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Password</IonLabel>
              <IonInput name='password' type='password' value={password} onIonChange={e => setPassword(e.target.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position='floating'>Password Confirmation</IonLabel>
              <IonInput
                name='passwordConfirmation'
                type='password'
                value={passwordConfirmation}
                onIonChange={e => setPasswordConfirmation(e.target.value)}
                required
              />
            </IonItem>
          </IonList>
          <IonItem lines='none'>
            <IonButton className='register-button' expand='block' fill='solid' type='submit'>
              Register
            </IonButton>
          </IonItem>
        </form>
      </IonContent>
    </>
  );
};

export default Register;
