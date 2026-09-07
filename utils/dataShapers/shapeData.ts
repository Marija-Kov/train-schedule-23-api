import * as fs from "fs";
import {
  Train,
  Station,
  StationDepartureDetails,
  StationName,
  TrainId,
  TrainIdDirection1,
  TrainIdDirection2,
  StationNameDisplay,
  TimeInput,
  TrainItinerary,
  ServiceFrequency,
} from "train-schedule-types";

type ARouteExtractedData = {
  stationNames: StationName[];
  timetableDataDirection1: string;
  timetableDataDirection2: string;
  trainIdsDirection1: TrainIdDirection1[];
  trainIdsDirection2: TrainIdDirection2[];
  serviceFrequencyDirection1: ServiceFrequency[];
  serviceFrequencyDirection2: ServiceFrequency[];

}

function generateMatrix(dataStr: string): TimeInput[][] {
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

function overwriteNonTemporalMarkers(
  departureTimes: TimeInput[][],
): TimeInput[][] {
  for (let i = 0; i < departureTimes.length; i++) {
    for (let j = 0; j < departureTimes[i].length; j++) {
      if (departureTimes[i][j] as TimeInput | "0" === "0") {
        departureTimes[i][j] = "n/a";
      }
      // Check for off route stations in composite timetables.
      if (departureTimes[i][j] as TimeInput | "9.9" === "9.9") {
        departureTimes[i][j] = "n/a";
      }
      // Check for no-stops
      if (departureTimes[i][j] as TimeInput | "8.8" === "8.8") {
        departureTimes[i][j] = "n/a";
      }
    }
  }
  return departureTimes;
}

function trainsData(...args: ARouteExtractedData[]): Train[] {
  const result: Train[] = [];
  args.map(data => {
    const timetableMatrixDirection1 = overwriteNonTemporalMarkers(generateMatrix(data.timetableDataDirection1));
    const timetableMatrixDirection2 = overwriteNonTemporalMarkers(generateMatrix(data.timetableDataDirection2));
    console.log(`Creating train objects for ${data.stationNames[0]}-${data.stationNames[data.stationNames.length - 1]}...`)
    for (let i = 0; i < data.trainIdsDirection1.length; ++i) {
      const trainObject = createTrainObject(
        i,
        data.trainIdsDirection1,
        data.serviceFrequencyDirection1,
        timetableMatrixDirection1,
        data.stationNames,
        1,
        result
      )
      if (!trainObject) continue;
      result.push(
        trainObject
      );
    }
    console.log(`Finished creating train objects for ${data.stationNames[0]}-${data.stationNames[data.stationNames.length - 1]}.`)

    console.log(`Creating train objects for ${data.stationNames[data.stationNames.length - 1]}-${data.stationNames[0]}...`)
    for (let i = 0; i < data.trainIdsDirection2.length; ++i) {
      const trainObject = createTrainObject(
        i,
        data.trainIdsDirection2,
        data.serviceFrequencyDirection2,
        timetableMatrixDirection2,
        data.stationNames.slice().reverse(),
        2,
        result
      )
      if (!trainObject) continue;
      result.push(
        trainObject
      );
    }
    console.log(`Finished creating train objects for ${data.stationNames[data.stationNames.length - 1]}-${data.stationNames[0]}.`)
    return;
  })
  return result;
}

function createTrainObject(
  index: number,
  trainIds: TrainId[],
  frequencies: ServiceFrequency[],
  matrix: TimeInput[][],
  stations: StationName[],
  directionId: 1 | 2,
  trains: Train[]
): Train | undefined {
  /**
   * TODO: If we want to have all the trains in one JSON file, overwriting should occur
   * such that the existing entry for a train id is overwritten if it has a shorter itinerary
   * than the new entry. 
   * 
   * In most cases, a train id is bound to one direction of one route. 
   * There are overlaps in routes which results in a train id showing up in more than one timetable.
   * These overlaps do not affect the direction - if a train is bound to direction 1 on route A-G,
   * it will be bound to direction 1 on route B-C because of the way we defined the directions
   * (which may or may not be helpful when getting departures with transfers).
   */
  const train: Train = {
    id: trainIds[index],
    directionId: directionId,
    serviceFrequency: frequencies[index],
    itinerary: [],
  };
  if (trains[trainIds[index]] && stations.length <= trains[trainIds[index]].itinerary.length) return;
  for (let i = 0; i < stations.length; ++i) {
    if (!matrix[i]) {
      console.error(`ERROR: Matrix row undefined, train id ${trainIds[index]}`)
      continue
    }
    addDeparture(stations[i], matrix[i][index], train.itinerary);
  }
  return train;
}

function addDeparture(
  aStationName: StationName,
  time: TimeInput,
  itinerary: TrainItinerary
) {
  if (!time) {
    console.error(`ERROR: Time value undefined at ${aStationName}. This is likely because a no-departure marker is missing from the timetable data string or a typo. Please check if the timetable date string is typed correctly.`)
    return
  }
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
    `../../trains.json`,
    JSON.stringify(trains, null, 2),
    (err) => {
      console.log(err);
    }
  );
}

function stationsData(
  stationNamesMap: { [key in StationName]: StationNameDisplay },
  trains: Train[]
): { [key in StationName]: Station } {
  const result: { [key in StationName]: Station } = {} as { [key in StationName]: Station };
  Object.keys(stationNamesMap).map((name) => {
    result[name as StationName] = {
      name: name as StationName,
      nameDisplay: stationNamesMap[name as StationName],
      departures: [], // TODO: this array contains data about trains found on the station at certain times, not all of them are technically departures.
    };
    for (let i = 0; i < trains.length; ++i) {
      if (trains[i].itinerary.filter((i) => i.station === name).length) {
        // Only push if the train id doesn't exist in the departures
        if (result[name as StationName].departures.filter(d => d.trainDetails.id === trains[i].id).length === 0) {
          result[name as StationName].departures.push(addDepartureToStation(trains[i], name as StationName));
        }
      }
    }
  })
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

function writeStationsEndpoint(stationsObject: { [key in StationName]: Station }): void {
  const { holidays } = require("./data/extractedData");
  const data = {
    holidays: holidays,
    stations: stationsObject,
  };
  return fs.writeFile(
    `../../stations.json`,
    JSON.stringify(data, null, 2),
    (err) => {
      console.log(err);
    }
  );
}

const shape = {
  generateMatrix,
  overwriteNonTemporalMarkers,
  trainsData,
  createTrainObject,
  addDeparture,
  stationsData,
  writeTrainsEndpoint,
  writeStationsEndpoint,
};

export default shape;
