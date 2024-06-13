import { StationName } from "../types/boringTypes";
import { Station, StationDeparture } from "../types/trainScheduleTypes";
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
  departures: StationDeparture[],
  direction: number
) {
  return departures.filter((d) => d.trainDetails.directionId === direction);
}

export function getDeparturesByFrequency(
  departures: StationDeparture[],
  frequency: boolean | "w&h_only" | undefined
) {
  return departures.filter(
    (d) => d.trainDetails.activeOnWeekendsAndHolidays === frequency
  );
}
