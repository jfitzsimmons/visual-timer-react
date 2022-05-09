import React from "react";

import {
  weatherCodesMap,
  weatherCodesDayMap,
  weatherCodesNightMap,
  precipitationTypeMap,
} from "../utils/maps";
import { localDate } from "../utils/timing";
import { Temp, Drop } from "../icons/icons";
import "./components.scss";

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
