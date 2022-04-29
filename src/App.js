import React, {
  useState, useEffect
} from "react";
import "./App.scss";
import {
  TimerLengthControl
} from "./Control.js";
// change to hooks TESTJPF!!
function App() {
  const seshLength = 10;
  const [timerState, setTimerState] = useState("stopped");
  const [timerType, setTimerType] = useState("Session");
  const [timer, setTimer] = useState(600);
  const [intervalID, setIntervalID] = useState(600);
  const [alarmColor, setAlarmColor] = useState({
    color: "#222",
    borderColor: "hsla(13, 98%, 49%, 0.2)"
  });

  const handleSeshLength = (e) => {
    setTimer(e.currentTarget.value * 60)
    /**
    lengthControl(
      "seshLength",
      e.currentTarget.value,
      seshLength,
      "Break"
    ); */
  }

  useEffect(() => {
    //Runs only on the first render
  }, [timer]);

  const timerControl = () => {
    if (timerState === "stopped") {
      beginCountDown();
      setTimerState("running")
      setAlarmColor({
        color: "#222",
        borderColor: "hsla(13, 98%, 49%, 1)"
      })
    } else {
      intervalID && clearInterval(intervalID);
      setTimerState("stopped")
      setAlarmColor({
        color: "#222",
        borderColor: "hsla(13, 98%, 49%, .2)",
      })
    };
  }
  const accurateInterval = () => {
    decrementTimer();
    phaseControl();
  }
  const beginCountDown = () => {
    //NEED USEREF FOR INTERVAL TEST JPF!!!!
    setIntervalID(setInterval(accurateInterval.bind(), 1000))
  }
  const decrementTimer = () => {
    if (timerType === "Session") {
      setTimer(timer - 1)
    } else {
      setTimer(timer + 1)
    }
  }
  const phaseControl = () => {
    let _t = timer;
    if (_t < 0) {
      if (timerType === "Session") {
        intervalID && clearInterval(intervalID);
        beginCountDown();
        switchTimer(0, "Break");
        warning(_t)
      } else {
        intervalID && clearInterval(intervalID);
        beginCountDown();
        switchTimer(seshLength * 60, "Session")
      };
    }
  }
  const warning = (_timer) => {
    _timer < 61 ?
      setAlarmColor({
        color: "#a50d0d",
        borderColor: "#a50d0d"
      })
      :
      setAlarmColor({
        color: "#222",
        borderColor: "#222"
      })
  }
  const switchTimer = (num, str) => {
    setTimer(num);
    setTimerType(str);
    setAlarmColor({
      color: "#222",
      borderColor: "#222"
    })
  }
  const clockify = () => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }
  const onKeyUp = (e) => {
    if (e.charCode === 13) {
      console.log("onKeyUp inside ENTER");
      reset();
      console.log(`1 timerState: ${timerState}`);
      timerControl();

      console.log(`2 timerState: ${timerState}`);
    }
  }
  const reset = () => {
    let currentSeshLength = seshLength;
    console.log(`currentSeshLength * 60 - RESet: ${currentSeshLength}`);
    setTimerState("stopped");
    setTimerType("Session")
    setTimer(currentSeshLength * 60)
    setIntervalID(-1)
    setAlarmColor({
      color: "#222",
      borderColor: "#222"
    })
    intervalID && clearInterval(intervalID);
  }

  return (<div>
    <TimerLengthControl titleID="session-label"
      minID="session-decrement"
      addID="session-increment"
      lengthID="session-length"
      title="Minutes"
      onClick={
        handleSeshLength
      }
      length={
        seshLength
      }
      clickEnter={
        onKeyUp
      }
    /> <div className="timer"
      style={
        alarmColor
      } >
      <div className="timer-wrapper" >
        <div id="timer-label" > {
          timerType
        } </div> <div id="time-left" > {
          clockify()
        } </div> </div > </div> <div className="timer-control" >
      <button id="start_stop"
        onClick={
          timerControl
        }
        onKeyPress={
          onKeyUp
        } >
        <i className="fa fa-play fa-2x" />
        <i className="fa fa-pause fa-2x" />
      </button> <button id="reset"
        onClick={
          reset
        } >
        <i className="fas fa-redo fa-2x" > </i> </button > </div>
  </div>
  );
}


export default App;