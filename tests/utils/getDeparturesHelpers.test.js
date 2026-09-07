const test = require("node:test")
const assert = require("node:assert");
const {
  isDatePatternValid,
  isTimePatternValid,
  getServiceFrequencyArray,
} = require("./index");

test("Get departures helpers", async (t) => {
  const year = new Date(Date.now()).getFullYear()

  await t.test("isDatePatternValid()", async (t) => {
    const invalidDay = `${year}-02-30`
    const invalidMonth = `${year}-33-30`
    const validDate = `${year}-11-11`

    await t.test("should be an invalid date (day)", (t) => {
      assert(!isDatePatternValid(invalidDay))
    })

    await t.test("should be an invalid date (month)", (t) => {
      assert(!isDatePatternValid(invalidMonth))
    })

    await t.test("should be a valid date", (t) => {
      assert(isDatePatternValid(validDate))
    })
  })

  await t.test("isTimePatternValid()", async (t) => {
    const invalidInputTimeFormat = "00:01"
    const validInputTimeFormat = "00.01"

    await t.test("should be an invalid input time format", (t) => {
      assert(!isTimePatternValid(invalidInputTimeFormat))
    })

    await t.test("should be a valid input time format", (t) => {
      assert(isTimePatternValid(validInputTimeFormat))
    })
  })
  
  await t.test("getServiceFrequencyArray()", async (t) => {
    const weekdayDate = "2026-01-05" // can't use current year because it may not yield consistent results
    const weekendOrHolidayDate = `${year}-02-15`

    await t.test("should be a weekday date", (t) => {
      assert(getServiceFrequencyArray(weekdayDate).join(",") === "ed,wd")
    })

    await t.test("should be a weekend or a holiday date", (t) => {
      assert(getServiceFrequencyArray(weekendOrHolidayDate).join(",") === "ed,wh")
    })
  })

})

