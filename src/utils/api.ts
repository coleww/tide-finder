import { solarCalc } from './solarCalc';

type TidePredictionRes = {
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

function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${yyyy}${mm}${dd}`;
}

function parseMetadata(metadata: any): Metadata {
  const station = metadata?.stations?.at(0);
  return {
    title: `${station?.name}, ${station?.state}`,
    lat: Number(station?.lat),
    lng: Number(station?.lng),
  };
}

function parseTideData(tideData: any): TidePrediction[] {
  return tideData?.predictions?.map((tidePrediction: TidePredictionRes) => {
    return {
      t: new Date(tidePrediction.t),
      v: Number(tidePrediction.v),
    };
  });
}

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
  const todayString = formatDate(today);
  const endDateString = formatDate(oneYearFromToday);

  let metadata, tideData;
  try {
    const metadataRes = await fetch(
      `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}.json`
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
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${todayString}&end_date=${endDateString}&station=${stationId}&product=predictions&datum=MLLW&time_zone=gmt&interval=hilo&units=english&application=daytime_lowtide_finder&format=json`
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

  return {
    metadata: parsedMetadata,
    tideData: parseTideData(tideData),
    solarData: getSolarData(
      parsedMetadata.lat,
      parsedMetadata.lng,
      today,
      oneYearFromToday
    ),
  };
}
