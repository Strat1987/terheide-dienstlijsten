import React, { Component } from 'react';
import logo from './terheide.png';
import './App.css';
import ApiCalendar from './lib/ApiCalendar.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sign: ApiCalendar.sign,
    };
    this.signUpdate = this.signUpdate.bind(this);
    ApiCalendar.onLoad(() => {
      console.log('loading Calendar API');
      ApiCalendar.listenSign(this.signUpdate);
    });
  }

  handleGoogleAuth(event, name) {
    alert('performing auth: ' + name);
    if (name === 'login') {
      ApiCalendar.handleAuthClick();
    } else if (name === 'logout') {
      ApiCalendar.handleSignoutClick();
    }
  }

  signUpdate(signResult) {
    console.log('sign Update:' + signResult);
    this.setState({
      sign: signResult 
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Terheide Dienstlijsten - Google Calendar</h1>
        </header>
        <p className="App-intro">
          Hier kan je je dienstlijsten ingeven zodat deze tevoorschijn komen in Google Calendar.
        </p>
        { this.state.sign ? 
        <button onClick={(e) => this.handleGoogleAuth(e, "logout")}>Uitloggen</button> :
        <button onClick={(e) => this.handleGoogleAuth(e, "login")}>Inloggen</button> }
      </div>
    );
  }
}

export default App;
