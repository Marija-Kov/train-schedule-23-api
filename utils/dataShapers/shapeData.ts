import * as fs from "fs";
import {
  Train,
  Station,
  StationDepartureDetails,
  StationName,
  TrainIdBatajnicaOvca,
  TrainIdOvcaBatajnica,
  StationNameDisplay,
  TimeInput,
  TrainItinerary,
  ServiceFrequency,
} from "train-schedule-types";

function extractDepartureTimes(dataStr: string): TimeInput[][] {
  /*
       Takes in data string extracted from the PDF 
       and, for each station, returns all times of departures in the given direction.
      */
  const len = dataStr.length + 1;
  let index = 0; // there's always a char at position 0
  const arr: TimeInput[] = [];
  for (let i = 1; i < len - 1; ++i) {
    const prev = dataStr.charAt(i - 1);
    const curr = dataStr.charAt(i);
    const next = dataStr.charAt(i + 1);
    if (curr === " ") {
      if (
        (prev.match(/[0-9]/) && !next.match(/[0-9]/)) ||
        (!prev.match(/[0-9]/) && next.match(/[0-9]/))
      ) {
        const time: TimeInput = dataStr.slice(index, i) as TimeInput;
        arr.push(time);
        index = i + 1;
      }
    }
    if (!next) {
      const time: TimeInput = dataStr.slice(index, i + 1) as TimeInput;
      arr.push(time);
    }
  }
  return arr
    .filter((a) => arr.indexOf(a) % 2 !== 0)
    .map((a) => a.split(" ")) as TimeInput[][];
}

function createTimetableMatrix(
  departureTimes: TimeInput[][],
): TimeInput[][] {
  for (let i = 0; i < departureTimes.length; i++) {
    for (let j = 0; j < departureTimes[i].length; j++) {
      if (departureTimes[i][j] as TimeInput | "0" === "0") {
        departureTimes[i][j] = "n/a";
      }
    }
  }
  return departureTimes;
}


function trainsData(
  trainIdsDir1: TrainIdBatajnicaOvca[],
  trainIdsDir2: TrainIdOvcaBatajnica[],
  serviceFrequencyDirection1: ServiceFrequency[],
  serviceFrequencyDirection2: ServiceFrequency[],
  stationNames: StationName[],
  timetable1: TimeInput[][],
  timetable2: TimeInput[][]
): Train[] {
  const result: Train[] = [];
  for (let i = 0; i < trainIdsDir1.length; ++i) {
    result.push(
      createTrainObject(
        i,
        trainIdsDir1,
        serviceFrequencyDirection1,
        timetable1,
        stationNames,
        1
      )
    );
  }
  for (let i = 0; i < trainIdsDir2.length; ++i) {
    result.push(
      createTrainObject(
        i,
        trainIdsDir2,
        serviceFrequencyDirection2,
        timetable2,
        stationNames.slice().reverse(),
        2
      )
    );
  }
  return result;
}

function createTrainObject(
  index: number,
  trainIds: (TrainIdBatajnicaOvca | TrainIdOvcaBatajnica)[],
  frequencies: ServiceFrequency[],
  matrix: TimeInput[][],
  stations: StationName[],
  directionId: 1 | 2
) {
  const train: Train = {
    id: trainIds[index],
    directionId: directionId,
    serviceFrequency: frequencies[index],
    itinerary: [],
  };
  for (let i = 0; i < stations.length; ++i) {
    addDeparture(stations[i], matrix[i][index], train.itinerary);
  }
  return train;
}

function addDeparture(
  aStationName: StationName,
  time: TimeInput,
  itinerary: TrainItinerary
) {
  if (time !== "n/a") {
    itinerary.push({
      station: aStationName,
      time: Number(time),
    });
  }
  return;
}

function writeTrainsEndpoint(arr: Train[]) {
  const trains: any = {};
  for (let train of arr) {
    trains[train.id] = train;
  }
  return fs.writeFile(
    "../../trains.json",
    JSON.stringify(trains, null, 2),
    (err) => {
      console.log(err);
    }
  );
}

function stationsData(
  stationNames: StationName[],
  stationsDisplay: StationNameDisplay[],
  trains: Train[]
): Station[] {
  const result: Station[] = [];
  for (let i = 0; i < stationNames.length; ++i) {
    result.push(createStationObject(stationNames[i], stationsDisplay[i], trains));
  }
  return result;
}

function createStationObject(
  aStationName: StationName,
  aStationNameDisplay: StationNameDisplay,
  trains: Train[]
) {
  const result: Station = {
    name: aStationName,
    nameDisplay: aStationNameDisplay,
    departures: [], // TODO: this array contains data about trains found on the station at certain times, not all of them are technically departures.
  };
  for (let i = 0; i < trains.length; ++i) {
    if (trains[i].itinerary.filter((i) => i.station === aStationName).length) {
      result.departures.push(addDepartureToStation(trains[i], aStationName));
    }
  }
  return result;
}

function addDepartureToStation(train: Train, aStationName: StationName) {
  const time = train.itinerary.filter((i) => i.station === aStationName)[0].time;
  return {
    time: time,
    trainDetails: {
      id: train.id,
      directionId: train.directionId,
      serviceFrequency: train.serviceFrequency,
    },
  } as StationDepartureDetails;
}

function writeStationsEndpoint(stationsData: Station[]): void {
  const { holidays } = require("./data/extractedData");
  const data = {
    holidays: holidays,
    stations: stationsData,
  };
  return fs.writeFile(
    "../../stations.json",
    JSON.stringify(data, null, 2),
    (err) => {
      console.log(err);
    }
  );
}

const shape = {
  extractDepartureTimes,
  createTimetableMatrix,
  trainsData,
  createTrainObject,
  addDeparture,
  stationsData,
  writeTrainsEndpoint,
  writeStationsEndpoint,
};

export default shape;
