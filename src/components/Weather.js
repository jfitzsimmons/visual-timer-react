import React, { useState, useEffect, useCallback } from "react";
import { Hourly, MoreHours } from "./Hourly";
import { Day } from "./Day";
import { cleanHourly, checkStaleData, localHour } from "../utils/timing";
import { usePrevious } from "../utils/helpers";
import "./components.scss";
import { Refresh, Loading } from "../icons/icons";

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

export function Forecast(props) {
  const { week } = props;
  const { active } = props;
  return (
    <>
      <h4>Forecast:</h4>
      <div className="forecast">
        {week.map((day, i) => (
          <Day
            id={`day_${i}`}
            key={`day${i}`}
            day={day}
            cname={`day-forecast ${i === active ? "active" : ""}`}
          />
        ))}
      </div>
    </>
  );
}

const setWeatherData = async () => {
  const response = fetch("/.netlify/functions/set-weather");
  const result = await response;
  try {
    return result.json();
  } catch (err) {
    console.error(err);
  }
};

const getDbLastUpdated = async () => {
  const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;
  const response = await fetch(fbdburl + "/data/lastUpdated.json").then((res) =>
    res.json()
  );
  return response;
};

const getWeatherData = async () => {
  const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;
  const response = await fetch(fbdburl + "/data/timelines.json").then((res) =>
    res.json()
  );
  return response;
};

export function Weather() {
  const [current, setCurrent] = useState(null);
  const [staleData, setStaleData] = useState(null);
  const prevStaleData = usePrevious(staleData);
  const [hourly, setHourly] = useState([]);
  const [week, setWeek] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [refreshWeather, setRefreshWeather] = useState(0);
  const prevRefreshWeather = usePrevious(refreshWeather);
  const [upToDateMsg, setUpToDateMsg] = useState("");

  function handleForecastClickEvents(event) {
    event.preventDefault();
    var target = event.target;
    var targetId = target.id;

    switch (targetId) {
      case "day_0":
      case "day_1":
      case "day_2":
      case "day_3":
      case "day_4":
        setActiveDay(parseInt(targetId.at(-1)));
        break;
      case "show_more":
        showMore === true ? setShowMore(false) : setShowMore(true);
        break;
      default:
        console.warn("Target has no associated function.");
    }
  }

  const showUpdatedMessage = useCallback(
    (msg) => {
      setUpToDateMsg(msg);
    },
    [setUpToDateMsg]
  );

  const handleTimelines = useCallback(
    (timelines) => {
      timelines.forEach((timeline) => {
        if (timeline.timestep === "current") setCurrent((c) => timeline);
        if (timeline.timestep === "1d") setWeek((w) => timeline);
        if (timeline.timestep === "1h")
          setHourly((t) => cleanHourly(timeline.intervals));
      });
      showUpdatedMessage(
        `Updated: ${localHour(timelines[2].startTime, false, true)}`
      );
    },
    [showUpdatedMessage]
  );

  const handleStaleData = useCallback(() => {
    getDbLastUpdated()
      .then((date) => {
        return checkStaleData(date);
      })
      .then((stale) => setStaleData(stale));
  }, []);

  const chooseTimelineSource = useCallback(
    (stale) => {
      const data =
        stale && stale === true ? setWeatherData() : getWeatherData();
      data.then((d) => handleTimelines(d));
    },
    [handleTimelines]
  );

  useEffect(() => {
    if (staleData !== null) {
      prevStaleData !== staleData || staleData === true
        ? chooseTimelineSource(staleData)
        : prevRefreshWeather !== refreshWeather &&
          showUpdatedMessage(`Current${refreshWeather % 2 === 0 ? "!" : "."}`);
    } else {
      handleStaleData();
    }
    prevRefreshWeather !== refreshWeather &&
      refreshWeather > 0 &&
      handleStaleData();
  }, [
    chooseTimelineSource,
    handleStaleData,
    prevStaleData,
    staleData,
    showUpdatedMessage,
    refreshWeather,
    prevRefreshWeather,
  ]);

  return current ? (
    <div className="weather-container">
      <div className="weather-container_header">
        <button
          className="refresh"
          onClick={() => setRefreshWeather(refreshWeather + 1)}
        >
          <Refresh />
        </button>
        {upToDateMsg && upToDateMsg.length > 0 && (
          <UpdateMsg msg={upToDateMsg} />
        )}
        <h2>Currently:</h2>
      </div>
      <Day day={current.intervals[0]} cname="day-current" />
      <Hourly
        day={hourly[activeDay]}
        showMore={showMore}
        activeDay={activeDay}
      />
      <div onClick={handleForecastClickEvents}>
        {hourly[activeDay].length > 8 && <MoreHours showMore={showMore} />}
        <Forecast week={week.intervals} active={activeDay} />
      </div>
    </div>
  ) : (
    <div className="loading">
      <div className="loading__icon">
        <Loading />
      </div>
      <div className="loading__text">loading...</div>
    </div>
  );
}
