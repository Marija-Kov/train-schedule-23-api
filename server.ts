import http from "http";
import { promises as fs } from "fs";
import { filterStationsData, filterTrainsData } from "./filterData";

const port = process.env.PORT || 3003;

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  if (method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "405 Method Not Allowed" }));
  }
  if (url && url.startsWith("/trains")) {
    const splitUrl = url.split("/");
    if (!splitUrl[2]) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      try {
        const json = await fs.readFile("./trains.json", "utf-8");
        return res.end(json);
      } catch (error) {
        console.error("Error reading trains.json:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
    const directionOrTrainId = Number(splitUrl[2]);
    const frequency = splitUrl[3];
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    try {
      const json = await fs.readFile("./trains.json", "utf-8");
      const data = JSON.parse(json);
      return filterTrainsData(res, data, directionOrTrainId, frequency);
    } catch (error) {
      console.error("Error reading/filtering trains data:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Internal server error" }));
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
    const station = splitUrl[2].split("-").join(" ");
    const direction = (() => {
      if (!splitUrl[3]) return undefined;
      if (splitUrl[3] === "") return NaN;
      return Number(splitUrl[3]);
    })();
    const frequency = splitUrl[4];
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    try {
      const json = await fs.readFile("./stations.json", "utf-8");
      const data = JSON.parse(json).stations;
      return filterStationsData(res, data, station, direction, frequency);
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
