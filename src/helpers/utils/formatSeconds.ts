export const formatSeconds = (s: number) => {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  const seconds = s - hours * 3600 - minutes * 60;

  const hoursString = hours < 10 ? `0${hours}` : hours.toString();
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${hoursString}:${minutesString}:${secondsString}`;
};
