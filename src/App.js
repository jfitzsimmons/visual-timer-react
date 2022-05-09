import React, { useState } from "react";
import "./App.scss";
import { Weather } from "./components/Weather";
import Timer from "./components/Timer";

function App() {
  const [lightMode, setLightMode] = useState(false);

  return (
    <div className={`app ${lightMode === true ? "light" : "dark"}`}>
      <div className="mode">
        <span>Dark</span>
        <label className="switch">
          <input
            type="checkbox"
            className="timer_input"
            onClick={() =>
              lightMode === true ? setLightMode(false) : setLightMode(true)
            }
          />
          <span className="slider round"></span>
        </label>
        <span>Light</span>
      </div>
      <Timer />
      <Weather />
    </div>
  );
}

export default App;
