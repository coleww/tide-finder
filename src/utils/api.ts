import { solarCalc } from './solarCalc';
import { parseTideData, parseMetadata, formatDateNOAA } from './parse';
import { type SolarData, type StationData } from './types';

function getSolarData(
  lat: number,
  lng: number,
  startDate: Date,
  endDate: Date
): SolarData[] {
  const solarData = [];
  for (
    var current = new Date(startDate.toString());
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    solarData.push(solarCalc(current, lat, lng) as SolarData);
  }
  return solarData;
}

export async function getStationData(
  stationId: string
): Promise<StationData | undefined> {
  const today = new Date();
  const oneYearFromToday = new Date();
  oneYearFromToday.setFullYear(new Date().getFullYear() + 1);
  const todayString = formatDateNOAA(today);
  const endDateString = formatDateNOAA(oneYearFromToday);

  let metadata, tideData;
  try {
    const metadataRes = await fetch(
      `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}.json`, { cache: "force-cache" }
    );
    if (metadataRes.ok) {
      metadata = await metadataRes.json();
    } else {
      throw new Error();
    }
  } catch (e) {
    return;
  }

  try {
    const tideDataRes = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${todayString}&end_date=${endDateString}&station=${stationId}&product=predictions&datum=MLLW&time_zone=gmt&interval=hilo&units=english&application=daytime_lowtide_finder&format=json`, { cache: "force-cache" }
    );

    if (tideDataRes.ok) {
      tideData = await tideDataRes.json();
    } else {
      throw new Error();
    }
  } catch (e) {
    return;
  }

  const parsedMetadata = parseMetadata(metadata);
  const parsedTideData = parseTideData(tideData)

  if (!parsedMetadata || !parsedTideData) return;

  return {
    metadata: parsedMetadata,
    tideData: parsedTideData,
    solarData: getSolarData(
      parsedMetadata.lat,
      parsedMetadata.lng,
      today,
      oneYearFromToday
    ),
  };
}
