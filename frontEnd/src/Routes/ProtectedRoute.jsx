import React, { useContext } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import LoginScreen from '../pages/LoginScreen';

const ProtectedRoute = (props) => {
  const { user } = useContext(AuthContext);
  const { component: Component } = props;
  console.log(props, user);
  return (
    <Route path={props.path}>
      { user === null ? <LoginScreen {...props}/> : <Component {...props}/> }
    </Route> 
  )
  // return <Route { ...rest} render={props => (user !== null ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default withRouter(ProtectedRoute);