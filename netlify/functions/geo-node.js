var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  });
}

/**
 *Firebase projects support Google service accounts, which you can use to call Firebase server APIs from your app server or trusted environment. If you're developing code locally or deploying your application on-premises, you can use credentials obtained via this service account to authorize server requests.
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
CHANE READ RULES TO ONLY BE THIS APP
Change write rules to only be admin
 */

// Import Admin SDK

//const { getDatabase } = require("firebase-admin/database");

// Get a database reference to our blog
const db = admin.database();
const dbref = db.ref("data");
const timelinesRef = dbref.child("timelines");

exports.handler = function (event, context, callback) {
  /*
  const pass = (body) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  };
  */
  //  console.log(getTimelineURL + "?" + getTimelineParameters);
  //timelinesRef.set([{ 1: "test" }]);

  fetch(getTimelineURL + "?" + getTimelineParameters, {
    method: "GET",
    compress: true,
  })
    .then((result) => result.json())
    .then((json) => timelinesRef.set(json.data.timelines))
    .catch((err) => console.error("error: " + err.message));
};
