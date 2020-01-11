import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default ProtectedRoute;