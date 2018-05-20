import React, { Component } from 'react';

class CalenderItem extends Component {
    
    day() {
        if(this.props.start) {
            var dayDate = new Date(this.props.start);
            return dayDate.getDay();
        }
        return "N/A";
    }

    render() {
        return (
            <div>
                <h3>{this.day} dienst: {this.props.event.summary} </h3>
                <span>start: {this.props.event.start ? this.props.event.start.dateTime : 'N/A'} einde: {this.props.event.end ? this.props.event.end.dateTime : 'N/A'}</span>
            </div>
        );
    }
}

export default CalenderItem;