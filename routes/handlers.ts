import { IncomingMessage } from "http";
import filter from "../utils/filterData";
import {
  param,
  data,
  aDirectionParam,
  aFrequencyParam,
  aTrainIdParam,
  aStationNameParam,
  aDateParam,
  aTimeParam,
} from "./helpers";
import { ExtendedServerRes } from "../framework";
import { getServiceFrequencyArray } from "../utils/getDeparturesHelpers";
import { ServiceFrequency, YyyyMmDd } from "train-schedule-types";

export const departures = async (
  req: IncomingMessage,
  res: ExtendedServerRes
) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;
  
  try {
    const result = await filter.departuresNEWX(
      await data("./stations.json"), // fetches stations
      await data("./trains.json"), // fetches trains
      aStationNameParam(param(url, 2)), // extracts departure station param
      aStationNameParam(param(url, 3)), // extracts arrival station param
      getServiceFrequencyArray(param(url, 4) as YyyyMmDd) as ServiceFrequency[], // gets relevant service frequency markers from date param
      aTimeParam(param(url, 5)) // extracts time param from url
    );
    if (result) {
      const statusCode = result.error ? 400 : 200;
      return res.sendJson(statusCode, result);
    }
  } catch (error) {
    console.error("Error reading/filtering stations/trains data:", error);
    return res.sendJson(500, { error: "Internal server error" });
  }
};

export const trains = async (req: IncomingMessage, res: ExtendedServerRes) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;

  if (["1", "2"].includes(param(url, 2))) {
    try {
      const result = filter.trainsData(
        await data("./trains.json"),
        aDirectionParam(param(url, 2)),
        aFrequencyParam(param(url, 3))
      );
      const statusCode = Object.keys(result)[0] === "error" ? 400 : 200;
      return res.sendJson(statusCode, result);
    } catch (error) {
      console.error("Error reading/filtering trains data:", error);
      return res.sendJson(500, { error: "Internal server error" });
    }
  }

  try {
    const result = filter.aTrainData(
      await data("./trains.json"),
      aTrainIdParam(param(url, 2))
    );
    const statusCode = Object.keys(result)[0] === "error" ? 400 : 200;
    return res.sendJson(statusCode, result);
  } catch (error) {
    console.error("Error reading/filtering trains data:", error);
    return res.sendJson(500, { error: "Internal server error" });
  }
};

export const stations = async (
  req: IncomingMessage,
  res: ExtendedServerRes
) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;

  try {
    const result = filter.stationsData(
      await data("./stations.json"),
      aStationNameParam(param(url, 2)),
      aDirectionParam(param(url, 3)),
      aFrequencyParam(param(url, 4))
    );
    const statusCode = Object.keys(result)[0] === "error" ? 400 : 200;
    return res.sendJson(statusCode, result);
  } catch (error) {
    console.error("Error reading/filtering stations data:", error);
    return res.sendJson(500, { error: "Internal server error" });
  }
};