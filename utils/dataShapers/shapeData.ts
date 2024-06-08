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
} from "../../types/boringTypes";

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

/*
 Timetable matrix creators modify departureTimes which is 
 the return value of extractDepartureTimes. 
 The algorithm differs for each of the 2 directions.
*/

function createTimetableMatrixDirection1(
  departureTimes: Time[][],
  stationsArr: StationName[],
  trainIdArr: TrainIdDirection1[]
): Time[][] {
  let j = 0; // subarray index ('column')
  let i = 1; // array index ('row')
  while (j < trainIdArr.length) {
    /*
     In departureTimes matrix compared to the PDF timetable, we can observe that 
     values in each column (t[i+n][j]) are not sorted in ascending order nor 
     associated with the same train id because some rows are shorter than others.
     We want to fill up the shorter rows so that all the rows are the same length
     and all the columns sorted in the ascending order AND 
     all values associated with one train id end up in one column.
     
     When we run into a t[i][j] < t[i-1][j], we want to do something so that
     eventually every t[i][j] > t[i-1][j] AND 
     have all values associated with one train id end up in one column.
    */
    const currRow = Number(departureTimes[i][j]);
    const rowAbove = Number(departureTimes[i - 1][j]);
    if (currRow < rowAbove || (currRow === 16.17 && rowAbove === 15.59)) {
      /*
      Go back upwards and insert n/a until we reach the top of the column (t[0][j]):
     */
      while (--i + 1) {
        departureTimes[i].splice(j, 0, "n/a");
      }
    }
    ++i;
    /*
     When we finish iterating through a column, we move on to the next one:
    */
    if (i === 15 || i === 0) {
      i = 1;
      ++j;
    }
  }
  /*
   Once we reach the last column, we finished filling up the top part of the table.
   We then reiterate every column 
   using inserted n/a values and the destination index of the shorter routes 
    (relative to the total number of rows in the table) 
   as guides to fill up the bottom part of the table.
  */
  j = 0;
  while (j < trainIdArr.length) {
    if (departureTimes[0][j] === "n/a") {
      i = 8; // index of the destination station of shorter routes (Beograd centar)
      while (i < stationsArr.length) {
        departureTimes[i].splice(j, 0, "n/a");
        ++i;
      }
    }
    ++j;
  }
  return departureTimes;
}

function createTimetableMatrixDirection2(
  departureTimes: Time[][],
  stationsLength: number
): Time[][] {
  for (let i = 0; i < 7; ++i) {
    departureTimes[i].splice(1, 0, "n/a");
    departureTimes[i].splice(8, 0, "n/a");
    departureTimes[i].splice(17, 0, "n/a");
    departureTimes[i].splice(21, 0, "n/a");
    departureTimes[i].splice(27, 0, "n/a");
    departureTimes[i].splice(29, 0, "n/a");
    departureTimes[i].splice(32, 0, "n/a");
    departureTimes[i].splice(33, 0, "n/a");
  }
  for (let i = 8; i < 11; ++i) {
    departureTimes[i].splice(10, 0, "n/a");
  }
  for (let i = 11; i < stationsLength; ++i) {
    departureTimes[i].splice(1, 0, "n/a");
    departureTimes[i].splice(8, 0, "n/a");
    departureTimes[i].splice(10, 0, "n/a");
    departureTimes[i].splice(13, 0, "n/a");
    departureTimes[i].splice(17, 0, "n/a");
    departureTimes[i].splice(21, 0, "n/a");
    departureTimes[i].splice(26, 0, "n/a");
    departureTimes[i].splice(27, 0, "n/a");
    departureTimes[i].splice(29, 0, "n/a");
    departureTimes[i].splice(32, 0, "n/a");
    departureTimes[i].splice(33, 0, "n/a");
    departureTimes[i].splice(35, 0, "n/a");
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
  trainsData: Train[]
): Station[] {
  const arr: Station[] = [];
  const stLen = stations.length;
  for (let i = 0; i < stLen; ++i) {
    const obj: Station = {
      name: "batajnica",
      nameFormatted: "Batajnica",
      departures: [],
    };
    obj.name = stations[i];
    obj.nameFormatted = stationsFormatted[i];
    obj.departures = [];
    const trLen = trainsData.length;
    for (let j = 0; j < trLen; ++j) {
      if (trainsData[j].itinerary[i]) {
        const departure: StationDeparture = {
          time: 0,
          trainDetails: {
            id: 7101,
            directionId: 1,
            activeOnWeekendsAndHolidays: false,
          },
        };
        departure.time = trainsData[j].itinerary[i].time;
        departure.trainDetails = {
          id: trainsData[j].id,
          directionId: trainsData[j].directionId,
          activeOnWeekendsAndHolidays:
            trainsData[j].activeOnWeekendsAndHolidays,
        };
        obj.departures.push(departure);
      }
    }
    arr.push(obj);
  }
  return arr;
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
  createTimetableMatrixDirection1,
  createTimetableMatrixDirection2,
  trainsData,
  createTrainObject,
  addDeparture,
  stationsData,
  writeTrainsEndpoint,
  writeStationsEndpoint,
};

export default shape;
