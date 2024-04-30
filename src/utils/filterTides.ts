import { type StationData, type TidePrediction } from './api';

export type DaytimeLowtideData = {
  sunrise: Date;
  sunset: Date;
  tides: TidePrediction[];
};

export function filterTides(tideTarget: number, stationData: StationData) {
  const { tideData, solarData } = stationData;

  const tidesByDate = tideData.reduce<{ [key: string]: TidePrediction[] }>(
    (acc, tidePrediction) => {
      const date = new Date(tidePrediction.t).toDateString();
      acc[date] = acc[date] || [];
      acc[date].push(tidePrediction);
      return acc;
    },
    {}
  );

  return solarData.reduce<DaytimeLowtideData[]>((acc, solarDay) => {
    const sunrise = new Date(solarDay.sunrise);
    const sunset = new Date(solarDay.sunset);
    const tides = tidesByDate[sunrise.toDateString()];

    const hasDaytimeLowtide = tides.some(tidePrediction => {
      const { t, v } = tidePrediction;
      const tideDate = new Date(t);

      const isLowTide = v < tideTarget;
      const isDayTime = tideDate >= sunrise && tideDate <= sunset;
      return isLowTide && isDayTime;
    });

    if (hasDaytimeLowtide) {
      acc.push({
        sunrise,
        sunset,
        tides,
      });
    }
    return acc;
  }, []);
}
