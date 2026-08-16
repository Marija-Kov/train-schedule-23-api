import {
  TimeInput,
  YyyyMmDd,
} from "train-schedule-types";
import { holidays } from "./dataShapers/data/extractedData";

export function isDatePatternValid(date: YyyyMmDd) {
  const pattern =
    "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$";
  const r = new RegExp(pattern);
  return date.match(r);
}

export function isTimePatternValid(time: TimeInput) {
  const pattern = `^([0-1][0-9]|2[0-3])\\.([0-5][0-9])$`;
  const r = new RegExp(pattern);
  return time.match(r);
}

export function getServiceFrequencyArray(date: YyyyMmDd) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6 || holidays.includes(date)
    ? ["ed", "wh"]
    : ["ed", "wd"];
}
