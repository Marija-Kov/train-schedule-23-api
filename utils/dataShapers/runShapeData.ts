import {
  batajnica_ovca,
  ovca_batajnica,
  train_id_batajnica_ovca,
  train_id_ovca_batajnica,
  train_frequency_batajnica_ovca,
  train_frequency_ovca_batajnica,
  stationsNames,
  stationsDisplay,
} from "./data/extractedData";

import shape from "./shapeData";

const departureTimesDirection1 = shape.extractDepartureTimes(batajnica_ovca);
const departureTimesDirection2 = shape.extractDepartureTimes(ovca_batajnica);

const timetableMatrixDirection1 = shape.createTimetableMatrix(departureTimesDirection1);
const timetableMatrixDirection2 = shape.createTimetableMatrix(departureTimesDirection2);

const trainsDataShaped = shape.trainsData(
  train_id_batajnica_ovca,
  train_id_ovca_batajnica,
  train_frequency_batajnica_ovca,
  train_frequency_ovca_batajnica,
  stationsNames,
  timetableMatrixDirection1,
  timetableMatrixDirection2
);

const stationsDataShaped = shape.stationsData(
  stationsNames,
  stationsDisplay,
  trainsDataShaped
);

shape.writeTrainsEndpoint(trainsDataShaped);

shape.writeStationsEndpoint(stationsDataShaped);
