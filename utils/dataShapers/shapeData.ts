import * as fs from "fs";
import {
  Train,
  Station,
  StationDeparture,
  Time,
  TrainItinerary,
} from "../../types/trainScheduleTypes";
import {
  StationName,
  TrainIdDirection1,
  TrainIdDirection2,
  StationNameFormatted,
} from "../../types/aliases";

function extractDepartureTimes(dataStr: string): Time[][] {
  /*
       Takes in data string extracted from the PDF 
       and, for each station, returns all times of departures in the given direction.
      */
  const len = dataStr.length + 1;
  let index = 0; // there's always a char at position 0
  const arr: Time[] = [];
  for (let i = 1; i < len - 1; ++i) {
    const prev = dataStr.charAt(i - 1);
    const curr = dataStr.charAt(i);
    const next = dataStr.charAt(i + 1);
    if (curr === " ") {
      if (
        (prev.match(/[0-9]/) && !next.match(/[0-9]/)) ||
        (!prev.match(/[0-9]/) && next.match(/[0-9]/))
      ) {
        const time: Time = dataStr.slice(index, i) as Time;
        arr.push(time);
        index = i + 1;
      }
    }
    if (!next) {
      const time: Time = dataStr.slice(index, i + 1) as Time;
      arr.push(time);
    }
  }
  return arr
    .filter((a) => arr.indexOf(a) % 2 !== 0)
    .map((a) => a.split(" ")) as Time[][];
}

function createTimetableMatrix(
  departureTimes: Time[][],
): Time[][] {
  for (let i = 0; i < departureTimes.length; i++) {
    for (let j = 0; j < departureTimes[i].length; j++) {
      if (departureTimes[i][j] as Time | "0" === "0") {
        departureTimes[i][j] = "n/a";
      }
    }
  }
  return departureTimes;
}


function trainsData(
  trainIdsDir1: TrainIdDirection1[],
  trainIdsDir2: TrainIdDirection2[],
  weekendsAndHolidays1: (boolean | "w&h_only")[],
  weekendsAndHolidays2: (boolean | "w&h_only")[],
  stations: StationName[],
  timetable1: Time[][],
  timetable2: Time[][]
): Train[] {
  const result: Train[] = [];
  for (let i = 0; i < trainIdsDir1.length; ++i) {
    result.push(
      createTrainObject(
        i,
        trainIdsDir1,
        weekendsAndHolidays1,
        timetable1,
        stations,
        1
      )
    );
  }
  for (let i = 0; i < trainIdsDir2.length; ++i) {
    result.push(
      createTrainObject(
        i,
        trainIdsDir2,
        weekendsAndHolidays2,
        timetable2,
        stations.slice().reverse(),
        2
      )
    );
  }
  return result;
}

function createTrainObject(
  index: number,
  trainIds: (TrainIdDirection1 | TrainIdDirection2)[],
  frequencies: (boolean | "w&h_only")[],
  matrix: Time[][],
  stations: StationName[],
  directionId: 1 | 2
) {
  const train: Train = {
    id: trainIds[index],
    directionId: directionId,
    activeOnWeekendsAndHolidays: frequencies[index],
    itinerary: [],
  };
  for (let i = 0; i < stations.length; ++i) {
    addDeparture(stations[i], matrix[i][index], train.itinerary);
  }
  return train;
}

function addDeparture(
  station: StationName,
  time: Time,
  itinerary: TrainItinerary
) {
  if (time !== "n/a") {
    itinerary.push({
      station: station,
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
  stations: StationName[],
  stationsFormatted: StationNameFormatted[],
  trains: Train[]
): Station[] {
  const result: Station[] = [];
  for (let i = 0; i < stations.length; ++i) {
    result.push(createStationObject(stations[i], stationsFormatted[i], trains));
  }
  return result;
}

function createStationObject(
  station: StationName,
  stationFormatted: StationNameFormatted,
  trains: Train[]
) {
  const result: Station = {
    name: station,
    nameFormatted: stationFormatted,
    departures: [], // TODO: this array contains data about trains found on the station at certain times, not all of them are technically departures.
  };
  for (let i = 0; i < trains.length; ++i) {
    if (trains[i].itinerary.filter((i) => i.station === station).length) {
      result.departures.push(addDepartureToStation(trains[i], station));
    }
  }
  return result;
}

function addDepartureToStation(train: Train, station: StationName) {
  const time = train.itinerary.filter((i) => i.station === station)[0].time;
  return {
    time: time,
    trainDetails: {
      id: train.id,
      directionId: train.directionId,
      activeOnWeekendsAndHolidays: train.activeOnWeekendsAndHolidays,
    },
  } as StationDeparture;
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
