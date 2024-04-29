import { type StationData, type TidePrediction } from "./api";

// For each date with a day time low tide below tide target, 
// return sunrise/sunset and all tide predictions for that day
export type DaytimeLowtideData = {
  sunrise: Date;
  sunset: Date;
  tides: TidePrediction[]
}


export function filterTides (tideTarget: number, stationData: StationData) {
  const { predictions, solarData} = stationData;

  const tidesByDate = predictions.reduce<{[key: string]: TidePrediction[]}>((acc, prediction) => {
    const date = new Date(prediction.t).toDateString();
    acc[date] = acc[date] || []
    acc[date].push(prediction)
    return acc;
  }, {});

  return solarData.reduce<DaytimeLowtideData[]>((acc, solarDay) => {
    const sunrise = new Date(solarDay.sunrise);
    const sunset = new Date(solarDay.sunset);
    const tides = tidesByDate[sunrise.toDateString()];

    const hasDaytimeLowtide = tides.some((tidePrediction) => {
      const {t, v} = tidePrediction;
      const tideDate = new Date(t);
      
      const isLowTide = v < tideTarget;
      const isDayTime = tideDate >= sunrise && tideDate <= sunset
      return isLowTide && isDayTime;
    })

    if (hasDaytimeLowtide) {
      acc.push({
        sunrise,
        sunset,
        tides,
      })
    }
    return acc
  }, []);
}



