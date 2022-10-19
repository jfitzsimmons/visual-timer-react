import React, { useState, useLayoutEffect, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { RefreshIcon } from "../../icons/icons";
import "./weather.scss";

export function UpdateMsg(props) {
  const { msg } = props;
  const [isShowingAlert, setShowingAlert] = useState(false);

  const handleMsg = useCallback(() => {
    setShowingAlert(true);
  }, []);

  useLayoutEffect(() => {
    handleMsg();
  }, [handleMsg, msg]);

  return (
    <>
      <CSSTransition
        in={isShowingAlert}
        timeout={400}
        classNames="refresh__msg"
        onEntered={() =>
          setTimeout(function () {
            setShowingAlert(false);
          }, 3000)
        }
      >
        <div
          id="refresh-msg"
          className="msg-format"
          onClick={() => isShowingAlert === true && setShowingAlert(false)}
        >
          {msg}
          <button className="close">X</button>
        </div>
      </CSSTransition>
    </>
  );
}

export function RefreshRow(props) {
  const { upToDateMsg } = props;
  const [isShowingAlert, setShowingAlert] = useState(false);

  function animateButton(event) {
    event.preventDefault();
    isShowingAlert === false && setShowingAlert(true);
  }

  return (
    <div className="weather-container_header">
      {upToDateMsg && upToDateMsg.length > 0 && <UpdateMsg msg={upToDateMsg} />}
      <button
        id="refresh-weather"
        className="refresh"
        aria-label="refresh weather data"
        onClick={animateButton}
      >
        <div
          className={`refresh__animation no-events ${
            isShowingAlert ? "weather-loading" : "weather-loaded"
          }`}
          onTransitionEnd={() =>
            isShowingAlert === true && setShowingAlert(false)
          }
        >
          <RefreshIcon />
        </div>
      </button>
      <h2>Currently:</h2>
    </div>
  );
}
