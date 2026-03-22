import {
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
  ovcaZemunResnikMladenovac,
  stationNamesDisplayMap
} from "./data/extractedData";

import shape from "./shapeData";

const allTrains = shape.trainsData(batajnicaOvca, ovcaZemunResnikLazarevac, ovcaZemunResnikMladenovac)

const allStations = shape.stationsData(stationNamesDisplayMap, allTrains)

shape.writeTrainsEndpoint(allTrains);

shape.writeStationsEndpoint(allStations)
