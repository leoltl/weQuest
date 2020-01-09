import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, setUser } = useContext(AuthContext);

  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default ProtectedRoute;
