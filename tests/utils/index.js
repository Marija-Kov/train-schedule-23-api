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

const fs = require("node:fs");
const stationsJson = fs.readFileSync("../../stations.json", "utf-8");
const trainsJson = fs.readFileSync("../../trains.json", "utf-8");

const {
  isStationNameValid,
  getStation,
  isDirectionValid,
  isFrequencyValid,
  getDeparturesInDirection,
  getDeparturesByFrequency,
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
};
