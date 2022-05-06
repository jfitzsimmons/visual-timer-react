import React, { useState, useEffect, useCallback } from "react";
import {
  weatherCodesMap,
  weatherCodesDayMap,
  weatherCodesNightMap,
  precipitationTypeMap,
} from "../utils/maps";
import { Temp, Drop } from "../icons/icons";
import "./components.scss";

const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const localDate = (startTime) => {
  let date = new Date(startTime);
  return date.toDateString();
};

const localHour = (startTime) => {
  let date = new Date(startTime);
  let hour = date.getHours();
  let post = hour < 12 ? " AM" : " PM";
  return (date.getHours() % 12 || 12) + post;
};

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
          <Day key={i} day={day} cname="day-forecast" />
        ))}
      </div>
    </>
  );
}

export function Hourly(props) {
  const { day } = props;
  return (
    <>
      <h4>Hourly:</h4>
      <div className="flex hourly">
        {day.map((hour, i) => (
          /**destructure insid ehere TeSTJPF!!! */
          <div key={i} className="hour card">
            <h6>{localHour(hour.startTime)}</h6>
            <div className="hour__weather">
              {weatherCodesMap.get(hour.values.weatherCode.toString())}
            </div>
            <div className="hour__temp">
              <Temp />: {hour.values.temperature}&#176;
              {/** hour.values.temperatureApparent **/}
            </div>
            <div className="hour__prec_prob">
              <Drop />: {hour.values.precipitationProbability}%
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function Day(props) {
  const { startTime, values } = props.day;
  return (
    <div className={`day card ${props.cname}`}>
      <h6 className="day__date">{localDate(startTime)}</h6>
      <div className="day__primary">
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
        <div className="day__temp">
          <Temp />: {values.temperature}&#176; / ta:{" "}
          {/**values.temperatureApparent*/}
        </div>
        {!!values.precipitationType && values.precipitationType !== 0 && (
          <div className="day__precip">
            <Drop />: {values.precipitationProbability}% chance of{" "}
            {precipitationTypeMap.get(values.precipitationType.toString())}:{" "}
            {values.precipitationIntensity}in/hr
          </div>
        )}
        <div className="day__humidity">{values.humidity}% humidity</div>
      </div>
      <div className="day__secondary">
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
  const startAdjustment = 24 - localHour(allHours[0].startTime);
  const first24Arr = localArr.slice(0, 24);
  localArr.splice(0, startAdjustment);
  localArr = chunk(localArr, 24);
  localArr.unshift([...first24Arr]);
  return localArr;
};

export function Weather() {
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState({});
  const [week, setWeek] = useState({});
  const [activeDay, setActiveDay] = useState(0);
  const [activeHour, setActiveHour] = useState(0);

  const handleWeather = useCallback((timelines) => {
    timelines.forEach((timeline) => {
      if (timeline.timestep === "current") setCurrent((c) => timeline);
      if (timeline.timestep === "1d") setWeek((w) => timeline);
      if (timeline.timestep === "1h")
        setHourly((t) => cleanHourly(timeline.intervals));
    });
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch(fbdburl + "/data/timelines.json").then(
        (res) => res.json()
      );
      handleWeather(await response);
    })();
  }, [handleWeather]);

  return (
    current && (
      <div className="weather-container">
        <h1>Currently:</h1>
        <Day day={current.intervals[0]} cname="day-current" />
        <Hourly day={hourly[activeDay]} />
        <Forecast week={week.intervals} />
      </div>
    )
  );
}
