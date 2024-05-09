import {
  Hours,
  Minutes,
  Year,
  Month,
  Day,
  TrainIdDirection1,
  TrainIdDirection2,
  StationName,
  StationNameFormatted,
} from "./boringTypes";

export type Time = `${Hours}.${Minutes}` | "n/a";

export type TimeOutput = `${Hours}:${Minutes}`;

export type YyyyMmDd = `${Year}-${Month}-${Day}`;

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

export type OutputDeparture = {
  departureTime: TimeOutput;
  arrivalTime: TimeOutput;
  trainId: TrainIdDirection1 | TrainIdDirection2;
};
