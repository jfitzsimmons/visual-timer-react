import React, { useState, useEffect, useCallback, useRef } from "react";
import { TimerLengthControl } from "./Control";
import { usePageVisibility, useInterval, usePrevious } from "../utils/helpers";
import { Play, Pause, Reset } from "../icons/icons";
import "./components.scss";

function Timer() {
  const [seshLength, setSeshLength] = useState(120);
  const [cachedTime, setCachedTime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  const [timerState, setTimerState] = useState("loaded");
  const [timerType, setTimerType] = useState("Session");
  const [timer, setTimer] = useState(7200);
  const [alarmColor, setAlarmColor] = useState({
    borderColor: "hsla(13, 98%, 49%, 0.2)",
  });
  const intervalRef = useRef(null);
  const isVisible = usePageVisibility();
  const prevIsVisible = usePrevious(isVisible);

  const timerControl = useCallback(() => {
    if (
      timerState === "stopped" ||
      timerState === "loaded" ||
      (isVisible === true && timerState === "sleep")
    ) {
      setTimerState("running");
      timerType === "Session"
        ? setAlarmColor({
            color: "#0da50d",
            borderColor: "#0da50d",
          })
        : setAlarmColor({
            color: "#a50d0d",
            borderColor: "#a50d0d",
          });
    } else {
      intervalRef.current && clear(intervalRef.current);
      if (timerState !== "loaded") setTimerState("stopped");
      setAlarmColor({
        borderColor: "hsla(13, 98%, 49%, .2)",
      });
    }
  }, [isVisible, timerState, timerType]);

  const getAppWakeTime = useCallback(() => {
    const currentTimeInMilliseconds = Math.floor(new Date().getTime() / 1000);
    setTimer(timer - (currentTimeInMilliseconds - cachedTime));
  }, [cachedTime, timer]);

  const setAppWakeTime = useCallback(() => {
    setTimerState("sleep");
    setCachedTime(Math.floor(new Date().getTime() / 1000));
  }, []);

  useEffect(() => {
    if (
      isVisible === false &&
      prevIsVisible !== isVisible &&
      timerState === "running"
    ) {
      setAppWakeTime();
    }
    if (
      isVisible === true &&
      prevIsVisible !== isVisible &&
      timerState === "sleep"
    ) {
      getAppWakeTime();
      timerControl();
    }
  }, [
    getAppWakeTime,
    isVisible,
    prevIsVisible,
    setAppWakeTime,
    timerControl,
    timerState,
  ]);

  const clear = () => {
    clearInterval(intervalRef.current);
  };

  const handleSeshLength = (e) => {
    setSeshLength(e.currentTarget.value);
    setTimer(e.currentTarget.value * 60);
    setTimerType("Session");
    setAlarmColor({
      color: "inherit",
      borderColor: "hsla(13, 98%, 49%, .2)",
    });
    setTimerState("stopped");
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
        switchTimer(Math.abs(_t) + 1, "Break");
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
    setTimerState("loaded");
    setTimerType("Session");
    setTimer(currentSeshLength * 60);
    setAlarmColor({
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
    <div className="timer_container">
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
        <button
          id="start_stop"
          aria-label="play and pause"
          onClick={timerControl}
          onKeyPress={onKeyUp}
        >
          <Play />
          <Pause />
        </button>{" "}
        <button aria-label="reset timer" id="reset" onClick={reset}>
          <Reset />
        </button>{" "}
      </div>
    </div>
  );
}

export default Timer;
