var admin = require("firebase-admin");

const config = require("../keyConfig");
const serviceAccount = config.FIREBASE_KEY;

const fetch = require("node-fetch");
const queryString = require("query-string");
const moment = require("moment");
const getTimelineURL = "https://api.tomorrow.io/v4/timelines";
const apikey = process.env.TOMORROWIO_SECRET;
let location = process.env.TOMORROWIO_LOCATION_ID;
// get sunset and sunrise and moon ?!?!? TESTJPF
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
  "cloudCover",
  "cloudBase",
  "cloudCeiling",
  "weatherCode",
  "humidity",
];
const units = "imperial";
const timesteps = ["current", "1h", "1d"];
const timezone = "America/Chicago";

exports.handler = function (event, context, callback) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    });
  }

  const db = admin.database();
  const dbref = db.ref("data");
  const timelinesRef = dbref.child("timelines");
  const lastUpdatedRef = dbref.child("lastUpdated");

  const now = moment.utc();
  const startTime = moment.utc(now).add(0, "minutes").toISOString();
  const endTime = moment.utc(now).add(4, "days").toISOString();
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
  fetch(getTimelineURL + "?" + getTimelineParameters, {
    method: "GET",
    compress: true,
  })
    .then((result) => result.json())
    .then((json) => {
      lastUpdatedRef.set(json.data.timelines[2].startTime);
      timelinesRef.set(json.data.timelines, (error) => {
        if (error) {
          console.log("Data could not be saved." + error);
        } else {
          admin.app().delete();
        }
      });
      return json.data.timelines;
    })
    .then((timelines) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(timelines),
      });
    })
    .catch((err) => {
      console.error("error: " + err.message);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.message),
      });
    });
};
