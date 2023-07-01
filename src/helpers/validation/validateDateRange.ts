import type { Date } from "../../types";

export const isDateBetweenRange = (
  rangeStart: string,
  rangeEnd: string,
  date: string
) => {
  const rangeStartSplit = rangeStart.split(".");
  const rangeStartDate: Date = {
    day: parseInt(rangeStartSplit[0]),
    month: parseInt(rangeStartSplit[1]),
    year: parseInt(rangeStartSplit[2]),
  };
  const rangeEndSplit = rangeEnd.split(".");
  const rangeEndDate: Date = {
    day: parseInt(rangeEndSplit[0]),
    month: parseInt(rangeEndSplit[1]),
    year: parseInt(rangeEndSplit[2]),
  };
  const dateSplit = date.split(".");
  const dateDate: Date = {
    day: parseInt(dateSplit[0]),
    month: parseInt(dateSplit[1]),
    year: parseInt(dateSplit[2]),
  };
  if (rangeStartDate.year > dateDate.year) return false;
  if (rangeEndDate.year < dateDate.year) return false;
  if (rangeStartDate.month > dateDate.month) return false;
  if (rangeEndDate.month < dateDate.month) return false;
  if (rangeStartDate.day > dateDate.day) return false;
  if (rangeEndDate.day < dateDate.day) return false;
  return true;
};
