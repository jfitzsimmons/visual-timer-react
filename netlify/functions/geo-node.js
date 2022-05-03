/**
 *
 *   Test JPF
 *
 * You get 500 cals per day.
 *
 */

const fetch = require("node-fetch");
const queryString = require("query-string");
const moment = require("moment");
const getTimelineURL = "https://api.tomorrow.io/v4/timelines";
const apikey = process.env.TOMORROWIO_SECRET;
let location = process.env.TOMORROWIO_LOCATION_ID;
const fields = [
  "precipitationIntensity",
  "precipitationType",
  "precipitationProbability",
  "weatherCodeDay",
  "weatherCodeNight",
  "windSpeed",
  "windGust",
  "windDirection",
  "temperature",
  "temperatureApparent",
  "cloudCover",
  "cloudBase",
  "cloudCeiling",
  "weatherCode",
  "humidity",
];
const units = "imperial";
const timesteps = ["current", "1h", "1d"];
const now = moment.utc();
const startTime = moment.utc(now).add(0, "minutes").toISOString();
const endTime = moment.utc(now).add(4, "days").toISOString();
const timezone = "America/Chicago";

const getTimelineParameters = queryString.stringify(
  {
    apikey,
    location,
    fields,
    units,
    timesteps,
    startTime,
    endTime,
    timezone,
  },
  { arrayFormat: "comma" }
);
/** TESTJPF
 *
 * 
 * 500 calls / per day
25 calls / per hour
3 calls / per second
 */

exports.handler = function (event, context, callback) {
  const pass = (body) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  };
  //  console.log(getTimelineURL + "?" + getTimelineParameters);
  fetch(getTimelineURL + "?" + getTimelineParameters, {
    method: "GET",
    compress: true,
  })
    .then((result) => result.json())
    .then((json) => {
      return pass(json.data);
    })
    .catch((err) => console.error("error: " + err.message));
};
