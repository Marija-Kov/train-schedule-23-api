import { Station, StationName, StationDepartureDetails, TrainDetails, TrainsMap, TrainIdBatajnicaOvca, TrainIdOvcaBatajnica } from "train-schedule-types";
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
  frequency: "ed" | "wd" | "wh"
) {
  return departures.filter(
    (d) => d.trainDetails.serviceFrequency === frequency
  );
}

export function getTrainsByFrequency(trains: TrainDetails[], frequency: "ed" | "wd" | "wh") {
  return Object.values(trains).filter(
    (train) => train.serviceFrequency === frequency
  );
}

export function getTrainsByDirection(trains: TrainsMap, direction: 1 | 2) {
  return Object.values(trains).filter(
    (train) => train.directionId === Number(direction)
  );
}

export function isTrainIdValid(
  trainIds: (TrainIdBatajnicaOvca | TrainIdOvcaBatajnica)[],
  id: TrainIdBatajnicaOvca | TrainIdOvcaBatajnica
) {
  return trainIds.includes(id);
}
