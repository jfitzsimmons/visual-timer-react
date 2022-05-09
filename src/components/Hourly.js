import { weatherCodesMap } from "../utils/maps";
import { localHour } from "../utils/timing";
import { Temp, Drop } from "../icons/icons";

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

export function Hourly(props) {
  const { day, showMore } = props;
  let _d = Array.from(day);
  _d = _d.sort(function (x, y) {
    var aDate = new Date(x.startTime);
    var bDate = new Date(y.startTime);
    return aDate.getTime() - bDate.getTime();
  });
  if (!showMore) _d = _d.splice(0, 8);
  return (
    <>
      <h4>Hourly:</h4>
      <div className="flex hourly">
        {_d.map((hour, i) => (
          /**destructure insid ehere TeSTJPF!!! */
          <div key={`hour${i}`} className={`hour card ${i > 7 ? "more" : ""}`}>
            <h6>{localHour(hour.startTime)}</h6>
            <div className="hour__weather">
              {weatherCodesMap.get(hour.values.weatherCode.toString())}
            </div>
            <div className="hour__temp row-v-align">
              <Temp />: {hour.values.temperature}&#176;
            </div>
            <div className="hour__prec_prob row-v-align">
              <Drop />: {hour.values.precipitationProbability}%
            </div>
          </div>
        ))}
      </div>
      {day.length > 8 && <MoreHours showMore={showMore} />}
    </>
  );
}
