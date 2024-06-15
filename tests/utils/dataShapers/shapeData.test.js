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

test("extractDepartureTimes()", () => {
  test(` data extracted correctly for direction 1`, () => {
    const data = shape.default.extractDepartureTimes(dataStrDirection1);
    if (
      data[0].join(",") ===
      "5.57,6.27,6.57,7.27,7.57,8.10,8.57,9.27,9.57,10.57,11.57,12.57,13.57,14.42,14.59,15.27,15.51,16.27,16.57,17.27,18.27,18.57,19.57"
    ) {
      console.log(`  batajnica ✅`);
    } else {
      console.log(`  batajnica ❌`);
      console.log(data[0].join(","));
    }
    if (
      data[1].join(",") ===
      "6.01,6.31,7.01,7.31,8.01,8.14,9.01,9.31,10.01,11.01,12.01,13.01,14.01,14.46,15.03,15.31,15.55,16.31,17.01,17.31,18.31,19.01,20.01"
    ) {
      console.log(`  kamendin ✅`);
    } else {
      console.log(`  kamendin ❌`);
      console.log(data[1].join(","));
    }
    if (
      data[2].join(",") ===
      "6.03,6.33,7.03,7.33,8.03,8.16,9.03,9.33,10.03,11.03,12.03,13.03,14.03,14.48,15.05,15.33,15.57,16.33,17.03,17.33,18.33,19.03,20.03"
    ) {
      console.log(`  zemunsko polje ✅`);
    } else {
      console.log(`  zemunsko polje ❌`);
      console.log(data[2].join(","));
    }
    if (
      data[3].join(",") ===
      "6.05,6.35,7.05,7.35,8.05,8.18,9.05,9.35,10.05,11.05,12.05,13.05,14.05,14.50,15.07,15.35,15.59,16.35,17.05,17.35,18.35,19.05,20.05"
    ) {
      console.log(`  altina ✅`);
    } else {
      console.log(`  altina ❌`);
      console.log(data[3].join(","));
    }
    if (
      data[4].join(",") ===
      "4.11,4.16,6.09,6.39,7.03,7.09,7.39,8.09,8.22,9.09,9.39,10.03,10.09,11.09,12.09,13.09,14.09,14.54,15.11,15.39,16.17,16.03,16.39,16.34,17.09,17.39,18.39,19.09,20.09"
    ) {
      console.log(`  zemun ✅`);
    } else {
      console.log(`  zemun ❌`);
      console.log(data[4].join(","));
    }
    if (
      data[5].join(",") ===
      "4.14,4.19,6.13,6.43,7.06,7.13,7.43,8.13,8.26,9.13,9.43,10.06,10.13,11.13,12.13,13.13,14.13,14.58,15.15,15.43,16.20,16.07,16.43,16.37,17.13,17.43,18.43,19.13,20.13"
    ) {
      console.log(`  tosin bunar ✅`);
    } else {
      console.log(`  tosin bunar ❌`);
      console.log(data[5].join(","));
    }
    if (
      data[6].join(",") ===
      "4.17,4.22,6.16,6.46,7.09,7.16,7.46,8.16,8.29,9.16,9.46,10.09,10.16,11.16,12.16,13.16,14.16,15.01,15.18,15.46,16.22,16.10,16.46,16.40,17.16,17.46,18.46,19.16,20.16"
    ) {
      console.log(`  novi beograd ✅`);
    } else {
      console.log(`  novi beograd ❌`);
      console.log(data[6].join(","));
    }
    if (
      data[7].join(",") ===
      "4.22,4.26,6.20,6.50,7.13,7.20,7.50,8.20,8.33,9.20,9.50,10.13,10.20,11.20,12.20,13.20,14.20,15.05,15.22,15.50,16.26,16.14,16.50,16.52,17.20,17.50,18.50,19.20,20.20"
    ) {
      console.log(`  beograd centar ✅`);
    } else {
      console.log(`  beograd centar ❌`);
      console.log(data[7].join(","));
    }
    if (
      data[8].join(",") ===
      "6.24,6.54,7.24,7.54,8.24,8.37,9.24,9.54,10.24,11.24,12.24,13.24,14.24,15.09,15.26,15.54,16.18,16.54,17.24,17.54,18.54,19.24,20.24"
    ) {
      console.log(`  karadjordjev park ✅`);
    } else {
      console.log(`  karadjordjev park ❌`);
      console.log(data[8].join(","));
    }
    if (
      data[9].join(",") ===
      "6.28,6.58,7.28,7.58,8.28,8.41,9.28,9.58,10.28,11.28,12.28,13.28,14.28,15.13,15.30,15.58,16.22,16.58,17.28,17.58,18.58,19.28,20.28"
    ) {
      console.log(`  vukov spomenik ✅`);
    } else {
      console.log(`  vukov spomenik ❌`);
      console.log(data[9].join(","));
    }
    if (
      data[10].join(",") ===
      "6.32,7.02,7.32,8.02,8.32,8.45,9.32,10.02,10.32,11.32,12.32,13.32,14.32,15.17,15.34,16.02,16.26,17.02,17.32,18.02,19.02,19.32,20.32"
    ) {
      console.log(`  pancevacki most ✅`);
    } else {
      console.log(`  pancevacki most ❌`);
      console.log(data[10].join(","));
    }
    if (
      data[11].join(",") ===
      "6.36,7.06,7.36,8.06,8.36,8.49,9.36,10.06,10.36,11.36,12.36,13.36,14.36,15.21,15.38,16.06,16.30,17.06,17.36,18.06,19.06,19.36,20.36"
    ) {
      console.log(`  krnjaca most ✅`);
    } else {
      console.log(`  krnjaca most ❌`);
      console.log(data[11].join(","));
    }
    if (
      data[12].join(",") ===
      "6.39,7.09,7.39,8.09,8.39,8.52,9.39,10.09,10.39,11.39,12.39,13.39,14.39,15.24,15.41,16.09,16.33,17.09,17.39,18.09,19.09,19.39,20.39"
    ) {
      console.log(`  krnjaca ukr ✅`);
    } else {
      console.log(`  krnjaca ukr ❌`);
      console.log(data[12].join(","));
    }
    if (
      data[13].join(",") ===
      "6.42,7.12,7.42,8.12,8.42,8.55,9.42,10.12,10.42,11.42,12.42,13.42,14.42,15.27,15.44,16.12,16.36,17.12,17.42,18.12,19.12,19.42,20.42"
    ) {
      console.log(`  sebes ✅`);
    } else {
      console.log(`  sebes ❌`);
      console.log(data[13].join(","));
    }
    if (
      data[14].join(",") ===
      "6.45,7.15,7.45,8.15,8.45,8.58,9.45,10.15,10.45,11.45,12.45,13.45,14.45,15.30,15.47,16.15,16.39,17.15,17.45,18.15,19.15,19.45,20.45"
    ) {
      console.log(`  ovca ✅`);
    } else {
      console.log(`  ovca ❌`);
      console.log(data[14].join(","));
    }
  });

  test(` data extracted correctly for direction 2`, () => {
    const data = shape.default.extractDepartureTimes(dataStrDirection2);
    if (
      data[0].join(",") ===
      "5.36,6.14,6.44,6.59,7.44,8.14,8.44,9.14,9.52,9.59,10.59,11.24,11.59,12.59,13.59,14.44,15.14,15.44,16.14,16.44,17.14,17.59,18.39,18.59,19.59,20.18,21.14,22.25"
    ) {
      console.log(`  ovca ✅`);
    } else {
      console.log(`  ovca ❌`);
      console.log(data[0].join(","));
    }
    if (
      data[1].join(",") ===
      "5.40,6.18,6.48,7.03,7.48,8.18,8.48,9.18,9.56,10.03,11.03,11.28,12.03,13.03,14.03,14.48,15.18,15.48,16.18,16.48,17.18,18.03,18.43,19.03,20.03,20.22,21.18,22.29"
    ) {
      console.log(`  sebes ✅`);
    } else {
      console.log(`  sebes ❌`);
      console.log(data[1].join(","));
    }
    if (
      data[2].join(",") ===
      "5.44,6.22,6.52,7.07,7.52,8.22,8.52,9.22,10.00,10.07,11.07,11.32,12.07,13.07,14.07,14.52,15.22,15.52,16.22,16.52,17.22,18.07,18.47,19.07,20.07,20.26,21.22,22.33"
    ) {
      console.log(`  krnjaca ukr ✅`);
    } else {
      console.log(`  krnjaca ukr ❌`);
      console.log(data[2].join(","));
    }
    if (
      data[3].join(",") ===
      "5.46,6.24,6.54,7.09,7.54,8.24,8.54,9.24,10.02,10.09,11.09,11.34,12.09,13.09,14.09,14.54,15.24,15.54,16.24,16.54,17.24,18.09,18.49,19.09,20.09,20.28,21.24,22.35"
    ) {
      console.log(`  krnjaca most ✅`);
    } else {
      console.log(`  krnjaca most ❌`);
      console.log(data[3].join(","));
    }
    if (
      data[4].join(",") ===
      "5.52,6.30,7.00,7.15,8.00,8.30,9.00,9.30,10.08,10.15,11.15,11.40,12.15,13.15,14.15,15.00,15.30,16.00,16.30,17.00,17.30,18.15,18.55,19.15,20.15,20.34,21.30,22.41"
    ) {
      console.log(`  pancevacki most ✅`);
    } else {
      console.log(`  pancevacki most ❌`);
      console.log(data[4].join(","));
    }
    if (
      data[5].join(",") ===
      "5.55,6.33,7.03,7.18,8.03,8.33,9.03,9.33,10.11,10.18,11.18,11.43,12.18,13.18,14.18,15.03,15.33,16.03,16.33,17.03,17.33,18.18,18.58,19.18,20.18,20.37,21.33,22.44"
    ) {
      console.log(`  vukov spomenik ✅`);
    } else {
      console.log(`  vukov spomenik ❌`);
      console.log(data[5].join(","));
    }
    if (
      data[6].join(",") ===
      "5.59,6.37,7.07,7.22,8.07,8.37,9.07,9.37,10.13,10.22,11.22,11.47,12.22,13.22,14.22,15.07,15.37,16.07,16.37,17.07,17.37,18.22,19.02,19.22,20.22,20.41,21.37,22.48"
    ) {
      console.log(`  karadjordjev park ✅`);
    } else {
      console.log(`  karadjordjev park ❌`);
      console.log(data[6].join(","));
    }
    if (
      data[7].join(",") ===
      "6.02,6.44,6.40,7.10,7.25,8.13,8.40,9.10,9.19,9.40,10.15,10.25,11.25,11.50,12.25,13.25,14.25,15.05,15.10,15.40,16.10,16.19,16.40,17.10,17.40,18.25,19.05,19.19,19.25,20.03,20.25,20.44,21.37,21.37,21.40,22.51"
    ) {
      console.log(`  beograd centar ✅`);
    } else {
      console.log(`  beograd centar ❌`);
      console.log(data[7].join(","));
    }
    if (
      data[8].join(",") ===
      "6.06,6.48,6.44,7.14,7.29,8.17,8.44,9.14,9.23,9.44,10.29,11.29,11.54,12.29,13.29,14.29,15.09,15.14,15.44,16.14,16.23,16.44,17.14,17.44,18.29,19.09,19.23,19.29,20.07,20.29,20.48,21.41,21.41,21.44,22.55"
    ) {
      console.log(`  novi beograd ✅`);
    } else {
      console.log(`  novi beograd ❌`);
      console.log(data[8].join(","));
    }
    if (
      data[9].join(",") ===
      "6.09,6.51,6.47,7.17,7.32,8.20,8.47,9.17,9.26,9.47,10.32,11.32,11.57,12.32,13.32,14.32,15.12,15.17,15.47,16.17,16.26,16.47,17.17,17.47,18.32,19.12,19.26,19.32,20.10,20.32,20.51,21.44,21.44,21.47,22.58"
    ) {
      console.log(`  tosin bunar ✅`);
    } else {
      console.log(`  tosin bunar ❌`);
      console.log(data[9].join(","));
    }
    if (
      data[10].join(",") ===
      "6.13,6.54,6.51,7.21,7.36,8.24,8.51,9.21,9.30,9.51,10.36,11.36,12.00,12.36,13.36,14.36,15.15,15.21,15.51,16.21,16.29,16.51,17.21,17.51,18.36,19.15,19.30,19.36,20.14,20.36,20.55,21.47,21.47,21.51,23.01"
    ) {
      console.log(`  zemun ✅`);
    } else {
      console.log(`  zemun ❌`);
      console.log(data[10].join(","));
    }
    if (
      data[11].join(",") ===
      "6.16,6.54,7.24,7.39,8.27,8.54,9.24,9.54,10.39,11.39,12.39,13.39,14.39,15.24,15.54,16.24,16.54,17.24,17.54,18.39,19.39,20.39,20.58,21.54"
    ) {
      console.log(`  altina ✅`);
    } else {
      console.log(`  altina ❌`);
      console.log(data[11].join(","));
    }
    if (
      data[12].join(",") ===
      "6.18,6.56,7.26,7.41,8.29,8.56,9.26,9.56,10.41,11.41,12.41,13.41,14.41,15.26,15.56,16.26,16.56,17.26,17.56,18.41,19.41,20.41,21.00,21.56"
    ) {
      console.log(`  zemunsko polje ✅`);
    } else {
      console.log(`  zemunsko polje ❌`);
      console.log(data[12].join(","));
    }
    if (
      data[13].join(",") ===
      "6.20,6.58,7.28,7.43,8.31,8.58,9.28,9.58,10.43,11.43,12.43,13.43,14.43,15.28,15.58,16.28,16.58,17.28,17.58,18.43,19.43,20.43,21.02,21.58"
    ) {
      console.log(`  kamendin ✅`);
    } else {
      console.log(`  kamendin ❌`);
      console.log(data[13].join(","));
    }
    if (
      data[14].join(",") ===
      "6.24,7.02,7.32,7.47,8.35,9.02,9.32,10.02,10.47,11.47,12.47,13.47,14.47,15.32,16.02,16.32,17.02,17.32,18.02,18.47,19.47,20.47,21.06,22.02"
    ) {
      console.log(`  batajnica ✅`);
    } else {
      console.log(`  batajnica ❌`);
      console.log(data[14].join(","));
    }
  });
});

test("createTimetableMatrix1()", () => {
  test(` matrix created correctly for direction 1`, () => {
    const data = shape.default.createTimetableMatrixDirection1(
      shape.default.extractDepartureTimes(dataStrDirection1),
      stationsNames,
      trainIdDirection1
    );
    if (
      data[0].join(",") ===
      "n/a,n/a,5.57,6.27,n/a,6.57,7.27,7.57,8.10,8.57,9.27,n/a,9.57,10.57,11.57,12.57,13.57,14.42,14.59,15.27,n/a,15.51,16.27,n/a,16.57,17.27,18.27,18.57,19.57"
    ) {
      console.log(`  batajnica ✅`);
    } else {
      console.log(`  batajnica ❌`);
      console.log(data[0].join(","));
    }
    if (
      data[1].join(",") ===
      "n/a,n/a,6.01,6.31,n/a,7.01,7.31,8.01,8.14,9.01,9.31,n/a,10.01,11.01,12.01,13.01,14.01,14.46,15.03,15.31,n/a,15.55,16.31,n/a,17.01,17.31,18.31,19.01,20.01"
    ) {
      console.log(`  kamendin ✅`);
    } else {
      console.log(`  kamendin ❌`);
      console.log(data[1].join(","));
    }
    if (
      data[2].join(",") ===
      "n/a,n/a,6.03,6.33,n/a,7.03,7.33,8.03,8.16,9.03,9.33,n/a,10.03,11.03,12.03,13.03,14.03,14.48,15.05,15.33,n/a,15.57,16.33,n/a,17.03,17.33,18.33,19.03,20.03"
    ) {
      console.log(`  zemunsko polje ✅`);
    } else {
      console.log(`  zemunsko polje ❌`);
      console.log(data[2].join(","));
    }
    if (
      data[3].join(",") ===
      "n/a,n/a,6.05,6.35,n/a,7.05,7.35,8.05,8.18,9.05,9.35,n/a,10.05,11.05,12.05,13.05,14.05,14.50,15.07,15.35,n/a,15.59,16.35,n/a,17.05,17.35,18.35,19.05,20.05"
    ) {
      console.log(`  altina ✅`);
    } else {
      console.log(`  altina ❌`);
      console.log(data[3].join(","));
    }
    if (
      data[4].join(",") ===
      "4.11,4.16,6.09,6.39,7.03,7.09,7.39,8.09,8.22,9.09,9.39,10.03,10.09,11.09,12.09,13.09,14.09,14.54,15.11,15.39,16.17,16.03,16.39,16.34,17.09,17.39,18.39,19.09,20.09"
    ) {
      console.log(`  zemun ✅`);
    } else {
      console.log(`  zemun ❌`);
      console.log(data[4].join(","));
    }
    if (
      data[5].join(",") ===
      "4.14,4.19,6.13,6.43,7.06,7.13,7.43,8.13,8.26,9.13,9.43,10.06,10.13,11.13,12.13,13.13,14.13,14.58,15.15,15.43,16.20,16.07,16.43,16.37,17.13,17.43,18.43,19.13,20.13"
    ) {
      console.log(`  tosin bunar ✅`);
    } else {
      console.log(`  tosin bunar ❌`);
      console.log(data[5].join(","));
    }
    if (
      data[6].join(",") ===
      "4.17,4.22,6.16,6.46,7.09,7.16,7.46,8.16,8.29,9.16,9.46,10.09,10.16,11.16,12.16,13.16,14.16,15.01,15.18,15.46,16.22,16.10,16.46,16.40,17.16,17.46,18.46,19.16,20.16"
    ) {
      console.log(`  novi beograd ✅`);
    } else {
      console.log(`  novi beograd ❌`);
      console.log(data[6].join(","));
    }
    if (
      data[7].join(",") ===
      "4.22,4.26,6.20,6.50,7.13,7.20,7.50,8.20,8.33,9.20,9.50,10.13,10.20,11.20,12.20,13.20,14.20,15.05,15.22,15.50,16.26,16.14,16.50,16.52,17.20,17.50,18.50,19.20,20.20"
    ) {
      console.log(`  beograd centar ✅`);
    } else {
      console.log(`  beograd centar ❌`);
      console.log(data[7].join(","));
    }
    if (
      data[8].join(",") ===
      "n/a,n/a,6.24,6.54,n/a,7.24,7.54,8.24,8.37,9.24,9.54,n/a,10.24,11.24,12.24,13.24,14.24,15.09,15.26,15.54,n/a,16.18,16.54,n/a,17.24,17.54,18.54,19.24,20.24"
    ) {
      console.log(`  karadjordjev park ✅`);
    } else {
      console.log(`  karadjordjev park ❌`);
      console.log(data[8].join(","));
    }
    if (
      data[9].join(",") ===
      "n/a,n/a,6.28,6.58,n/a,7.28,7.58,8.28,8.41,9.28,9.58,n/a,10.28,11.28,12.28,13.28,14.28,15.13,15.30,15.58,n/a,16.22,16.58,n/a,17.28,17.58,18.58,19.28,20.28"
    ) {
      console.log(`  vukov spomenik ✅`);
    } else {
      console.log(`  vukov spomenik ❌`);
      console.log(data[9].join(","));
    }
    if (
      data[10].join(",") ===
      "n/a,n/a,6.32,7.02,n/a,7.32,8.02,8.32,8.45,9.32,10.02,n/a,10.32,11.32,12.32,13.32,14.32,15.17,15.34,16.02,n/a,16.26,17.02,n/a,17.32,18.02,19.02,19.32,20.32"
    ) {
      console.log(`  pancevacki most ✅`);
    } else {
      console.log(`  pancevacki most ❌`);
      console.log(data[10].join(","));
    }
    if (
      data[11].join(",") ===
      "n/a,n/a,6.36,7.06,n/a,7.36,8.06,8.36,8.49,9.36,10.06,n/a,10.36,11.36,12.36,13.36,14.36,15.21,15.38,16.06,n/a,16.30,17.06,n/a,17.36,18.06,19.06,19.36,20.36"
    ) {
      console.log(`  krnjaca most ✅`);
    } else {
      console.log(`  krnjaca most ❌`);
      console.log(data[11].join(","));
    }
    if (
      data[12].join(",") ===
      "n/a,n/a,6.39,7.09,n/a,7.39,8.09,8.39,8.52,9.39,10.09,n/a,10.39,11.39,12.39,13.39,14.39,15.24,15.41,16.09,n/a,16.33,17.09,n/a,17.39,18.09,19.09,19.39,20.39"
    ) {
      console.log(`  krnjaca ukr ✅`);
    } else {
      console.log(`  krnjaca ukr ❌`);
      console.log(data[12].join(","));
    }
    if (
      data[13].join(",") ===
      "n/a,n/a,6.42,7.12,n/a,7.42,8.12,8.42,8.55,9.42,10.12,n/a,10.42,11.42,12.42,13.42,14.42,15.27,15.44,16.12,n/a,16.36,17.12,n/a,17.42,18.12,19.12,19.42,20.42"
    ) {
      console.log(`  sebes ✅`);
    } else {
      console.log(`  sebes ❌`);
      console.log(data[13].join(","));
    }
    if (
      data[14].join(",") ===
      "n/a,n/a,6.45,7.15,n/a,7.45,8.15,8.45,8.58,9.45,10.15,n/a,10.45,11.45,12.45,13.45,14.45,15.30,15.47,16.15,n/a,16.39,17.15,n/a,17.45,18.15,19.15,19.45,20.45"
    ) {
      console.log(`  ovca ✅`);
    } else {
      console.log(`  ovca ❌`);
      console.log(data[14].join(","));
    }
  });
});

test("createTimetableMatrix2()", () => {
  test(` matrix created correctly for direction 2`, () => {
    const data = shape.default.createTimetableMatrixDirection2(
      shape.default.extractDepartureTimes(dataStrDirection2),
      stationsNames.length
    );
    if (
      data[0].join(",") ===
      "5.36,n/a,6.14,6.44,6.59,7.44,8.14,8.44,n/a,9.14,9.52,9.59,10.59,11.24,11.59,12.59,13.59,n/a,14.44,15.14,15.44,n/a,16.14,16.44,17.14,17.59,18.39,n/a,18.59,n/a,19.59,20.18,n/a,n/a,21.14,22.25"
    ) {
      console.log(`  ovca ✅`);
    } else {
      console.log(`  ovca ❌`);
      console.log(data[0].join(","));
    }
    if (
      data[1].join(",") ===
      "5.40,n/a,6.18,6.48,7.03,7.48,8.18,8.48,n/a,9.18,9.56,10.03,11.03,11.28,12.03,13.03,14.03,n/a,14.48,15.18,15.48,n/a,16.18,16.48,17.18,18.03,18.43,n/a,19.03,n/a,20.03,20.22,n/a,n/a,21.18,22.29"
    ) {
      console.log(`  sebes ✅`);
    } else {
      console.log(`  sebes ❌`);
      console.log(data[1].join(","));
    }
    if (
      data[2].join(",") ===
      "5.44,n/a,6.22,6.52,7.07,7.52,8.22,8.52,n/a,9.22,10.00,10.07,11.07,11.32,12.07,13.07,14.07,n/a,14.52,15.22,15.52,n/a,16.22,16.52,17.22,18.07,18.47,n/a,19.07,n/a,20.07,20.26,n/a,n/a,21.22,22.33"
    ) {
      console.log(`  krnjaca ukr ✅`);
    } else {
      console.log(`  krnjaca ukr ❌`);
      console.log(data[2].join(","));
    }
    if (
      data[3].join(",") ===
      "5.46,n/a,6.24,6.54,7.09,7.54,8.24,8.54,n/a,9.24,10.02,10.09,11.09,11.34,12.09,13.09,14.09,n/a,14.54,15.24,15.54,n/a,16.24,16.54,17.24,18.09,18.49,n/a,19.09,n/a,20.09,20.28,n/a,n/a,21.24,22.35"
    ) {
      console.log(`  krnjaca most ✅`);
    } else {
      console.log(`  krnjaca most ❌`);
      console.log(data[3].join(","));
    }
    if (
      data[4].join(",") ===
      "5.52,n/a,6.30,7.00,7.15,8.00,8.30,9.00,n/a,9.30,10.08,10.15,11.15,11.40,12.15,13.15,14.15,n/a,15.00,15.30,16.00,n/a,16.30,17.00,17.30,18.15,18.55,n/a,19.15,n/a,20.15,20.34,n/a,n/a,21.30,22.41"
    ) {
      console.log(`  pancevacki most ✅`);
    } else {
      console.log(`  pancevacki most ❌`);
      console.log(data[4].join(","));
    }
    if (
      data[5].join(",") ===
      "5.55,n/a,6.33,7.03,7.18,8.03,8.33,9.03,n/a,9.33,10.11,10.18,11.18,11.43,12.18,13.18,14.18,n/a,15.03,15.33,16.03,n/a,16.33,17.03,17.33,18.18,18.58,n/a,19.18,n/a,20.18,20.37,n/a,n/a,21.33,22.44"
    ) {
      console.log(`  vukov spomenik ✅`);
    } else {
      console.log(`  vukov spomenik ❌`);
      console.log(data[5].join(","));
    }
    if (
      data[6].join(",") ===
      "5.59,n/a,6.37,7.07,7.22,8.07,8.37,9.07,n/a,9.37,10.13,10.22,11.22,11.47,12.22,13.22,14.22,n/a,15.07,15.37,16.07,n/a,16.37,17.07,17.37,18.22,19.02,n/a,19.22,n/a,20.22,20.41,n/a,n/a,21.37,22.48"
    ) {
      console.log(`  karadjordjev park ✅`);
    } else {
      console.log(`  karadjordjev park ❌`);
      console.log(data[6].join(","));
    }
    if (
      data[7].join(",") ===
      "6.02,6.44,6.40,7.10,7.25,8.13,8.40,9.10,9.19,9.40,10.15,10.25,11.25,11.50,12.25,13.25,14.25,15.05,15.10,15.40,16.10,16.19,16.40,17.10,17.40,18.25,19.05,19.19,19.25,20.03,20.25,20.44,21.37,21.37,21.40,22.51"
    ) {
      console.log(`  beograd centar ✅`);
    } else {
      console.log(`  beograd centar ❌`);
      console.log(data[7].join(","));
    }
    if (
      data[8].join(",") ===
      "6.06,6.48,6.44,7.14,7.29,8.17,8.44,9.14,9.23,9.44,n/a,10.29,11.29,11.54,12.29,13.29,14.29,15.09,15.14,15.44,16.14,16.23,16.44,17.14,17.44,18.29,19.09,19.23,19.29,20.07,20.29,20.48,21.41,21.41,21.44,22.55"
    ) {
      console.log(`  novi beograd ✅`);
    } else {
      console.log(`  novi beograd ❌`);
      console.log(data[8].join(","));
    }
    if (
      data[9].join(",") ===
      "6.09,6.51,6.47,7.17,7.32,8.20,8.47,9.17,9.26,9.47,n/a,10.32,11.32,11.57,12.32,13.32,14.32,15.12,15.17,15.47,16.17,16.26,16.47,17.17,17.47,18.32,19.12,19.26,19.32,20.10,20.32,20.51,21.44,21.44,21.47,22.58"
    ) {
      console.log(`  tosin bunar ✅`);
    } else {
      console.log(`  tosin bunar ❌`);
      console.log(data[9].join(","));
    }
    if (
      data[10].join(",") ===
      "6.13,6.54,6.51,7.21,7.36,8.24,8.51,9.21,9.30,9.51,n/a,10.36,11.36,12.00,12.36,13.36,14.36,15.15,15.21,15.51,16.21,16.29,16.51,17.21,17.51,18.36,19.15,19.30,19.36,20.14,20.36,20.55,21.47,21.47,21.51,23.01"
    ) {
      console.log(`  zemun ✅`);
    } else {
      console.log(`  zemun ❌`);
      console.log(data[10].join(","));
    }
    if (
      data[11].join(",") ===
      "6.16,n/a,6.54,7.24,7.39,8.27,8.54,9.24,n/a,9.54,n/a,10.39,11.39,n/a,12.39,13.39,14.39,n/a,15.24,15.54,16.24,n/a,16.54,17.24,17.54,18.39,n/a,n/a,19.39,n/a,20.39,20.58,n/a,n/a,21.54,n/a"
    ) {
      console.log(`  altina ✅`);
    } else {
      console.log(`  altina ❌`);
      console.log(data[11].join(","));
    }
    if (
      data[12].join(",") ===
      "6.18,n/a,6.56,7.26,7.41,8.29,8.56,9.26,n/a,9.56,n/a,10.41,11.41,n/a,12.41,13.41,14.41,n/a,15.26,15.56,16.26,n/a,16.56,17.26,17.56,18.41,n/a,n/a,19.41,n/a,20.41,21.00,n/a,n/a,21.56,n/a"
    ) {
      console.log(`  zemunsko polje ✅`);
    } else {
      console.log(`  zemunsko polje ❌`);
      console.log(data[12].join(","));
    }
    if (
      data[13].join(",") ===
      "6.20,n/a,6.58,7.28,7.43,8.31,8.58,9.28,n/a,9.58,n/a,10.43,11.43,n/a,12.43,13.43,14.43,n/a,15.28,15.58,16.28,n/a,16.58,17.28,17.58,18.43,n/a,n/a,19.43,n/a,20.43,21.02,n/a,n/a,21.58,n/a"
    ) {
      console.log(`  kamendin ✅`);
    } else {
      console.log(`  kamendin ❌`);
      console.log(data[13].join(","));
    }
    if (
      data[14].join(",") ===
      "6.24,n/a,7.02,7.32,7.47,8.35,9.02,9.32,n/a,10.02,n/a,10.47,11.47,n/a,12.47,13.47,14.47,n/a,15.32,16.02,16.32,n/a,17.02,17.32,18.02,18.47,n/a,n/a,19.47,n/a,20.47,21.06,n/a,n/a,22.02,n/a"
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
    shape.default.createTimetableMatrixDirection1(
      shape.default.extractDepartureTimes(dataStrDirection1),
      stationsNames,
      trainIdDirection1
    ),
    shape.default.createTimetableMatrixDirection2(
      shape.default.extractDepartureTimes(dataStrDirection2),
      stationsNames.length
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
        i[0].time === 6.27 &&
        i[14].station === "ovca" &&
        i[14].time === 7.15
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
        i[0].time === 6.44 &&
        i[3].station === "zemun" &&
        i[3].time === 6.54
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
        i[0].time === 6.14 &&
        i[14].station === "batajnica" &&
        i[14].time === 7.02
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
        i[0].time === 9.52 &&
        i[7].station === "beograd centar" &&
        i[7].time === 10.15
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
      shape.default.createTimetableMatrixDirection1(
        shape.default.extractDepartureTimes(dataStrDirection1),
        stationsNames,
        trainIdDirection1
      ),
      shape.default.createTimetableMatrixDirection2(
        shape.default.extractDepartureTimes(dataStrDirection2),
        stationsNames.length
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
    checkStopsAt("batajnica", 47, 5.57, 22.02);
    checkStopsAt("kamendin", 47, 6.01, 21.58);
    checkStopsAt("zemunsko polje", 47, 6.03, 21.56);
    checkStopsAt("altina", 47, 6.05, 21.54);
    checkStopsAt("zemun", 64, 4.11, 23.01);
    checkStopsAt("tosin bunar", 64, 4.14, 22.58);
    checkStopsAt("novi beograd", 64, 4.17, 22.55);
    checkStopsAt("beograd centar", 65, 4.22, 22.51);
    checkStopsAt("karadjordjev park", 51, 6.24, 22.48);
    checkStopsAt("vukov spomenik", 51, 6.28, 22.44);
    checkStopsAt("pancevacki most", 51, 6.32, 22.41);
    checkStopsAt("krnjaca most", 51, 6.36, 22.35);
    checkStopsAt("krnjaca ukr", 51, 6.39, 22.33);
    checkStopsAt("sebes", 51, 6.42, 22.29);
    checkStopsAt("ovca", 51, 6.45, 22.25);
  });
});
