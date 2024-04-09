import {
  StationName,
  StationNameFormatted,
  TrainIdDirection1,
  TrainIdDirection2,
  Hours,
  Minutes,
} from "./boringTypes";

export type Time = `${Hours}.${Minutes}` | "n/a";

export type TrainDetails = {
  id: TrainIdDirection1 | TrainIdDirection2;
  directionId: GetDirectionId<
    TrainIdDirection1,
    TrainIdDirection2,
    TrainDetails["id"]
  >;
  activeOnWeekendsAndHolidays: boolean | "w&h_only";
};

export type GetDirectionId<T1, T2, Id extends T1 | T2> = Id extends T1 ? 1 : 2;

export type TrainItinerary = { station: StationName; time: number }[];

export type Train = TrainDetails & { itinerary: TrainItinerary };

export type StationDeparture = { time: number; trainDetails: TrainDetails };

export type Station = {
  name: StationName;
  nameFormatted: StationNameFormatted;
  departures: StationDeparture[];
};
