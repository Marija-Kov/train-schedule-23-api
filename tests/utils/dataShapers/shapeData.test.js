const {
  shape,
  trainIdActiveOnWeekendsAndHolidaysDirection1,
  trainIdActiveOnWeekendsAndHolidaysDirection2,
} = require("../index.js");
const {
  dataStrDirection1,
  dataStrDirection2,
  stationsNames,
  stationsFormatted,
  trainIdDirection1,
  trainIdDirection2,
} = require("../index.js");

function test(title, callback) {
  console.log(title);
  callback();
}

test("createTimetableMatrix()", () => {
  test(` matrix created correctly for direction 1`, () => {
    const data = shape.default.createTimetableMatrix(
      shape.default.extractDepartureTimes(dataStrDirection1)
    );
    if (
      data[0].join(",") ===
      "n/a,n/a,6.00,6.30,n/a,7.10,7.30,8.00,8.30,8.57,9.30,n/a,10.10,11.20,12.00,13.20,14.00,14.30,15.10,15.30,n/a,16.00,16.30,n/a,17.10,17.30,18.30,19.10,20.00"
    ) {
      console.log(`  batajnica ✅`);
    } else {
      console.log(`  batajnica ❌`);
      console.log(data[0].join(","));
    }
    if (
      data[1].join(",") ===
      "n/a,n/a,6.04,6.34,n/a,7.14,7.34,8.04,8.34,9.01,9.34,n/a,10.14,11.24,12.04,13.24,14.04,14.34,15.14,15.34,n/a,16.04,16.34,n/a,17.14,17.34,18.34,19.14,20.04"
    ) {
      console.log(`  kamendin ✅`);
    } else {
      console.log(`  kamendin ❌`);
      console.log(data[1].join(","));
    }
    if (
      data[2].join(",") ===
      "n/a,n/a,6.06,6.36,n/a,7.16,7.36,8.06,8.36,9.03,9.36,n/a,10.16,11.26,12.06,13.26,14.06,14.36,15.16,15.36,n/a,16.06,16.36,n/a,17.16,17.36,18.36,19.16,20.06"
    ) {
      console.log(`  zemunsko polje ✅`);
    } else {
      console.log(`  zemunsko polje ❌`);
      console.log(data[2].join(","));
    }
    if (
      data[3].join(",") ===
      "n/a,n/a,6.08,6.38,n/a,7.18,7.38,8.08,8.38,9.05,9.38,n/a,10.18,11.28,12.08,13.28,14.08,14.38,15.18,15.38,n/a,16.08,16.38,n/a,17.18,17.38,18.38,19.18,20.08"
    ) {
      console.log(`  altina ✅`);
    } else {
      console.log(`  altina ❌`);
      console.log(data[3].join(","));
    }
    if (
      data[4].join(",") ===
      "3.44,4.10,6.12,6.42,7.15,7.22,7.42,8.12,8.42,9.18,9.42,9.47,10.22,11.32,12.12,13.32,14.12,14.42,15.22,15.42,16.16,16.12,16.42,16.37,17.22,17.42,18.42,19.22,20.12"
    ) {
      console.log(`  zemun ✅`);
    } else {
      console.log(`  zemun ❌`);
      console.log(data[4].join(","));
    }
    if (
      data[5].join(",") ===
      "3.47,4.13,6.16,6.46,7.18,7.26,7.46,8.16,8.46,9.22,9.46,9.50,10.26,11.36,12.16,13.36,14.16,14.46,15.26,15.46,16.20,16.16,16.46,16.40,17.26,17.46,18.46,19.26,20.16"
    ) {
      console.log(`  tosin bunar ✅`);
    } else {
      console.log(`  tosin bunar ❌`);
      console.log(data[5].join(","));
    }
    if (
      data[6].join(",") ===
      "3.49,4.15,6.19,6.49,7.21,7.29,7.49,8.19,8.49,9.25,9.49,9.53,10.29,11.39,12.19,13.39,14.19,14.49,15.29,15.49,16.23,16.19,16.49,16.43,17.29,17.49,18.49,19.29,20.19"
    ) {
      console.log(`  novi beograd ✅`);
    } else {
      console.log(`  novi beograd ❌`);
      console.log(data[6].join(","));
    }
    if (
      data[7].join(",") ===
      "3.54,4.20,6.23,6.53,7.24,7.33,7.53,8.23,8.53,9.29,9.53,9.57,10.33,11.43,12.23,13.43,14.23,14.53,15.33,15.53,16.27,16.23,16.53,16.47,17.33,17.53,18.53,19.33,20.23"
    ) {
      console.log(`  beograd centar ✅`);
    } else {
      console.log(`  beograd centar ❌`);
      console.log(data[7].join(","));
    }
    if (
      data[8].join(",") ===
      "n/a,n/a,6.27,6.57,n/a,7.37,7.57,8.27,8.57,9.33,9.57,n/a,10.37,11.47,12.27,13.47,14.27,14.57,15.37,15.57,n/a,16.27,16.57,n/a,17.37,17.57,18.57,19.37,20.27"
    ) {
      console.log(`  karadjordjev park ✅`);
    } else {
      console.log(`  karadjordjev park ❌`);
      console.log(data[8].join(","));
    }
    if (
      data[9].join(",") ===
      "n/a,n/a,6.31,7.01,n/a,7.41,8.01,8.31,9.01,9.37,10.01,n/a,10.41,11.51,12.31,13.51,14.31,15.01,15.41,16.01,n/a,16.31,17.01,n/a,17.41,18.01,19.01,19.41,20.31"
    ) {
      console.log(`  vukov spomenik ✅`);
    } else {
      console.log(`  vukov spomenik ❌`);
      console.log(data[9].join(","));
    }
    if (
      data[10].join(",") ===
      "n/a,n/a,6.35,7.05,n/a,7.45,8.05,8.35,9.05,9.41,10.05,n/a,10.45,11.55,12.35,13.55,14.35,15.05,15.45,16.05,n/a,16.35,17.05,n/a,17.45,18.05,19.05,19.45,20.35"
    ) {
      console.log(`  pancevacki most ✅`);
    } else {
      console.log(`  pancevacki most ❌`);
      console.log(data[10].join(","));
    }
    if (
      data[11].join(",") ===
      "n/a,n/a,6.39,7.09,n/a,7.49,8.09,8.39,9.09,9.45,10.09,n/a,10.49,11.59,12.39,13.59,14.39,15.09,15.49,16.09,n/a,16.39,17.09,n/a,17.49,18.09,19.09,19.49,20.39"
    ) {
      console.log(`  krnjaca most ✅`);
    } else {
      console.log(`  krnjaca most ❌`);
      console.log(data[11].join(","));
    }
    if (
      data[12].join(",") ===
      "n/a,n/a,6.42,7.12,n/a,7.52,8.12,8.42,9.12,9.48,10.12,n/a,10.52,12.02,12.42,14.02,14.42,15.12,15.52,16.12,n/a,16.42,17.12,n/a,17.52,18.12,19.12,19.52,20.42"
    ) {
      console.log(`  krnjaca ukr ✅`);
    } else {
      console.log(`  krnjaca ukr ❌`);
      console.log(data[12].join(","));
    }
    if (
      data[13].join(",") ===
      "n/a,n/a,6.45,7.15,n/a,7.55,8.15,8.45,9.15,9.51,10.15,n/a,10.55,12.05,12.45,14.05,14.45,15.15,15.55,16.15,n/a,16.45,17.15,n/a,17.55,18.15,19.15,19.55,20.45"
    ) {
      console.log(`  sebes ✅`);
    } else {
      console.log(`  sebes ❌`);
      console.log(data[13].join(","));
    }
    if (
      data[14].join(",") ===
      "n/a,n/a,6.48,7.18,n/a,7.58,8.18,8.48,9.18,9.54,10.18,n/a,10.58,12.08,12.48,14.08,14.48,15.18,15.58,16.18,n/a,16.48,17.18,n/a,17.58,18.18,19.18,19.58,20.48"
    ) {
      console.log(`  ovca ✅`);
    } else {
      console.log(`  ovca ❌`);
      console.log(data[14].join(","));
    }
  });

  test(` matrix created correctly for direction 2`, () => {
    const data = shape.default.createTimetableMatrix(
      shape.default.extractDepartureTimes(dataStrDirection2)
    );
    if (
      data[0].join(",") ===
      "5.40,n/a,6.10,6.40,7.10,7.40,8.10,8.40,n/a,9.10,9.50,10.00,10.50,11.20,12.10,13.10,13.50,n/a,14.40,15.10,15.40,n/a,16.20,16.40,17.10,17.50,18.40,n/a,19.10,n/a,19.40,20.20,n/a,n/a,21.10,22.35"
    ) {
      console.log(`  ovca ✅`);
    } else {
      console.log(`  ovca ❌`);
      console.log(data[0].join(","));
    }
    if (
      data[1].join(",") ===
      "5.44,n/a,6.14,6.44,7.14,7.44,8.14,8.44,n/a,9.14,9.54,10.04,10.54,11.24,12.14,13.14,13.54,n/a,14.44,15.14,15.44,n/a,16.24,16.44,17.14,17.54,18.44,n/a,19.14,n/a,19.44,20.24,n/a,n/a,21.14,22.39"
    ) {
      console.log(`  sebes ✅`);
    } else {
      console.log(`  sebes ❌`);
      console.log(data[1].join(","));
    }
    if (
      data[2].join(",") ===
      "5.48,n/a,6.18,6.48,7.18,7.48,8.18,8.48,n/a,9.18,9.58,10.08,10.58,11.28,12.18,13.18,13.58,n/a,14.48,15.18,15.48,n/a,16.28,16.48,17.18,17.58,18.48,n/a,19.18,n/a,19.48,20.28,n/a,n/a,21.18,22.43"
    ) {
      console.log(`  krnjaca ukr ✅`);
    } else {
      console.log(`  krnjaca ukr ❌`);
      console.log(data[2].join(","));
    }
    if (
      data[3].join(",") ===
      "5.50,n/a,6.20,6.50,7.20,7.50,8.20,8.50,n/a,9.20,10.00,10.10,11.00,11.30,12.20,13.20,14.00,n/a,14.50,15.20,15.50,n/a,16.30,16.50,17.20,18.00,18.50,n/a,19.20,n/a,19.50,20.30,n/a,n/a,21.20,22.45"
    ) {
      console.log(`  krnjaca most ✅`);
    } else {
      console.log(`  krnjaca most ❌`);
      console.log(data[3].join(","));
    }
    if (
      data[4].join(",") ===
      "5.56,n/a,6.26,6.56,7.26,7.56,8.26,8.56,n/a,9.26,10.06,10.16,11.06,11.36,12.26,13.26,14.06,n/a,14.56,15.26,15.56,n/a,16.36,16.56,17.26,18.06,18.56,n/a,19.26,n/a,19.56,20.36,n/a,n/a,21.26,22.51"
    ) {
      console.log(`  pancevacki most ✅`);
    } else {
      console.log(`  pancevacki most ❌`);
      console.log(data[4].join(","));
    }
    if (
      data[5].join(",") ===
      "5.59,n/a,6.29,6.59,7.29,7.59,8.29,8.59,n/a,9.29,10.09,10.19,11.09,11.39,12.29,13.29,14.09,n/a,14.59,15.29,15.59,n/a,16.39,16.59,17.29,18.09,18.59,n/a,19.29,n/a,19.59,20.39,n/a,n/a,21.29,22.54"
    ) {
      console.log(`  vukov spomenik ✅`);
    } else {
      console.log(`  vukov spomenik ❌`);
      console.log(data[5].join(","));
    }
    if (
      data[6].join(",") ===
      "6.03,n/a,6.33,7.03,7.33,8.03,8.33,9.03,n/a,9.33,10.13,10.21,11.13,11.43,12.33,13.33,14.13,n/a,15.03,15.33,16.03,n/a,16.43,17.03,17.33,18.13,19.03,n/a,19.33,n/a,20.03,20.43,n/a,n/a,21.33,22.58"
    ) {
      console.log(`  karadjordjev park ✅`);
    } else {
      console.log(`  karadjordjev park ❌`);
      console.log(data[6].join(","));
    }
    if (
      data[7].join(",") ===
      "6.06,6.25,6.36,7.06,7.36,8.06,8.36,9.06,9.13,9.36,10.16,10.23,11.16,11.46,12.36,13.36,14.16,15.10,15.06,15.36,16.06,15.41,16.46,17.06,17.36,18.16,19.06,19.18,19.36,20.10,20.06,20.46,21.48,21.48,21.36,23.01"
    ) {
      console.log(`  beograd centar ✅`);
    } else {
      console.log(`  beograd centar ❌`);
      console.log(data[7].join(","));
    }
    if (
      data[8].join(",") ===
      "6.10,6.28,6.40,7.10,7.40,8.10,8.40,9.10,9.17,9.40,10.20,n/a,11.20,11.50,12.40,13.40,14.20,15.14,15.10,15.40,16.10,15.45,16.50,17.10,17.40,18.20,19.10,19.22,19.40,20.14,20.10,20.50,21.52,21.52,21.40,23.05"
    ) {
      console.log(`  novi beograd ✅`);
    } else {
      console.log(`  novi beograd ❌`);
      console.log(data[8].join(","));
    }
    if (
      data[9].join(",") ===
      "6.13,6.31,6.43,7.13,7.43,8.13,8.43,9.13,9.20,9.43,10.23,n/a,11.23,11.53,12.43,13.43,14.23,15.17,15.13,15.43,16.13,15.48,16.53,17.13,17.43,18.23,19.13,19.25,19.43,20.17,20.13,20.53,21.55,21.55,21.43,23.08"
    ) {
      console.log(`  tosin bunar ✅`);
    } else {
      console.log(`  tosin bunar ❌`);
      console.log(data[9].join(","));
    }
    if (
      data[10].join(",") ===
      "6.17,6.34,6.47,7.17,7.47,8.17,8.47,9.17,9.23,9.47,10.27,n/a,11.27,11.56,12.47,13.47,14.27,15.20,15.17,15.47,16.17,15.51,16.57,17.17,17.47,18.27,19.16,19.28,19.47,20.20,20.17,20.57,21.58,21.58,21.47,23.11"
    ) {
      console.log(`  zemun ✅`);
    } else {
      console.log(`  zemun ❌`);
      console.log(data[10].join(","));
    }
    if (
      data[11].join(",") ===
      "6.20,n/a,6.50,7.20,7.50,8.20,8.50,9.20,n/a,9.50,10.30,n/a,11.30,n/a,12.50,13.50,14.30,n/a,15.20,15.50,16.20,n/a,17.00,17.20,17.50,18.30,n/a,n/a,19.50,n/a,20.20,21.00,n/a,n/a,21.50,n/a"
    ) {
      console.log(`  altina ✅`);
    } else {
      console.log(`  altina ❌`);
      console.log(data[11].join(","));
    }
    if (
      data[12].join(",") ===
      "6.22,n/a,6.52,7.22,7.52,8.22,8.52,9.22,n/a,9.52,10.32,n/a,11.32,n/a,12.52,13.52,14.32,n/a,15.22,15.52,16.22,n/a,17.02,17.22,17.52,18.32,n/a,n/a,19.52,n/a,20.22,21.02,n/a,n/a,21.52,n/a"
    ) {
      console.log(`  zemunsko polje ✅`);
    } else {
      console.log(`  zemunsko polje ❌`);
      console.log(data[12].join(","));
    }
    if (
      data[13].join(",") ===
      "6.24,n/a,6.54,7.24,7.54,8.24,8.54,9.24,n/a,9.54,10.34,n/a,11.34,n/a,12.54,13.54,14.34,n/a,15.24,15.54,16.24,n/a,17.04,17.24,17.54,18.34,n/a,n/a,19.54,n/a,20.24,21.04,n/a,n/a,21.54,n/a"
    ) {
      console.log(`  kamendin ✅`);
    } else {
      console.log(`  kamendin ❌`);
      console.log(data[13].join(","));
    }
    if (
      data[14].join(",") ===
      "6.28,n/a,6.58,7.28,7.58,8.28,8.58,9.28,n/a,9.58,10.38,n/a,11.38,n/a,12.58,13.58,14.38,n/a,15.28,15.58,16.28,n/a,17.08,17.28,17.58,18.38,n/a,n/a,19.58,n/a,20.28,21.08,n/a,n/a,21.58,n/a"
    ) {
      console.log(`  batajnica ✅`);
    } else {
      console.log(`  batajnica ❌`);
      console.log(data[14].join(","));
    }
  });
});

test("trainsData()", () => {
  const data = shape.default.trainsData(
    trainIdDirection1,
    trainIdDirection2,
    trainIdActiveOnWeekendsAndHolidaysDirection1,
    trainIdActiveOnWeekendsAndHolidaysDirection2,
    stationsNames,
    shape.default.createTimetableMatrix(
      shape.default.extractDepartureTimes(dataStrDirection1)
    ),
    shape.default.createTimetableMatrix(
      shape.default.extractDepartureTimes(dataStrDirection2)
    )
  );
  function getItinerary(trainId) {
    return data.filter((train) => train.id === trainId)[0].itinerary;
  }
  test(` writes correct itinerary`, () => {
    test(`  8003`, () => {
      const i = getItinerary(8003);
      if (
        i.length === 15 &&
        i[0].station === "batajnica" &&
        i[0].time === 6.3 &&
        i[14].station === "ovca" &&
        i[14].time === 7.18
      ) {
        console.log(`  ✅`);
      } else {
        console.log(`  ❌`);
        console.log(i);
      }
    });
    test(`  7900`, () => {
      const i = getItinerary(7900);
      if (
        i.length === 4 &&
        i[0].station === "beograd centar" &&
        i[0].time === 6.25 &&
        i[3].station === "zemun" &&
        i[3].time === 6.34
      ) {
        console.log(`  ✅`);
      } else {
        console.log(`  ❌`);
        console.log(i);
      }
    });
    test(`  8002`, () => {
      const i = getItinerary(8002);
      if (
        i.length === 15 &&
        i[0].station === "ovca" &&
        i[0].time === 6.1 &&
        i[14].station === "batajnica" &&
        i[14].time === 6.58
      ) {
        console.log(`  ✅`);
      } else {
        console.log(`  ❌`);
        console.log(i);
      }
    });
    test(`  8310`, () => {
      const i = getItinerary(8310);
      if (
        i.length === 8 &&
        i[0].station === "ovca" &&
        i[0].time === 10 &&
        i[7].station === "beograd centar" &&
        i[7].time === 10.23
      ) {
        console.log(`  ✅`);
      } else {
        console.log(`  ❌`);
        console.log(i);
      }
    });
  });
});

test("stationsData()", () => {
  const data = shape.default.stationsData(
    stationsNames,
    stationsFormatted,
    shape.default.trainsData(
      trainIdDirection1,
      trainIdDirection2,
      trainIdActiveOnWeekendsAndHolidaysDirection1,
      trainIdActiveOnWeekendsAndHolidaysDirection2,
      stationsNames,
      shape.default.createTimetableMatrix(
        shape.default.extractDepartureTimes(dataStrDirection1)
      ),
      shape.default.createTimetableMatrix(
        shape.default.extractDepartureTimes(dataStrDirection2)
      )
    )
  );
  test(` writes all stops correctly`, () => {
    function checkStopsAt(stationName, targetLength, earliest, latest) {
      const stationIndex = stationsNames.indexOf(stationName);
      if (
        data[stationIndex].departures.length === targetLength &&
        data[stationIndex].departures[0].time === earliest &&
        data[stationIndex].departures[targetLength - 1].time === latest
      ) {
        console.log(`  ${stationName} ✅`);
      } else {
        console.log(`  ${stationName} ❌`);
        console.log(data[stationIndex].departures);
        console.log(data[stationIndex].departures.length);
      }
    }
    checkStopsAt("batajnica", 47, 6.00, 21.58);
    checkStopsAt("kamendin", 47, 6.04, 21.54);
    checkStopsAt("zemunsko polje", 47, 6.06, 21.52);
    checkStopsAt("altina", 47, 6.08, 21.50);
    checkStopsAt("zemun", 64, 3.44, 23.11);
    checkStopsAt("tosin bunar", 64, 3.47, 23.08);
    checkStopsAt("novi beograd", 64, 3.49, 23.05);
    checkStopsAt("beograd centar", 65, 3.54, 23.01);
    checkStopsAt("karadjordjev park", 51, 6.27, 22.58);
    checkStopsAt("vukov spomenik", 51, 6.31, 22.54);
    checkStopsAt("pancevacki most", 51, 6.35, 22.51);
    checkStopsAt("krnjaca most", 51, 6.39, 22.45);
    checkStopsAt("krnjaca ukr", 51, 6.42, 22.43);
    checkStopsAt("sebes", 51, 6.45, 22.39);
    checkStopsAt("ovca", 51, 6.48, 22.35);
  });
});
