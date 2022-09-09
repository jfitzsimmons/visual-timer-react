import React, { useState } from "react";
import { weatherCodesMap, precipitationTypeMap } from "../../utils/maps";
import { localHour } from "../../utils/timing";
import { Temp, Drop } from "../../icons/icons";

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

export function MoreData(props) {
  const { secondaryData } = props;
  return (
    <ul className="day__secondary no-events text-2">
      {!!secondaryData.precipitationType &&
        secondaryData.precipitationType !== 0 && (
          <li className="day__precip">
            <b>
              {precipitationTypeMap.get(
                secondaryData.precipitationType.toString()
              )}
              :
            </b>{" "}
            {secondaryData.precipitationIntensity}in/hr
          </li>
        )}
      <li className="day__humidity">
        {secondaryData.humidity}% <b>humidity</b>
      </li>
      <li className="day__cloud_cover">
        <b>Cloud Cover:</b> {secondaryData.cloudCover}%
      </li>
      <li className="day__cloud_distance">
        <b>Cloud Base:</b> {secondaryData.cloudBase}mi | <b>Ceiling:</b>{" "}
        {secondaryData.cloudCeiling}mi
      </li>
      <li className="day__wind">
        <b>Wind:</b> {secondaryData.windSpeed}mph (gust up to:{" "}
        {secondaryData.windGust}mph) {secondaryData.windDirection}
      </li>
    </ul>
  );
}

export function Hourly(props) {
  const [activeHour, setActiveHour] = useState(-1);
  const [showData, setShowData] = useState(false);
  const { day, showMore, activeDay } = props;
  let _d = Array.from(day);
  _d = _d.sort(function (x, y) {
    var aDate = new Date(x.startTime);
    var bDate = new Date(y.startTime);
    return aDate.getTime() - bDate.getTime();
  });
  if (!showMore) _d = _d.splice(0, 8);

  function handleHourlyClickEvents(event) {
    event.preventDefault();
    const target = event.target;
    const targetId = target.id;
    const parsedHour = parseInt(targetId.match("(?<=_)[a-zA-Z0-9]+"));
    switch (targetId) {
      case "hour_0":
      case "hour_1":
      case "hour_2":
      case "hour_3":
      case "hour_4":
      case "hour_5":
      case "hour_6":
      case "hour_7":
      case "hour_8":
      case "hour_9":
      case "hour_10":
      case "hour_11":
      case "hour_12":
      case "hour_13":
      case "hour_14":
      case "hour_15":
      case "hour_16":
      case "hour_17":
      case "hour_18":
      case "hour_19":
      case "hour_20":
      case "hour_21":
      case "hour_22":
      case "hour_23":
        handleActiveAndMoreData(parsedHour);
        break;
      case "show_data":
        showData === true ? setShowData(false) : setShowData(true);
        break;
      default:
        console.warn("Target has no associated function.");
    }
  }

  function handleActiveAndMoreData(hour) {
    activeHour === hour
      ? showData === true
        ? setShowData(false)
        : setShowData(true)
      : setShowData(true);
    setActiveHour(hour);
  }

  return (
    <>
      <h4>
        Hourly:{" "}
        {activeDay === 0
          ? "Today"
          : activeDay > 1
          ? `${activeDay} days from now`
          : "Tomorrow"}
      </h4>
      <div onClick={handleHourlyClickEvents}>
        <div className="flex hourly">
          {_d.map((hour, i) => (
            <div
              key={`hour${i}`}
              id={`hour_${i}`}
              className={`hour card ${
                activeHour === i && showData === true ? "active" : ""
              }`}
            >
              <h6 className="no-events">{localHour(hour.startTime)}</h6>
              <div className="hour__weather no-events">
                {weatherCodesMap.get(hour.values.weatherCode.toString())}
              </div>
              <div className="hour__temp row-v-align no-events">
                <Temp />: {hour.values.temperature}&#176;
              </div>
              <div className="hour__prec_prob row-v-align no-events">
                <Drop />: {hour.values.precipitationProbability}%
              </div>
              {activeHour === i && showData === true && (
                <MoreData secondaryData={hour.values} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
