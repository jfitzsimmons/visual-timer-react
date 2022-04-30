import React, {Component} from "react";
import "./App.scss";

export class TimerLengthControl extends Component {
  render() {
    return (
      <div className="length-control">
        <div id={this.props.titleID}>{this.props.title}</div>
        <div>
          <input
            id={this.props.minID}
            type="number"
            className="btn-level"
            defaultValue={this.props.length}
            onChange={this.props.onClick}
            onKeyPress={this.props.clickEnter}></input>
          <span></span>
        </div>
      </div>
    );
  }
}
