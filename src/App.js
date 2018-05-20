import React, { Component } from 'react';
import logo from './terheide.png';
import './App.css';
import ApiCalendar from './lib/ApiCalendar';
import CalendarItem from './components/CalendarItem'
import Month from './components/Month'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sign: ApiCalendar.sign,
      calendarId: "<CALENDAR_ID>",
      monthRange: this.currentMonthDateRange(),
      currentMonth: "",
      //test events since API can't connect on localhost
      calendarEvents: [{ "kind": "calendar#event", "etag": "\"3045134953452000\"", "id": "618s8bn3f7oufmrbblkpnhslc8", "status": "confirmed", "htmlLink": "https://www.google.com/calendar/event?eid=NjE4czhibjNmN291Zm1yYmJsa3BuaHNsYzggMG8ydDRoa2R1b3Q2N2ZidDY0aWx0ZnJwZWdAZw", "created": "2018-04-01T07:24:36.000Z", "updated": "2018-04-01T07:24:36.726Z", "summary": "B-45 (late)", "creator": { "email": "roexbert@gmail.com", "displayName": "Bert Roex" }, "organizer": { "email": "0o2t4hkduot67fbt64iltfrpeg@group.calendar.google.com", "displayName": "Ter Heide", "self": true }, "start": { "dateTime": "2018-05-01T13:15:00+02:00" }, "end": { "dateTime": "2018-05-01T21:00:00+02:00" }, "iCalUID": "618s8bn3f7oufmrbblkpnhslc8@google.com", "sequence": 0, "reminders": { "useDefault": true } }, { "kind": "calendar#event", "etag": "\"3045134965146000\"", "id": "gua9gpc9b8i4kvb9e37stp42d8", "status": "confirmed", "htmlLink": "https://www.google.com/calendar/event?eid=Z3VhOWdwYzliOGk0a3ZiOWUzN3N0cDQyZDggMG8ydDRoa2R1b3Q2N2ZidDY0aWx0ZnJwZWdAZw", "created": "2018-04-01T07:24:42.000Z", "updated": "2018-04-01T07:24:42.573Z", "summary": "A (vroege)", "creator": { "email": "roexbert@gmail.com", "displayName": "Bert Roex" }, "organizer": { "email": "0o2t4hkduot67fbt64iltfrpeg@group.calendar.google.com", "displayName": "Ter Heide", "self": true }, "start": { "dateTime": "2018-05-03T06:30:00+02:00" }, "end": { "dateTime": "2018-05-03T15:00:00+02:00" }, "iCalUID": "gua9gpc9b8i4kvb9e37stp42d8@google.com", "sequence": 0, "reminders": { "useDefault": true } }]
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
      .then(({ result }) => {
        const events = result.items;
        console.log(events);
        this.setState({ calendarEvents: events });
      })
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
    const manipulateDate = new Date();

    manipulateDate.setDate(1);
    const selectedYear = manipulateDate.getFullYear();

    const selectedMonth = manipulateDate.getMonth();

    const locale = "nl-be";
    const fullMonth = manipulateDate.toLocaleString(locale, { month: "long" });

    manipulateDate.setHours(0);
    manipulateDate.setMinutes(0);
    manipulateDate.setSeconds(0);
    manipulateDate.setMilliseconds(0);
    const firstDayOfMonthWeekDay = manipulateDate.getDay();
    const fromDate = new Date(manipulateDate);

    // Set the start-max parameter to the beginning of next month.
    manipulateDate.setDate(this.daysInMonth(manipulateDate.getMonth(), manipulateDate.getFullYear()));
    manipulateDate.setHours(23);
    manipulateDate.setMinutes(59);
    manipulateDate.setSeconds(59);
    const lastDayOfMonth = manipulateDate.getDate();
    const toDate = new Date(manipulateDate);
    return { from: fromDate, to: toDate, year: selectedYear, month: selectedMonth, fullMonth: fullMonth, firstDayOfMonthWeekDay: firstDayOfMonthWeekDay, lastDayOfMonth: lastDayOfMonth };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Month currentMonth={this.state.monthRange.fullMonth} currentYear={this.state.monthRange.year} />
        </header>
        <p className="App-intro">
        </p>
        {this.state.sign ?
          <button onClick={(e) => this.handleGoogleAuth(e, "logout")}>Uitloggen</button> :
          <button onClick={(e) => this.handleGoogleAuth(e, "login")}>Inloggen</button>}
        <div>
          {this.state.calendarEvents.map((event) =>
            <CalendarItem event={event} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
