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
  } else if (url === "/stations") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./stations.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      return res.end(data);
    });
  } else if (url && url.startsWith("/stations/")){
    const station = url.split('/')[2];
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./stations.json", "utf-8", (err, data) => {
      if (err) {
        return res.end(err);
      }
      const json = JSON.parse(data);
      return res.end(JSON.stringify(json.stations[station]));
    });
  } else if (url === "/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Welcome to the API!")
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
