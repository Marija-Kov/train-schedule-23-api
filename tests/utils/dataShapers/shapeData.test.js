const test = require("node:test")
const assert = require("node:assert")
const {
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
  stationNamesDisplayMap,
  shape
} = require("../index.js");

test("generate matrix and overwrite non-temporal markers", async (t) => {
  
   await t.test("should create the matrix correctly for Batajnica-Ovca", async (t) => {
    const data = shape.default.overwriteNonTemporalMarkers(
      shape.default.generateMatrix(batajnicaOvca.timetableDataDirection1)
    );
    
    await t.test("should write correct data for batajnica", (t) => {
      assert(data[0].join(",") === "6.00,6.30,7.10,7.30,8.00,8.30,8.57,9.30,10.10,11.20,12.00,12.35,14.00,14.30,15.10,15.30,16.00,16.30,17.10,17.30,18.30,19.10,20.00")
    })
    
    await t.test("should write correct data for kamendin", (t) => {
      assert(data[1].join(",") === "6.04,6.34,7.14,7.34,8.04,8.34,9.01,9.34,10.14,11.24,12.04,12.39,14.04,14.34,15.14,15.34,16.04,16.34,17.14,17.34,18.34,19.14,20.04")
    })
    
    await t.test("should write correct data for zemunsko polje", (t) => {
      assert(data[2].join(",") === "6.06,6.36,7.16,7.36,8.06,8.36,9.03,9.36,10.16,11.26,12.06,12.41,14.06,14.36,15.16,15.36,16.06,16.36,17.16,17.36,18.36,19.16,20.06")
    })
    
    await t.test("should write correct data for altina", (t) => {
      assert(data[3].join(",") === "6.08,6.38,7.18,7.38,8.08,8.38,9.05,9.38,10.18,11.28,12.08,12.43,14.08,14.38,15.18,15.38,16.08,16.38,17.18,17.38,18.38,19.18,20.08")
    })
    
    await t.test("should write correct data for zemun", (t) => {
      assert(data[4].join(",") === "6.12,6.42,7.22,7.42,8.12,8.42,9.18,9.42,10.22,11.32,12.12,12.47,14.12,14.42,15.22,15.42,16.12,16.42,17.22,17.42,18.42,19.22,20.12")
    })
    
    await t.test("should write correct data for tosin bunar", (t) => {
      assert(data[5].join(",") === "6.16,6.46,7.26,7.46,8.16,8.46,9.22,9.46,10.26,11.36,12.16,12.51,14.16,14.46,15.26,15.46,16.16,16.46,17.26,17.46,18.46,19.26,20.16")
    })
    
    await t.test("should write correct data for novi beograd", (t) => {
      assert(data[6].join(",") === "6.19,6.49,7.29,7.49,8.19,8.49,9.25,9.49,10.29,11.39,12.19,12.54,14.19,14.49,15.29,15.49,16.19,16.49,17.29,17.49,18.49,19.29,20.19")
    })
    
    await t.test("should write correct data for beograd centar", (t) => {
      assert(data[7].join(",") === "6.23,6.53,7.33,7.53,8.23,8.53,9.29,9.53,10.33,11.43,12.23,12.58,14.23,14.53,15.33,15.53,16.23,16.53,17.33,17.53,18.53,19.33,20.23")
    })
    
    await t.test("should write correct data for karadjordjev park", (t) => {
      assert(data[8].join(",") === "6.27,6.57,7.37,7.57,8.27,8.57,9.33,9.57,10.37,11.47,12.27,13.02,14.27,14.57,15.37,15.57,16.27,16.57,17.37,17.57,18.57,19.37,20.27")
    })
    
    await t.test("should write correct data for vukov spomenik", (t) => {
      assert(data[9].join(",") === "6.31,7.01,7.41,8.01,8.31,9.01,9.37,10.01,10.41,11.51,12.31,13.06,14.31,15.01,15.41,16.01,16.31,17.01,17.41,18.01,19.01,19.41,20.31")
    })
    
    await t.test("should write correct data for pancevacki most", (t) => {
      assert(data[10].join(",") === "6.35,7.05,7.45,8.05,8.35,9.05,9.41,10.05,10.45,11.55,12.35,13.10,14.35,15.05,15.45,16.05,16.35,17.05,17.45,18.05,19.05,19.45,20.35")
    })
    
    await t.test("should write correct data for krnjaca most", (t) => {
      assert(data[11].join(",") === "6.39,7.09,7.49,8.09,8.39,9.09,9.45,10.09,10.49,11.59,12.39,13.14,14.39,15.09,15.49,16.09,16.39,17.09,17.49,18.09,19.09,19.49,20.39")
    })
    
    await t.test("should write correct data for krnjaca ukr", (t) => {
      assert(data[12].join(",") === "6.42,7.12,7.52,8.12,8.42,9.12,9.48,10.12,10.52,12.02,12.42,13.17,14.42,15.12,15.52,16.12,16.42,17.12,17.52,18.12,19.12,19.52,20.42")
    })
    
    await t.test("should write correct data for sebes", (t) => {
      assert(data[13].join(",") === "6.45,7.15,7.55,8.15,8.45,9.15,9.51,10.15,10.55,12.05,12.45,13.20,14.45,15.15,15.55,16.15,16.45,17.15,17.55,18.15,19.15,19.55,20.45")
    })
    
    await t.test("should write correct data for ovca", (t) => {
      assert(data[14].join(",") === "6.48,7.18,7.58,8.18,8.48,9.18,9.54,10.18,10.58,12.08,12.48,13.23,14.48,15.18,15.58,16.18,16.48,17.18,17.58,18.18,19.18,19.58,20.48")
    })
  });
  
  await t.test("should create the matrix correctly for Ovca-Batajnica", async (t) => {
    const data = shape.default.overwriteNonTemporalMarkers(
      shape.default.generateMatrix(batajnicaOvca.timetableDataDirection2)
    );
    
    await t.test("should write correct data for ovca", (t) => {
      assert(data[0].join(",") === "5.40,6.10,6.40,7.10,7.40,8.10,8.40,9.10,9.50,10.50,11.20,12.10,13.10,13.50,14.40,15.10,15.40,16.20,16.40,17.10,17.50,18.40,19.10,19.40,20.20,21.10,22.35")
    })
    
    await t.test("should write correct data for sebes", (t) => {
      assert(data[1].join(",") === "5.44,6.14,6.44,7.14,7.44,8.14,8.44,9.14,9.54,10.54,11.24,12.14,13.14,13.54,14.44,15.14,15.44,16.24,16.44,17.14,17.54,18.44,19.14,19.44,20.24,21.14,22.39")
    })
    
    await t.test("should write correct data for krnjaca ukr", (t) => {
      assert(data[2].join(",") === "5.48,6.18,6.48,7.18,7.48,8.18,8.48,9.18,9.58,10.58,11.28,12.18,13.18,13.58,14.48,15.18,15.48,16.28,16.48,17.18,17.58,18.48,19.18,19.48,20.28,21.18,22.43")
    })
    
    await t.test("should write correct data for krnjaca most", (t) => {
      assert(data[3].join(",") === "5.50,6.20,6.50,7.20,7.50,8.20,8.50,9.20,10.00,11.00,11.30,12.20,13.20,14.00,14.50,15.20,15.50,16.30,16.50,17.20,18.00,18.50,19.20,19.50,20.30,21.20,22.45")
    })
    
    await t.test("should write correct data for pancevacki most", (t) => {
      assert(data[4].join(",") === "5.56,6.26,6.56,7.26,7.56,8.26,8.56,9.26,10.06,11.06,11.36,12.26,13.26,14.06,14.56,15.26,15.56,16.36,16.56,17.26,18.06,18.56,19.26,19.56,20.36,21.26,22.51")
    })
    
    await t.test("should write correct data for vukov spomenik", (t) => {
      assert(data[5].join(",") === "5.59,6.29,6.59,7.29,7.59,8.29,8.59,9.29,10.09,11.09,11.39,12.29,13.29,14.09,14.59,15.29,15.59,16.39,16.59,17.29,18.09,18.59,19.29,19.59,20.39,21.29,22.54")
    })
    
    await t.test("should write correct data for karadjordjev park", (t) => {
      assert(data[6].join(",") === "6.03,6.33,7.03,7.33,8.03,8.33,9.03,9.33,10.13,11.13,11.43,12.33,13.33,14.13,15.03,15.33,16.03,16.43,17.03,17.33,18.13,19.03,19.33,20.03,20.43,21.33,22.58")
    })
    
    await t.test("should write correct data for beograd centar", (t) => {
      assert(data[7].join(",") === "6.06,6.36,7.06,7.36,8.06,8.36,9.06,9.36,10.16,11.16,11.46,12.36,13.36,14.16,15.06,15.36,16.06,16.46,17.06,17.36,18.16,19.06,19.36,20.06,20.46,21.36,23.01")
    })
    
    await t.test("should write correct data for novi beograd", (t) => {
      assert( data[8].join(",") === "6.10,6.40,7.10,7.40,8.10,8.40,9.10,9.40,10.20,11.20,11.50,12.40,13.40,14.20,15.10,15.40,16.10,16.50,17.10,17.40,18.20,19.10,19.40,20.10,20.50,21.40,23.05")
    })
    
    await t.test("should write correct data for tosin bunar", (t) => {
      assert(data[9].join(",") === "6.13,6.43,7.13,7.43,8.13,8.43,9.13,9.43,10.23,11.23,11.53,12.43,13.43,14.23,15.13,15.43,16.13,16.53,17.13,17.43,18.23,19.13,19.43,20.13,20.53,21.43,23.08")
    })
    
    await t.test("should write correct data for zemun", (t) => {
      assert(data[10].join(",") === "6.17,6.47,7.17,7.47,8.17,8.47,9.17,9.47,10.27,11.27,11.56,12.47,13.47,14.27,15.17,15.47,16.17,16.57,17.17,17.47,18.27,19.16,19.47,20.17,20.57,21.47,23.11")
    })
    
    await t.test("should write correct data for altina", (t) => {
      assert(data[11].join(",") === "6.20,6.50,7.20,7.50,8.20,8.50,9.20,9.50,10.30,11.30,n/a,12.50,13.50,14.30,15.20,15.50,16.20,17.00,17.20,17.50,18.30,n/a,19.50,20.20,21.00,21.50,n/a")
    })
    
    await t.test("should write correct data for zemunsko polje", (t) => {
      assert(data[12].join(",") === "6.22,6.52,7.22,7.52,8.22,8.52,9.22,9.52,10.32,11.32,n/a,12.52,13.52,14.32,15.22,15.52,16.22,17.02,17.22,17.52,18.32,n/a,19.52,20.22,21.02,21.52,n/a")
    })
    
    await t.test("should write correct data for kamendin", (t) => {
      assert(data[13].join(",") === "6.24,6.54,7.24,7.54,8.24,8.54,9.24,9.54,10.34,11.34,n/a,12.54,13.54,14.34,15.24,15.54,16.24,17.04,17.24,17.54,18.34,n/a,19.54,20.24,21.04,21.54,n/a")
    })
    
    await t.test("should write correct data for batajnica", (t) => {
      assert(data[14].join(",") === "6.28,6.58,7.28,7.58,8.28,8.58,9.28,9.58,10.38,11.38,n/a,12.58,13.58,14.38,15.28,15.58,16.28,17.08,17.28,17.58,18.38,n/a,19.58,20.28,21.08,21.58,n/a")
    })
  });
});

test("trainsData()", async (t) => {
  const data = shape.default.trainsData(batajnicaOvca);

  function getItinerary(trainId) {
    return data.filter((train) => train.id === trainId)[0].itinerary;
  }
  
  await t.test("should write correct itinerary for", async (t) => {
    
    await t.test("8003", (t) => {
      const i = getItinerary(8003);

      assert(i.length === 15)
      assert(i[0].station === "batajnica")
      assert(i[0].time === 6.3)
      assert(i[14].station === "ovca")
      assert(i[14].time === 7.18)
    });

    await t.test("8004", async (t) => {
      const i = getItinerary(8004);

      assert(i.length === 15)
      assert(i[0].station === "ovca")
      assert(i[0].time === 6.4)
      assert(i[10].station === "zemun")
      assert(i[10].time === 7.17)
    });
  });
});

// test("stationsData()", async (t) => {
//   const data = shape.default.stationsData(
//     batajnicaOvca.stationNames,
//     Object.keys(stationNamesDisplayMap),
//     shape.default.trainsData(
//       batajnicaOvca.trainIdsDirection1,
//       batajnicaOvca.trainIdsDirection2,
//       batajnicaOvca.serviceFrequencyDirection1,
//       batajnicaOvca.serviceFrequencyDirection2,
//       batajnicaOvca.stationNames,
//       shape.default.overwriteNonTemporalMarkers(
//         shape.default.generateMatrix(batajnicaOvca.timetableDataDirection1)
//       ),
//       shape.default.overwriteNonTemporalMarkers(
//         shape.default.generateMatrix(batajnicaOvca.timetableDataDirection2)
//       )
//     )
//   );

//   await t.test("should write all stations correctly", async (t) => {
//     function checkStopsAt(stationName, targetDeparturesCount, earliest, latest) {
//         assert(data[stationName].departures.length === targetDeparturesCount)
//         assert(data[stationName].departures[0].time === earliest)
//         assert(data[stationName].departures[targetDeparturesCount - 1].time === latest)
//     }
//     await t.test("batajnica", (t) => {
//       checkStopsAt("batajnica", 47, 6.00, 21.58); //??
//     })
//     await t.test("kamendin", (t) => {
//       checkStopsAt("kamendin", 47, 6.04, 21.54);
//     })
//     await t.test("zemunsko polje", (t) => {
//       checkStopsAt("zemunsko polje", 47, 6.06, 21.52);
//     })
//     await t.test("altina", (t) => {
//       checkStopsAt("altina", 47, 6.08, 21.50);
//     })
//     await t.test("zemun", (t) => {
//       checkStopsAt("zemun", 54, 3.44, 23.11);
//     })
//     await t.test("tosin bunar", (t) => {
//       checkStopsAt("tosin bunar", 54, 3.47, 23.08);
//     })
//     await t.test("novi beograd", (t) => {
//       checkStopsAt("novi beograd", 54, 3.49, 23.05);
//     })
//     await t.test("beograd centar", (t) => {
//       checkStopsAt("beograd centar", 55, 3.54, 23.01);
//     })
//     await t.test("karadjordjev park", (t) => {
//       checkStopsAt("karadjordjev park", 51, 6.27, 22.58);
//     })
//     await t.test("vukov spomenik", (t) => {
//       checkStopsAt("vukov spomenik", 51, 6.31, 22.54);
//     })
//     await t.test("pancevacki most", (t) => {
//       checkStopsAt("pancevacki most", 51, 6.35, 22.51);
//     })
//     await t.test("krnjaca most", (t) => {
//       checkStopsAt("krnjaca most", 51, 6.39, 22.45);
//     })
//     await t.test("krnjaca ukr", (t) => {
//       checkStopsAt("krnjaca ukr", 51, 6.42, 22.43);
//     })
//     await t.test("sebes", (t) => {
//       checkStopsAt("sebes", 51, 6.45, 22.39);
//     })
//     await t.test("ovca", (t) => {
//       checkStopsAt("ovca", 51, 6.48, 22.35);
//     })
//   });
// });
