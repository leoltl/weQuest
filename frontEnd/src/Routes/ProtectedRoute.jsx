import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, setUser } = useContext(AuthContext);
  const getCurrentState = async e => {
    axios.get('/api/users').then(user => {
      setUser(user.data);
    });
  };

  useEffect(() => {
    getCurrentState();
  }, []);
  console.log('user', user);
  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default ProtectedRoute;
