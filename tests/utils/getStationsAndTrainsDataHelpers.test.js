const {
  stationsJson,
  trainsJson,
  trainStationHelp,
  extracted,
} = require("./index");

function test(title, callback) {
  console.log(title);
  callback();
}

const stations = JSON.parse(stationsJson).stations;
const trains = JSON.parse(trainsJson);

test("trainStationHelp.isStationNameValid()", () => {
  test(` invalid station name`, () => {
    const invalidName = "abc";
    if (!trainStationHelp.isStationNameValid(invalidName)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(trainStationHelp.isStationNameValid(invalidName));
    }
  });

  test(` valid station name`, () => {
    const validName = "altina";
    if (trainStationHelp.isStationNameValid(validName)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(trainStationHelp.isStationNameValid(validName));
    }
  });
});

test("trainStationHelp.getStation()", () => {
  test(` gets a station`, () => {
    const station = trainStationHelp.getStation("altina", stations);
    if (station.name === "altina") {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(station);
    }
  });
});

test("trainStationHelp.isDirectionValid()", () => {
  test(` valid direction`, () => {
    const direction = 1;
    if (trainStationHelp.isDirectionValid(direction)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(trainStationHelp.isDirectionValid(direction));
    }
  });
  test(` invalid direction`, () => {
    const direction = 0;
    if (!trainStationHelp.isDirectionValid(direction)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(trainStationHelp.isDirectionValid(direction));
    }
  });
});

test("trainStationHelp.isFrequencyValid()", () => {
  test(` valid frequency`, () => {
    const frequency = "ed";
    if (trainStationHelp.isFrequencyValid(frequency)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(trainStationHelp.isFrequencyValid(frequency));
    }
  });
  test(` invalid frequency`, () => {
    const frequency = "ww";
    if (!trainStationHelp.isFrequencyValid(frequency)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(trainStationHelp.isFrequencyValid(frequency));
    }
  });
});

test("trainStationHelp.getDeparturesInDirection()", () => {
  test(` get correct departures`, () => {
    const direction = 2;
    const departures = trainStationHelp.getDeparturesInDirection(
      stations[1].departures,
      direction
    );
    if (departures[0].trainDetails.directionId === direction) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(departures[0].trainDetails.directionId);
    }
  });
});

test("trainStationHelp.getDeparturesByFrequency()", () => {
  test(` get correct departures`, () => {
    const frequency = false;
    const departures = trainStationHelp.getDeparturesByFrequency(
      stations[1].departures,
      frequency
    );
    if (departures[0].trainDetails.activeOnWeekendsAndHolidays === frequency) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(departures[0].trainDetails.activeOnWeekendsAndHolidays);
    }
  });
});

test("trainStationHelp.getFrequency()", () => {
  test(` gets right frequency`, () => {
    const f = trainStationHelp.getFrequency("ed");
    if (f === true) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(f);
    }
  });
});

test("trainStationHelp.getTrainsByFrequency()", () => {
  test(` gets trains by frequency correctly`, () => {
    const frequency = "wh";
    const result = trainStationHelp.getTrainsByFrequency(
      trainStationHelp.getTrainsByDirection(trains, 2),
      frequency
    );
    if (result[0].activeOnWeekendsAndHolidays === "w&h_only") {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result[0].activeOnWeekendsAndHolidays);
    }
  });
});

test("trainStationHelp.getTrainsByDirection()", () => {
  test(` gets trains by direction correctly`, () => {
    const direction = 2;
    const result = trainStationHelp.getTrainsByDirection(trains, direction);
    if (result[0].directionId === direction) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result[0].directionId);
    }
  });
});

test("trainStationHelp.isTrainIdValid()", () => {
  test(` invalid train id`, () => {
    const result = trainStationHelp.isTrainIdValid(
      [...extracted.trainIdDirection1, ...extracted.trainIdDirection2],
      2222
    );
    if (!result) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
  test(` valid train id`, () => {
    const result = trainStationHelp.isTrainIdValid(
      [...extracted.trainIdDirection1, ...extracted.trainIdDirection2],
      8003
    );
    if (result) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
});
