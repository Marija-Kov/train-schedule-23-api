import { ServerResponse } from "http";
import { Station, Train } from "./typeDefinitions/trainScheduleTypes";
import {
  StationName,
  TrainIdDirection1,
  TrainIdDirection2,
} from "./typeDefinitions/boringTypes";
import {
  stations as stationNames,
  trainId_d1,
  trainId_d2,
} from "./helpers/extractedData";

export const filterStationsData = (
  res: ServerResponse,
  stations: Station[],
  station: StationName,
  direction: 1 | 2 | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!res)
    throw Error(
      "filterData > filterStationsData(): argument 'res' is missing"
    );
  if (!stations)
    throw Error(
      "filterData > filterStationsData(): argument 'stations' is missing"
    );
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
       Get the corresponding getFrequency value to use for filtering:
      */
      const activeOnWeekendsAndHolidays = getFrequency(frequency);
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

export const filterTrainsByDirectionAndFrequency = (
  res: ServerResponse,
  trains: Train[],
  direction: "1" | "2" | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!res)
    throw Error(
      "filterData > filterTrainsByDirectionAndFrequency(): argument 'res' is missing"
    );
  if (!trains)
    throw Error(
      "filterData > filterTrainsByDirectionAndFrequency(): argument 'trains' is missing"
    );
  if (direction && direction.toString().length === 1) {
    if (!["1", "2"].includes(direction)) {
      res.statusCode = 422;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Invalid direction parameter" }));
    }
    if (frequency) {
      if (!["wh", "wd", "ed"].includes(frequency)) {
        res.statusCode = 422;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ error: "Invalid frequency parameter" })
        );
      }
      const activeOnWeekendsAndHolidays = getFrequency(frequency);
      let result: Train[] = [];
      /*
       Filter the trains by direction and frequency:
      */
      for (let train in trains) {
        if (
          trains[train].directionId === Number(direction) &&
          trains[train].activeOnWeekendsAndHolidays ===
            activeOnWeekendsAndHolidays
        ) {
          result.push(trains[train]);
        }
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(result, null, 2));
    } else {
      /*
       Filter the trains by direction id only:
      */
      let result: Train[] = [];
      for (let train in trains) {
        if (trains[train].directionId === Number(direction)) {
          result.push(trains[train]);
        }
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(result, null, 2));
    }
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(trains, null, 2));
};

export const filterTrainsById = (
  res: ServerResponse,
  trains: Train[],
  trainId: TrainIdDirection1 | TrainIdDirection2 | undefined
) => {
  if (!res)
    throw Error(
      "filterData > filterTrainsById(): argument 'res' is missing"
    );
  if (!trains)
    throw Error(
      "filterData > filterTrainsById(): argument 'trains' is missing"
    );
  if (!trainId) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(trains, null, 2));
  }
  if (
    trainId.toString().length !== 4 ||
    ![...trainId_d1, ...trainId_d2].includes(
      trainId as TrainIdDirection1 | TrainIdDirection2
    )
  ) {
    res.statusCode = 422;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Invalid train id" }));
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(trains[trainId], null, 2));
};

function getFrequency(
  frequency: "ed" | "wd" | "wh"
): boolean | "w&h_only" | undefined {
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
