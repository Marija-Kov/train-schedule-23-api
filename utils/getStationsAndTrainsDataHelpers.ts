import { Station, StationName, StationDepartureDetails, TrainDetails, TrainsMap, TrainIdDirection1, TrainIdDirection2 } from "train-schedule-types";
import { stationsNames } from "./dataShapers/data/extractedData";

export function isStationNameValid(station: StationName) {
  return stationsNames.includes(station);
}

export function getStation(station: string, stations: Station[]) {
  return stations.filter((s) => s.name === station)[0];
}

export function isDirectionValid(direction: number) {
  return [1, 2].includes(direction);
}

export function isFrequencyValid(frequency: string) {
  return ["wh", "wd", "ed"].includes(frequency);
}

export function getDeparturesInDirection(
  departures: StationDepartureDetails[],
  direction: number
) {
  return departures.filter((d) => d.trainDetails.directionId === direction);
}

export function getDeparturesByFrequency(
  departures: StationDepartureDetails[],
  frequency: boolean | "w&h_only" | undefined
) {
  return departures.filter(
    (d) => d.trainDetails.activeOnWeekendsAndHolidays === frequency
  );
}

export function getTrainsByFrequency(trains: TrainDetails[], frequency: "ed" | "wd" | "wh") {
  return Object.values(trains).filter(
    (train) => train.activeOnWeekendsAndHolidays === getFrequency(frequency)
  );
}

export function getTrainsByDirection(trains: TrainsMap, direction: 1 | 2) {
  return Object.values(trains).filter(
    (train) => train.directionId === Number(direction)
  );
}

export function isTrainIdValid(
  trainIds: (TrainIdDirection1 | TrainIdDirection2)[],
  id: TrainIdDirection1 | TrainIdDirection2
) {
  return trainIds.includes(id);
}

export function getFrequency(
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
