const path = require("node:path");
const fs = require("node:fs");

module.exports.shape = require("../../dist/utils/dataShapers/shapeData");

module.exports.extracted = require("../../dist/utils/dataShapers/data/extractedData");

module.exports.departureHelp = require("../../dist/utils/getDeparturesHelpers.js");

module.exports.trainStationHelp = require("../../dist/utils/getStationsAndTrainsDataHelpers.js");

module.exports.stationsJson = fs.readFileSync(
  path.join(__dirname, "../../stations.json"),
  "utf-8"
);

module.exports.trainsJson = fs.readFileSync(
  path.join(__dirname, "../../trains.json"),
  "utf-8"
);
