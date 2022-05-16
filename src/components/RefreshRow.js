import React, { useState, useEffect, useCallback } from "react";
import { RefreshIcon } from "../icons/icons";
import "./components.scss";

export function UpdateMsg(props) {
  const { msg } = props;
  const [isShowingAlert, setShowingAlert] = useState(false);
  //TEST JPF add clsing icon
  const handleMsg = useCallback(() => {
    setShowingAlert(true);
  }, []);

  useEffect(() => {
    handleMsg();
  }, [handleMsg, msg]);

  return (
    <>
      <div
        id="refresh-msg"
        className={`refresh__msg ${
          isShowingAlert ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() =>
          isShowingAlert === true && setShowingAlert(false)
        }
      >
        {msg}
      </div>
    </>
  );
}

export function RefreshRow(props) {
  const { upToDateMsg } = props;
  const [isShowingAlert, setShowingAlert] = useState(false);

  function animateButton(event) {
    isShowingAlert === false && setShowingAlert(true);
  }

  return (
    <div className="weather-container_header">
      <button id="refresh-weather" className="refresh" onClick={animateButton}>
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
      {upToDateMsg && upToDateMsg.length > 0 && <UpdateMsg msg={upToDateMsg} />}
      <h2>Currently:</h2>
    </div>
  );
}
