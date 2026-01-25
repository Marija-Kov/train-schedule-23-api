import {
  Station,
  StationName,
  StationDepartureDetails,
  DepartureOutput,
  TimeInput,
  TimeOutput,
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

export function getStationNameDisplay(index: number, stations: Station[]) {
  return stations[index].nameDisplay;
}

export function narrowDownSelection(
  index: number,
  time: TimeInput,
  stations: Station[],
  direction: 1 | 2,
  frequency: (string | boolean)[]
) {
  return stations[index].departures.filter((d: StationDepartureDetails) => {
    return (
      d.time >= Number(time) &&
      d.trainDetails.directionId === direction &&
      frequency.includes(d.trainDetails.serviceFrequency)
    );
  });
}

export function shapeToOutputFormat(departures: StationDepartureDetails[]) {
  return departures.map((d: StationDepartureDetails) => {
    return {
      departureTime: d.time.toFixed(2).split(".").join(":") as TimeOutput,
      arrivalTime: "0:10", // placeholder
      trainId: d.trainDetails.id,
    } as DepartureOutput;
  });
}

export function getResultFromTrainIdOverlaps(
  departures: DepartureOutput[],
  arrivals: StationDepartureDetails[]
) {
  const result: DepartureOutput[] = [];
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

export function getTimeOutputFormat(arrival: StationDepartureDetails) {
  return arrival.time.toFixed(2).split(".").join(":") as TimeOutput;
}

export function getIndexOfSelectedStation(
  aStationName: StationName,
  stations: Station[]
) {
  return stations
    .filter((station: Station) => station.name === aStationName)
    .map((station: Station) => stations.indexOf(station))[0];
}

export function getStationIndexesIfDirectionIs2(
  direction: 1 | 2,
  indexFrom: number,
  indexTo: number,
  stations: Station[]
) {
  if (direction === 2) {
    indexFrom = stations.length - 1 - indexFrom;
    indexTo = stations.length - 1 - indexTo;
  }
  return { indexFrom, indexTo };
}

function getDirection(indexFrom: number, indexTo: number) {
  return (indexFrom > indexTo ? 2 : 1) as 1 | 2;
}
