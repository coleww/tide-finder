import {
  type StationData,
  type TidePrediction,
  type LowtideEventData,
} from '../types';
import { formatDateTZ } from './parse';

export function filterDaytimeTides(
  tideTarget: number,
  threshold: number,
  stationData: StationData
) {
  const { tideData, solarData, timezone } = stationData;

  // TODO: memoize this to improve perf when changing tide target
  const tidesByDate = tideData.reduce<{ [key: string]: TidePrediction[] }>(
    (acc, tidePrediction) => {
      const date = formatDateTZ(tidePrediction.time, timezone);
      acc[date] = acc[date] || [];
      acc[date].push(tidePrediction);
      return acc;
    },
    {}
  );

  return solarData.reduce<LowtideEventData[]>((acc, solarDay) => {
    const tides = tidesByDate[formatDateTZ(solarDay.sunrise, timezone)];

    const sunriseTarget = new Date(
      solarDay.sunrise.getTime() - threshold * 60000
    );
    const sunsetTarget = new Date(
      solarDay.sunset.getTime() + threshold * 60000
    );

    const daytimeLowtide = tides?.find(tidePrediction => {
      const { time, tide } = tidePrediction;

      const isLowTide = tide < tideTarget;
      const isDayTime = time >= sunriseTarget && time <= sunsetTarget;
      return isLowTide && isDayTime;
    });

    if (daytimeLowtide) {
      acc.push({
        sunrise: solarDay.sunrise,
        sunset: solarDay.sunset,
        tides,
        lowtide: daytimeLowtide,
      });
    }
    return acc;
  }, []);
}
