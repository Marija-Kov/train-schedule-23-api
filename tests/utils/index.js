const path = require("node:path");
const fs = require("node:fs");

const shape = require("../../dist/utils/dataShapers/shapeData");
const {
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
  stationNamesDisplayMap
} = require("../../dist/utils/dataShapers/data/extractedData");

const stationsJson = fs.readFileSync(
  path.join(__dirname, "../../stations.json"),
  "utf-8"
);
const trainsJson = fs.readFileSync(
  path.join(__dirname, "../../trains.json"),
  "utf-8"
);

const {
  isStationNameValid,
  getStation,
  isDirectionValid,
  isFrequencyValid,
  getDeparturesInDirection,
  getDeparturesByFrequency,
  getTrainsByFrequency,
  getTrainsByDirection,
  isTrainIdValid,
} = require("../../dist/utils/getStationsAndTrainsDataHelpers.js");

const {
  isDatePatternValid,
  isTimePatternValid,
  getServiceFrequencyArray,
} = require("../../dist/utils/getDeparturesHelpers.js");

module.exports = {
  shape,
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
  stationNamesDisplayMap,
  stationsJson,
  trainsJson,
  isStationNameValid,
  getStation,
  isDirectionValid,
  isFrequencyValid,
  getDeparturesInDirection,
  getDeparturesByFrequency,
  getTrainsByFrequency,
  getTrainsByDirection,
  isTrainIdValid,
  isDatePatternValid,
  isTimePatternValid,
  getServiceFrequencyArray,
};
