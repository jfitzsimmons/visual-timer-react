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
      <button id={this.props.minID}
        className="btn-level" value="-"
        onClick={this.props.onClick}>
        <i className="fa fa-arrow-down fa-2x"/>
      </button>
      <div id={this.props.lengthID} className="btn-level">
        {this.props.length}
      </div>
      <button id={this.props.addID}
        className="btn-level" value="+"
        onClick={this.props.onClick}>
        <i className="fa fa-arrow-up fa-2x"/>
      </button>
    </div>
  )
}
};
