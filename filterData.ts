import { ServerResponse } from "http";
import {
  stations as stationNames,
  trainId_d1,
  trainId_d2,
} from "./helpers/extractedData";

export const filterStationsData = (
  res: ServerResponse,
  stations: any[],
  station: string,
  direction: number | undefined,
  frequency: string
) => {
  if (!stationNames.includes(station)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Invalid station name" }));
  }
  if (typeof direction === "number") {
    if (![1, 2].includes(direction)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Invalid direction parameter" }));
    }
    if (frequency) {
      if (!["wh", "wd", "ed"].includes(frequency)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ error: "Invalid frequency parameter" })
        );
      }
      const activeOnWeekendsAndHolidays = activity(frequency);
      for (let s of stations) {
        if (s.name === station) {
          return (() => {
            let departures: any[] = [];
            for (let departure of s.departures) {
              if (
                departure.trainDetails.directionId === direction &&
                departure.trainDetails.activeOnWeekendsAndHolidays ===
                  activeOnWeekendsAndHolidays
              ) {
                departures.push(departure);
              }
            }
            return res.end(JSON.stringify(departures, null, 2));
          })();
        }
      }
    }
    for (let s of stations) {
      if (s.name === station) {
        return (() => {
          let departures: any[] = [];
          for (let departure of s.departures) {
            if (departure.trainDetails.directionId === direction) {
              departures.push(departure);
            }
          }
          return res.end(JSON.stringify(departures, null, 2));
        })();
      }
    }
  }
  for (let s of stations) {
    if (s.name === station) {
      return res.end(JSON.stringify(s, null, 2));
    }
  }
};

export const filterTrainsData = (
  res: ServerResponse,
  trains: any[],
  directionOrTrainId: number,
  frequency: string
) => {
  if (directionOrTrainId.toString().length > 1) {
    if (
      directionOrTrainId.toString().length !== 4 ||
      ![...trainId_d1, ...trainId_d2].includes(directionOrTrainId)
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ error: "Invalid train id or direction parameter" })
      );
    }
    if (frequency) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          error: "Invalid route: cannot use frequency parameter with train id",
        })
      );
    } else {
      return res.end(JSON.stringify(trains[directionOrTrainId], null, 2));
    }
  }
  if (directionOrTrainId.toString().length === 1) {
    if (![1, 2].includes(directionOrTrainId)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ error: "Invalid train id or direction parameter" })
      );
    }
    if (frequency) {
      if (!["wh", "wd", "ed"].includes(frequency)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ error: "Invalid frequency parameter" })
        );
      }
      const activeOnWeekendsAndHolidays = activity(frequency);
      let result: any[] = [];
      for (let train in trains) {
        if (
          trains[train].directionId === directionOrTrainId &&
          trains[train].activeOnWeekendsAndHolidays ===
            activeOnWeekendsAndHolidays
        ) {
          result.push(trains[train]);
        }
      }
      return res.end(JSON.stringify(result, null, 2));
    } else {
      let result: any[] = [];
      for (let train in trains) {
        if (trains[train].directionId === directionOrTrainId) {
          result.push(trains[train]);
        }
      }
      return res.end(JSON.stringify(result, null, 2));
    }
  }
};

function activity(frequency: string) {
  let active: any;
  switch (frequency) {
    case "wh":
      active = "w&h_only";
      break;
    case "ed":
      active = true;
      break;
    case "wd":
      active = false;
      break;
    default:
      undefined;
  }
  return active;
}
