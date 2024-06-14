import {
  Station,
  Train,
  Time,
  YyyyMmDd,
  TrainsObject,
} from "../types/trainScheduleTypes";
import {
  stationsNames,
  trainIdDirection1,
  trainIdDirection2,
} from "./dataShapers/data/extractedData";
import { ExtendedServerRes } from "../framework";
import {
  StationName,
  TrainIdDirection1,
  TrainIdDirection2,
} from "../types/boringTypes";
import {
  isDatePatternValid,
  isTimePatternValid,
  getFrequencyArray,
  formatStationNameForOutput,
  getDirectionAndStationIndexes,
  narrowDownSelection,
  shapeToOutputFormat,
  getResultFromTrainIdOverlaps,
} from "./getDeparturesHelpers";

import {
  isStationNameValid,
  getStation,
  isDirectionValid,
  isFrequencyValid,
  getDeparturesInDirection,
  getDeparturesByFrequency,
} from "./getStationsAndTrainsDataHelpers";

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
    (from && !stationsNames.includes(from)) ||
    (to && !stationsNames.includes(to))
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
  }
  if (!time) {
    return res.sendJson(422, { error: "Time parameter is required" });
  }

  if (!isDatePatternValid(date)) {
    return res.sendJson(422, { error: "Invalid date value" });
  }

  if (!isTimePatternValid(time)) {
    return res.sendJson(422, { error: "Invalid time format or value" });
  }

  const { indexFrom, indexTo, direction } = getDirectionAndStationIndexes(
    from,
    to,
    stations
  );

  const frequency = getFrequencyArray(date);

  const narrowedDownSelectionOfDepartures = narrowDownSelection(
    indexFrom,
    time,
    stations,
    direction,
    frequency
  );

  if (!narrowedDownSelectionOfDepartures.length) {
    return res.sendJson(404, {
      error: "No departures found for specified parameters",
    });
  }

  const outputDepartures = shapeToOutputFormat(
    narrowedDownSelectionOfDepartures
  );

  const narrowedDownSelectionOfArrivals = narrowDownSelection(
    indexTo,
    time,
    stations,
    direction,
    frequency
  );

  const departures = getResultFromTrainIdOverlaps(
    outputDepartures,
    narrowedDownSelectionOfArrivals
  );

  if (!departures.length) {
    return res.sendJson(404, {
      error: "No departures found for specified parameters",
    });
  }

  return res.sendJson(200, {
    departureStation: formatStationNameForOutput(indexFrom, stations),
    arrivalStation: formatStationNameForOutput(indexTo, stations),
    departures: departures,
  });
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
  if (station && !isStationNameValid(station)) {
    return res.sendJson(422, { error: "Invalid station name" });
  }

  if (direction === undefined) {
    return res.sendJson(200, getStation(station, stations));
  }

  if (!isDirectionValid(direction)) {
    return res.sendJson(422, { error: "Invalid direction parameter" });
  }

  if (frequency) {
    if (!isFrequencyValid(frequency)) {
      return res.sendJson(422, { error: "Invalid frequency parameter" });
    }

    return res.sendJson(
      200,
      getDeparturesByFrequency(
        getDeparturesInDirection(
          getStation(station, stations).departures,
          direction
        ),
        getFrequency(frequency)
      )
    );
  }
  /*
     If no frequency parameter is provided, return all the departures 
     from the specified station, in the specified direction:
    */
  return res.sendJson(
    200,
    getDeparturesInDirection(
      getStation(station, stations).departures,
      direction
    )
  );
};

const trainsData = (
  res: ExtendedServerRes,
  trains: TrainsObject,
  direction: "1" | "2" | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!res) throw Error("filterData > trainsData(): argument 'res' is missing");
  if (!trains)
    throw Error("filterData > trainsData(): argument 'trains' is missing");
  if (direction === undefined) return res.sendJson(200, trains);
  if (direction && !isDirectionValid(Number(direction))) {
    return res.sendJson(422, { error: "Invalid direction parameter" });
  }
  if (!frequency) {
    return res.sendJson(200, getTrainsByDirection(trains, direction));
  }
  if (frequency && !isFrequencyValid(frequency)) {
    return res.sendJson(422, { error: "Invalid frequency parameter" });
  }

  return res.sendJson(
    200,
    getTrainsByFrequency(getTrainsByDirection(trains, direction), frequency)
  );
};

const aTrainData = (
  res: ExtendedServerRes,
  trains: TrainsObject,
  trainId: TrainIdDirection1 | TrainIdDirection2 | undefined
) => {
  if (!res) throw Error("filterData > aTrainData(): argument 'res' is missing");
  if (!trains) {
    throw Error("filterData > aTrainData(): argument 'trains' is missing");
  }
  if (!trainId) {
    return res.sendJson(200, trains);
  }
  if (!isTrainIdValid([...trainIdDirection1, ...trainIdDirection2], trainId)) {
    return res.sendJson(422, { error: "Invalid train id" });
  }
  return res.sendJson(200, trains[trainId]);
};

function getTrainsByFrequency(trains: Train[], frequency: "ed" | "wd" | "wh") {
  return Object.values(trains).filter(
    (train) => train.activeOnWeekendsAndHolidays === getFrequency(frequency)
  );
}

function getTrainsByDirection(trains: TrainsObject, direction: "1" | "2") {
  return Object.values(trains).filter(
    (train) => train.directionId === Number(direction)
  );
}

function isTrainIdValid(
  trainIds: (TrainIdDirection1 | TrainIdDirection2)[],
  id: TrainIdDirection1 | TrainIdDirection2
) {
  return trainIds.includes(id);
}

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
  trainsData,
  aTrainData,
};

export default filter;
