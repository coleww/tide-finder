export type TidePredictionRes = {
  t: string;
  v: string;
  type: string;
};

export type TidePrediction = {
  time: Date;
  tide: number;
};

export type Metadata = {
  title: string;
  lat: number;
  lng: number;
};

export type SolarData = {
  lunarIlluminosity: number;
  sunrise: Date;
  sunset: Date;
};

export type StationData = {
  tideData: TidePrediction[];
  solarData: SolarData[];
  metadata: Metadata;
  timezone: string;
};

export type LowtideEventData = {
  solarData: SolarData;
  tides: TidePrediction[];
  lowtide: TidePrediction;
};

export { type Mode, modes as modesEnum } from './hooks/useMode';
