import React, { useState, useEffect, useCallback } from "react";
import { Hourly } from "./Hourly";
import {
  weatherCodesMap,
  weatherCodesDayMap,
  weatherCodesNightMap,
  precipitationTypeMap,
} from "../utils/maps";
import { localHour, localDate } from "../utils/timing";
import { Temp, Drop } from "../icons/icons";
import "./components.scss";

const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export function Current(props) {
  const { date } = props;
  return (
    <div>
      <h4>Currently:</h4>
      {date && localDate(date)}
    </div>
  );
}
export function Today(props) {
  const { hours } = props;
  return (
    <div>
      <h6>Later:</h6>
      {hours.map((h) => h.startTime && localDate(h.startTime))}
    </div>
  );
}

export function Forecast(props) {
  const { week } = props;
  return (
    <>
      <h4>Forecast:</h4>
      <div className="forecast">
        {week.map((day, i) => (
          <Day id={`day_${i}`} key={i} day={day} cname="day-forecast" />
        ))}
      </div>
    </>
  );
}

export function Day(props) {
  const { startTime, values } = props.day;
  return (
    <div id={props.id} className={`day card ${props.cname}`}>
      <h6 className="day__date no-events">{localDate(startTime)}</h6>
      <div className="day__primary no-events">
        <div className="day__weather">
          {weatherCodesMap.get(values.weatherCode.toString())}
        </div>
        {!!values.weatherCodeDay && (
          <div className="day__weather__morning">
            Morning: {weatherCodesDayMap.get(values.weatherCodeDay.toString())}
          </div>
        )}
        {!!values.weatherCodeNight && (
          <div className="day__weather__night">
            Night:{" "}
            {weatherCodesNightMap.get(values.weatherCodeNight.toString())}
          </div>
        )}
        <div className="day__temp row-v-align">
          <Temp />: {values.temperature}&#176; / ta:{" "}
          {/**values.temperatureApparent*/}
        </div>
        {!!values.precipitationType && values.precipitationType !== 0 && (
          <div className="day__precip row-v-align">
            <Drop />: {values.precipitationProbability}% chance of{" "}
            {precipitationTypeMap.get(values.precipitationType.toString())}:{" "}
            {values.precipitationIntensity}in/hr
          </div>
        )}
      </div>
      <div className="day__secondary no-events">
        <div className="day__humidity">{values.humidity}% humidity</div>
        <div className="day__cloud_cover">
          Cloud Cover: {values.cloudCover}%
        </div>
        <div className="day__cloud_distance">
          Cloud Base: {values.cloudBase}mi | Ceiling: {values.cloudCeiling}mi
        </div>
        <div className="day__wind">
          Wind: {values.windSpeed}mph (gust up to: {values.windGust}mph){" "}
          {values.windDirection}
        </div>
      </div>
    </div>
  );
}

const cleanHourly = (allHours) => {
  let localArr = allHours;
  const startAdjustment = 24 - parseInt(localHour(allHours[0].startTime));
  const first24Arr = localArr.slice(0, 24);
  localArr.splice(0, startAdjustment);
  localArr = chunk(localArr, 24);
  localArr.unshift([...first24Arr]);
  return localArr;
};
/** 
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
*/
export function Weather() {
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState({});
  const [week, setWeek] = useState({});
  const [activeDay, setActiveDay] = useState(0);
  const [showMore, setShowMore] = useState(false);

  //const [activeHour, setActiveHour] = useState(0);
  //const prevCurrent = usePrevious(current);

  const handleWeather = useCallback((timelines) => {
    timelines.forEach((timeline) => {
      if (timeline.timestep === "current") setCurrent((c) => timeline);
      if (timeline.timestep === "1d") setWeek((w) => timeline);
      if (timeline.timestep === "1h")
        setHourly((t) => cleanHourly(timeline.intervals));
    });
  }, []);

  function handleAllClickEvents(event) {
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
        console.error("Target has no associated function.");
    }
  }

  const getTimelines = useCallback(async () => {
    (async () => {
      const response = await fetch(fbdburl + "/data/timelines.json").then(
        (res) => res.json()
      );
      handleWeather(await response);
    })();
  }, [handleWeather]);

  useEffect(() => {
    getTimelines();
  }, [getTimelines]);

  useEffect(() => {
    if (current && current.startTime) {
      const dateNow = new Date();
      let dateThen = new Date(current.startTime);
      var isMoreThan20 =
        dateNow.getTime() - dateThen.getTime() > 60 * 20 * 1000;

      if (isMoreThan20)
        (async function () {
          const response = fetch("/.netlify/functions/geo-node");
          const result = await response;
          try {
            result.statusCode === 200
              ? getTimelines()
              : console.log("ERROR TESTJPF");
          } catch {
            console.log("!!!ERROR2 TESTJPF");
          }
        })();
    }
  }, [current, getTimelines]);

  return (
    current && (
      <div className="weather-container">
        <h1>Currently:</h1>
        <Day day={current.intervals[0]} cname="day-current" />
        <div onClick={handleAllClickEvents}>
          <Hourly day={hourly[activeDay]} showMore={showMore} />
          <Forecast week={week.intervals} />
        </div>
      </div>
    )
  );
}
