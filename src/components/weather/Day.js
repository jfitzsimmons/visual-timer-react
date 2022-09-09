import React from "react";

import {
  weatherCodesMap,
  weatherCodesDayMap,
  weatherCodesNightMap,
  precipitationTypeMap,
} from "../../utils/maps";
import { localDate, localHour } from "../../utils/timing";
import { Temp, Drop } from "../../icons/icons";
import "./weather.scss";

export function Day(props) {
  const { startTime, values } = props.day;
  return (
    <div id={props.id} className={`day card ${props.cname}`}>
      <h6 className="day__date no-events">
        {localDate(startTime)}{" "}
        {props.cname === "day-current" && localHour(startTime, false, true)}{" "}
      </h6>
      <div className="day__primary no-events">
        <div className="day__weather">
          {weatherCodesMap.get(values.weatherCode.toString())}
        </div>
        {!!values.weatherCodeDay && (
          <div className="day__weather__morning text-2">
            Morning: {weatherCodesDayMap.get(values.weatherCodeDay.toString())}
          </div>
        )}
        {!!values.weatherCodeNight && (
          <div className="day__weather__night text-2">
            Night:{" "}
            {weatherCodesNightMap.get(values.weatherCodeNight.toString())}
          </div>
        )}
        <div className="day__temp row-v-align">
          <Temp />
          <b>{values.temperature}&#176;</b>
        </div>
        {!!values.precipitationType && values.precipitationType !== 0 && (
          <div className="day__precip row-v-align">
            <Drop />
            <div className="bold">
              <span>{values.precipitationProbability}%&nbsp;</span>{" "}
            </div>
            <sub>
              chance of{" "}
              {precipitationTypeMap.get(values.precipitationType.toString())}
            </sub>
          </div>
        )}
      </div>
      <ul className="day__secondary no-events text-2">
        {!!values.precipitationType && values.precipitationType !== 0 && (
          <li className="day__precip">
            <b>
              {precipitationTypeMap.get(values.precipitationType.toString())}:
            </b>{" "}
            {values.precipitationIntensity}in/hr
          </li>
        )}
        <li className="day__humidity">
          {values.humidity}% <b>humidity</b>
        </li>
        <li className="day__cloud_cover">
          <b>Cloud Cover:</b> {values.cloudCover}%
        </li>
        <li className="day__cloud_distance">
          <b>Cloud Base:</b> {values.cloudBase}mi | <b>Ceiling:</b>{" "}
          {values.cloudCeiling}mi
        </li>
        <li className="day__wind">
          <b>Wind:</b> {values.windSpeed}mph (gust up to: {values.windGust}mph){" "}
          {values.windDirection}
        </li>
      </ul>
    </div>
  );
}
