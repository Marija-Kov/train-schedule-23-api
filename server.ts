import { promises as fs } from "fs";
import filter from "./utils/filterData";
import { YyyyMmDd, Time } from "./types/trainScheduleTypes";
import F from "./framework";
import {
  TrainIdDirection1,
  TrainIdDirection2,
  StationName,
} from "./types/boringTypes";

const port = process.env.PORT || 3003;

const server = new F();

server.route("/trains", async (req, res) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;

  if (["1", "2"].includes(param(url, 2))) {
    try {
      return filter.trainsData(
        res,
        await data("./trains.json"),
        aDirectionParam(param(url, 2)),
        aFrequencyParam(param(url, 3))
      );
    } catch (error) {
      console.error("Error reading/filtering trains data:", error);
      return res.sendJson(500, { error: "Internal server error" });
    }
  }

  try {
    return filter.aTrainData(
      res,
      await data("./trains.json"),
      aTrainIdParam(param(url, 2))
    );
  } catch (error) {
    console.error("Error reading/filtering trains data:", error);
    return res.sendJson(500, { error: "Internal server error" });
  }
});

server.route("/stations", async (req, res) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;

  try {
    return filter.stationsData(
      res,
      await data("./stations.json"),
      aStationNameParam(param(url, 2)),
      aDirectionParam(param(url, 3)),
      aFrequencyParam(param(url, 4))
    );
  } catch (error) {
    console.error("Error reading/filtering stations data:", error);
    return res.sendJson(500, { error: "Internal server error" });
  }
});

server.route("/departures", async (req, res) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;

  try {
    return filter.departures(
      res,
      await data("./stations.json"),
      aStationNameParam(param(url, 2)),
      aStationNameParam(param(url, 3)),
      aDateParam(param(url, 4)),
      aTimeParam(param(url, 5))
    );
  } catch (error) {
    console.error("Error reading/filtering stations data:", error);
    return res.sendJson(500, { error: "Internal server error" });
  }
});

server.route("/", async (req, res) => {
  const { method } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  return res.sendJson(200, { message: "Welcome to the train schedule API!" });
});

// This prevents app from crashing when browsers ask for favicon:
server.route("/favicon.ico", async (req, res) => {
  return res.end();
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/**
 * Gets a parameter from the url where parameters are separated by '/' by order number .
 * @param url
 * @param n target parameter's order number
 * @returns parameter (string)
 */
function param(url: string, n: number) {
  const splitUrl = url.split("/");
  return splitUrl[n];
}

/**
 * Formats a station name parameter as extracted from the url by replacing dashes with empty spaces and converts it to type StationName.
 * @param stationNameParam station name extracted from the url
 * @returns station name (StationName)
 */
function aStationNameParam(stationNameParam: string) {
  if (!stationNameParam) return undefined;
  return stationNameParam.split("-").join(" ") as StationName;
}

/**
 * Converts a direction parameter from string to type 1 | 2.
 * @param directionParam direction extracted from the url
 * @returns
 */
function aDirectionParam(directionParam: string) {
  if (!directionParam) return undefined;
  return Number(directionParam) as 1 | 2;
}

/**
 * Converts a frequency parameter to type "ed" | "wd" | "wh"
 * @param frequencyParam frequency extracted from the url
 * @returns
 */
function aFrequencyParam(frequencyParam: string) {
  if (!frequencyParam) return undefined;
  return frequencyParam as "ed" | "wd" | "wh";
}

/**
 * Converts train id numerical string to type TrainIdDirection1 | TrainIdDirection2
 * @param trainIdParam train id extracted from the url
 * @returns train id number (TrainIdDirection1 | TrainIdDirection2)
 */
function aTrainIdParam(trainIdParam: string) {
  return Number(trainIdParam) as TrainIdDirection1 | TrainIdDirection2;
}

/**
 * Converts date string to type YyyyMmDd.
 * @param dateParam date extracted from the url
 * @returns
 */
function aDateParam(dateParam: string) {
  return dateParam as YyyyMmDd;
}

/**
 * Converts time string to type Time.
 * @param timeParam time extracted from the url
 * @returns
 */
function aTimeParam(timeParam: string) {
  return timeParam as Time;
}

/**
 * Gets data out of a json file.
 * @param pathToFile relative path to file
 * @returns an object or an array
 */
async function data(pathToFile: string) {
  const json = await fs.readFile(pathToFile, "utf-8");
  if (pathToFile.match(/stations/)) {
    return await JSON.parse(json).stations;
  }
  return await JSON.parse(json);
}
