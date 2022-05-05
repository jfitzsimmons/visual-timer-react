import React, { useState, useEffect, useCallback } from "react";
import {
  weatherCodesMap,
  weatherCodesDayMap,
  weatherCodesNightMap,
  precipitationTypeMap,
} from "../utils/maps";
import "./components.scss";

// import { fireStorage } from "./config/firebase-config";
// import { ref, getDownloadURL } from "firebase/storage";

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
  return date.getHours();
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
      <h5>Later:</h5>
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
          /**destructure insid ehere TSTJPF!!! */
          <div key={i} className="hour">
            <h6>{localHour(hour.startTime)}</h6>
            <div className="hour__weather">
              {weatherCodesMap.get(hour.values.weatherCode.toString())}
            </div>
            <div className="hour__temp">
              Temp: {hour.values.temperature}&#176; / ta:{" "}
              {hour.values.temperatureApparent}
              &#176;
            </div>
            <div className="hour__prec_prob">
              rain chance: {hour.values.precipitationProbability}%
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
    <div className={`day ${props.cname}`}>
      <h5 className="day__date">{localDate(startTime)}</h5>
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
          Night: {weatherCodesNightMap.get(values.weatherCodeNight.toString())}
        </div>
      )}
      <div className="day__temp">
        Temp: {values.temperature}&#176; / ta: {values.temperatureApparent}
        &#176;
      </div>
      <div className="day__humidity">humidity: {values.humidity}%</div>
      {!!values.precipitationType && values.precipitationType !== 0 && (
        <div className="day__precip">
          {values.precipitationProbability}% chance of{" "}
          {precipitationTypeMap.get(values.precipitationType.toString())}:{" "}
          {values.precipitationIntensity}in/hr
        </div>
      )}
      <div className="day__cloud_cover">Cloud Cover: {values.cloudCover}%</div>
      <div className="day__cloud_distance">
        Cloud Base: {values.cloudBase}mi | Ceiling: {values.cloudCeiling}mi
      </div>

      <div className="day__wind">
        wind: {values.windSpeed}mph (gust up to: {values.windGust}mph){" "}
        {values.windDirection}
      </div>
    </div>
  );
}

export function Weather() {
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState({});
  const [week, setWeek] = useState({});

  const handleWeather = useCallback((timelines) => {
    timelines.forEach((timeline) => {
      if (timeline.timestep === "current") setCurrent((c) => timeline);
      if (timeline.timestep === "1d") setWeek((w) => timeline);
      if (timeline.timestep === "1h")
        setHourly((t) => chunk(timeline.intervals, 24));
    });
  }, []);

  useEffect(() => {
    (async () => {
      /** 
      let weathJsonURL = await getDownloadURL(
        ref(fireStorage, "weatherdata.json")
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .catch(function (error) {
          console.log("error encountered");
          console.error(error.message);
        });
        */
      console.log(fbdburl);
      const response = await fetch(fbdburl + "/data/timelines.json").then(
        (res) => res.json()
      );
      handleWeather(await response);
    })();

    // const response = fetch(weathJsonURL).then((response) => response.json());
    // console.log(JSON.stringify(response));

    /** 
     * TEST JPF 
     * READY to GO
     * commented out to save requests!!!!
    console.log("mounted");
    (async () => {
      const response = await fetch("/.netlify/functions/geo-node").then(
        (response) => response.json()
      );
      console.log(JSON.stringify(response));
    })();
*/
  }, [handleWeather]);

  /**
   *  forEach timeline,
   *  if timestep = "1d"
   *  component for current, day, week?
   */
  return (
    current && (
      <div className="weather-container">
        <h1>Currently:</h1>
        <Day day={current.intervals[0]} cname="day-current" />
        <Hourly day={hourly[0]} />
        {/**<Today hours={today.intervals} />*/}
        <Forecast week={week.intervals} />
      </div>
    )
  );
}
