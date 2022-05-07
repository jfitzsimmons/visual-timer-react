export const localHour = (startTime) => {
  let date = new Date(startTime);
  let hour = date.getHours();
  let post = hour < 12 ? " AM" : " PM";
  return (date.getHours() % 12 || 12) + post;
};

export const localDate = (startTime) => {
  let date = new Date(startTime);
  return date.toDateString();
};
