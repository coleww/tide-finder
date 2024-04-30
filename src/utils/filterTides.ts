import { type StationData, type TidePrediction, type DaytimeLowtideData } from './types';
import { formatDateTZ} from './parse';


export function filterTides(tideTarget: number, threshold: number, stationData: StationData) {
  const { tideData, solarData, timezone } = stationData;

  // TODO: memoize this to improve perf when changing tide target
  const tidesByDate = tideData.reduce<{ [key: string]: TidePrediction[] }>(
    (acc, tidePrediction) => {
      const date = formatDateTZ(tidePrediction.t, timezone);
      acc[date] = acc[date] || [];
      acc[date].push(tidePrediction);
      return acc;
    },
    {}
  );

  return solarData.reduce<DaytimeLowtideData[]>((acc, solarDay) => {
    const tides = tidesByDate[formatDateTZ(solarDay.sunrise, timezone)];

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
