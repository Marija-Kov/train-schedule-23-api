export const filterStationsData = (
  res: any,
  stations: any[],
  station: string,
  direction: number,
  frequency: string
) => {
  if (frequency) {
    const activeOnWeekendsAndHolidays = activity(frequency);
    for (let s of stations) {
      if (s.name === station) {
        return (() => {
          let departures: any[] = [];
          for (let departure of s.departures) {
            if (
              departure.trainDetails.directionId === direction &&
              departure.trainDetails.activeOnWeekendsAndHolidays ===
                activeOnWeekendsAndHolidays
            ) {
              departures.push(departure);
            }
          }
          return res.end(JSON.stringify(departures, null, 2));
        })();
      }
    }
  } else if (direction) {
    for (let s of stations) {
      if (s.name === station) {
        return (() => {
          let departures: any[] = [];
          for (let departure of s.departures) {
            if (departure.trainDetails.directionId === direction) {
              departures.push(departure);
            }
          }
          return res.end(JSON.stringify(departures, null, 2));
        })();
      }
    }
  } else {
    for (let s of stations) {
      if (s.name === station) {
        return res.end(JSON.stringify(s, null, 2));
      }
    }
  }
};

export const filterTrainsData = (
  res: any,
  trains: any[],
  directionOrTrainId: number,
  frequency: string
) => {
  if (frequency) {
    const activeOnWeekendsAndHolidays = activity(frequency);

    let result: any[] = [];
    for (let train in trains) {
      if (
        trains[train].directionId === directionOrTrainId &&
        trains[train].activeOnWeekendsAndHolidays ===
          activeOnWeekendsAndHolidays
      ) {
        result.push(trains[train]);
      }
    }
    return res.end(JSON.stringify(result, null, 2));
  }

  if (directionOrTrainId.toString().length === 4) {
    return res.end(JSON.stringify(trains[directionOrTrainId], null, 2));
  } else if ([1, 2].includes(directionOrTrainId)) {
    let result: any[] = [];
    for (let train in trains) {
      if (trains[train].directionId === directionOrTrainId) {
        result.push(trains[train]);
      }
    }
    return res.end(JSON.stringify(result, null, 2));
  }
};

function activity(frequency: string) {
  let active: any;
  switch (frequency) {
    case "wh":
      active = "w&h_only";
      break;
    case "ed":
      active = true;
      break;
    case "wd":
      active = false;
      break;
    default:
      undefined;
  }
  return active;
}
