const path = require("node:path");
const fs = require("node:fs");

const shape = require("../../dist/utils/dataShapers/shapeData");
const {
  dataStrDirection1,
  dataStrDirection2,
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stationsNames,
  stationsFormatted,
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
  getFrequency
} = require("../../dist/utils/getStationsAndTrainsDataHelpers");

module.exports = {
  shape,
  dataStrDirection1,
  dataStrDirection2,
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stationsNames,
  stationsFormatted,
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
  getFrequency
};
