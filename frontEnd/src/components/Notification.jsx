import React, { useState, useContext, useEffect } from 'react';
import { IonToast } from '@ionic/react';
import { AuthContext } from '../contexts/authContext';
import { CSSTransition } from 'react-transition-group';

export default function Notification(props) {
  const [showToast, setShowToast] = useState(false);
  const { notification } = useContext(AuthContext);
  const [initalRender, setInitialRender] = useState(true);

  // show toast when notification hook is changed
  useEffect(() => {
    if (!initalRender) {
      setShowToast(true);
    }

    // ensures notificaiton does not show up on load
    setInitialRender(false);
  }, [notification]);

  return (
    <CSSTransition
      in={showToast}
      timeout={300}
      classNames='notification'
      unmountOnExit
      // onEnter={() => setShowButton(true)}
      onExited={() => setShowToast(false)}
    >
      <IonToast
        classNames='notification'
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={notification}
        duration={2000}
        position={'top'}
      />
    </CSSTransition>
  );
}
