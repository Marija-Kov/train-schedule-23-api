import {
  Station,
  StationName,
  TimeInput,
  YyyyMmDd,
  TrainId,
  TrainsMap,
  ServiceFrequency,
  Train,
  TrainItinerary
} from "train-schedule-types";

import {
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
  ovcaZemunResnikMladenovac,
  stationNamesDisplayMap
} from "./dataShapers/data/extractedData";

import {
  isDatePatternValid,
  isTimePatternValid,
  getServiceFrequencyArray,
  getStationNameDisplay,
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
  getTrainsByFrequency,
  getTrainsByDirection,
  isTrainIdValid,
} from "./getStationsAndTrainsDataHelpers";

const getDirectArrivals = (
  stations: { [key in StationName]: Station },
  trains: { [key in TrainId]: Train },
  from: StationName,
  to: StationName,
  serviceFrequency: ServiceFrequency[],
  time: TimeInput,
  checkedTrainsArray: TrainId[]
): {
  departureSt: StationName, arrivalSt: StationName, departureTime: TimeInput, arrivalTime: TimeInput, trainId: TrainId, layover: {
    station: StationName,
    arrivalTime: TimeInput,
    departureTime: TimeInput,
    waitTime: string,
    trainId: TrainId
  }
}[] => {
  let result: any[] = [];
  const departuresFromTheStationByQueriedTimeAndFrequency = stations[from].departures.filter(d => (d.time >= Number(time)) && (d.trainDetails.serviceFrequency === serviceFrequency[0] || d.trainDetails.serviceFrequency === serviceFrequency[1]) && d)
  departuresFromTheStationByQueriedTimeAndFrequency.forEach(d => {
    const trainId = d.trainDetails.id;
    if (checkedTrainsArray.includes(trainId)) return;
    result = [...result, ...trains[trainId].itinerary.filter(i => i.station === to).map(i => {
      checkedTrainsArray.push(trainId)
      return {
        departureTime: d.time,
        arrivalTime: i.time,
        trainId: trainId,
        layover: null // for all direct arrivals
      }
    })]
  })
  return result.filter(e => e !== undefined && e.departureTime < e.arrivalTime);
}

const getLayoverStationAndArrivalTimes = (
  stations: { [key in StationName]: Station },
  trains: { [key in TrainId]: Train },
  from: StationName,
  to: StationName,
  serviceFrequency: ServiceFrequency[],
  time: TimeInput,
  checkedTrainsArray: TrainId[]
) => {
  let result: any[] = [];
  const departuresFromTheStationByQueriedTimeAndFrequency =
    stations[from].departures
      .filter(d => (d.time >= Number(time)) &&
        (d.trainDetails.serviceFrequency === serviceFrequency[0] || d.trainDetails.serviceFrequency === serviceFrequency[1]) &&
        d)
  departuresFromTheStationByQueriedTimeAndFrequency.forEach(d => {
    const trainId = d.trainDetails.id;
    if (checkedTrainsArray.includes(trainId)) return;
    result =
      [...result,
      ...trains[trainId].itinerary.filter(i => i.station === "karadjordjev park") // karadjordjev park is a layover station for all train lines
        .map(i => {
          checkedTrainsArray.push(trainId);
          return {
            station: i.station, 
            departureTime: d.time, 
            arrivalTime: i.time, 
            trainId: trainId
          }
        })]
  })
  return result.filter(e => e !== undefined && e.departureTime < e.arrivalTime);
}

function subtractHHMM(minuend: TimeInput, subtrahend: TimeInput) {
  let minuendHH = Math.trunc(Number(minuend));
  let subtrahendHH = Math.trunc(Number(subtrahend));
  if (minuendHH < subtrahendHH) {
    console.error("Bad input: minuend must be greater than subtrahend")
    return
  }

  let minuendMM = Number(String(minuend).split(".")[1]) || 0; // hmm..
  let subtrahendMM = Number(String(subtrahend).split(".")[1]) || 0;

  if (minuendMM < subtrahendMM) {
    minuendHH -= 1;
    minuendMM += 60;
  }

  const differenceHH = minuendHH - subtrahendHH;
  const differenceMM = minuendMM - subtrahendMM;

  if (differenceHH === 0) return `${differenceMM}min`

  return `${differenceHH}h ${differenceMM}min`
}

const departuresNEWX = async (
  stations: { [key in StationName]: Station },
  trains: { [key in TrainId]: Train },
  from?: StationName,
  to?: StationName,
  serviceFrequency?: ServiceFrequency[],
  time?: TimeInput,
) => {

  if (!stations)
    throw Error("filterData > departuresNEWX(): argument 'stations' is missing");
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
    (from && !Object.keys(stationNamesDisplayMap).includes(from)) ||
    (to && !Object.keys(stationNamesDisplayMap).includes(to))
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
  if (!serviceFrequency) {
    return { error: "Date parameter is required" };
  }
  if (!time) {
    return { error: "Time parameter is required" };
  }
  // must be an array of 2 strings of ServiceFrequency type
  if (!Array.isArray(serviceFrequency) || serviceFrequency.length !== 2) {
    return { error: "Invalid service frequency value" };
  }

  if (!isTimePatternValid(time)) {
    return { error: "Invalid time format or value" };
  }

  let checkedTrainsArray: TrainId[] = [];

  const directArrivals = getDirectArrivals(stations, trains, from, to, serviceFrequency, time, checkedTrainsArray);

  if (!directArrivals.length) {
    checkedTrainsArray = []
  }
  // departures form the layover to destination station in the specified time frame
  const possibleLayovers = getLayoverStationAndArrivalTimes(stations, trains, from, to, serviceFrequency, time, checkedTrainsArray);

  if (!possibleLayovers.length) {
    return {
      departureStation: stationNamesDisplayMap[from],
      arrivalStation: stationNamesDisplayMap[to],
      departures: directArrivals // this may be []
    }
  }

  const firstLayoverRecord = possibleLayovers[0];

  const layoverDepartures = getDirectArrivals(
    stations,
    trains,
    firstLayoverRecord.station,
    to,
    serviceFrequency,
    firstLayoverRecord.arrivalTime,
    checkedTrainsArray
  )

  const indirectArrivals: 
  { departureTime: TimeInput; 
    arrivalTime: TimeInput; 
    trainId: TrainId; 
    layover: { 
      station: StationName; 
      arrivalTime: TimeInput; 
      departureTime: TimeInput; 
      waitTime: string | undefined; 
      trainId: TrainId; 
    }; 
  }[] = [];

  possibleLayovers.forEach((l, i) => {
    for (let j = 0; j <= layoverDepartures.length; j++) {
      // this ensures that we only get the trains in the right direction
      if (layoverDepartures[j] && layoverDepartures[j].departureTime > l.arrivalTime) {
        indirectArrivals.push({
          departureTime: l.departureTime,
          arrivalTime: layoverDepartures[j].arrivalTime,
          trainId: l.trainId,
          layover: {
            station: l.station,
            arrivalTime: l.arrivalTime,
            departureTime: layoverDepartures[j].departureTime,
            waitTime: subtractHHMM(layoverDepartures[j].departureTime, l.arrivalTime),
            trainId: layoverDepartures[j].trainId
          }
        })
        break // we only need the shortest layover duration
      }
    }
  })

  return {
    departureStation: stationNamesDisplayMap[from],
    arrivalStation: stationNamesDisplayMap[to],
    departures: [...directArrivals, ...indirectArrivals]
  }
}

const departures = (
  stations: Station[],
  from: StationName | undefined,
  to: StationName | undefined,
  date: YyyyMmDd,
  time: TimeInput
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
    (from && !Object.keys(stationNamesDisplayMap).includes(from)) ||
    (to && !Object.keys(stationNamesDisplayMap).includes(to))
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

  const frequency = getServiceFrequencyArray(date);

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
    departureStation: getStationNameDisplay(indexFrom, stations),
    arrivalStation: getStationNameDisplay(indexTo, stations),
    departures: departures,
  };
};

const stationsData = (
  stations: { [key in StationName]: Station },
  aStation: StationName | undefined,
  direction: 1 | 2 | undefined,
  frequency: ServiceFrequency | undefined
) => {
  if (!stations)
    throw Error(
      "filterData > filterStationsData(): argument 'stations' is missing"
    );
  if (!aStation) {
    return stations;
  }
  if (aStation && !isStationNameValid(aStation)) {
    return { error: "Invalid station name" };
  }

  if (direction === undefined) {
    return getStation(aStation, stations);
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
        getStation(aStation, stations).departures,
        direction
      ),
      frequency
    );
  }
  /*
     If no frequency parameter is provided, return all the departures 
     from the specified station, in the specified direction:
    */
  return getDeparturesInDirection(
    getStation(aStation, stations).departures,
    direction
  );
};

const trainsData = (
  trains: TrainsMap,
  direction: 1 | 2 | undefined,
  frequency: ServiceFrequency | undefined
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
  trains: TrainsMap,
  trainId: TrainId | undefined
) => {
  if (!trains) {
    throw Error("filterData > aTrainData(): argument 'trains' is missing");
  }
  if (!trainId) {
    // DO NOT RETURN ALL ON trains/sfewfw/
    return trains;
  }
  if (!isTrainIdValid([...batajnicaOvca.trainIdsDirection1, ...batajnicaOvca.trainIdsDirection2, ...ovcaZemunResnikLazarevac.trainIdsDirection1, ...ovcaZemunResnikLazarevac.trainIdsDirection2, ...ovcaZemunResnikMladenovac.trainIdsDirection1, ...ovcaZemunResnikMladenovac.trainIdsDirection2], trainId)) {
    return { error: "Invalid train id" };
  }
  return trains[trainId];
};

const filter = {
  departures,
  departuresNEWX,
  stationsData,
  trainsData,
  aTrainData,
};

export default filter;
