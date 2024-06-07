import * as fs from "fs";
import {
  Train,
  Station,
  StationDeparture,
  Time,
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
  stationsArr: StationName[],
  trainIdArr: TrainIdDirection2[]
): Time[][] {
  let j = 0;
  let i = 1;
  while (j < trainIdArr.length) {
    if (
      departureTimes[i] &&
      Number(departureTimes[i][j]) < Number(departureTimes[i - 1][j])
    ) {
      while (--i + 1) {
        departureTimes[i].splice(j, 0, "n/a");
      }
    }
    ++i;
    if (i === 15 || i === 0) {
      i = 1;
      ++j;
    }
  }
  j = 0;
  while (j < trainIdArr.length) {
    if (j === 10) {
      i = 8; // stations.indexOf the stations right after the destination of second shortest routes (Novi Beograd)
      while (i < stationsArr.length) {
        departureTimes[i].splice(j, 0, "n/a");
        ++i;
      }
    }
    if (departureTimes[0][j] === "n/a" || j === 13 || j === 26 || j === 35) {
      i = 11; // stations.indexOf the stations right after the destination of shortest routes (Altina)
      while (i < stationsArr.length) {
        departureTimes[i].splice(j, 0, "n/a");
        ++i;
      }
    }
    ++j;
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
  const len1 = trainIdsDir1.length;
  const len2 = trainIdsDir2.length;
  const arr: Train[] = [];
  for (let i = 0; i < len1; ++i) {
    const obj: Train = {
      id: 8003,
      directionId: 1,
      activeOnWeekendsAndHolidays: false,
      itinerary: [],
    };
    obj.id = trainIdsDir1[i];
    obj.directionId = 1;
    obj.activeOnWeekendsAndHolidays = weekendsAndHolidays1[i];
    obj.itinerary = [];
    for (let j = 0; j < stations.length; ++j) {
      if (timetable1[j][i] !== "n/a") {
        const objD: { station: StationName; time: number } = {
          station: "batajnica",
          time: 0,
        };
        objD.station = stations[j];
        objD.time = Number(timetable1[j][i]);
        obj.itinerary.push(objD);
      }
    }
    arr.push(obj);
  }
  for (let i = 0; i < len2; ++i) {
    const obj: Train = {
      id: 8003,
      directionId: 1,
      activeOnWeekendsAndHolidays: false,
      itinerary: [],
    };
    obj.id = trainIdsDir2[i];
    obj.directionId = 2;
    obj.activeOnWeekendsAndHolidays = weekendsAndHolidays2[i];
    obj.itinerary = [];
    const stLen = stations.length;
    for (let j = 0; j < stLen; ++j) {
      if (timetable2[j][i] !== "n/a") {
        const objD: { station: StationName; time: number } = {
          station: "batajnica",
          time: 0,
        };
        objD.station = stations[stLen - 1 - j];
        objD.time = Number(timetable2[j][i]);
        obj.itinerary.push(objD);
      }
    }
    arr.push(obj);
  }
  return arr;
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
  stationsData,
  writeTrainsEndpoint,
  writeStationsEndpoint,
};

export default shape;
