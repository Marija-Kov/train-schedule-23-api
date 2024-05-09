import { promises as fs } from "fs";
import filter from "./utils/filterData";
import { Station, Train, YyyyMmDd, Time } from "./types/trainScheduleTypes";
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
  const splitUrl = url.split("/");
  if (!splitUrl[2]) {
    try {
      const json = await fs.readFile("./trains.json", "utf-8");
      const data: Train[] = (await JSON.parse(json)) as Train[];
      return res.sendJson(200, data);
    } catch (error) {
      console.error("Error reading/filtering trains data:", error);
      return res.sendJson(500, { error: "Internal server error" });
    }
  }
  /*
   If it looks like a direction:
  */
  if (splitUrl[2].length === 1) {
    const direction: "1" | "2" = splitUrl[2] as "1" | "2";
    if (direction !== "1" && direction !== "2") {
      return res.sendJson(422, { error: "Invalid direction - 1 or 2 only" });
    } else {
      const frequency: "ed" | "wd" | "wh" | undefined = splitUrl[3] as
        | "ed"
        | "wd"
        | "wh"
        | undefined;
      try {
        const json = await fs.readFile("./trains.json", "utf-8");
        const data: Train[] = (await JSON.parse(json)) as Train[];
        return filter.trainsByDirectionAndFrequency(
          res,
          data,
          direction,
          frequency
        );
      } catch (error) {
        console.error("Error reading/filtering trains data:", error);
        return res.sendJson(500, { error: "Internal server error" });
      }
    }
    /*
     If it does not look like a direction:
    */
  } else if (splitUrl[2].length > 1) {
    const trainId: TrainIdDirection1 | TrainIdDirection2 = Number(
      splitUrl[2]
    ) as TrainIdDirection1 | TrainIdDirection2;
    try {
      const json = await fs.readFile("./trains.json", "utf-8");
      const data: Train[] = JSON.parse(json) as Train[];
      return filter.trainsById(res, data, trainId);
    } catch (error) {
      console.error("Error reading/filtering trains data:", error);
      return res.sendJson(500, { error: "Internal server error" });
    }
  }
});

server.route("/stations", async (req, res) => {
  const { method, url } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  if (!url) return;
  const splitUrl = url.split("/");
  if (!splitUrl[2]) {
    try {
      const json = await fs.readFile("./stations.json", "utf-8");
      const data = JSON.parse(json);
      return res.sendJson(200, data);
    } catch (error) {
      console.error("Error reading stations.json:", error);
      return res.sendJson(500, { error: "Internal server error" });
    }
  }
  /*
   Multi-part station names are separated with '-' in the URL and with ' ' in .json files
   so they have to be formatted before being passed to the filter function:
  */
  const stationName: StationName = splitUrl[2]
    .split("-")
    .join(" ") as StationName;
  const direction: 1 | 2 | undefined = (
    splitUrl[3] ? Number(splitUrl[3]) : undefined
  ) as 1 | 2 | undefined;
  const frequency: "ed" | "wd" | "wh" | undefined = splitUrl[4] as
    | "ed"
    | "wd"
    | "wh"
    | undefined;
  try {
    const json = await fs.readFile("./stations.json", "utf-8");
    const data: Station[] = JSON.parse(json).stations;
    return filter.stationsData(res, data, stationName, direction, frequency);
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
  const splitUrl = url.split("/");
  if (!splitUrl[2] || !splitUrl[3] || !splitUrl[4] || !splitUrl[5]) {
    return res.sendJson(422, {
      error: "Please include all required parameters",
    });
  }
  const from = splitUrl[2].split("-").join(" ") as StationName;
  const to = splitUrl[3].split("-").join(" ") as StationName;
  const date = splitUrl[4] as YyyyMmDd;
  const time = splitUrl[5] as Time;
  try {
    const json = await fs.readFile("./stations.json", "utf-8");
    const data: Station[] = JSON.parse(json).stations;
    return filter.departures(res, data, from, to, date, time);
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
