const fs = require("node:fs");
const { departureHelp } = require("./index.js");

function test(title, callback) {
  console.log(title);
  callback();
}

const json = fs.readFileSync("../../stations.json", "utf-8");
let stations = JSON.parse(json).stations;

test("departureHelp.isDatePatternValid()", () => {
  test(` invalid day of month`, () => {
    const invalidDay = "2024-02-30";
    if (!departureHelp.isDatePatternValid(invalidDay)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(departureHelp.isDatePatternValid(invalidDay));
    }
  });
  test(` invalid month`, () => {
    if (!departureHelp.isDatePatternValid("2024-33-30")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(departureHelp.isDatePatternValid("2024-33-30"));
    }
  });
});

test("departureHelp.isTimePatternValid()", () => {
  test(` invalid time pattern`, () => {
    if (!departureHelp.isTimePatternValid("00:01")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(departureHelp.isTimePatternValid("00:01"));
    }
  });
  test(` valid time pattern`, () => {
    if (departureHelp.isTimePatternValid("00.01")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
});

test("departureHelp.getFrequencyArray()", () => {
  test(` for weekends and holidays`, () => {
    if (
      departureHelp.getFrequencyArray("2024-01-07").join(",") ===
      "true,w&h_only"
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
  test(` for work days`, () => {
    if (
      departureHelp.getFrequencyArray("2024-02-01").join(",") === "true,false"
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
});

test("departureHelp.getDirectionAndStationIndexes()", () => {
  test(` gets correct indexes and direction`, () => {
    const result = departureHelp.getDirectionAndStationIndexes(
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

test("departureHelp.getIndexOfSelectedStation()", () => {
  test(` gets correct index`, () => {
    const index = departureHelp.getIndexOfSelectedStation("altina", stations);
    if (index === 3) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(index);
    }
  });
});

test("departureHelp.narrowDownSelection()", () => {
  test(` narrows down selection by given criteria`, () => {
    const result = departureHelp.narrowDownSelection(3, "19.05", stations, 2, [
      true,
      false,
    ]);
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

test("departureHelp.shapeToOutputFormat()", () => {
  test(` shapes output object correctly`, () => {
    const result = departureHelp.shapeToOutputFormat([
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

test("departureHelp.getResultFromTrainIdOverlaps()", () => {
  test(` gets correct final search result`, () => {
    const result = departureHelp.getResultFromTrainIdOverlaps(
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

test("departureHelp.getTimeOutputFormat()", () => {
  test(` formats time correctly`, () => {
    if (
      departureHelp.getTimeOutputFormat({
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

test("departureHelp.getStationIndexesIfDirectionIs2()", () => {
  test(` gets indexes of given stations in direction 2`, () => {
    let indexFrom = 4;
    let indexTo = 1;
    let stationsCount = 15;
    const result = departureHelp.getStationIndexesIfDirectionIs2(
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
