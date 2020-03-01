import React from 'react';
import { Route, Redirect } from 'react-router-dom';





const PrivateRoute = ({ component: Component, auth, ...rest }) => {
//get token from localstorage and check authentication
    const isAuthenticated = localStorage.getItem('token');
  return (
    <Route
    {...rest}
    render={props =>
      isAuthenticated? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
  )
}


export default PrivateRoute;
