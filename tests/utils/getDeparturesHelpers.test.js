const fs = require("node:fs");
const {
  isDatePatternValid,
  isTimePatternValid,
  getFrequencyArray,
  getIndexOfSelectedStation,
  getDirectionAndStationIndexes,
  narrowDownSelection,
  shapeToOutputFormat,
  getResultFromTrainIdOverlaps,
  getTimeOutputFormat,
  getStationIndexesIfDirectionIs2,
} = require("./index");

function test(title, callback) {
  console.log(title);
  callback();
}

const json = fs.readFileSync("../../stations.json", "utf-8");
let stations = JSON.parse(json).stations;

test("isDatePatternValid()", () => {
  test(` invalid day of month`, () => {
    const invalidDay = "2025-02-30";
    if (!isDatePatternValid(invalidDay)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isDatePatternValid(invalidDay));
    }
  });
  test(` invalid month`, () => {
    if (!isDatePatternValid("2025-33-30")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isDatePatternValid("2025-33-30"));
    }
  });
});

test("isTimePatternValid()", () => {
  test(` invalid time pattern`, () => {
    if (!isTimePatternValid("00:01")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isTimePatternValid("00:01"));
    }
  });
  test(` valid time pattern`, () => {
    if (isTimePatternValid("00.01")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
});

test("getFrequencyArray()", () => {
  test(` for weekends and holidays`, () => {
    if (getFrequencyArray("2025-01-07").join(",") === "true,w&h_only") {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
  test(` for work days`, () => {
    const mondayToFridayDate = "2025-02-03";
    if (getFrequencyArray(mondayToFridayDate).join(",") === "true,false") {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
});

test("getDirectionAndStationIndexes()", () => {
  test(` gets correct indexes and direction`, () => {
    const result = getDirectionAndStationIndexes(
      "altina",
      "kamendin",
      stations
    );
    if (
      result.indexFrom === 3 &&
      result.indexTo === 1 &&
      result.direction === 2
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
});

test("getIndexOfSelectedStation()", () => {
  test(` gets correct index`, () => {
    const index = getIndexOfSelectedStation("altina", stations);
    if (index === 3) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(index);
    }
  });
});

test("narrowDownSelection()", () => {
  test(` narrows down selection by given criteria`, () => {
    const result = narrowDownSelection(3, "19.05", stations, 2, [true, false]);
    if (
      result.length < stations.length &&
      result[0].time >= 19.05 &&
      result[0].trainDetails
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
});

test("shapeToOutputFormat()", () => {
  test(` shapes output object correctly`, () => {
    const result = shapeToOutputFormat([
      {
        time: 21.47,
        trainDetails: {
          id: 7116,
          directionId: 2,
          activeOnWeekendsAndHolidays: false,
        },
      },
    ]);
    if (result[0].departureTime && result[0].arrivalTime && result[0].trainId) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
});

test("getResultFromTrainIdOverlaps()", () => {
  test(` gets correct final search result`, () => {
    const result = getResultFromTrainIdOverlaps(
      [
        {
          departureTime: "11:00",
          arrivalTime: "00:01",
          trainId: 7116,
        },
      ],
      [
        {
          time: 11.3,
          trainDetails: {
            id: 7116,
            directionId: 2,
            activeOnWeekendsAndHolidays: false,
          },
        },
        {
          time: 11.2,
          trainDetails: {
            id: 8003,
            directionId: 2,
            activeOnWeekendsAndHolidays: false,
          },
        },
      ]
    );
    if (result.length === 1) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
});

test("getTimeOutputFormat()", () => {
  test(` formats time correctly`, () => {
    if (
      getTimeOutputFormat({
        time: 11.2,
        trainDetails: {
          id: 8003,
          directionId: 2,
          activeOnWeekendsAndHolidays: false,
        },
      }) === "11:20"
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
});

test("getStationIndexesIfDirectionIs2()", () => {
  test(` gets indexes of given stations in direction 2`, () => {
    let indexFrom = 4;
    let indexTo = 1;
    let stationsCount = 15;
    const result = getStationIndexesIfDirectionIs2(
      2,
      indexFrom,
      indexTo,
      stations
    );
    if (
      result.indexFrom === stationsCount - 1 - indexFrom &&
      result.indexTo === stationsCount - 1 - indexTo
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(result);
    }
  });
});
