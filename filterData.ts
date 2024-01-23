import { ServerResponse } from "http";
import { Station, Train } from "./trainScheduleTypes";
import {
  stations as stationNames,
  trainId_d1,
  trainId_d2,
} from "./helpers/extractedData";

export const filterStationsData = (
  res: ServerResponse,
  stations: Station[],
  station: string,
  direction: number | undefined,
  frequency: string
) => {
  if (!stationNames.includes(station)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Invalid station name" }));
  }
  /*
   Checking whether direction is truthy will not work properly 
   because '0' is a falsy value and it will lead to returning 
   all station data instead of invalid direction parameter error.
   All numbers have to be considered:
  */
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
      /*
       Get the corresponding activity value to use for filtering:
      */
      const activeOnWeekendsAndHolidays = activity(frequency);
      /*
       After validating all the parameters, find the station:
      */
      for (let s of stations) {
        if (s.name === station) {
          /*
           Then get inside the station object:
          */
          return (() => {
            let departures: any[] = [];
            /*
             Filter the departures within the specified station:
            */
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
    /*
     If no frequency parameter is provided:
    */
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
  /*
   If no direction parameter is provided:
  */
  for (let s of stations) {
    if (s.name === station) {
      return res.end(JSON.stringify(s, null, 2));
    }
  }
};

export const filterTrainsData = (
  res: ServerResponse,
  trains: Train[],
  directionOrTrainId: number,
  frequency: string
) => {
  /*
   When the parameter could be a train id:
  */
  if (directionOrTrainId.toString().length > 1) {
    /*
     Check if it's a valid train id:
    */
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
    /*
     Frequency parameter is not particularly useful in combination with train id parameter
     so it should return an error:
    */
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
  /*
   When the parameter could be a direction:
  */
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
      /*
       Filter the trains by direction and activity:
      */
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
    /*
     Filter the trains by direction id only:
    */
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
