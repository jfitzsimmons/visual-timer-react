/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.scss';

export class TimerLengthControl extends Component {
render() {
  return (
    <div className="length-control">
      <div id={this.props.titleID}>
        {this.props.title}
      </div>
      <input id={this.props.minID}
        className="btn-level" defaultValue={this.props.length}
        onChange={this.props.onClick}
        >
        
      </input>
      <div id={this.props.lengthID} className="btn-level">
        {this.props.length}
      </div>
      <button id={this.props.addID}
        className="btn-level" value="+"
        >
        <i className="fa fa-arrow-up fa-2x"/>
      </button>
    </div>
  )
}
};
