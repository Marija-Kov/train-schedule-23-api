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
      return getData_trains(res, trains, directionOrTrainId, frequency);
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
      return getData_stations(res, stations, station, direction, frequency);
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
  res: any,
  stations: any[],
  station: string,
  direction: number,
  frequency: string
) => {
  if (frequency) {
    let activeOnWeekendsAndHolidays: any;
    switch (frequency) {
      case "wh":
        activeOnWeekendsAndHolidays = "w&h_only";
        break;
      case "ed":
        activeOnWeekendsAndHolidays = true;
        break;
      case "wd":
        activeOnWeekendsAndHolidays = false;
        break;
      default:
        undefined;
    }
    for (let s of stations) {
      if (s.name === station) {
        return (() => {
          let departures: any[] = [];
          for (let departure of s.departures) {
            if (
              departure.trainDetails.directionId === direction &&
              departure.trainDetails.activeOnWeekendsAndHolidays ===
                activeOnWeekendsAndHolidays
            ) {
              departures.push(departure);
            }
          }
          return res.end(JSON.stringify(departures, null, 2));
        })();
      }
    }
  } else if (direction) {
    for (let s of stations) {
      if (s.name === station) {
        return (() => {
          let departures: any[] = [];
          for (let departure of s.departures) {
            if (departure.trainDetails.directionId === direction) {
              departures.push(departure);
            }
          }
          return res.end(JSON.stringify(departures, null, 2));
        })();
      }
    }
  } else {
    for (let s of stations) {
      if (s.name === station) {
        return res.end(JSON.stringify(s, null, 2));
      }
    }
  }
};

const getData_trains = (
  res: any,
  trains: any[],
  directionOrTrainId: number,
  frequency: string
) => {
  if (frequency) {
    let activeOnWeekendsAndHolidays: any;
    switch (frequency) {
      case "wh":
        activeOnWeekendsAndHolidays = "w&h_only";
        break;
      case "ed":
        activeOnWeekendsAndHolidays = true;
        break;
      case "wd":
        activeOnWeekendsAndHolidays = false;
        break;
      default:
        undefined;
    }
    let result: any[] = [];
    for (let train in trains) {
      if (
        trains[train].directionId === directionOrTrainId &&
        trains[train].activeOnWeekendsAndHolidays ===
          activeOnWeekendsAndHolidays
      ) {
        result.push(trains[train]);
      }
    }
    return res.end(JSON.stringify(result, null, 2));
  }

  if (directionOrTrainId.toString().length === 4) {
    return res.end(JSON.stringify(trains[directionOrTrainId], null, 2));
  } else if ([1, 2].includes(directionOrTrainId)) {
    let result: any[] = [];
    for (let train in trains) {
      if (trains[train].directionId === directionOrTrainId) {
        result.push(trains[train]);
      }
    }
    return res.end(JSON.stringify(result, null, 2));
  }
};
