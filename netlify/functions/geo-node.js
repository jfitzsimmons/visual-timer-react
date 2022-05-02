/**
 *
 *   Test JPF
 *
 * You get 500 cals per day.
 * Do theis server side and call netlify function?
 *  Where to store JSON?
 *
 */
/** 
const sdk = require("api")("@climacell-docs/v4#bzqumkyn13ppf");
exports.handler = async function (event, context, callback) {
  sdk.auth(process.env.TOMORROWIO_SECRET);
  sdk["get-timelines"]({
    location: process.env.TOMORROWIO_lOCATION_ID,
    fields:
      "temperature&fields=temperatureApparent&fields=humidity&fields=windSpeed&fields=precipitationProbability&fields=cloudCover&fields=weatherCodeDay&fields=weatherCodeNight",
    units: "metric",
    timesteps: "1h&timesteps=1d",
    "Accept-Encoding": "gzip",
  })
    .then(function (body) {
      callback(null, {
        statusCode: 200,
        body,
      });
    })
    .catch((err) => console.error(err));
};
*/
/** 

const fs = require('fs');
const fileName = './file.json';
const file = require(fileName);

file.key = 'new value';

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file));
  console.log('writing to ' + fileName);
});

*/

const fetch = require("node-fetch");
const queryString = require("query-string");
const moment = require("moment");

// set the Timelines GET endpoint as the target URL
const getTimelineURL = "https://api.tomorrow.io/v4/timelines";

// get your key from app.tomorrow.io/development/keys
const apikey = process.env.TOMORROWIO_SECRET;

// pick the location, as a latlong pair
//TESTJPF LOWERCASE l: !!!!!
//in location
let location = process.env.TOMORROWIO_LOCATION_ID;

// list the fields
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

// choose the unit system, either metric or imperial
const units = "imperial";

// set the timesteps, like "current", "1h" and "1d"
const timesteps = ["current", "1h", "1d"];

// configure the time frame up to 6 hours back and 15 days out
const now = moment.utc();
const startTime = moment.utc(now).add(0, "minutes").toISOString();
const endTime = moment.utc(now).add(1, "days").toISOString();

// specify the timezone, using standard IANA timezone format
const timezone = "America/Chicago";

// request the timelines with all the query string parameters as options
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
 * gettting a RESPONSE!!!!!
 */
exports.handler = async function (event, context, callback) {
  fetch(getTimelineURL + "?" + getTimelineParameters, {
    method: "GET",
    compress: true,
  })
    .then((result) => result.json())
    .then((json) => console.log(json.data))
    .catch((err) => console.error("error: " + err));
};
/*

---- [PREMIUM FEATURE] contact sales@tomorrow.io ----

// set the Timelines POST endpoint as the target URL
const postTimelineURL = 'https://api.tomorrow.io/v4/timelines' + "?apikey=" + apikey;

fields = {
  "precipitationIntensityMax",
  "precipitationTypeMax",
  "windSpeedAverage",
  "temperatureMin",
  "temperatureMax",
  "cloudCoverMax"
}

location = {
     "type":"Polygon",
        "coordinates":
        [[[-73.985043,40.753554],[-73.990724,40.75595],[-73.984726,40.764167],[-73.979057,40.761747],[-73.985043,40.753554]]]
      }

const postTimelineOptions = {method: 'POST', compress: true,
  				headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   location
                   fields,
                   units,
                   timesteps,
                   startTime,
                   endTime,
                   timezone
                 })};

fetch(postTimelineURL, postTimelineOptions)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error: ' + err));

*/
