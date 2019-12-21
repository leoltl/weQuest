import React, { createContext } from 'react';

export const AuthContext = createContext();

class AuthContextProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      user: null
    };
  }

  // temp hard coded change authtication function
  // we can probably reuse this when we do the login/ signup function
  // and keep the authenticate state in this context.
  hardChangeAuthState() {
    this.setState(prevState => ({
      ...prevState,
      isLoggedIn: !prevState.isLoggedIn,
      user: prevState.user ? null : 'Leo'
    }));
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          ...this.state,
          hardChangeAuth: this.hardChangeAuthState.bind(this)
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContextProvider;
