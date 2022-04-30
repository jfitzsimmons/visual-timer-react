import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import { TimerLengthControl } from "./Control.js";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [seshLength, setSeshLength] = useState(120);
  const [timerState, setTimerState] = useState("stopped");
  const [timerType, setTimerType] = useState("Session");
  const [timer, setTimer] = useState(7200);
  const [alarmColor, setAlarmColor] = useState({
    color: "#222",
    borderColor: "hsla(13, 98%, 49%, 0.2)",
  });
  const intervalRef = useRef(null);

  const clear = () => {
    clearInterval(intervalRef.current);
  };

  const handleSeshLength = (e) => {
    setSeshLength(e.currentTarget.value);
    setTimer(e.currentTarget.value * 60);
  };

  const timerControl = () => {
    if (timerState === "stopped") {
      setTimerState("running");
      setAlarmColor({
        color: "#141",
        borderColor: "hsla(120, 98%, 49%, 1)",
      });
    } else {
      intervalRef.current && clear(intervalRef.current);
      setTimerState("stopped");
      setAlarmColor({
        color: "#222",
        borderColor: "hsla(13, 98%, 49%, .2)",
      });
    }
  };

  const accurateInterval = () => {
    decrementTimer();
    phaseControl();
  };

  const decrementTimer = () => {
    timerType === "Session" ? setTimer(timer - 1) : setTimer(timer + 1);
  };

  const phaseControl = () => {
    let _t = timer;
    if (_t <= 0) {
      if (timerType === "Session") {
        intervalRef.current && clear(intervalRef.current);
        switchTimer(1, "Break");
        setAlarmColor({
          color: "#a50d0d",
          borderColor: "#a50d0d",
        });
      } else {
        intervalRef.current && clear(intervalRef.current);
        switchTimer(seshLength * 60, "Session");
      }
    }
  };

  const switchTimer = (num, str) => {
    setTimerType(str);
    setTimer(num);
    setAlarmColor({
      color: "#222",
      borderColor: "#222",
    });
  };

  const clockify = () => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  };

  const onKeyUp = (e) => {
    if (e.charCode === 13) {
      reset();
      timerControl();
    }
  };

  const reset = () => {
    let currentSeshLength = seshLength;
    setTimerState("stopped");
    setTimerType("Session");
    setTimer(currentSeshLength * 60);
    setAlarmColor({
      color: "#222",
      borderColor: "hsla(13, 98%, 49%, .2)",
    });
    intervalRef.current && clear(intervalRef.current);
  };

  useInterval(
    () => {
      accurateInterval();
    },
    timerState === "running" ? 1000 : null
  );

  return (
    <div>
      <TimerLengthControl
        titleID="session-label"
        minID="session-decrement"
        addID="session-increment"
        lengthID="session-length"
        title="Minutes"
        onClick={handleSeshLength}
        length={seshLength}
        clickEnter={onKeyUp}
      />{" "}
      <div className="timer" style={alarmColor}>
        <div className="timer-wrapper">
          <div id="timer-label"> {timerType} </div>{" "}
          <div id="time-left"> {clockify()} </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="timer-control">
        <button id="start_stop" onClick={timerControl} onKeyPress={onKeyUp}>
          <i className="fa fa-play fa-2x" />
          <i className="fa fa-pause fa-2x" />
        </button>{" "}
        <button id="reset" onClick={reset}>
          <i className="fas fa-redo fa-2x"> </i>{" "}
        </button>{" "}
      </div>
    </div>
  );
}

export default App;
