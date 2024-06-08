import {
  dataStrDirection1,
  dataStrDirection2,
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stations,
  stationsFormatted,
} from "./data/extractedData";

import shape from "./shapeData";

const departureTimesDirection1 = shape.extractDepartureTimes(dataStrDirection1);
const departureTimesDirection2 = shape.extractDepartureTimes(dataStrDirection2);

const timetableMatrixDirection1 = shape.createTimetableMatrixDirection1(
  departureTimesDirection1,
  stations,
  trainIdDirection1
);

const timetableMatrixDirection2 = shape.createTimetableMatrixDirection2(
  departureTimesDirection2,
  stations.length,
);

const trainsDataShaped = shape.trainsData(
  trainIdDirection1,
  trainIdDirection2,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
  stations,
  timetableMatrixDirection1,
  timetableMatrixDirection2
);

const stationsDataShaped = shape.stationsData(
  stations,
  stationsFormatted,
  trainsDataShaped
);

shape.writeTrainsEndpoint(trainsDataShaped);

shape.writeStationsEndpoint(stationsDataShaped);
