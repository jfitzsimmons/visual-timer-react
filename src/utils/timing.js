import { chunk } from "./helpers";

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export const localHour = (startTime, military, minutes) => {
  let date = new Date(startTime);
  let hour = date.getHours();
  let post = hour < 12 ? " AM" : " PM";
  let time = military && military === true ? hour : hour % 12 || 12;
  if (minutes && minutes === true) time += ":" + addZero(date.getMinutes());
  return time + post;
};

export const localDate = (startTime) => {
  let date = new Date(startTime);
  return date.toDateString();
};

export const cleanHourly = (allHours) => {
  let localArr = allHours;
  const startAdjustment = 24 - parseInt(localHour(allHours[0].startTime, true));
  const first24Arr = localArr.slice(0, 24);

  localArr.splice(0, startAdjustment);
  localArr = chunk(localArr, 24);
  localArr.unshift([...first24Arr]);
  return localArr;
};

export const checkStaleData = (date) => {
  const dateNow = new Date();
  const dateThen = new Date(date);
  return dateNow.getTime() - dateThen.getTime() > 60 * 20 * 1000;
};
