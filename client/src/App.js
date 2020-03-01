import React, { Component } from 'react'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import Navbar from './Navbar';

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar/>
        <Route exact path="/register" component = {Register} />
        <Route exact path="/login" component = {Login} />
        <Switch>
            <PrivateRoute
                exact
                path="/"
                component={Dashboard}
            />
        </Switch>
      </Router>
    )
  }
}

export default App
