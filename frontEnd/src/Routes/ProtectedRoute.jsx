import React, { useContext } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import LoginScreen from '../pages/LoginScreen';

const ProtectedRoute = props => {
  const { user } = useContext(AuthContext);
  const { component: Component } = props;
  return <Route path={props.path}>{user === null ? <LoginScreen {...props} /> : <Component {...props} />}</Route>;
  // issue with <Redirect /> component. It only render once but not subsequent load. Refactored to above implementation to solve that issue.
  // return <Route { ...rest} render={props => (user !== null ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default withRouter(ProtectedRoute);
