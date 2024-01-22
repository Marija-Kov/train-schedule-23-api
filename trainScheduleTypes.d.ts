type TrainDetails = {
  id: number;
  directionId: 1 | 2;
  activeOnWeekendsAndHolidays: boolean | "w&h_only";
};

type TrainItinerary = { station: string; time: number }[];

type Train = TrainDetails & { itinerary: TrainItinerary };

type StationDeparture = { time: number; trainDetails: TrainDetails };

type Station = {
  name: string;
  nameFormatted: string;
  departures: StationDeparture[];
};

export { TrainDetails, TrainItinerary, Train, StationDeparture, Station };
