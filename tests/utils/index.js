const shape = require("../../dist/utils/dataShapers/shapeData");
const {
  dataStrDirection1,
  dataStrDirection2,
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stations,
  stationsFormatted,
} = require("../../dist/utils/dataShapers/data/extractedData");

module.exports = {
  shape,
  dataStrDirection1,
  dataStrDirection2,
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stations,
  stationsFormatted,
};
