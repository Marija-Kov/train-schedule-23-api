import {
  dataStrDirection1,
  dataStrDirection2,
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stationsNames,
  stationsFormatted,
} from "./data/extractedData";

import shape from "./shapeData";

const departureTimesDirection1 = shape.extractDepartureTimes(dataStrDirection1);
const departureTimesDirection2 = shape.extractDepartureTimes(dataStrDirection2);

const timetableMatrixDirection1 = shape.createTimetableMatrix(departureTimesDirection1);
const timetableMatrixDirection2 = shape.createTimetableMatrix(departureTimesDirection2);

const trainsDataShaped = shape.trainsData(
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stationsNames,
  timetableMatrixDirection1,
  timetableMatrixDirection2
);

const stationsDataShaped = shape.stationsData(
  stationsNames,
  stationsFormatted,
  trainsDataShaped
);

shape.writeTrainsEndpoint(trainsDataShaped);

shape.writeStationsEndpoint(stationsDataShaped);
