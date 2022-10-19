import React, { Component } from "react";
import "./components.scss";

export class TimerLengthControl extends Component {
  render() {
    return (
      <div className="length-control">
        <label for={this.props.minID}>{this.props.title}</label>
        <div className="relative">
          <input
            id={this.props.minID}
            type="number"
            className="btn-level minutes_input"
            defaultValue={this.props.length}
            onChange={this.props.onClick}
            onKeyPress={this.props.clickEnter}
          ></input>
          <span className="fancy_span"></span>
        </div>
      </div>
    );
  }
}
