import React, { Component } from 'react';
import axios from 'axios';
import './style.scss';

import argus from '@argus-dashboard/components';
const { Argus } = argus.components;
import config from '../config';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false
    };

    this.loginAction = this.loginAction.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login() {
    return(
      <form id="login-form" onSubmit={this.loginAction}>
        <div className="input-box">
          <label for="user-input">User:</label>
          <input id="user-input" type="text" name="user" onChange={this.onChange} />
        </div>
        <div className="input-box">
          <label for="password-input">Password:</label>
          <input id="password-input" type="password" name="pass" onChange={this.onChange} />
        </div>
        <input type="submit" value="Login" />
      </form>
    )
  }

  loginAction(e) {
    e.preventDefault();
    const { user, pass } = this.state;
    let self = this;
    axios.post('/login', {
        username: user,
        password: pass
    }).then( function(res) {
      if( res.data === 'ok' ) {
        self.setState({
          loggedUser: user
        });
      }
    });

    return false;
  }

  componentWillMount() {
    axios.get('/login')
    .then( response => {
      if( response.data !== null ) {
        this.setState({
          loggedUser: response.data
        });
      }
    });
  }

  render() {
    let content = this.login();

    if( this.state.loggedUser ) {
      content = (<Argus config={config} />);
    }

    return content;
  }

}
