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
    let trainId = "";
    let direction = 0;
    const splitUrl = url.split("/");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./trains.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      const trains = JSON.parse(data);
      /* Train by ID number */
      if (splitUrl[2].length > 2) {
        trainId = splitUrl[2];
        return res.end(JSON.stringify(trains[trainId], null, 2));
        /* Trains by direction */
      } else if (splitUrl[2] === "1" || splitUrl[2] === "2") {
        direction = Number(splitUrl[2]);
        let result: any[] = [];
        /* Trains active on weekends and holidays in the given direction */
        if (splitUrl[3] && splitUrl[3] === "wh") {
          for (let train in trains) {
            if (
              trains[train].directionId === direction &&
              trains[train].activeOnWeekendsAndHolidays === "w&h_only"
            ) {
              result.push(trains[train]);
            }
          }
          return res.end(JSON.stringify(result, null, 2));
          /* Trains active every day in the given direction */
        } else if (splitUrl[3] && splitUrl[3] === "ed") {
          for (let train in trains) {
            if (
              trains[train].directionId === direction &&
              trains[train].activeOnWeekendsAndHolidays === true
            ) {
              result.push(trains[train]);
            }
          }
          return res.end(JSON.stringify(result, null, 2));
          /* Trains active Monday to Friday in the given direction */
        } else if (splitUrl[3] && splitUrl[3] === "wd") {
          for (let train in trains) {
            if (
              trains[train].directionId === direction &&
              trains[train].activeOnWeekendsAndHolidays === false
            ) {
              result.push(trains[train]);
            }
          }
          return res.end(JSON.stringify(result, null, 2));
        } else {
          for (let train in trains) {
            if (trains[train].directionId === direction) {
              result.push(trains[train]);
            }
          }
          return res.end(JSON.stringify(result, null, 2));
        }
      }
    });
  } else if (url === "/stations") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./stations.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      return res.end(data);
    });
  } else if (url && url.startsWith("/stations/")) {
    const station = url.split("/")[2];
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./stations.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      const json = JSON.parse(data);
      return res.end(JSON.stringify(json.stations[station]));
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
