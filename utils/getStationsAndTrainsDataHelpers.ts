import { Station, StationName, StationDepartureDetails, TrainDetails, TrainsMap, TrainId, ServiceFrequency } from "train-schedule-types";
import { stationNamesDisplayMap } from "./dataShapers/data/extractedData";

export function isStationNameValid(aStationName: StationName) {
  return Object.keys(stationNamesDisplayMap).includes(aStationName);
}

export function getStation(aStationName: StationName, stations: {[key in StationName]: Station}) {
  return stations[aStationName];
}

export function isDirectionValid(direction: number) {
  return [1, 2].includes(direction);
}

export function isFrequencyValid(frequency: ServiceFrequency) {
  return ["wh", "wd", "ed"].includes(frequency);
}

export function getDeparturesInDirection(
  departures: StationDepartureDetails[],
  direction: 1 | 2
) {
  return departures.filter((d) => d.trainDetails.directionId === direction);
}

export function getDeparturesByFrequency(
  departures: StationDepartureDetails[],
  frequency: ServiceFrequency
) {
  return departures.filter(
    (d) => d.trainDetails.serviceFrequency === frequency
  );
}

export function getTrainsByFrequency(trains: TrainDetails[], frequency: ServiceFrequency) {
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
  trainIds: (TrainId)[],
  id: TrainId
) {
  return trainIds.includes(id);
}
