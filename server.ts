import http from "http";
import fs from "fs";

const port = process.env.PORT || 3003;

const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain");
    res.end("405 Method Not Allowed");
    return;
  }
  if (url === "/trains") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./trains.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      return res.end(data);
    });
  } else if (url && url.startsWith("/trains/")) {
    const splitUrl = url.split("/");
    const directionOrTrainId = Number(splitUrl[2]);
    const frequency = splitUrl[3];
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./trains.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      const trains = JSON.parse(data);
      return filterTrainsData(res, trains, directionOrTrainId, frequency);
    });
  } else if (url === "/stations") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./stations.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      const stations = JSON.parse(data).stations;
      return res.end(JSON.stringify(stations, null, 2));
    });
  } else if (url && url.startsWith("/stations/")) {
    const splitUrl = url.split("/");
    const station = splitUrl[2].split("-").join(" ");
    const direction = Number(splitUrl[3]);
    const frequency = splitUrl[4];
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./stations.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      const stations = JSON.parse(data).stations;
      return filterStationsData(res, stations, station, direction, frequency);
    });
  } else if (url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Welcome to the API!");
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found");
  }
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const getData_stations = (
