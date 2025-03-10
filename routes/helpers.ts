import { promises as fs } from "fs";
import {
  StationName,
  TrainIdDirection1,
  TrainIdDirection2,
} from "../types/aliases";
import { YyyyMmDd, Time } from "../types/trainScheduleTypes";

/**
 * Gets a parameter from the url where parameters are separated by '/' by order number .
 * @param url
 * @param n target parameter's order number
 * @returns parameter (string)
 */
export function param(url: string, n: number) {
  const splitUrl = url.split("/");
  return splitUrl[n];
}

/**
 * Formats a station name parameter as extracted from the url by replacing dashes with empty spaces and converts it to type StationName.
 * @param stationNameParam station name extracted from the url
 * @returns station name (StationName)
 */
export function aStationNameParam(stationNameParam: string) {
  if (!stationNameParam) return undefined;
  return stationNameParam.split("-").join(" ") as StationName;
}

/**
 * Converts a direction parameter from string to type 1 | 2.
 * @param directionParam direction extracted from the url
 * @returns
 */
export function aDirectionParam(directionParam: string) {
  if (!directionParam) return undefined;
  return Number(directionParam) as 1 | 2;
}

/**
 * Converts a frequency parameter to type "ed" | "wd" | "wh"
 * @param frequencyParam frequency extracted from the url
 * @returns
 */
export function aFrequencyParam(frequencyParam: string) {
  if (!frequencyParam) return undefined;
  return frequencyParam as "ed" | "wd" | "wh";
}

/**
 * Converts train id numerical string to type TrainIdDirection1 | TrainIdDirection2
 * @param trainIdParam train id extracted from the url
 * @returns train id number (TrainIdDirection1 | TrainIdDirection2)
 */
export function aTrainIdParam(trainIdParam: string) {
  return Number(trainIdParam) as TrainIdDirection1 | TrainIdDirection2;
}

/**
 * Converts date string to type YyyyMmDd.
 * @param dateParam date extracted from the url
 * @returns
 */
export function aDateParam(dateParam: string) {
  return dateParam as YyyyMmDd;
}

/**
 * Converts time string to type Time.
 * @param timeParam time extracted from the url
 * @returns
 */
export function aTimeParam(timeParam: string) {
  return timeParam as Time;
}

/**
 * Gets data out of a json file.
 * @param pathToFile relative path to file
 * @returns an object or an array
 */
export async function data(pathToFile: string) {
  const json = await fs.readFile(pathToFile, "utf-8");
  if (pathToFile.match(/stations/)) {
    return await JSON.parse(json).stations;
  }
  return await JSON.parse(json);
}


