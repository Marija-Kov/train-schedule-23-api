const path = require("node:path");
const fs = require("node:fs");

const shape = require("../../dist/utils/dataShapers/shapeData");
const {
  batajnicaOvca,
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
} = require("../../dist/utils/getStationsAndTrainsDataHelpers");

const {
  isDatePatternValid,
  isTimePatternValid,
  getServiceFrequencyArray,
  getIndexOfSelectedStation,
  getDirectionAndStationIndexes,
  narrowDownSelection,
  shapeToOutputFormat,
  getResultFromTrainIdOverlaps,
  getTimeOutputFormat,
  getStationIndexesIfDirectionIs2,
} = require("../../dist/utils/getDeparturesHelpers.js");

module.exports = {
  shape,
  batajnicaOvca,
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
  getIndexOfSelectedStation,
  getDirectionAndStationIndexes,
  narrowDownSelection,
  shapeToOutputFormat,
  getResultFromTrainIdOverlaps,
  getTimeOutputFormat,
  getStationIndexesIfDirectionIs2,
};
