import {
    dataStr_direction1,
    dataStr_direction2,
    trainId_d1,
    trainId_d2,
    trainIdActiveOnWeekendsAndHolidays_d1,
    trainIdActiveOnWeekendsAndHolidays_d2,
    stations,
    stationsFormatted,
    holidays
} from './rawData'

import {
    extractDepartureTimes,
    createTimetableMatrix_d1,
    createTimetableMatrix_d2,
    shapeTrainsData,
    shapeStationsData,
    writeTrainsEndpoint,
    writeStationsEndpoint
} from './functions'

const departureTimes_d1 = extractDepartureTimes(dataStr_direction1);
const departureTimes_d2 = extractDepartureTimes(dataStr_direction2);

const timetableMatrix_d1 = 
 createTimetableMatrix_d1(
   departureTimes_d1,
   stations,
   trainId_d1
 );

const timetableMatrix_d2 = 
 createTimetableMatrix_d2(
   departureTimes_d2,
   stations,
   trainId_d2
 );

const trainsDataShaped = 
 shapeTrainsData(
   trainId_d1,
   trainId_d2,
   trainIdActiveOnWeekendsAndHolidays_d1,
   trainIdActiveOnWeekendsAndHolidays_d2,
   stations,
   timetableMatrix_d1,
   timetableMatrix_d2 
 );

const stationsDataShaped =
 shapeStationsData(
   stations,
   stationsFormatted,
   trainsDataShaped
 );

 writeTrainsEndpoint(
  trainsDataShaped,
)

 writeStationsEndpoint(
   stationsDataShaped,
   holidays
 )

