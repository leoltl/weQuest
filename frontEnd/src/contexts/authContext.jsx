import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// class AuthContextProvider extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       isLoggedIn: false,
//       user: null
//     };
//   }

//   // temp hard coded change authtication function
//   // we can probably reuse this when we do the login/ signup function
//   // and keep the authenticate state in this context.
//   hardChangeAuthState() {
//     this.setState(prevState => ({
//       isLoggedIn: !prevState.isLoggedIn,
//       user: prevState.user ? null : 'Leo'
//     }));
//   }

//   render() {
//     return (
//       <AuthContext.Provider
//         value={{
//           ...this.state,
//           hardChangeAuth: this.hardChangeAuthState.bind(this)
//         }}
//       >
//         {this.props.children}
//       </AuthContext.Provider>
//     );
//   }
// }

const AuthContextProvider = props => {
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(props.socket);
  const [notification, setNotification] = useState('');

  const hardChangeAuth = () => {
    setUser(prevState => (prevState ? null : 'Leo'));
  };

  useEffect(() => {
    // notification listener
    socket.on('notifications', event => {
      console.log('notifications', event.data);
      const notification = event.data;
      setNotification(notification);
    });

    return () => {
      socket.off('notifications');
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        hardChangeAuth,
        socket,
        notification,
        setNotification,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
