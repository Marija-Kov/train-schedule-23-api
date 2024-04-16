import http from "http";
import { promises as fs } from "fs";
import {
  filterStationsData,
  filterTrainsById,
  filterTrainsByDirectionAndFrequency,
  getDeparturesAndArrivalsByDepartureDateAndTime,
} from "./filterData";
import {
  Station,
  Train,
  YyyyMmDd,
  Time,
} from "./typeDefinitions/trainScheduleTypes";
import {
  StationName,
  TrainIdDirection1,
  TrainIdDirection2,
} from "./typeDefinitions/boringTypes";

const port = process.env.PORT || 3003;

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  if (method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "405 Method Not Allowed" }));
  }
  /*
   There are 2 main resource URLs, '/trains' and '/stations'.
   All subresource URLs start with either of them:
  */
  if (url && url.startsWith("/trains")) {
    /*
     Get all URL parameters:
    */
    const splitUrl = url.split("/");
    if (!splitUrl[2]) {
      try {
        const json = await fs.readFile("./trains.json", "utf-8");
        const data: Train[] = JSON.parse(json) as Train[];
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error reading/filtering trains data:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
    /*
     If it looks like a direction:
    */
    if (splitUrl[2].length === 1) {
      const direction: "1" | "2" = splitUrl[2] as "1" | "2";
      if (direction !== "1" && direction !== "2") {
        res.statusCode = 422;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ error: "Invalid direction - 1 or 2 only" })
        );
      } else {
        const frequency: "ed" | "wd" | "wh" | undefined = splitUrl[3] as
          | "ed"
          | "wd"
          | "wh"
          | undefined;
        try {
          const json = await fs.readFile("./trains.json", "utf-8");
          const data: Train[] = JSON.parse(json) as Train[];
          return filterTrainsByDirectionAndFrequency(
            res,
            data,
            direction,
            frequency
          );
        } catch (error) {
          console.error("Error reading/filtering trains data:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Internal server error" }));
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
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return filterTrainsById(res, data, trainId);
      } catch (error) {
        console.error("Error reading/filtering trains data:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
  } else if (url && url.startsWith("/stations")) {
    const splitUrl = url.split("/");
    if (!splitUrl[2]) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      try {
        const json = await fs.readFile("./stations.json", "utf-8");
        return res.end(json);
      } catch (error) {
        console.error("Error reading stations.json:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Internal server error" }));
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
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    try {
      const json = await fs.readFile("./stations.json", "utf-8");
      const data: Station[] = JSON.parse(json).stations;
      return filterStationsData(res, data, stationName, direction, frequency);
    } catch (error) {
      console.error("Error reading/filtering stations data:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  } else if (url && url.startsWith("/departures")) {
    const splitUrl = url.split("/");
    if (!splitUrl[2] || !splitUrl[3] || !splitUrl[4] || !splitUrl[5]) {
      res.statusCode = 422;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          error: "Please include all required parameters",
        })
      );
    }
    const from = splitUrl[2].split("-").join(" ") as StationName;
    const to = splitUrl[3].split("-").join(" ") as StationName;
    const date = splitUrl[4] as YyyyMmDd;
    const time = splitUrl[5] as Time;
    try {
      const json = await fs.readFile("./stations.json", "utf-8");
      const data: Station[] = JSON.parse(json).stations;
      return getDeparturesAndArrivalsByDepartureDateAndTime(
        res,
        data,
        from,
        to,
        date,
        time
      );
    } catch (error) {
      console.error("Error reading/filtering stations data:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  } else if (url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({ message: "Welcome to the train schedule API!" })
    );
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
