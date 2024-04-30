export type TidePredictionRes = {
  t: string;
  v: string;
  type: string;
};

export type TidePrediction = {
  t: Date;
  v: number;
};

export type Metadata = {
  title: string;
  lat: number;
  lng: number;
};

export type SolarData = {
  sunrise: Date;
  sunset: Date;
};

export type StationData = {
  tideData: TidePrediction[];
  solarData: SolarData[];
  metadata: Metadata;
};
