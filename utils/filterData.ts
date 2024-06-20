import {
  Station,
  Time,
  YyyyMmDd,
  TrainsObject,
} from "../types/trainScheduleTypes";

import {
  stationsNames,
  trainIdDirection1,
  trainIdDirection2,
} from "./dataShapers/data/extractedData";

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
  getFrequency,
  getTrainsByFrequency,
  getTrainsByDirection,
  isTrainIdValid,
} from "./getStationsAndTrainsDataHelpers";

const departures = (
  stations: Station[],
  from: StationName | undefined,
  to: StationName | undefined,
  date: YyyyMmDd,
  time: Time
) => {
  if (!stations)
    throw Error("filterData > departures(): argument 'stations' is missing");
  if (!from) {
    return {
      error: "Departure station parameter is required",
    };
  }
  if (!to) {
    return {
      error: "Arrival station parameter is required",
    };
  }
  if (
    (from && !stationsNames.includes(from)) ||
    (to && !stationsNames.includes(to))
  ) {
    return {
      error: "Invalid departure and/or arrival station parameter",
    };
  }

  if (from && to && from === to) {
    return {
      error: "Departure and arrival station must be different",
    };
  }
  if (!date) {
    return { error: "Date parameter is required" };
  }
  if (!time) {
    return { error: "Time parameter is required" };
  }

  if (!isDatePatternValid(date)) {
    return { error: "Invalid date value" };
  }

  if (!isTimePatternValid(time)) {
    return { error: "Invalid time format or value" };
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
    return {
      error: "No departures found for specified parameters",
    };
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
    return {
      error: "No departures found for specified parameters",
    };
  }

  return {
    departureStation: formatStationNameForOutput(indexFrom, stations),
    arrivalStation: formatStationNameForOutput(indexTo, stations),
    departures: departures,
  };
};

const stationsData = (
  stations: Station[],
  station: StationName | undefined,
  direction: 1 | 2 | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!stations)
    throw Error(
      "filterData > filterStationsData(): argument 'stations' is missing"
    );
  if (!station) {
    return stations;
  }
  if (station && !isStationNameValid(station)) {
    return { error: "Invalid station name" };
  }

  if (direction === undefined) {
    return getStation(station, stations);
  }

  if (!isDirectionValid(direction)) {
    return { error: "Invalid direction parameter" };
  }

  if (frequency) {
    if (!isFrequencyValid(frequency)) {
      return { error: "Invalid frequency parameter" };
    }

    return getDeparturesByFrequency(
      getDeparturesInDirection(
        getStation(station, stations).departures,
        direction
      ),
      getFrequency(frequency)
    );
  }
  /*
     If no frequency parameter is provided, return all the departures 
     from the specified station, in the specified direction:
    */
  return getDeparturesInDirection(
    getStation(station, stations).departures,
    direction
  );
};

const trainsData = (
  trains: TrainsObject,
  direction: 1 | 2 | undefined,
  frequency: "ed" | "wd" | "wh" | undefined
) => {
  if (!trains)
    throw Error("filterData > trainsData(): argument 'trains' is missing");
  if (direction === undefined) return trains;
  if (direction && !isDirectionValid(direction)) {
    return { error: "Invalid direction parameter" };
  }
  if (!frequency) {
    return getTrainsByDirection(trains, direction);
  }
  if (frequency && !isFrequencyValid(frequency)) {
    return { error: "Invalid frequency parameter" };
  }

  return getTrainsByFrequency(
    getTrainsByDirection(trains, direction),
    frequency
  );
};

const aTrainData = (
  trains: TrainsObject,
  trainId: TrainIdDirection1 | TrainIdDirection2 | undefined
) => {
  if (!trains) {
    throw Error("filterData > aTrainData(): argument 'trains' is missing");
  }
  if (!trainId) {
    // DO NOT RETURN ALL ON trains/sfewfw/
    return trains;
  }
  if (!isTrainIdValid([...trainIdDirection1, ...trainIdDirection2], trainId)) {
    return { error: "Invalid train id" };
  }
  return trains[trainId];
};

const filter = {
  departures,
  stationsData,
  trainsData,
  aTrainData,
};

export default filter;
