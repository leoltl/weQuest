import React, { useContext } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const ProtectedRoute = ({ component: Component, history, ...rest }) => {
  const { user } = useContext(AuthContext);
  console.log('PROTECT', user);
  return <Route { ...rest} render={props => (user !== null ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default withRouter(ProtectedRoute);