import React, { useState, useEffect, useCallback } from "react";
// import { fireStorage } from "./config/firebase-config";
// import { ref, getDownloadURL } from "firebase/storage";

const fbdburl = process.env.REACT_APP_FIREBASE_DATABASE_URL;

const localDate = (startTime) => {
  let date = new Date(startTime);
  return date.toDateString();
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
          <Day key={i} day={day} />
        ))}
      </div>
    </>
  );
}

export function Day(props) {
  const { startTime, values } = props.day;
  return (
    <div>
      <h5>{localDate(startTime)}</h5>
      <p>cloudBase: {values.cloudBase}mi</p>
      <p>cloudCeiling: {values.cloudCeiling}mi</p>
      <p>cloudCover: {values.cloudCover}%</p>
      <p>humidity: {values.humidity}%</p>
      <p>
        {values.precipitationProbability}% chance of {values.precipitationType}:{" "}
        {values.precipitationIntensity}in/hr
      </p>
      <p>
        temperature: {values.temperature}&#176; / ta:{" "}
        {values.temperatureApparent}&#176;
      </p>
      <p>weatherCode: {values.weatherCode}</p>
      <p>weatherCodeDay: {values.weatherCodeDay}</p>
      <p>weatherCodeNight: {values.weatherCodeNight}</p>
      <p>
        wind: {values.windSpeed}mph (gust up to: {values.windGust}mph){" "}
        {values.windDirection}
      </p>
    </div>
  );
}

export function Weather() {
  const [current, setCurrent] = useState(null);
  //onst [today, setToday] = useState({});
  const [week, setWeek] = useState({});

  const handleWeather = useCallback((timelines) => {
    timelines.forEach((timeline) => {
      if (timeline.timestep === "current") setCurrent((c) => timeline);
      //if (timeline.timestep === "1h") setToday((t) => timeline);
      if (timeline.timestep === "1d") setWeek((w) => timeline);
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
      const response = await fetch(fbdburl + "/timelines.json").then((res) =>
        res.json()
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
        <Day day={current.intervals[0]} />
        {/**<Today hours={today.intervals} />*/}
        <Forecast week={week.intervals} />
      </div>
    )
  );
}
