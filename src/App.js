import React, { Component } from "react";
import { Spinner } from "react-bootstrap"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LoginForm from "./Login";
import RegisterForm from "./Register";
import Feed from "./Feed";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

/**
 * Main app with router to redirect to different pages
 * 
 * Holds logged in state per browser session
 * 
 * TO DO:
 * - send a request to backend to check for token validity/expiry
 */
export default class App extends Component { 
  state = {
    loading: true,
    loggedIn: false
  }

  async componentDidMount() {
    const auth = await localStorage.getItem("auth") || undefined;
    if (auth) {
      this.userLogIn(true); // doesn't know if the token is actually valid or not...
    }
    this.setState({
      loading: false,
    });
  }

  userLogIn = async (bool) => {
    await this.setState({
      loggedIn: bool
    })
  }

  render(){
    if (this.state.loading){
      return <Spinner animation="border" role="status"/>
    }

    return (
      <Router>
        <Switch>
          <Route path="/login" exact render={(props)=>(
            <LoginForm {...props} logIn={this.userLogIn} loggedIn={this.state.loggedIn}/>
          )}/>
          <Route path="/register" exact render={(props)=>(
            <RegisterForm {...props} register={this.userLogIn} loggedIn={this.state.loggedIn}/>
          )}/>
          <Route path="/" exact render={(props)=>(
            <Feed {...props}  setUserLogin={this.userLogIn} loggedIn={this.state.loggedIn}/>
          )}/>
        </Switch>
      </Router>
    );
  }
}