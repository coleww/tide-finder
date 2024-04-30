import { type StationData, type TidePrediction } from './types';

export type DaytimeLowtideData = {
  sunrise: Date;
  sunset: Date;
  tides: TidePrediction[];
};

// .toLocaleString("en-US", {timeZone: "America/New_York"})

export function filterTides(tideTarget: number, threshold: number, stationData: StationData) {
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
    const tides = tidesByDate[solarDay.sunrise.toDateString()];

    const sunriseTarget = new Date(solarDay.sunrise.getTime() - threshold * 60000);
    const sunsetTarget = new Date(solarDay.sunset.getTime() + threshold * 60000);

    const hasDaytimeLowtide = tides?.some(tidePrediction => {
      const { t, v } = tidePrediction;
      const tideDate = new Date(t);

      const isLowTide = v < tideTarget;
      const isDayTime = tideDate >= sunriseTarget && tideDate <= sunsetTarget;
      return isLowTide && isDayTime;
    });

    if (hasDaytimeLowtide) {
      acc.push({
        sunrise: solarDay.sunrise,
        sunset: solarDay.sunset,
        tides,
      });
    }
    return acc;
  }, []);
}
