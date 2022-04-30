import React, {useState, useEffect, useRef} from 'react';
import './App.scss';
import {TimerLengthControl} from './Control.js';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
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
  const seshLength = 10;
  const [timerState, setTimerState] = useState('stopped');
  const [timerType, setTimerType] = useState('Session');
  const [timer, setTimer] = useState(600);
  const [alarmColor, setAlarmColor] = useState({
    color: '#222',
    borderColor: 'hsla(13, 98%, 49%, 0.2)',
  });
  const intervalRef = useRef(null);

  const clear = () => {
    console.log('CLEAR');
    clearInterval(intervalRef.current);
  };

  const handleSeshLength = e => {
    console.log('handleSeshLength');
    setTimer(e.currentTarget.value * 60);
  };

  const timerControl = () => {
    console.log('timerControl');
    if (timerState === 'stopped') {
      setTimerState('running');
      setAlarmColor({
        color: '#141',
        borderColor: 'hsla(120, 98%, 49%, 1)',
      });
    } else {
      intervalRef.current && clear(intervalRef.current);
      setTimerState('stopped');
      setAlarmColor({
        color: '#222',
        borderColor: 'hsla(13, 98%, 49%, .2)',
      });
    }
  };
  const accurateInterval = () => {
    console.log('accurateInterval');
    decrementTimer();
    phaseControl();
  };

  const decrementTimer = () => {
    if (timerType === 'Session') {
      console.log(`decrementTimer TIMER: ${timer}`);
      setTimer(timer - 1);
    } else {
      console.log(`increment TIMERTYPR: ${timerType}`);
      setTimer(timer + 1);
    }
  };
  const phaseControl = () => {
    let _t = timer;
    if (_t <= 0) {
      console.log(`TEST phaseControl`);
      if (timerType === 'Session') {
        intervalRef.current && clear(intervalRef.current);
        switchTimer(0, 'Break');
        warning(_t);
      } else {
        intervalRef.current && clear(intervalRef.current);
        switchTimer(seshLength * 60, 'Session');
      }
    }
  };
  const warning = _timer => {
    _timer < 61
      ? setAlarmColor({
          color: '#a50d0d',
          borderColor: '#a50d0d',
        })
      : setAlarmColor({
          color: '#222',
          borderColor: '#222',
        });
  };
  const switchTimer = (num, str) => {
    setTimer(num);
    setTimerType(str);
    setAlarmColor({
      color: '#222',
      borderColor: '#222',
    });
  };
  const clockify = () => {
    console.log(`clockify TIMER: ${timer}`);
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  };
  const onKeyUp = e => {
    if (e.charCode === 13) {
      console.log('onKeyUp inside ENTER');
      reset();
      console.log(`1 timerState: ${timerState}`);
      timerControl();

      console.log(`2 timerState: ${timerState}`);
    }
  };
  const reset = () => {
    let currentSeshLength = seshLength;
    console.log(`currentSeshLength * 60 - RESet: ${currentSeshLength}`);
    setTimerState('stopped');
    setTimerType('Session');
    setTimer(currentSeshLength * 60);
    setAlarmColor({
      color: '#222',
      borderColor: '#222',
    });
    intervalRef.current && clear(intervalRef.current);
  };
  useInterval(
    () => {
      accurateInterval();
    },
    timerState === 'running' ? 1000 : null,
    // passing null stops the interval
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
      />{' '}
      <div className="timer" style={alarmColor}>
        <div className="timer-wrapper">
          <div id="timer-label"> {timerType} </div>{' '}
          <div id="time-left"> {clockify()} </div>{' '}
        </div>{' '}
      </div>{' '}
      <div className="timer-control">
        <button id="start_stop" onClick={timerControl} onKeyPress={onKeyUp}>
          <i className="fa fa-play fa-2x" />
          <i className="fa fa-pause fa-2x" />
        </button>{' '}
        <button id="reset" onClick={reset}>
          <i className="fas fa-redo fa-2x"> </i>{' '}
        </button>{' '}
      </div>
    </div>
  );
}

export default App;
