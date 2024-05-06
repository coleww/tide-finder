import {
  type Metadata,
  type TidePrediction,
  type TidePredictionRes,
} from '../types';

export function formatDateNOAA(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${yyyy}${mm}${dd}`;
}

export function formatDateTZ(date: Date, tz: string) {
  return date.toLocaleDateString('en-US', { timeZone: tz });
}

export function formatTimeTZ(date: Date, tz: string) {
  return date.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function parseTideTimestamp(timestamp: string) {
  // predictions API returns UTC time as "2024-04-30 18:15"
  // need to format as UTC otherwise Date constructor parses as local time
  return timestamp.split(' ').join('T') + 'Z';
}

export function parseMetadata(metadata: any): Metadata | undefined {
  const station = metadata?.stations?.at(0);
  if (!station) return;
  return {
    title: `${station?.name}, ${station?.state}`,
    lat: Number(station?.lat),
    lng: Number(station?.lng),
  };
}

export function parseTideData(tideData: any): TidePrediction[] | undefined {
  return tideData?.predictions?.map((tidePrediction: TidePredictionRes) => {
    return {
      time: new Date(parseTideTimestamp(tidePrediction.t)),
      tide: Number(tidePrediction.v),
    };
  });
}
