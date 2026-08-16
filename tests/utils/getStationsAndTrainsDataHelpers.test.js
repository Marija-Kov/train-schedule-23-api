const test = require("node:test")
const assert = require("node:assert")
const {
  stationsJson,
  trainsJson,
  isStationNameValid,
  getStation,
  isDirectionValid,
  isFrequencyValid,
  getDeparturesInDirection,
  getDeparturesByFrequency,
  getTrainsByFrequency,
  getTrainsByDirection,
  isTrainIdValid,
  batajnicaOvca,
  ovcaZemunResnikLazarevac,
} = require("./index")

test("Get stations and traind data helpers", async (t) => {
  const stations = JSON.parse(stationsJson).stations;
  const trains = JSON.parse(trainsJson)

  await t.test("isStationNameValid()", async (t) => {
    const invalidStationName = "abc"
    const validStationName = "klenje"

    await t.test("should be an invalid station name", () => {
      assert(!isStationNameValid(invalidStationName))
    })
    
    await t.test("should be a valid station name", () => {
      assert(isStationNameValid(validStationName), `Should be a valid station name: ${validStationName}`)
    })
  })
  
  await t.test("getStation()", async (t) => {
    const aStationName = "novi beograd"

    await t.test("should get a correct station property", () => {
      let aStationObject = getStation(aStationName, stations)
      assert(aStationObject.name === aStationName)
    })

  })

  await t.test("isDirectionValid()", async (t) => {
    const invalidDirection = 3
    const validDirection = 2
    
    await t.test("should be an invalid direction", () => {
      assert(!isDirectionValid(invalidDirection))
    })
    
    await t.test("should be a valid direction", async (t) => {
      assert(isDirectionValid(validDirection))
    })
  })

  await t.test("isFrequencyValid()", async (t) => {
    const invalidFrequency = "ww"
    const validFrequency = "ed"
    
    await t.test("should be an invalid frequency", async (t) => {
      assert(!isFrequencyValid(invalidFrequency))
    })

    await t.test("ahould be a valid frequency", async (t) => {
      assert(isFrequencyValid(validFrequency))
    })
  })
  
  await t.test("isTrainIdValid()", async (t) => {
    const invalidTrainId = 1000
    const validTrainId = 8003
     
    await t.test("should be an invalid train id", async (t) => {
      assert(!isTrainIdValid([...batajnicaOvca.trainIdsDirection1, ...batajnicaOvca.trainIdsDirection2, ...ovcaZemunResnikLazarevac.trainIdsDirection1, ...ovcaZemunResnikLazarevac.trainIdsDirection2], invalidTrainId))
    })

    await t.test("should be a valid train id", async (t) => {
      assert(isTrainIdValid([...batajnicaOvca.trainIdsDirection1, ...batajnicaOvca.trainIdsDirection2, ...ovcaZemunResnikLazarevac.trainIdsDirection1, ...ovcaZemunResnikLazarevac.trainIdsDirection2], validTrainId)) 
    })
     
    
  }) 
  
  await t.test("getDeparturesInDirection()", async (t) => {
    const aDirection = 1
    const aStationName = "tosin bunar"

    await t.test("should get departures for an expected direction", async (t) => {
      const departuresInDirection = getDeparturesInDirection(stations[aStationName].departures, aDirection)

      assert(departuresInDirection[0].trainDetails.directionId === aDirection)
    })
    
  })

  await t.test("getTrainsInDirection()", async (t) => {
    const aDirection = 2

    await t.test("should get trains for an expected direction", async (t) => {
      const trainsInDirection = getTrainsByDirection(trains, aDirection)
    
      assert(trainsInDirection[0].directionId === aDirection)
    })
  })
  
  await t.test("getDeparturesByFrequency()", async (t) => {
    const aFrequency = "wd"
    const aStationName = "karadjordjev park"
    
    await t.test("should get departures from a station of expected frequency", async (t) => {
      const departuresByFrequency = getDeparturesByFrequency(stations[aStationName].departures, aFrequency)
      
      assert(departuresByFrequency[0].trainDetails.serviceFrequency === aFrequency)
    })
  })

  await t.test("getTrainsByFrequency()", async (t) => {
    const aFrequency = "ed"

    await t.test("should get trains of the expected service frequency", async (t) => {
      const trainsByFrequency = getTrainsByFrequency(trains, aFrequency)
    
      assert(trainsByFrequency[0].serviceFrequency === aFrequency)
    })
  })
})