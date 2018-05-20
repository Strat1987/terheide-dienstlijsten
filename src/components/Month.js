import React, { Component } from 'react';

class Month extends Component {
    
    render() {
        return (
            <h1 className="App-title">Terheide Dienstlijst - {this.props.currentMonth} {this.props.currentYear}</h1>
        );
    }
}

export default Month;