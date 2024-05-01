import { createEvents } from 'ics';
import { type Metadata, type DaytimeLowtideData } from './types';
import { formatTimeTZ } from './parse';

function createTideEvent(
  lowtideData: DaytimeLowtideData,
  metadata: Metadata,
  timezone: string,
  stationId: string
) {
  const { title, lat, lng } = metadata;
  const { lowtide, sunrise, sunset, tides } = lowtideData;
  const description = [
    `- sunrise ${formatTimeTZ(sunrise, timezone)}`,
    ...tides.map(
      tide => `- ${tide.tide}ft, ${formatTimeTZ(tide.time, timezone)}`
    ),
    `- sunset ${formatTimeTZ(sunset, timezone)}`,
  ].join('\n');

  return {
    start: lowtide.time.getTime(), // TODO: does the time zone get translated properly?
    duration: { hours: 1 },
    title: `${lowtide.tide}ft ${title}`,
    description,
    location: title,
    // url: `/daytime-lowtide-finder?station_id=${stationId}`,
    geo: { lat: lat, lon: lng },
    // categories: ['low tide',],
  };
}

export async function handleDownload(
  lowtideData: DaytimeLowtideData[],
  metadata: Metadata,
  timezone: string,
  stationId: string
) {
  const filename = 'LowTideCalendar.ics';
  const events = lowtideData.map(ltd =>
    createTideEvent(ltd, metadata, timezone, stationId)
  );
  const file = await new Promise((resolve, reject) => {
    createEvents(events, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(new File([value], filename, { type: 'text/calendar' }));
    });
  }).catch(e => {
    console.error(e);
  });

  if (!file) return;

  const url = URL.createObjectURL(file as Blob);

  // trying to assign the file URL to a window could cause cross-site
  // issues so this is a workaround using HTML5
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
