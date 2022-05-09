import { chunk } from "./helpers";

export const localHour = (startTime, military) => {
  let date = new Date(startTime);
  let hour = date.getHours();
  let post = hour < 12 ? " AM" : " PM";
  return military
    ? date.getHours() + post
    : (date.getHours() % 12 || 12) + post;
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
