import React, { useState, useEffect, useCallback } from "react";
import { Hourly } from "./Hourly";
import { Day } from "./Day";
import { cleanHourly, checkStaleData } from "../utils/timing";
import { usePrevious } from "../utils/helpers";
import "./components.scss";
import { Refresh, Loading } from "../icons/icons";

export function MoreHours(props) {
  const { showMore } = props;
  return (
    <>
      <button id="show_more" className="show_more">
        {showMore === false ? "More \u2193" : "Less \u2191"}
      </button>
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

  const handleTimelines = useCallback((timelines) => {
    timelines.forEach((timeline) => {
      if (timeline.timestep === "current") setCurrent((c) => timeline);
      if (timeline.timestep === "1d") setWeek((w) => timeline);
      if (timeline.timestep === "1h")
        setHourly((t) => cleanHourly(timeline.intervals));
    });
  }, []);

  const handleStaleData = useCallback(() => {
    getDbLastUpdated()
      .then((date) => checkStaleData(date))
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
    handleStaleData();
    staleData !== null &&
      prevStaleData !== staleData &&
      chooseTimelineSource(staleData);
  }, [chooseTimelineSource, handleStaleData, prevStaleData, staleData]);

  return current ? (
    <div className="weather-container">
      <div className="weather-container_header">
        <button
          className="refresh"
          onClick={() => setRefreshWeather(refreshWeather + 1)}
        >
          <Refresh />
        </button>
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
