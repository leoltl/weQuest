// import React, { useContext, useEffect } from 'react';
// import { Redirect, Route } from 'react-router-dom';
// import { AuthContext } from '../contexts/authContext';
// import axios from 'axios';

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const { user, setUser } = useContext(AuthContext);
//   // console.log("DEBUG",user);

//   // useEffect(() => {
//   //   const getCurrentState = async e => {
//   //     const user = await axios.get('/api/users');
//   //     setUser(user.data);
//   //   };
//   //   getCurrentState();
//   // }, []);
//   return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
// };

// export default ProtectedRoute;

import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, setUser } = useContext(AuthContext);
  console.log("DEBUG",user);

  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default ProtectedRoute;