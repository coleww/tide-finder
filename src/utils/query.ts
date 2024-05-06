export const STATION_QP = 'station_id';
export const MODE_QP = 'mode';

export function updateQueryParam(qp: string, val: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(qp, val);
  window.history.pushState(null, '', url.toString());
}

export function getQueryParam(qp: string) {
  return new URLSearchParams(document.location.search).get(qp) || '';
}
