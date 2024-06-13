const {
  stationsJson,
  trainsJson,
  isStationNameValid,
  getStation,
  isDirectionValid,
  isFrequencyValid,
  getDeparturesInDirection,
  getDeparturesByFrequency,
} = require("./index");

function test(title, callback) {
  console.log(title);
  callback();
}

const stations = JSON.parse(stationsJson).stations;
const trains = JSON.parse(trainsJson);

test("isStationNameValid()", () => {
  test(` invalid station name`, () => {
    const invalidName = "abc";
    if (!isStationNameValid(invalidName)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isStationNameValid(invalidName));
    }
  });

  test(` valid station name`, () => {
    const validName = "altina";
    if (isStationNameValid(validName)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isStationNameValid(validName));
    }
  });
});

test("getStation()", () => {
  test(` gets a station`, () => {
    const station = getStation("altina", stations);
    if (station.name === "altina") {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(station);
    }
  });
});

test("isDirectionValid()", () => {
  test(` valid direction`, () => {
    const direction = 1;
    if (isDirectionValid(direction)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isDirectionValid(direction));
    }
  });
  test(` invalid direction`, () => {
    const direction = 0;
    if (!isDirectionValid(direction)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isDirectionValid(direction));
    }
  });
});

test("isFrequencyValid()", () => {
  test(` valid frequency`, () => {
    const frequency = "ed";
    if (isFrequencyValid(frequency)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isFrequencyValid(frequency));
    }
  });
  test(` invalid frequency`, () => {
    const frequency = "ww";
    if (!isFrequencyValid(frequency)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isFrequencyValid(frequency));
    }
  });
});

test("getDeparturesInDirection()", () => {
  test(` get correct departures`, () => {
    const direction = 2;
    const departures = getDeparturesInDirection(
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

test("getDeparturesByFrequency()", () => {
  test(` get correct departures`, () => {
    const frequency = false;
    const departures = getDeparturesByFrequency(
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
