import { StationName } from "../types/boringTypes";
import {
  Station,
  StationDeparture,
  OutputDeparture,
  Time,
  TimeOutput,
  YyyyMmDd,
} from "../types/trainScheduleTypes";
import { holidays, year } from "./dataShapers/data/extractedData";

export function isDatePatternValid(date: YyyyMmDd) {
  const pattern = `^${year}-(0[1-9]|1[0-2])-([0][1-9]|[1-2][0-9]|3[01])$`;
  const r = new RegExp(pattern);
  return date.match(r);
}

export function areMonthAndDayValid(date: YyyyMmDd) {
  const dateArr = date.split("-");
  const invalidDate =
    (Number(dateArr[0]) % 2 !== 0 &&
      dateArr[1] === "02" &&
      Number(dateArr[2]) > 28) ||
    (dateArr[1] === "02" && Number(dateArr[2]) > 29) ||
    (["04", "06", "09", "11"].includes(dateArr[1]) && dateArr[2] === "31");
  return !invalidDate;
}

export function isTimePatternValid(time: Time) {
  const pattern = `^([0-1][0-9]|2[0-3]).([0-5][0-9])$`;
  const r = new RegExp(pattern);
  return time.match(r);
}

export function getFrequencyArray(date: YyyyMmDd) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6 || holidays.includes(date)
    ? [true, "w&h_only"]
    : [true, false];
}

export function getDirectionAndStationIndexes(
  from: StationName,
  to: StationName,
  stations: Station[]
) {
  let indexFrom = getIndexOfSelectedStation(from, stations);
  let indexTo = getIndexOfSelectedStation(to, stations);
  const direction = getDirection(indexFrom, indexTo);
  getStationIndexesIfDirectionIs2(direction, indexFrom, indexTo, stations);

  return { indexFrom, indexTo, direction };
}

export function formatStationNameForOutput(index: number, stations: Station[]) {
  return stations[index].nameFormatted;
}

export function narrowDownSelection(
  index: number,
  time: Time,
  stations: Station[],
  direction: 1 | 2,
  frequency: (string | boolean)[]
) {
  return stations[index].departures.filter((d: StationDeparture) => {
    return (
      d.time >= Number(time) &&
      d.trainDetails.directionId === direction &&
      frequency.includes(d.trainDetails.activeOnWeekendsAndHolidays)
    );
  });
}

export function shapeToOutputFormat(departures: StationDeparture[]) {
  return departures.map((d: StationDeparture) => {
    return {
      departureTime: d.time.toFixed(2).split(".").join(":") as TimeOutput,
      arrivalTime: "0:10", // placeholder
      trainId: d.trainDetails.id,
    } as OutputDeparture;
  });
}

export function getResultFromTrainIdOverlaps(
  departures: OutputDeparture[],
  arrivals: StationDeparture[]
) {
  const result: OutputDeparture[] = [];
  for (let departure of departures) {
    for (let arrival of arrivals) {
      if (departure.trainId === arrival.trainDetails.id) {
        departure.arrivalTime = getTimeOutputFormat(arrival);
        result.push(departure);
      }
    }
  }
  return result;
}

function getTimeOutputFormat(arrival: StationDeparture) {
  return arrival.time.toFixed(2).split(".").join(":") as TimeOutput;
}

function getIndexOfSelectedStation(
  stationName: StationName,
  stations: Station[]
) {
  return stations
    .filter((station: Station) => station.name === stationName)
    .map((station: Station) => stations.indexOf(station))[0];
}

function getStationIndexesIfDirectionIs2(
  direction: 1 | 2,
  indexFrom: number,
  indexTo: number,
  stations: Station[]
) {
  if (direction === 2) {
    indexFrom = stations.length - 1 - indexFrom;
    indexTo = stations.length - 1 - indexTo;
  }
}

function getDirection(indexFrom: number, indexTo: number) {
  return (indexFrom > indexTo ? 2 : 1) as 1 | 2;
}
