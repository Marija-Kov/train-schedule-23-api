import {
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
  stationNamesDisplayMap
} from "./data/extractedData";

import shape from "./shapeData";

const allTrains = shape.trainsData(batajnicaOvca, ovcaZemunResnikLazarevac)

const allStations = shape.stationsData(stationNamesDisplayMap, allTrains)

shape.writeTrainsEndpoint(allTrains);

shape.writeStationsEndpoint(allStations)
