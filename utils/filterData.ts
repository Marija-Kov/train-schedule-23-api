import {
  Station,
  StationDeparture,
  OutputDeparture,
  Train,
  Time,
  TimeOutput,
  YyyyMmDd,
} from "../types/trainScheduleTypes";
import {
  stations as stationNames,
  trainIdDirection1,
  trainIdDirection2,
  holidays,
  year,
} from "./dataShapers/data/extractedData";
import { ExtendedServerRes } from "../framework";
import {
  StationName,
  TrainIdDirection1,
  TrainIdDirection2,
} from "../types/boringTypes";

const departures = (
  res: ExtendedServerRes,
  stations: Station[],
  from: StationName,
  to: StationName,
  date: YyyyMmDd,
  time: Time
) => {
  if (!res) throw Error("filterData > departures(): argument 'res' is missing");
  if (!stations)
    throw Error("filterData > departures(): argument 'stations' is missing");
  if (!from) {
    return res.sendJson(422, {
      error: "Departure station parameter is required",
    });
  }
  if (!to) {
    return res.sendJson(422, {
      error: "Arrival station parameter is required",
    });
  }
  if (
    (from && !stationNames.includes(from)) ||
    (to && !stationNames.includes(to))
  ) {
    return res.sendJson(422, {
      error: "Invalid departure and/or arrival station parameter",
    });
  }
  if (from && to && from === to) {
    return res.sendJson(422, {
      error: "Departure and arrival station must be different",
    });
  }
  if (!date) {
    return res.sendJson(422, { error: "Date parameter is required" });
  } else {
    const pattern = `^${year}-(0[1-9]|1[0-2])-([0][1-9]|[1-2][0-9]|3[01])$`;
    const r = new RegExp(pattern);
    if (!date.match(r)) {
      return res.sendJson(422, { error: "Invalid date value" });
    } else {
      const dateArr = date.split("-");
      if (
        (Number(dateArr[0]) % 2 !== 0 &&
          dateArr[1] === "02" &&
          Number(dateArr[2]) > 28) ||
        (dateArr[1] === "02" && Number(dateArr[2]) > 29) ||
        (["04", "06", "09", "11"].includes(dateArr[1]) && dateArr[2] === "31")
      ) {
        return res.sendJson(422, { error: "Invalid date value" });
      }
    }
  }
  if (!time) {
    return res.sendJson(422, { error: "Time parameter is required" });
  } else {
    const pattern = `^([0-1][0-9]|2[0-3]).([0-5][0-9])$`;
    const r = new RegExp(pattern);
    if (!time.match(r)) {
      return res.sendJson(422, { error: "Invalid time format or value" });
    }
  }
  const day = new Date(date).getDay();
  const frequency =
    day === 0 || day === 6 || holidays.includes(date)
      ? [true, "w&h_only"]
      : [true, false];
  let [indexFrom] = stations
    .filter((station: Station) => station.name === from)
    .map((station: Station) => stations.indexOf(station));
  let [indexTo] = stations
    .filter((station: Station) => station.name === to)
    .map((station: Station) => stations.indexOf(station));
  const departureStationNameFormatted = stations[indexFrom].nameFormatted;
  const arrivalStationNameFormatted = stations[indexTo].nameFormatted;
  const direction = indexFrom > indexTo ? 2 : 1;
  if (direction === 2) {
    indexFrom = stations.length - 1 - indexFrom;
    indexTo = stations.length - 1 - indexTo;
  }
  /*
   Narrow down to the departures whose time is equal to or later than the specified departure time,
   that go in the derived direction and that operate on the derived day type (every day, weekday, weekend/holiday);
   Not all of these departures necessarily end up on the specified arrival station.
  */
  const narrowedDownSelectionOfDepartures = stations[
    indexFrom
  ].departures.filter((d: StationDeparture) => {
    return (
      d.time >= Number(time) &&
      d.trainDetails.directionId === direction &&
      frequency.includes(d.trainDetails.activeOnWeekendsAndHolidays)
    );
  });

  if (!narrowedDownSelectionOfDepartures.length) {
    return res.sendJson(404, {
      error: "No departures found for specified parameters",
    });
  }

  const narrowedDownSelectionOfOutputDepartures =
    narrowedDownSelectionOfDepartures.map((d: StationDeparture) => {
      return {
        departureTime: d.time.toFixed(2).split(".").join(":") as TimeOutput,
        arrivalTime: "0:10", // placeholder
        trainId: d.trainDetails.id,
      } as OutputDeparture;
    });

  /*
   Narrow down arrivals to specified arrival station;
   Not all of these arrivals necessarily start on the specified departure station:
  */
  const narrowedDownSelectionOfArrivals = stations[indexTo].departures.filter(
    (d: StationDeparture) => {
      return (
        d.time >= Number(time) &&
        d.trainDetails.directionId === direction &&
        frequency.includes(d.trainDetails.activeOnWeekendsAndHolidays)
      );
    }
  );

  const departures: OutputDeparture[] = [];

  for (let i = 0; i < narrowedDownSelectionOfOutputDepartures.length; ++i) {
    for (let j = 0; j < narrowedDownSelectionOfArrivals.length; ++j) {
      if (
        narrowedDownSelectionOfOutputDepartures[i].trainId ===
        narrowedDownSelectionOfArrivals[j].trainDetails.id
      ) {
        const time = narrowedDownSelectionOfArrivals[j].time
          .toFixed(2)
          .split(".")
          .join(":") as TimeOutput;
        narrowedDownSelectionOfOutputDepartures[i].arrivalTime = time;
        departures.push(narrowedDownSelectionOfOutputDepartures[i]);
      }
    }
  }

  if (!departures.length) {
    return res.sendJson(404, {
      error: "No departures found for specified parameters",
    });
  }
  const result = {
    departureStation: departureStationNameFormatted,
    arrivalStation: arrivalStationNameFormatted,
    departures: departures,
  };
  return res.sendJson(200, result);
};

const stationsData = (
  res: ExtendedServerRes,
  stations: Station[],
  station: StationName | undefined,
  direction: 1 | 2 | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!res)
    throw Error("filterData > filterStationsData(): argument 'res' is missing");
  if (!stations)
    throw Error(
      "filterData > filterStationsData(): argument 'stations' is missing"
    );
  if (!station) {
    return res.sendJson(200, stations);
  }
  if (station && !stationNames.includes(station)) {
    return res.sendJson(422, { error: "Invalid station name" });
  }
  /*
   Checking whether direction is truthy will not work properly 
   because '0' is a falsy value and it will lead to returning 
   all station data instead of invalid direction parameter error.
   All numbers have to be considered:
  */
  if (typeof direction === "number") {
    if (![1, 2].includes(direction)) {
      return res.sendJson(422, { error: "Invalid direction parameter" });
    }
    if (frequency) {
      if (!["wh", "wd", "ed"].includes(frequency)) {
        return res.sendJson(422, { error: "Invalid frequency parameter" });
      }
      /*
       Get the corresponding value with getFrequency to use for filtering:
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
            let departures: StationDeparture[] = [];
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
            return res.sendJson(200, departures);
          })();
        }
      }
    }
    /*
     If no frequency parameter is provided, return all the departures 
     from the specified station, in the specified direction:
    */
    for (let s of stations) {
      if (s.name === station) {
        return (() => {
          let departures: StationDeparture[] = [];
          for (let departure of s.departures) {
            if (departure.trainDetails.directionId === direction) {
              departures.push(departure);
            }
          }
          return res.sendJson(200, departures);
        })();
      }
    }
  }
  /*
   If no direction parameter is provided, all specified station data is returned:
  */
  for (let s of stations) {
    if (s.name === station) {
      return res.sendJson(200, s);
    }
  }
};

const trainsByDirectionAndFrequency = (
  res: ExtendedServerRes,
  trains: Train[],
  direction: "1" | "2" | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!res)
    throw Error(
      "filterData > trainsByDirectionAndFrequency(): argument 'res' is missing"
    );
  if (!trains)
    throw Error(
      "filterData > trainsByDirectionAndFrequency(): argument 'trains' is missing"
    );
  if (direction && direction.toString().length === 1) {
    if (!["1", "2"].includes(direction)) {
      return res.sendJson(422, { error: "Invalid direction parameter" });
    }
    if (frequency) {
      if (!["wh", "wd", "ed"].includes(frequency)) {
        return res.sendJson(422, { error: "Invalid frequency parameter" });
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
      return res.sendJson(200, result);
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
      return res.sendJson(200, result);
    }
  }
  return res.sendJson(200, trains);
};

const trainsById = (
  res: ExtendedServerRes,
  trains: Train[],
  trainId: TrainIdDirection1 | TrainIdDirection2 | undefined
) => {
  if (!res) throw Error("filterData > trainsById(): argument 'res' is missing");
  if (!trains)
    throw Error("filterData > trainsById(): argument 'trains' is missing");
  if (!trainId) {
    return res.sendJson(200, trains);
  }
  if (
    trainId.toString().length !== 4 ||
    ![...trainIdDirection1, ...trainIdDirection2].includes(
      trainId as TrainIdDirection1 | TrainIdDirection2
    )
  ) {
    return res.sendJson(422, { error: "Invalid train id" });
  }
  return res.sendJson(200, trains[trainId]);
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

const filter = {
  departures,
  stationsData,
  trainsByDirectionAndFrequency,
  trainsById,
};

export default filter;
