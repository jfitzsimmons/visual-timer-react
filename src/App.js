import React, {
  Component
} from "react";
import "./App.scss";
import {
  TimerLengthControl
} from "./Control.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brkLength: 5,
      seshLength: 10,
      timerState: "stopped",
      timerType: "Session",
      timer: 600,
      intervalID: "",
      alarmColor: {
        color: "#222",
        borderColor: "hsla(13, 98%, 49%, 0.2)"
      },
    };
    this.setBrkLength = this.setBrkLength.bind(this);
    this.setSeshLength = this.setSeshLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.clockify = this.clockify.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.reset = this.reset.bind(this);
  }
  setBrkLength(e) {
    this.lengthControl(
      "brkLength",
      e.currentTarget.value,
      this.state.brkLength,
      "Session"
    );
  }
  setSeshLength(e) {
    this.lengthControl(
      "seshLength",
      e.currentTarget.value,
      this.state.seshLength,
      "Break"
    );
  }
  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === "running") return;
    this.setState({
      [stateToChange]: sign,
      timer: sign * 60
    });
  }
  timerControl() {
    if (this.state.timerState === "stopped") {
    this.beginCountDown();
      this.setState({
        timerState: "running",
        alarmColor: {
          color: "#222",
          borderColor: "hsla(13, 98%, 49%, 1)"
        },
      }) 
    } else {
      this.state.intervalID && clearInterval(this.state.intervalID);
      this.setState({
        timerState: "stopped",
        alarmColor: {
          color: "#222",
          borderColor: "hsla(13, 98%, 49%, .2)",
        },
      })
    };
  }
  accurateInterval() {
    this.decrementTimer();
    this.phaseControl();
  }
  beginCountDown() {
    this.setState({
      intervalID: setInterval(this.accurateInterval.bind(this), 1000),
    });
  }
  decrementTimer() {
    if (this.state.timerType === "Session") {
      this.setState({
        timer: this.state.timer - 1
      });
    } else {
      this.setState({
        timer: this.state.timer + 1
      });
    }
  }
  phaseControl() {
    let timer = this.state.timer;
    if (timer < 0) {
      if (this.state.timerType === "Session") {
        this.state.intervalID && clearInterval(this.state.intervalID);
        this.beginCountDown();
        this.switchTimer(0, "Break");
        this.warning(timer)
      } else {
        this.state.intervalID && clearInterval(this.state.intervalID);
        this.beginCountDown();
        this.switchTimer(this.state.seshLength * 60, "Session")
      };
    }
  }
  warning(_timer) {
    _timer < 61 ?
    this.setState({
      alarmColor: {
        color: "#a50d0d"
      }
    }) :
    this.setState({
      alarmColor: {
        color: "#222"
      }
    });
  }
  buzzer(_timer) {
    if (_timer === 0) {
      // this.audioBeep.play();
    }
  }
  switchTimer(num, str) {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: {
        color: "#222"
      },
    });
  }
  clockify() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }
  onKeyUp(e) {
    if (e.charCode === 13) {
      console.log("onKeyUp inside ENTER");
      this.reset();
      console.log(`1 this.state.timerState: ${this.state.timerState}`);
      this.timerControl();

      console.log(`2 this.state.timerState: ${this.state.timerState}`);
    }
  }
  reset() {
    let currentSeshLength = this.state.seshLength;
    console.log(`currentSeshLength * 60 - RESet: ${currentSeshLength}`);
    this.setState({
      timerState: "stopped",
      timerType: "Session",
      timer: currentSeshLength * 60,
      intervalID: "",
      alarmColor: {
        color: "#222"
      },
    });
    this.state.intervalID && clearInterval(this.state.intervalID);
  }
  render() {
    return ( <div>
      <TimerLengthControl titleID = "session-label"
      minID = "session-decrement"
      addID = "session-increment"
      lengthID = "session-length"
      title = "Minutes"
      onClick = {
        this.setSeshLength
      }
      length = {
        this.state.seshLength
      }
      clickEnter = {
        this.onKeyUp
      }
      /> <div className = "timer"
      style = {
        this.state.alarmColor
      } >
      <div className = "timer-wrapper" >
      <div id = "timer-label" > {
        this.state.timerType
      } </div> <div id = "time-left" > {
        this.clockify()
      } </div> </div > </div> <div className = "timer-control" >
      <button id = "start_stop"
      onClick = {
        this.timerControl
      }
      onKeyPress = {
        this.onKeyUp
      } >
      <i className = "fa fa-play fa-2x" />
      <i className = "fa fa-pause fa-2x" />
      </button> <button id = "reset"
      onClick = {
        this.reset
      } >
      <i className = "fas fa-redo fa-2x" > </i> </button > </div> 
      </div>
    );
  }
}

export default App;