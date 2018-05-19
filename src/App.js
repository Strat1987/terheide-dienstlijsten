import React, { Component } from 'react';
import logo from './terheide.png';
import './App.css';
import ApiCalendar from './lib/ApiCalendar.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sign: ApiCalendar.sign,
      calendarId: "<CALENDAR_ID>",
      monthRange: this.currentMonthDateRange()
    };
    this.signUpdate = this.signUpdate.bind(this);
    this.currentMonthDateRange = this.currentMonthDateRange.bind(this);
    ApiCalendar.onLoad(() => {
      //Set fixed calendar for now
      ApiCalendar.setCalendar(this.state.calendarId);
      //TODO how to list or create calendar
      console.log('loading Calendar API');
      this.setState({
        sign: ApiCalendar.sign
      });
      ApiCalendar.listenSign(this.signUpdate);
      if (this.state.sign) {
        this.getEvents();
      }
    });
  }

  handleGoogleAuth(event, name) {
    console.log('performing authentication action: ' + name);
    if (name === 'login') {
      ApiCalendar.handleAuthClick();
    } else if (name === 'logout') {
      ApiCalendar.handleSignoutClick();
    }
  }

  getEvents() {
    console.log('monthRange: ' + JSON.stringify(this.state.monthRange));
    ApiCalendar.listUpcomingEvents(this.state.monthRange.from, this.state.monthRange.to)
    .then(({result}) => {
      console.log(result.items);
    });
  }

  signUpdate(signResult) {
    console.log('sign Update:' + signResult);
    if (signResult) {
      this.getEvents();
    }
    this.setState({
      sign: signResult
    });
  }

  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  currentMonthDateRange() {
    // Set the start-min parameter to the beginning of today.
    var manipulateDate = new Date();
    var selectedYear;
    var selectedMonth;

    manipulateDate.setDate(1);
    if (selectedYear == undefined) {
      selectedYear = manipulateDate.getFullYear();
    } else {
      manipulateDate.setFullYear(selectedYear);
    }

    if (selectedMonth == undefined) {
      selectedMonth = manipulateDate.getMonth();
    } else {
      manipulateDate.setMonth(selectedMonth);
    }
    manipulateDate.setHours(0);
    manipulateDate.setMinutes(0);
    manipulateDate.setSeconds(0);
    manipulateDate.setMilliseconds(0);
    var firstDayOfMonthWeekDay = manipulateDate.getDay();
    var fromDate = new Date(manipulateDate);

    // Set the start-max parameter to the beginning of next month.
    manipulateDate.setDate(this.daysInMonth(manipulateDate.getMonth(), manipulateDate.getFullYear()));
    manipulateDate.setHours(23);
    manipulateDate.setMinutes(59);
    manipulateDate.setSeconds(59);
    var lastDayOfMonth = manipulateDate.getDate();
    var toDate = new Date(manipulateDate);
    return { from: fromDate, to: toDate };
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
        {this.state.sign ?
          <button onClick={(e) => this.handleGoogleAuth(e, "logout")}>Uitloggen</button> :
          <button onClick={(e) => this.handleGoogleAuth(e, "login")}>Inloggen</button>}
      </div>
    );
  }
}

export default App;
