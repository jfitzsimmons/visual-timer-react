import React, { useState, useEffect, useCallback } from "react";
import { Hourly, MoreHours } from "./Hourly";
import { Day } from "./Day";
import { RefreshRow } from "./RefreshRow";
import { cleanHourly, checkStaleData, localHour } from "../../utils/timing";
import { usePrevious, debounce } from "../../utils/helpers";
import "./weather.scss";
import { LoadingIcon } from "../../icons/icons";

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

const getDbLastUpdated = async (userToken) => {
  const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;
  const response = await fetch(
    fbdburl + "/data/lastUpdated.json?auth=" + userToken
  ).then((res) => res.json());
  return response;
};

const getWeatherData = async (userToken) => {
  const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;
  const response = await fetch(
    fbdburl + "/data/timelines.json?auth=" + userToken
  ).then((res) => res.json());
  return response;
};

export function Weather(props) {
  const { userToken } = props;
  const [current, setCurrent] = useState(null);
  const [staleData, setStaleData] = useState(null);
  const prevStaleData = usePrevious(staleData);
  const [hourly, setHourly] = useState([]);
  const [week, setWeek] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const [upToDateMsg, setUpToDateMsg] = useState("");

  function handleWeatherClickEvents(event) {
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
      case "refresh-weather":
        debounceHandleStaleData();
        break;
      default:
        console.warn("Target has no associated function.");
    }
  }

  const showUpdatedMessage = useCallback(
    (msg) => {
      if (current) {
        setUpToDateMsg(
          `${staleData === true ? "Updated" : `Current as of`}: ${localHour(
            current.intervals[0].startTime,
            false,
            true
          )} [${Math.random().toString(36).slice(2, 7)}]`
        );
      }
    },
    [current, staleData]
  );

  const handleTimelines = useCallback((timelines) => {
    timelines.forEach((timeline) => {
      if (timeline.timestep === "current") setCurrent((c) => timeline);
      if (timeline.timestep === "1d") setWeek((w) => timeline);
      if (timeline.timestep === "1h")
        setHourly((t) => cleanHourly(timeline.intervals));
    });
  }, []);

  const chooseTimelineSource = useCallback(
    (stale) => {
      const data =
        stale && stale === true ? setWeatherData() : getWeatherData(userToken);
      data.then((d) => handleTimelines(d));
    },
    [handleTimelines, userToken]
  );

  const handleStaleData = useCallback(() => {
    getDbLastUpdated(userToken)
      .then((date) => {
        return checkStaleData(date);
      })
      .then((stale) =>
        stale !== staleData
          ? setStaleData(stale)
          : stale === true
          ? chooseTimelineSource(stale)
          : showUpdatedMessage()
      );
  }, [chooseTimelineSource, showUpdatedMessage, staleData, userToken]);

  const debounceHandleStaleData = debounce(handleStaleData, 500);

  useEffect(() => {
    if (staleData !== null) {
      prevStaleData !== staleData
        ? chooseTimelineSource(staleData)
        : showUpdatedMessage();
    } else {
      handleStaleData();
    }
  }, [
    chooseTimelineSource,
    handleStaleData,
    prevStaleData,
    staleData,
    showUpdatedMessage,
  ]);

  return current ? (
    <div className="weather-container">
      <div onClick={handleWeatherClickEvents}>
        <RefreshRow upToDateMsg={upToDateMsg} />
      </div>
      <Day day={current.intervals[0]} cname="day-current" />
      <Hourly
        day={hourly[activeDay]}
        showMore={showMore}
        activeDay={activeDay}
      />
      <div onClick={handleWeatherClickEvents}>
        {hourly[activeDay].length > 8 && <MoreHours showMore={showMore} />}
        <Forecast week={week.intervals} active={activeDay} />
      </div>
    </div>
  ) : (
    <div className="loading">
      <div className="loading__icon">
        <LoadingIcon />
      </div>
      <div className="loading__text">loading...</div>
    </div>
  );
}
