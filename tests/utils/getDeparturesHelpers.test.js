const fs = require("node:fs");
const {
  isDatePatternValid,
  isTimePatternValid,
  getServiceFrequencyArray,
  getTimeOutputFormat,
} = require("./index");

function test(title, callback) {
  console.log(title);
  callback();
}

const json = fs.readFileSync("stations.json", "utf-8");
let stations = JSON.parse(json).stations;

test("isDatePatternValid()", () => {
  test(` invalid day of month`, () => {
    const invalidDay = "2026-02-30";
    if (!isDatePatternValid(invalidDay)) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isDatePatternValid(invalidDay));
    }
  });
  test(` invalid month`, () => {
    if (!isDatePatternValid("2026-33-30")) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
      console.log(isDatePatternValid("2026-33-30"));
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

test("getServiceFrequencyArray()", () => {
  // NOTE: Currently obsolete, no departures for weekends and holidays exclusively
  // test(` for weekends and holidays`, () => {
  //   if (getServiceFrequencyArray("2026-01-07").join(",") === "ed,wh) {
  //     console.log(`  ✅`);
  //   } else {
  //     console.log(`  ❌`);
  //   }
  // });
  test(` for work days`, () => {
    const mondayToFridayDate = "2026-02-03";
    if (getServiceFrequencyArray(mondayToFridayDate).join(",") === "ed,wd") {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
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
          serviceFrequency: "wd",
        },
      }) === "11:20"
    ) {
      console.log(`  ✅`);
    } else {
      console.log(`  ❌`);
    }
  });
});
