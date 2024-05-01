const STATION_QP = 'station_id';

export function updateQueryParam(stationId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(STATION_QP, stationId);
  window.history.pushState(null, '', url.toString());
}

export function getQueryParam() {
  return new URLSearchParams(document.location.search).get(STATION_QP) || '';
}